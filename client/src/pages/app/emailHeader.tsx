import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from '@/types/baseTypes';

interface EmailHeaderProps {
	email: Message;
	isSender: boolean;
}

export const EmailHeader: React.FC<EmailHeaderProps> = ({ email, isSender }) => {
	return (
		<div className="flex items-start gap-4 w-full">
			<Avatar className="w-8 h-8">
				<AvatarFallback>{email.from.name?.charAt(0)}</AvatarFallback>
			</Avatar>
			<div className="flex-1 text-left overflow-hidden">
				<div className="flex justify-between items-center">
					<span className="font-semibold truncate">{email.from.name}</span>
					<span
						className={cn(
							'text-xs',
							isSender ? 'text-primary-foreground/70' : 'text-muted-foreground',
						)}
					>
						{new Date(email.date).toLocaleString()}
					</span>
				</div>
				<div className="font-medium text-sm truncate">{email.subject}</div>
				<p
					className={cn(
						'text-sm truncate text-wrap',
						isSender ? 'text-primary-foreground/90' : 'text-muted-foreground',
					)}
				>
					{email.snippet}
				</p>
			</div>
		</div>
	);
};
