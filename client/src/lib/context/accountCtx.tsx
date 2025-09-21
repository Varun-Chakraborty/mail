import { userService } from '@/services/http';
import type { Account } from '@/types/baseTypes';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router';

function useFetchAccounts() {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [selectedAccount, selectAccount] = useState<number>();
	const [status, setStatus] = useState<'loading' | 'idle'>('loading');
	const navigate = useNavigate();

	useEffect(() => {
		userService
			.fetchAccounts()
			.then((response) => {
				const accounts = response.data?.accounts || [];
				setAccounts(accounts);
				selectAccount(0);
				setStatus('idle');
			})
			.catch((e) => {
				if (e.response.status === 401) navigate('/');
			});
	}, []);

	return { accounts, selectedAccount, selectAccount, status };
}

interface AccountCtx {
	accounts: Account[];
	selectedAccount?: number;
	selectAccount: (account: number) => void;
	status: 'loading' | 'idle';
	getCurrentAccount: () => Account | undefined;
}

const AccountsCtx = createContext<AccountCtx | undefined>(undefined);

export function AccountsProvider({ children }: { children: React.ReactNode }) {
	const { accounts, selectedAccount, selectAccount, status } = useFetchAccounts();

	function getCurrentAccount() {
		if (selectedAccount == undefined) return undefined;
		return accounts[selectedAccount];
	}

	return (
		<AccountsCtx value={{ accounts, selectedAccount, selectAccount, status, getCurrentAccount }}>
			{children}
		</AccountsCtx>
	);
}

export function useAccounts() {
	const context = useContext(AccountsCtx);
	if (context === undefined) {
		throw new Error('useAccounts must be used within a AccountsProvider');
	}
	return context;
}
