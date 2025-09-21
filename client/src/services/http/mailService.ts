import { HTTPService } from './httpService';
import type { FetchMessagesResponse } from '@/types/responseTypes/mailResponse';

class MailService extends HTTPService {
	constructor() {
		super();
	}

	async fetchMessages(
		contactEmail: string,
		provider: string,
		accountId: string,
		pageToken?: string,
	) {
		return (
			await this.api.get<FetchMessagesResponse>(
				`/mail/messages?email=${contactEmail}&provider=${provider}&accountId=${accountId}` +
					(pageToken ? `&pageToken=${pageToken}` : ''),
			)
		).data;
	}
}

export default new MailService();
