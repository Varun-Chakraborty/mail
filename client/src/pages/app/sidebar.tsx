import ContinueWithGoogle from '@/components/button/continueWithGoogle';
import { GoogleSVG } from '@/components/svgs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccounts } from '@/lib/context/accountCtx';
import { useConversations } from '@/lib/context/conversationCtx';
import { useUserCtx } from '@/lib/context/userCtx';
import { cn } from '@/lib/utils';
import {
	Archive,
	Cloud,
	FileText,
	Inbox,
	LogOut,
	Plus,
	Send,
	Settings,
	UserIcon,
} from 'lucide-react';

interface NavButtonProps {
	icon: React.ReactNode;
	children: React.ReactNode;
	active?: boolean;
	onClick?: () => void;
	className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({
	icon,
	children,
	active = false,
	onClick,
	className,
}) => {
	return (
		<Button
			variant="ghost"
			onClick={onClick}
			className={cn(
				'w-full justify-start gap-2 space-x-2', // [Refinement] Removed redundant flex classes
				active
					? 'bg-sidebar-accent text-sidebar-accent-foreground'
					: 'text-sidebar-foreground/80 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/80',
			)}
		>
			{icon}
			<span className={cn('truncate', className)}>{children}</span>
		</Button>
	);
};

export const Sidebar: React.FC = () => {
	const { selectedAccount, accounts, selectAccount } = useAccounts();
	const { logout, user } = useUserCtx();
	const { conversations, status, error403, selectedConversation, selectConversation } =
		useConversations();

	const renderConversations = () => {
		if (status === 'loading') {
			return (
				<div className="space-y-1">
					<Skeleton className="h-9 w-full" />
					<Skeleton className="h-9 w-full" />
					<Skeleton className="h-9 w-full" />
				</div>
			);
		}

		if (error403) {
			return <ContinueWithGoogle />;
		}

		if (!conversations || conversations.length === 0) {
			return (
				<p className="text-xs text-center text-sidebar-foreground/60">No conversations found.</p>
			);
		}

		return (
			<div className="space-y-1 overflow-y-auto">
				{conversations.map((conversation, i) => (
					<NavButton
						key={i}
						icon={<UserIcon className="h-4 w-4" />}
						active={selectedConversation == i}
						onClick={() => selectConversation(i)}
						className="text-left"
					>
						<div className="">{conversation.name}</div>
					</NavButton>
				))}
			</div>
		);
	};

	return (
		<>
			<div className="p-4 flex items-center justify-between gap-2 border-b border-sidebar-border">
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage src={user?.pfp} alt={user?.name} />
						<AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
					</Avatar>
					<div className="flex-1 overflow-hidden">
						<div className="font-semibold truncate">{user?.name}</div>
						<div className="text-xs text-sidebar-foreground/70 truncate">{user?.primaryemail}</div>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={() => logout()}
					className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent dark:hover:text-destructive"
				>
					<LogOut className="h-4 w-4" />
				</Button>
			</div>

			<nav className="flex-1 flex flex-col p-4 space-y-4 min-h-0">
				<div className="shrink-0">
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-sm font-semibold text-sidebar-foreground/80 uppercase">Accounts</h3>
						<Button
							variant="ghost"
							size="icon"
							className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					<div className="space-y-1 overflow-y-auto">
						{accounts.map((account, i) => (
							<NavButton
								key={account.id}
								icon={account.provider == 'GOOGLE' ? <GoogleSVG /> : <Cloud className="h-4 w-4" />}
								active={selectedAccount == i}
								onClick={() => selectAccount(i)}
							>
								<span className="text-xs text-muted-foreground">{account.email}</span>
							</NavButton>
						))}
					</div>
				</div>

				<div className="flex-1 flex flex-col min-h-0">
					<div className="flex justify-between items-center mb-2 shrink-0">
						<h3 className="text-sm font-semibold text-sidebar-foreground/80 uppercase">
							conversations
						</h3>
						<Button
							variant="ghost"
							size="icon"
							disabled={status == 'loading' || error403}
							className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					{renderConversations()}
				</div>

				<div className="shrink-0">
					<h3 className="text-sm font-semibold text-sidebar-foreground/80 uppercase mb-2">
						Folders
					</h3>
					<div className="space-y-1">
						<NavButton icon={<Inbox className="h-4 w-4" />}>Inbox</NavButton>
						<NavButton icon={<Send className="h-4 w-4" />}>Sent</NavButton>
						<NavButton icon={<FileText className="h-4 w-4" />}>Drafts</NavButton>
						<NavButton icon={<Archive className="h-4 w-4" />}>Archive</NavButton>
					</div>
				</div>
			</nav>

			<div className="p-4 border-t border-sidebar-border">
				<NavButton icon={<Settings className="h-4 w-4" />}>Settings</NavButton>
			</div>
		</>
	);
};
