import { getPrismaClient } from '@/db/index.js';
import { RedisService } from '@/services/index.js';
import { ApiResponse, wrapperFx, setCookie, tokens, hashToken } from '@/utils/index.js';

export const refreshToken = wrapperFx(async function (req, res) {
	const refreshToken = req.cookies.refreshToken ?? req.headers.authorization?.split(' ')[1];

	if (!refreshToken) {
		new ApiResponse('No refresh token found', undefined, 401).error(res);
		return;
	}

	const hashedToken = hashToken(refreshToken);

	const redis = new RedisService();
	const prisma = getPrismaClient();

	const doesExists = await redis.isTheTokenDumped(hashedToken);
	if (doesExists) {
		new ApiResponse('Invalid refresh token', undefined, 401).error(res);
		return;
	}

	const verificationResponse = tokens.verifyRefreshTokens(refreshToken);
	if (!verificationResponse) {
		new ApiResponse('Invalid refresh token', undefined, 401).error(res);
		return;
	}
	const { id } = verificationResponse;

	const user = await prisma.user.findUnique({
		where: { id, sessions: { some: { refreshToken: hashedToken } } },
	});

	if (!user) {
		res.clearCookie('refreshToken');
		new ApiResponse('Invalid refresh token', undefined, 401).error(res);
		return;
	}

	const { access, res: response } = tokens.generateTokens(user, 'access', res);

	new ApiResponse('Refresh successful', {
		accessToken: access,
	}).success(response);
	return;
});
