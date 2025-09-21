import { getPrismaClient } from '@/db/index.js';
import { ApiResponse } from '@/utils/ApiResponse.js';
import { decryptToken, encryptToken } from '@/utils/hashAndEncrypt.js';
import { wrapperFx } from '@/utils/wrapperFx.js';
import { google, gmail_v1 } from 'googleapis';
import { type Authentication, AuthProvider } from 'generated/prisma/index.js';
import type { PrismaClient } from '@prisma/client/extension';

interface ParsedMessage {
	id: string;
	threadId: string;
	from: { name?: string; email: string };
	subject: string;
	snippet: string;
	bodyHtml: string;
	bodyText: string;
	date: Date;
	isSender: boolean;
}

function decodeBase64(data: string) {
	return Buffer.from(data, 'base64url').toString('utf-8');
}

function parseMessage(
	message: gmail_v1.Schema$Message,
	userEmail: string,
): ParsedMessage | undefined {
	const headers = message.payload?.headers;
	const getHeaders = (name: string) => headers?.find((h) => h.name === name)?.value || '';

	const fromHeader = getHeaders('From');
	let fromName: string | undefined;
	let fromEmail: string | undefined;

	if (fromHeader.includes('<')) {
		[fromName, fromEmail] = fromHeader
			.split(' <')
			.map((s, i) => (i === 1 ? s.slice(0, -1) : s.replace(/"/g, '')));
	} else {
		fromEmail = fromHeader;
	}

	if (!fromEmail || !fromName) {
		return;
	}

	const isSender = fromEmail.toLowerCase() === userEmail.toLowerCase();

	let bodyHtml = '';
	let bodyText = '';

	function getBody(parts: gmail_v1.Schema$MessagePart[]) {
		for (const part of parts) {
			if (part.mimeType === 'text/html' && part.body?.data) {
				bodyHtml = decodeBase64(part.body.data);
			} else if (part.mimeType === 'text/plain' && part.body?.data) {
				bodyText = decodeBase64(part.body.data);
			} else if (part.parts) {
				getBody(part.parts);
			}
		}
	}

	if (message.payload?.parts) {
		getBody(message.payload.parts);
	} else if (message.payload?.body?.data) {
		bodyText = decodeBase64(message.payload.body.data);
	}

	return {
		id: message.id!,
		threadId: message.threadId!,
		from: { name: fromName, email: fromEmail! },
		subject: getHeaders('Subject'),
		snippet: message.snippet!,
		bodyHtml: bodyHtml,
		bodyText: bodyText,
		date: new Date(getHeaders('Date')),
		isSender: isSender,
	};
}

async function fetchMessagesFromGoogle(
	prisma: PrismaClient,
	tokens: { provider_access_token: string | null; provider_refresh_token: string | null },
	contactEmail: string,
	myEmail: string,
	pageToken?: string,
	maxResults: number = 20,
) {
	const oauth2Client = new google.auth.OAuth2({
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		redirectUri: process.env.GOOGLE_REDIRECT_URI,
	});

	oauth2Client.setCredentials({
		access_token: tokens.provider_access_token,
		refresh_token: tokens.provider_refresh_token,
	});

	oauth2Client.on('tokens', (tokens) => {
		if (tokens.access_token) {
			const token = encryptToken(tokens.access_token);
			prisma.authentication.update({
				where: {
					id: contactEmail,
				},
				data: {
					provider_access_token: token.encrypted,
					access_token_iv: token.iv,
				},
			});
		}
	});

	const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

	const { data: messageList } = await gmail.users.messages.list({
		userId: 'me',
		q: `from:${contactEmail} OR to:${contactEmail}`,
		maxResults,
		pageToken: pageToken,
	});

	if (!messageList.messages || messageList.messages.length === 0) {
		return {
			messages: [],
			nextPageToken: null,
		};
	}

	const nextPageToken = messageList.nextPageToken || null;

	const messagePromises = messageList.messages.map((msg) =>
		gmail.users.messages.get({
			userId: 'me',
			id: msg.id!,
			format: 'full',
		}),
	);

	const messageResults = await Promise.all(messagePromises);

	const messages: ParsedMessage[] = [];
	for (const result of messageResults) {
		const parsedMessage = parseMessage(result.data, myEmail);
		if (parsedMessage) {
			messages.push(parsedMessage);
		}
	}

	return {
		messages,
		nextPageToken,
	};
}

export const fetchMessages = wrapperFx(async (req, res) => {
	const user = req.user!;
	const accountId = req.query.accountId;
	const contactEmail = req.query.email;
	const pageToken = req.query.pageToken;
	const provider = req.query.provider?.toUpperCase();

	if (!accountId || !contactEmail) {
		new ApiResponse('Missing accountId or email', undefined, 400).error(res);
		return;
	}

	const prisma = getPrismaClient();

	const authentication = await prisma.authentication.findUnique({
		where: {
			id: accountId,
			provider: provider as Authentication['provider'],
			userId: user.id,
		},
		select: {
			provider_access_token: true,
			access_token_iv: true,
			provider_refresh_token: true,
			refresh_token_iv: true,
			email: true,
		},
	});

	if (!authentication) {
		new ApiResponse('This contact is not linked to your account', undefined, 400).error(res);
		return;
	}

	authentication.provider_access_token = decryptToken({
		iv: authentication.access_token_iv!,
		encrypted: authentication.provider_access_token!,
	});
	authentication.provider_refresh_token = decryptToken({
		iv: authentication.refresh_token_iv!,
		encrypted: authentication.provider_refresh_token!,
	});

	const { messages, nextPageToken } = await fetchMessagesFromGoogle(
		prisma,
		authentication,
		contactEmail,
		authentication.email,
		pageToken,
	);

	new ApiResponse('success', {
		messages: messages,
		nextPageToken: nextPageToken,
	}).success(res);
});
