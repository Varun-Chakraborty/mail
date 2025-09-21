import { isAxiosError } from 'axios';
import { HTTPService } from './httpService';
import type {
	FetchAccountsResponse,
	FetchConversationResponse,
	FetchUserResponse,
} from '@/types/responseTypes/userResponse';

class UserService extends HTTPService {
	constructor() {
		super();
	}

	async isUsernameAvailable(username: string) {
		try {
			await this.api.get(`/isUsernameAvailable?username=${username}`);
			return true;
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 409) {
				return false;
			} else {
				throw error;
			}
		}
	}

	async fetchAccounts() {
		return (await this.api.get<FetchAccountsResponse>('/user/fetchAccounts')).data;
	}

	async fetchUser() {
		return (await this.api.get<FetchUserResponse>('/user')).data;
	}

	async fetchConversations(provider: string, accountId: string) {
		return (
			await this.api.get<FetchConversationResponse>(
				`/user/conversations?provider=${provider.toLowerCase()}&accountId=${accountId}`,
			)
		).data;
	}
}

export default new UserService();
