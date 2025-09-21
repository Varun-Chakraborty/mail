import { useAccounts } from '@/lib/context/accountCtx';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/baseTypes';

interface FullEmailContentProps {
	email: Message;
	isSender: boolean;
}

export const FullEmailContent: React.FC<FullEmailContentProps> = ({ email, isSender }) => {
	const { getCurrentAccount } = useAccounts();
	const account = getCurrentAccount();

	return (
		<div className={cn('rounded-lg border bg-background p-4', isSender ? 'mr-12' : 'ml-12')}>
			<div className="border-b pb-4 mb-4 text-sm text-muted-foreground">
				<p>
					<strong>From:</strong> {email.from.name} <span>&lt;{email.from.email}&gt;</span>
				</p>
				<p>
					<strong>To:</strong> You <span>&lt;{account?.email}&gt;</span>
				</p>
				<p>
					<strong>Subject:</strong> {email.subject}
				</p>
			</div>

			<div
				className="prose prose-sm dark:prose-invert max-w-none"
				dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
			/>
			<pre className="text-sm text-muted-foreground text-wrap py-4">{email.bodyText}</pre>
		</div>
	);
};
