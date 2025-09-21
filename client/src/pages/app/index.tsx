import { AccountsProvider } from '@/lib/context/accountCtx';
import { ConversationPane } from './convopane';
import { Sidebar } from './sidebar';
import { ConversationProvider } from '@/lib/context/conversationCtx';

interface AppLayoutProps {
	sidebar: React.ReactNode;
	children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, children }) => {
	return (
		<div className="flex h-dvh w-full bg-background">
			<aside className="w-76 h-full border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex-col hidden md:flex">
				{sidebar}
			</aside>

			<main className="flex-1 flex flex-col h-screen overflow-hidden">{children}</main>
		</div>
	);
};

export function MailClient() {
	return (
		<AccountsProvider>
			<ConversationProvider>
				<AppLayout sidebar={<Sidebar />}>
					<ConversationPane />
				</AppLayout>
			</ConversationProvider>
		</AccountsProvider>
	);
}
