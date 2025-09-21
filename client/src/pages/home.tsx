import { Button } from '@/components/ui/button'; // Adjust path as needed
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Adjust path as needed
import { useUserCtx } from '@/lib/context/userCtx';
import { MessageSquare, Users, Smile, Mail, Send, User, Inbox } from 'lucide-react';
import { Link } from 'react-router';

function Header() {
	const { user } = useUserCtx();
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-14 items-center">
				<div className="md:mr-4 mr-0 flex items-center">
					<Mail className="h-6 w-6 mr-2" />
					<span className="font-bold">Chitty Chat</span>
				</div>
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-2">
						{user ? (
							<Button asChild>
								<Link to="/app">Continue to Chitty Chat</Link>
							</Button>
						) : (
							<>
								<Button variant="ghost" asChild>
									<Link to="/login">Log In</Link>
								</Button>
								<Button>Get Early Access</Button>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}

function HeroSection() {
	return (
		<section className="flex flex-col items-center justify-center py-20 md:py-32">
			<h1 className="text-4xl md:text-6xl font-bold text-center leading-tight tracking-tighter">
				Your Email, Reimagined
				<br />
				as a <span className="text-primary">Conversation</span>.
			</h1>
			<p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground text-center">
				Ditch the cluttered inbox. Chitty Chat turns your emails into a clean, fast, and chat-like
				experience. All your existing accounts, one revolutionary app.
			</p>
			<div className="mt-8 flex gap-4">
				<Button size="lg">Get Early Access</Button>
				<Button size="lg" variant="outline">
					See How It Works
				</Button>
			</div>
		</section>
	);
}

const features = [
	{
		icon: <MessageSquare className="h-8 w-8 text-primary" />,
		title: 'Conversational Threads',
		description:
			'No more endless reply chains. See your emails flow like a natural chat discussion, with subjects as topics.',
	},
	{
		icon: <Users className="h-8 w-8 text-primary" />,
		title: 'Smart Sender Grouping',
		description:
			'We automatically group emails by sender or team, just like contacts and groups in your favorite chat app.',
	},
	{
		icon: <Smile className="h-8 w-8 text-primary" />,
		title: 'Quick Replies & Reactions',
		description:
			'Respond faster with quick replies, snoozing, and emoji reactions without drafting a formal reply.',
	},
];

function FeaturesSection() {
	return (
		<section className="py-20">
			<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
				{features.map((feature) => (
					<Card key={feature.title}>
						<CardHeader>
							<div className="mb-4">{feature.icon}</div>
							<CardTitle>{feature.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{feature.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

function ChatMockup() {
	return (
		<Card className="w-full max-w-4xl mx-auto overflow-hidden">
			<div className="flex h-[500px] bg-background">
				<div className="w-1/4 border-r bg-muted/50 p-4">
					<h2 className="text-lg font-semibold mb-4">Contacts</h2>
					<div className="space-y-2">
						<div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary font-medium">
							<User className="h-5 w-5" />
							<span>Alice Smith</span>
						</div>
						<div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
							<User className="h-5 w-5" />
							<span>Bob Johnson</span>
						</div>
						<div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer">
							<Inbox className="h-5 w-5" />
							<span>Project Updates</span>
						</div>
						<div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted cursor-pointer text-muted-foreground">
							<Inbox className="h-5 w-5" />
							<span>Newsletters</span>
						</div>
					</div>
				</div>

				<div className="w-3/4 flex flex-col">
					<div className="border-b p-4">
						<h3 className="text-lg font-semibold">Alice Smith</h3>
						<p className="text-sm text-muted-foreground">alice.smith@example.com</p>
					</div>

					<div className="flex-1 p-6 space-y-6 overflow-y-auto">
						<div className="flex flex-col items-start gap-2">
							<div className="rounded-lg bg-muted p-4 max-w-lg">
								<div className="text-xs font-semibold text-muted-foreground mb-1">Alice Smith</div>
								<div className="font-bold mb-2">Subject: Quick question on the slides</div>
								<p className="text-sm">
									Hey, just looked at the slides for tomorrow, looks great! Just had one quick
									question on slide 5...
								</p>
							</div>
						</div>

						<div className="flex flex-col items-end gap-2">
							<div className="rounded-lg bg-primary text-primary-foreground p-4 max-w-lg">
								<div className="text-xs font-semibold text-primary-foreground/80 mb-1">You</div>
								<div className="font-bold mb-2">Re: Quick question on the slides</div>
								<p className="text-sm">
									Thanks, Alice! Glad you liked them. What's up with slide 5? Happy to clarify.
								</p>
							</div>
						</div>

						<div className="flex flex-col items-start gap-2">
							<div className="rounded-lg bg-muted p-4 max-w-lg">
								<div className="text-xs font-semibold text-muted-foreground mb-1">Alice Smith</div>
								<div className="font-bold mb-2">Re: Quick question on the slides</div>
								<p className="text-sm">
									It was about the Q3 projection data. Does that include the new market estimates we
									discussed?
								</p>
							</div>
						</div>
					</div>

					<div className="border-t p-4 bg-background">
						<div className="flex items-center gap-2 border rounded-lg p-2">
							<input
								type="text"
								placeholder="Type your reply (as an email)..."
								className="flex-1 bg-transparent outline-none text-sm px-2"
							/>
							<Button size="icon">
								<Send className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

function DemoSection() {
	return (
		<section className="bg-muted/30 py-20 md:py-32">
			<div className="">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold">See It In Action</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Stop sorting, start chatting. Our interface turns your inbox into a focused
						conversation, showing you what matters most.
					</p>
				</div>
				<div className="mt-12">
					<ChatMockup />
				</div>
			</div>
		</section>
	);
}

function CTASection() {
	return (
		<section className="py-20 md:py-32 text-center">
			<h2 className="text-3xl md:text-4xl font-bold">Ready to Change How You Email?</h2>
			<p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
				Get free early access to Chitty Chat and be the first to experience an inbox that finally
				feels natural.
			</p>
			<div className="mt-8">
				<Button size="lg">Sign Up for the Beta</Button>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer className="border-t">
			<div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
				<p className="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Chitty Chat. All rights reserved.
				</p>
				<div className="flex gap-4">
					<Button variant="link" size="sm" className="text-muted-foreground">
						Privacy Policy
					</Button>
					<Button variant="link" size="sm" className="text-muted-foreground">
						Terms of Service
					</Button>
				</div>
			</div>
		</footer>
	);
}

export function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground p-8">
			<Header />
			<main className="flex-1">
				<HeroSection />
				<FeaturesSection />
				<DemoSection />
				{/* You can add a Testimonial section here later */}
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
