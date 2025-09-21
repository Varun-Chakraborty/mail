import { useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';
import { Home, Login, Signup, ForgotPassword } from './pages';
import { Error } from './components/error';
import { NotFound } from './components/not_found';
import { MailClient } from './pages/app';
import { UserProvider } from './lib/context/userCtx';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<UserProvider>
				<main className="h-screen">
					<Outlet />
				</main>
			</UserProvider>
		),
		children: [
			{
				path: '',
				element: <Home />,
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'signup',
				element: <Signup />,
			},
			{
				path: 'forgot-password',
				element: <ForgotPassword />,
			},
			{
				path: 'app',
				element: <MailClient />,
			},
			{
				path: '*',
				element: <NotFound />,
			},
		],
		ErrorBoundary: Error,
	},
]);

function App() {
	useEffect(() => {
		document.documentElement.classList.add('dark');
	}, []);

	return <RouterProvider router={router} />;
}

export default App;
