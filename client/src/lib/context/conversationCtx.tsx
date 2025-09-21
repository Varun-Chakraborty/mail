import { userService } from '@/services/http';
import type { Account, Conversation } from '@/types/baseTypes';
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { createContext } from 'react';
import { useAccounts } from './accountCtx';
import mailService from '@/services/http/mailService';

function useFetchConversations(provider?: string, accountId?: string) {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
	const [error403, setError403] = useState(false);

	useEffect(() => {
		if (!accountId || !provider) return;
		userService
			.fetchConversations(provider, accountId)
			.then((response) => {
				const conversations = response.data?.conversations;
				conversations?.map((convo) => {
					convo.messages = [];
				});
				setConversations(conversations || []);
				setStatus('idle');
			})
			.catch((e) => {
				if (e.response?.status === 403) setError403(true);
				setStatus('error');
				console.error(e);
			});
	}, [accountId, provider]);

	return { conversations, setConversations, error403, status, setStatus };
}

interface ConversationCtx {
	conversations: Conversation[];
	status: 'loading' | 'idle' | 'error';
	error403: boolean;
	setStatus: Dispatch<SetStateAction<'loading' | 'idle' | 'error'>>;
	selectedConversation?: number;
	selectConversation: Dispatch<SetStateAction<number | undefined>>;
	getCurrentConversation: () => Conversation | undefined;
	appendMessages: () => Promise<void>;
}

const ConversationCtx = createContext<ConversationCtx | undefined>(undefined);

export function ConversationProvider({ children }: { children: React.ReactNode }) {
	const { selectedAccount, getCurrentAccount } = useAccounts();
	const [{ provider, accountId }, setSelectedAccount] = useState({ provider: '', accountId: '' });
	const { conversations, setConversations, status, error403, setStatus } = useFetchConversations(
		provider,
		accountId,
	);
	const [selectedConversation, selectConversation] = useState<number>();
	const [selectedAccountInfo, setSelectedAccountInfo] = useState<Account>();

	useEffect(() => {
		const selectedAccount = getCurrentAccount();
		setSelectedAccountInfo(selectedAccount);
		if (selectedAccount) {
			setSelectedAccount({
				provider: selectedAccount.provider,
				accountId: selectedAccount.id,
			});
		}
	}, [selectedAccount]);

	async function appendMessages() {
		if (!selectedAccountInfo) return;
		setStatus('loading');
		const conversation = getCurrentConversation();
		if (!conversation) return;
		const data = await mailService
			.fetchMessages(
				conversation.email,
				selectedAccountInfo.provider,
				selectedAccountInfo.id,
				conversation.pageToken,
			)
			.then((response) => response?.data);
		if (!data) return;
		const { messages, pageToken } = data;
		if (!messages) return;
		setConversations((prev) => {
			prev.splice(selectedConversation!, 1, {
				...conversation,
				messages: [...conversation.messages, ...messages.reverse()],
				pageToken,
			});

			return [...prev];
		});
		setStatus('idle');
	}

	function getCurrentConversation() {
		if (selectedConversation != undefined) {
			const convo = conversations[selectedConversation];
			return convo;
		}
	}

	return (
		<ConversationCtx
			value={{
				conversations,
				selectConversation,
				selectedConversation,
				status,
				error403,
				getCurrentConversation,
				appendMessages,
				setStatus,
			}}
		>
			{children}
		</ConversationCtx>
	);
}

export function useConversations() {
	const context = useContext(ConversationCtx);
	if (context === undefined) {
		throw new Error('useConversationsCtx must be used within a ConversationProvider');
	}
	return context;
}
