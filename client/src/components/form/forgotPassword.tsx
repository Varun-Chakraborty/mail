import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel } from '../ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'react-router';

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'div'>) {
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
				<CardHeader>
					<CardTitle>Forgot Password?</CardTitle>
					<CardDescription>Enter your email below to get the reset secret</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form>
							<div className="flex flex-col gap-6">
								<FormField
									name="email"
									control={form.control}
									render={({ field }) => (
										<FormItem className="grid gap-3">
											<FormLabel>Email</FormLabel>
											<Input {...field} />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Submit
								</Button>
							</div>
							<div className="mt-4 text-center text-sm">
								Don&apos;t have an account?{' '}
								<Link to="/signup" className="underline underline-offset-4">
									Sign up
								</Link>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
