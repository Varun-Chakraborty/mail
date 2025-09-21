export * as ExpressTypes from './express/index.js';

export interface UserWithCredentials {
	id: string;
	name: string;
	email: string;
	password?: string;
	refreshToken?: string | null;
}
export interface Profile extends Omit<UserWithCredentials, 'password' | 'refreshToken' | 'email'> {}

export interface User extends Profile {
	email: string;
	pfp?: string | null;
	banner?: string | null;
	postsCount?: number;
	followers?: { id: string }[];
	following?: { id: string }[];
	followersCount?: number;
	followingCount?: number;
}

export interface AccessJWTResponse extends User {
	iat: number;
	exp: number;
}
export interface RefreshJWTResponse extends RefreshJWTPayload {
	iat: number;
	exp: number;
}
export interface RefreshJWTPayload extends Pick<Profile, 'id'> {}
