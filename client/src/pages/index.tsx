import { LoginForm, SignupForm, ForgotPasswordForm } from '@/components/form';

export function Login() {
	return (
		<div className="flex h-full w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}

export function Signup() {
	return (
		<div className="flex h-full w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignupForm />
			</div>
		</div>
	);
}

export function ForgotPassword() {
	return (
		<div className="flex h-full w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<ForgotPasswordForm />
			</div>
		</div>
	);
}

export { Home } from './home';
