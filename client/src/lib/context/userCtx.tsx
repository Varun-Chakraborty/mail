import { authService, userService } from '@/services/http';
import type { Profile } from '@/types/baseTypes';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router';

function useFetchUser() {
	const [user, setUser] = useState<Profile>();
	const [status, setStatus] = useState<'loading' | 'idle'>('loading');

	useEffect(() => {
		userService.fetchUser().then((response) => {
			const user = response.data?.user;
			setUser(user);
			setStatus('idle');
		});
	}, []);

	return { user, setUser, status };
}

interface UserCtx {
	user?: Profile;
	status: 'loading' | 'idle';
	logout: () => void;
}

const UserCtx = createContext<UserCtx | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
	const { user, setUser, status } = useFetchUser();
	const navigate = useNavigate();

	function logout() {
		authService.logout();
		setUser(undefined);
		navigate('/');
	}

	return <UserCtx value={{ user, logout, status }}>{children}</UserCtx>;
}

export function useUserCtx() {
	const context = useContext(UserCtx);
	if (context === undefined) {
		throw new Error('useUserCtx must be used within a UserProvider');
	}
	return context;
}
