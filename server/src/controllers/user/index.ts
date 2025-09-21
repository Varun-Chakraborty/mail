import { getPrismaClient } from '@/db/index.js';
import { ApiResponse } from '@/utils/ApiResponse.js';
import { wrapperFx } from '@/utils/wrapperFx.js';

export const isUsernameAvailable = wrapperFx(async (req, res) => {
	new ApiResponse('success').success(res);
	return;
});

export const fetchAccounts = wrapperFx(async (req, res) => {
	const user = req.user!;
	const prisma = getPrismaClient();
	const accounts = await prisma.authentication.findMany({
		where: {
			userId: user.id,
			provider: { not: 'LOCAL' },
		},
		select: {
			id: true,
			email: true,
			provider: true,
		},
	});
	new ApiResponse('success', { accounts }).success(res);
});

export const fetchUser = wrapperFx(async (req, res) => {
	new ApiResponse('success', { user: req.user! }).success(res);
});

export { fetchConversations } from './fetchConversations.js';
