import type { Profile } from '../baseTypes';
import type { APIResponse } from './baseResponse';

export interface LoginResponse extends APIResponse {
	data?: {
		user: Profile;
		accessToken: string;
	};
}

export interface SignupResponse extends APIResponse {
	data?: {
		user: Profile;
		accessToken: string;
	};
}

export interface AuthStatusResponse extends APIResponse {
	data?: {
		user: Profile;
	};
}
