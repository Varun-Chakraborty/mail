import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ContinueWithGoogle from '../button/continueWithGoogle';
import { Form, FormItem, FormLabel } from '../ui/form';
import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const formSchema = z.object({
		email: z.email(),
		password: z.string().min(6),
	});
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>Login with your Google account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form className="grid gap-6">
							<div className="flex flex-col gap-4">
								<ContinueWithGoogle />
							</div>
							<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
								<span className="bg-card text-muted-foreground relative z-10 px-2">
									Or continue with
								</span>
							</div>
							<div className="grid gap-6">
								<FormItem className="grid gap-3">
									<FormLabel>Email</FormLabel>
									<Input id="email" type="email" placeholder="m@example.com" required />
								</FormItem>
								<FormItem className="grid gap-3">
									<div className="flex items-center">
										<FormLabel>Password</FormLabel>
										<Link
											to="/forgot-password"
											className="ml-auto text-sm underline-offset-4 hover:underline"
										>
											Forgot your password?
										</Link>
									</div>
									<Input id="password" type="password" required />
								</FormItem>
								<Button type="submit" className="w-full">
									Login
								</Button>
							</div>
							<div className="text-center text-sm">
								Don&apos;t have an account?{' '}
								<Link to="/signup" className="underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
				<a href="#">Privacy Policy</a>.
			</div>
		</div>
	);
}
