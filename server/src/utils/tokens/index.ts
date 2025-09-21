type TokenType = 'access' | 'refresh';

import type {
	AccessJWTResponse,
	ExpressTypes,
	Profile,
	RefreshJWTResponse,
} from '@/types/index.js';
import { generateToken, verifyToken } from './tokenUtils.js';
import { setCookie } from '../setCookie.js';
import type { User } from 'generated/prisma/index.js';

interface Data {
	id: string;
	name?: string | null;
	pfp?: string;
	primaryemail: string;
}

export function generateTokens(data: Data, type: TokenType | 'both', res: ExpressTypes.Res) {
	const accessSecret = process.env.JWT_ACCESS_SECRET;
	const refreshSecret = process.env.JWT_REFRESH_SECRET;
	const accessExpiration = process.env.JWT_ACCESS_EXPIRATION ?? '1d';
	const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION ?? '7d';
	let access: string | undefined, refresh: string | undefined;
	if (type === 'access' || type === 'both')
		access = generateToken(data, accessSecret!, accessExpiration);
	if (type === 'refresh' || type === 'both') {
		refresh = generateToken({ id: data.id }, refreshSecret!, refreshExpiration);
	}
	if (access) {
		res = setCookie('accessToken', access!, res, {
			maxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE ?? String(1000 * 60 * 60 * 24)),
		});
	}
	if (refresh) {
		res = setCookie('refreshToken', refresh!, res, {
			maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE ?? String(1000 * 60 * 60 * 24 * 7)),
		});
	}

	return { access, refresh, res };
}

export function verifyAccessTokens(token: string): AccessJWTResponse | null {
	const accessSecret = process.env.JWT_ACCESS_SECRET;
	return verifyToken(token, accessSecret!) as AccessJWTResponse | null;
}

export function verifyRefreshTokens(token: string): RefreshJWTResponse | null {
	const refreshSecret = process.env.JWT_REFRESH_SECRET;
	return verifyToken(token, refreshSecret!) as RefreshJWTResponse | null;
}
