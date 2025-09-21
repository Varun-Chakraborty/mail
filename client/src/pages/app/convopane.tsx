import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { EmailHeader } from './emailHeader';
import { FullEmailContent } from './fullEmailContent';
import { ReplyComposer } from './replyComposer';
import { Sidebar } from './sidebar';
import { useConversations } from '@/lib/context/conversationCtx';

interface ConversationPaneProps {
	className?: Readonly<string>;
}

import { MessageSquare } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Conversation } from '@/types/baseTypes';
import { Skeleton } from '@/components/ui/skeleton';

const EmptyConversation = () => {
	return (
		<div className="flex flex-col h-full flex-1 items-center justify-center p-6 text-center">
			<MessageSquare className="h-24 w-24 text-muted-foreground/30" />
			<h2 className="mt-6 text-2xl font-semibold">Select a Conversation</h2>
			<p className="mt-2 text-muted-foreground">
				Choose a contact from the sidebar to see your email thread or start a new one.
			</p>
		</div>
	);
};

const MessageList = ({
	conversation,
	ref,
}: {
	conversation: Conversation;
	ref: React.RefObject<HTMLDivElement | null>;
}) => {
	return (
		<div ref={ref} className="flex-1 p-4 md:p-6 overflow-y-auto">
			<Accordion
				type="multiple"
				className="w-full space-y-4 flex flex-col"
				defaultValue={[`message-${conversation?.messages[conversation?.messages.length - 1]?.id}`]}
			>
				{conversation?.messages.map((message) => (
					<AccordionItem
						value={`message-${message.id}`}
						key={message.id}
						className={cn(
							'border-none w-full md:max-w-[60%] rounded-lg',
							message.isSender ? 'self-end' : 'self-start',
						)}
					>
						<AccordionTrigger
							className={cn(
								'p-4 rounded-lg hover:no-underline data-[state=open]:pb-3 cursor-pointer',
								message.isSender ? 'bg-primary text-primary-foreground' : 'bg-muted',
							)}
						>
							<EmailHeader email={message} isSender={message.isSender} />
						</AccordionTrigger>
						<AccordionContent className="p-0 pt-3">
							<FullEmailContent email={message} isSender={message.isSender} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
};

export const ConversationPane: React.FC<ConversationPaneProps> = ({ className }) => {
	const { selectedConversation, getCurrentConversation, appendMessages, status } =
		useConversations();
	const [conversation, setConversation] = useState<Conversation>();
	const messageListRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let conversation = getCurrentConversation();
		if (conversation?.messages.length === 0)
			appendMessages().then(() => {
				let conversation = getCurrentConversation();
				setConversation(conversation);
			});
		setConversation(conversation);
	}, [selectedConversation]);

	useLayoutEffect(() => {
		if (messageListRef.current)
			messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
	}, [conversation]);

	return (
		<div className={cn('flex flex-col h-full', className)}>
			<div className="p-4 border-b border-border bg-background z-10 flex items-center gap-4 shrink-0">
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="md:hidden">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Open navigation</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="p-0 w-64">
						{/* This is a more advanced step, but in a real app
            			  you'd pass the state setters (onSelectAccount, etc.) 
            			  into this Sidebar instance as well.
            			*/}
						<Sidebar />
					</SheetContent>
				</Sheet>

				<div>
					<h2 className="text-lg font-semibold">{conversation?.name}</h2>
					<p className="text-sm text-muted-foreground">{conversation?.email}</p>
				</div>
			</div>

			{!conversation ? (
				<EmptyConversation />
			) : (
				<>
					{status === 'loading' ? (
						<div className="flex flex-col h-full flex-1 items-center justify-center p-6 text-center">
							<Skeleton className="h-24 w-24" />
							<h2 className="mt-6 text-2xl font-semibold">Loading...</h2>
						</div>
					) : (
						<MessageList ref={messageListRef} conversation={conversation} />
					)}
					<ReplyComposer className="shrink-0" conversation={conversation} />
				</>
			)}
		</div>
	);
};
