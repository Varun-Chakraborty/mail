import { hashPassword, hashToken } from '@/utils/index.js';
import { Prisma, PrismaClient } from '@/../generated/prisma/index.js';

export async function hashPasswordDuringCreate({
	args,
	query,
}: {
	args: Prisma.AuthenticationCreateArgs;
	query: (args: Prisma.AuthenticationCreateArgs) => Prisma.PrismaPromise<any>;
}) {
	const { data } = args;
	if (data.password && typeof data.password === 'string')
		data.password = await hashPassword(data.password!);
	return query(args);
}

export async function hashPasswordDuringUpdate({
	args,
	query,
}: {
	args: Prisma.AuthenticationUpdateArgs;
	query: (args: Prisma.AuthenticationUpdateArgs) => Prisma.PrismaPromise<any>;
}) {
	const { data } = args;
	if (typeof data.password === 'string' && data.password)
		data.password = await hashPassword(data.password);
	return query(args);
}

export async function hashTokenDuringUpdate({
	args,
	query,
}: {
	args: Prisma.SessionUpdateArgs;
	query: (args: Prisma.SessionUpdateArgs) => Prisma.PrismaPromise<any>;
}) {
	const { data } = args;
	if (typeof data.refreshToken === 'string' && data.refreshToken)
		data.refreshToken = await hashToken(data.refreshToken);
	return query(args);
}

let prismaClient: PrismaClient | null = null;

export function getPrismaClient() {
	if (!prismaClient) {
		const prismaExt = Prisma.defineExtension({
			query: {
				authentication: {
					create: hashPasswordDuringCreate,
					update: hashPasswordDuringUpdate,
				},
				session: {
					update: hashTokenDuringUpdate,
				},
			},
		});
		prismaClient = new PrismaClient().$extends(prismaExt) as PrismaClient;
	}

	return prismaClient;
}
