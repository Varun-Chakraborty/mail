import type { Message } from '../baseTypes';
import type { APIResponse } from './baseResponse';

export interface FetchMessagesResponse extends APIResponse {
	data?: {
		messages: Message[];
		pageToken?: string;
	};
}
