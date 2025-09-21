import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Send, Bold, Italic, Underline, List } from 'lucide-react';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/baseTypes';

interface ReplyComposerProps {
	className?: string;
	conversation?: Conversation;
}

export const ReplyComposer: React.FC<ReplyComposerProps> = ({ className, conversation }) => {
	const [showCcBcc, setShowCcBcc] = useState(false);

	return (
		<div className={cn('p-4 border-t border-border bg-background', className)}>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="reply-item" className="border-none">
					<AccordionTrigger className="font-medium hover:no-underline py-2 cursor-pointer">
						Reply to {conversation?.name}
					</AccordionTrigger>
					<AccordionContent>
						<div className="rounded-lg border focus-within:ring-2 focus-within:ring-ring pt-4">
							<div className="px-4 pb-4 space-y-2">
								<div className="flex items-center gap-2">
									<span className="text-sm text-muted-foreground">To:</span>
									<Input
										defaultValue={conversation?.email}
										className="border-none h-auto p-0 m-0 focus-visible:ring-0"
									/>
									<Button variant="ghost" size="sm" onClick={() => setShowCcBcc(!showCcBcc)}>
										Cc/Bcc
									</Button>
								</div>
								{showCcBcc && (
									<>
										<Separator />
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">Cc:</span>
											<Input
												placeholder="carbon@copy.com"
												className="border-none h-auto p-0 m-0 focus-visible:ring-0"
											/>
										</div>
										<Separator />
										<div className="flex items-center gap-2">
											<span className="text-sm text-muted-foreground">Bcc:</span>
											<Input
												placeholder="blind@copy.com"
												className="border-none h-auto p-0 m-0 focus-visible:ring-0"
											/>
										</div>
									</>
								)}
								<Separator />
								<Input
									defaultValue="Re: Quick question on the slides"
									placeholder="Subject"
									className="border-none h-auto p-0 m-0 text-base font-medium focus-visible:ring-0"
								/>
							</div>

							<Separator />
							<Textarea
								placeholder="Type your email..."
								className="min-h-[150px] border-none focus-visible:ring-0 resize-y"
							/>

							<div className="p-2 flex justify-between items-center border-t bg-muted/50">
								<ToggleGroup type="multiple">
									<ToggleGroupItem value="bold" aria-label="Toggle bold">
										<Bold className="h-4 w-4" />
									</ToggleGroupItem>
									<ToggleGroupItem value="italic" aria-label="Toggle italic">
										<Italic className="h-4 w-4" />
									</ToggleGroupItem>
									<ToggleGroupItem value="underline" aria-label="Toggle underline">
										<Underline className="h-4 w-4" />
									</ToggleGroupItem>
									<ToggleGroupItem value="list" aria-label="Toggle list">
										<List className="h-4 w-4" />
									</ToggleGroupItem>
								</ToggleGroup>

								<Button>
									<Send className="h-4 w-4 mr-2" />
									Send Email
								</Button>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};
