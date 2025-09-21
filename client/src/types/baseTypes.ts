export interface Message {
	id: string;
	threadId: string;
	from: { name?: string; email: string };
	subject: string;
	snippet: string;
	bodyHtml: string;
	bodyText: string;
	date: Date;
	isSender: boolean;
}

export interface Conversation {
	name: string;
	email: string;
	snippet: string;
	messages: Message[];
	pageToken?: string;
}

export type Provider = 'GOOGLE' | 'OUTLOOK';

export interface Account {
	id: string;
	name: string;
	email: string;
	provider: Provider;
	conversations: Conversation[];
}

export interface Profile {
	id: string;
	name: string;
	primaryemail: string;
	pfp?: string;
	accounts: Account[];
}

export interface Email {
	id: number;
	from: string;
	email: string;
	subject: string;
	snippet: string;
	body: string;
	date: string;
	isSender: boolean;
}

export interface User {
	name: string;
	email: string;
	pfp?: string;
}
