import { getPrismaClient } from '@/db/index.js';
import { RedisService } from '@/services/index.js';
import { ApiResponse, wrapperFx, tokens } from '@/utils/index.js';

export const signout = wrapperFx(async function (req, res) {
	const user = req.user!;
	const redis = new RedisService();

	const accessToken = req.tokens!.accessToken!;
	const accessTokenExpiry = tokens.verifyAccessTokens(accessToken)?.exp;
	if (accessTokenExpiry) {
		await redis.setDumpedToken(accessToken, accessTokenExpiry);
	}
	res.clearCookie('accessToken');

	const refreshToken = req.cookies.refreshToken ?? req.headers.authorization?.split(' ')[1];

	if (!refreshToken) {
		new ApiResponse('Signout successful').success(res);
		return;
	}

	if (await redis.isTheTokenDumped(refreshToken)) {
		new ApiResponse('Signout successful').success(res);
		return;
	}

	const isActive = tokens.verifyRefreshTokens(refreshToken);

	if (!isActive) {
		new ApiResponse('Signout successful').success(res);
		return;
	}

	const prisma = getPrismaClient();

	const session = await prisma.session.delete({
		where: {
			userId: user.id,
			refreshToken,
		},
	});

	if (!session) {
		new ApiResponse('Signout successful').success(res);
		return;
	}

	res.clearCookie('refreshToken');

	new ApiResponse('Signout successful').success(res);
});
