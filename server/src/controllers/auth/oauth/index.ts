import { ApiResponse } from '@/utils/index.js';
import { wrapperFx } from '@/utils/wrapperFx.js';
import { google } from 'googleapis';
import { encryptToken, hashToken } from '@/utils/hashAndEncrypt.js';
import { generateTokens } from '@/utils/tokens/index.js';
import { getPrismaClient } from '@/db/index.js';

export const oauthGoogle = wrapperFx(async (req, res) => {
	const { code } = req.query;

	if (!code) {
		return new ApiResponse('error', 'Missing code').redirect(res, '/');
	}

	const oauth2Client = new google.auth.OAuth2({
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirectUri: process.env.GOOGLE_REDIRECT_URI,
	});

	const { tokens: creds } = await oauth2Client.getToken(code);
	if (!creds.access_token || !creds.refresh_token) {
		return new ApiResponse('error', 'Required tokens could not be retrieved').redirect(res, '/');
	}

	oauth2Client.setCredentials(creds);

	const oauth2 = google.oauth2({
		auth: oauth2Client,
		version: 'v2',
	});

	const { data: user } = await oauth2.userinfo.get();

	const tokens = {
		access_token: encryptToken(creds.access_token),
		refresh_token: encryptToken(creds.refresh_token),
	};

	const prisma = getPrismaClient();

	const userData = await prisma.authentication.upsert({
		where: {
			providerId: user.id!,
		},
		update: {
			provider_access_token: tokens.access_token.encrypted,
			access_token_iv: tokens.access_token.iv,
			provider_refresh_token: tokens.refresh_token.encrypted,
			refresh_token_iv: tokens.refresh_token.iv,
		},
		create: {
			user: {
				connectOrCreate: {
					where: {
						primaryemail: user.email!,
					},
					create: {
						primaryemail: user.email!,
						name: user.name!,
					},
				},
			},
			provider: 'GOOGLE',
			providerId: user.id!,
			provider_access_token: tokens.access_token.encrypted,
			access_token_iv: tokens.access_token.iv,
			provider_refresh_token: tokens.refresh_token.encrypted,
			refresh_token_iv: tokens.refresh_token.iv,
			email: user.email!,
		},
		select: {
			user: {
				select: {
					id: true,
					name: true,
					primaryemail: true,
				},
			},
		},
	});

	const { refresh, res: response } = generateTokens(userData.user, 'both', res);

	await prisma.user.update({
		where: {
			id: userData.user.id,
		},
		data: {
			sessions: {
				create: {
					refreshToken: hashToken(refresh!),
				},
			},
		},
	});

	return new ApiResponse('success').redirect(response, '/app');
});
