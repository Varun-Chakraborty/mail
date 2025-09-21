import { AuthResponseTypes, BaseResponseTypes } from '@/types/responseTypes';
import { HTTPService } from './httpService';

class AuthService extends HTTPService {
	constructor() {
		super();
	}

	async login(username: string, password: string) {
		const response = await this.api.post<AuthResponseTypes.LoginResponse>('/auth/signin', {
			username,
			password,
		});
		return response.data;
	}

	async signup(name: string, username: string, email: string, password: string) {
		const response = await this.api.post<AuthResponseTypes.SignupResponse>('/auth/signup', {
			name,
			username,
			email,
			password,
		});
		return response.data;
	}

	async logout() {
		await this.api.post('/auth/signout');
	}

	async forgotPassword(email: string) {
		const response = await this.api.post<BaseResponseTypes.APIResponse>('/auth/forgotPassword', {
			email,
		});
		return response.data;
	}

	async resetPassword(email: string, resetToken: string, password: string) {
		const response = await this.api.post<BaseResponseTypes.APIResponse>('/auth/resetPassword', {
			email,
			resetToken,
			password,
		});
		return response.data;
	}

	async isLoggedIn() {
		return this.api
			.get<AuthResponseTypes.AuthStatusResponse>('/auth/authStatus')
			.then(() => false)
			.catch((error) => error.response.status == 403);
	}
}

export default new AuthService();
