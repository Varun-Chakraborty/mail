import { Link } from 'react-router';
import { Button } from '../ui/button';
import { GoogleSVG } from '../svgs';

export default function ContinueWithGoogle() {
	return (
		<Button variant="outline" className="w-full" asChild>
			<Link
				to={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/gmail.readonly&access_type=offline&prompt=consent`}
			>
				<GoogleSVG />
				Continue with Google
			</Link>
		</Button>
	);
}
