import { getPrismaClient } from '@/db/index.js';
import { ApiResponse } from '@/utils/ApiResponse.js';
import { decryptToken, encryptToken } from '@/utils/hashAndEncrypt.js';
import { wrapperFx } from '@/utils/wrapperFx.js';
import { google } from 'googleapis';
import { type Authentication, AuthProvider } from 'generated/prisma/index.js';
import type { PrismaClient } from '@prisma/client/extension';

async function fetchConversationsFromGoogle(
	prisma: PrismaClient,
	tokens: { provider_access_token: string | null; provider_refresh_token: string | null },
	accountId?: string,
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
					id: accountId,
				},
				data: {
					provider_access_token: token.encrypted,
					access_token_iv: token.iv,
				},
			});
		}
	});

	const gmail = google.gmail({
		auth: oauth2Client,
		version: 'v1',
	});

	const { data: threadsList } = await gmail.users.threads.list({
		userId: 'me',
		labelIds: ['INBOX'],
	});

	const promises = threadsList?.threads?.map((thread) =>
		gmail.users.threads.get({
			format: 'metadata',
			userId: 'me',
			id: thread.id!,
			metadataHeaders: ['From', 'Subject', 'Date'],
		}),
	);

	const results = await Promise.all(promises!);

	const threads = results.map((result, i) => {
		const headers = result.data?.messages?.[0]?.payload?.headers;

		const getHeaders = (name: string) => headers?.find((header) => header.name === name)?.value;

		const fromHeader = getHeaders('From');

		if (!fromHeader) {
			return null;
		}

		let [name, email] = fromHeader.split(' <').map((str, i) => {
			if (i === 0) return str.trim();
			return str.trim().substring(0, str.length - 1);
		});

		if (!email) {
			email = name!;
		}

		return {
			id: result.data?.id,
			snippet: truncate(threadsList?.threads?.[i]?.snippet || '', 100),
			subject: getHeaders('Subject'),
			name,
			email,
			date: getHeaders('Date'),
		};
	});

	// combine the threads with same email into each conversation
	const conversations: { name?: string; email: string; snippet: string }[] = [];

	for (const thread of threads) {
		if (!thread) continue;
		const conversation = conversations.find((c) => c.email === thread.email);
		if (!conversation) {
			conversations.push({ name: thread.name, email: thread.email, snippet: thread.snippet });
		}
	}

	return conversations;
}

export const fetchConversations = wrapperFx(async (req, res) => {
	const user = req.user!;
	const provider = req.query.provider?.toUpperCase();
	const accountId = req.query.accountId;

	if (!provider) {
		new ApiResponse('Missing provider', undefined, 400).error(res);
		return;
	}

	// check if the provider provided when uppercased matches with any of the providers from the enum Authentication['provider']
	if (!Object.values(AuthProvider).includes(provider as Authentication['provider'])) {
		new ApiResponse('Invalid provider', undefined, 400).error(res);
		return;
	}

	const prisma = getPrismaClient();
	const tokens = await prisma.authentication.findUnique({
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
		},
	});

	if (!tokens) {
		new ApiResponse('Missing tokens', undefined, 400).error(res);
		return;
	}

	tokens.provider_access_token = decryptToken({
		iv: tokens.access_token_iv!,
		encrypted: tokens.provider_access_token!,
	});
	tokens.provider_refresh_token = decryptToken({
		iv: tokens.refresh_token_iv!,
		encrypted: tokens.provider_refresh_token!,
	});

	const conversations = await fetchConversationsFromGoogle(prisma, tokens, accountId);

	new ApiResponse('success', { conversations }).success(res);
});

function truncate(string: string, length: number) {
	string = string.trimEnd();
	return string.length > length ? string.substring(0, length - 3) + '...' : string;
}
