import { useRouteError } from 'react-router';

export function Error() {
	const error = useRouteError() as Error;
	return (
		<main className="p-10 space-y-5">
			<h1 className="text-3xl">Caught Error</h1>
			<pre>{error.stack}</pre>
		</main>
	);
}
