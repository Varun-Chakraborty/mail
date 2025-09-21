declare namespace NodeJS {
	export interface ProcessEnv {
		PORT?: string;
		JWT_ACCESS_SECRET?: string;
		JWT_REFRESH_SECRET?: string;
		JWT_ACCESS_EXPIRATION?: string;
		JWT_REFRESH_EXPIRATION?: string;
		ACCESS_COOKIE_MAX_AGE?: string;
		REFRESH_COOKIE_MAX_AGE?: string;
		ALLOWED_ORIGINS?: string;
		NODE_ENV: 'production' | 'development';
		REDIS_HOST: string;
		GMAIL_ADDRESS: string;
		GMAIL_PASSWORD: string;
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		GOOGLE_REDIRECT_URI: string;
	}
}
