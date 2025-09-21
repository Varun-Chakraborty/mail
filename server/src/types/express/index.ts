import express from 'express';
import type { Authentication } from 'generated/prisma/index.js';
import { type Credentials } from 'google-auth-library';

export interface Req extends express.Request {
	body: {};
	query: {
		code?: string;
		provider?: Authentication['provider'];
		accountId?: string;
		email?: string;
		pageToken?: string;
	};
	params: {};
	cookies: {
		accessToken?: string;
		refreshToken?: string;
	};
	tokens?: {
		accessToken?: string;
		refreshToken?: string;
	};
	creds?: Credentials;
	user?: {
		id: string;
		name?: string;
		email: string;
	};
}
export interface Res extends express.Response {}
export interface Next extends express.NextFunction {}
