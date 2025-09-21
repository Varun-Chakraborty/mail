import type { Account, Conversation, Profile } from '../baseTypes';

export interface FetchAccountsResponse {
	data?: {
		accounts: Account[];
	};
}

export interface FetchUserResponse {
	data?: {
		user: Profile;
	};
}

export interface FetchConversationResponse {
	data?: {
		conversations: Conversation[];
	};
}
