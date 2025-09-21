import type { Res } from '@/types/express/index.js';

export class ApiResponse {
	status?: number;
	message: string;
	data?: object;
	stack?: string;

	constructor(message: string, data?: any, status?: number, stack?: string) {
		this.status = status;
		this.message = message;
		this.data = data;
		this.stack = stack;
	}

	success(res: Res) {
		return res
			.status(this.status ?? 200)
			.json({ success: true, message: this.message, data: this.data });
	}

	redirect(res: Res, url: string) {
		return res.status(this.status ?? 302).redirect(`http://localhost:5173${url}`);
	}

	error(res: Res) {
		return res.status(this.status ?? 500).json({
			success: false,
			message:
				(!this.status || this.status === 500) && process.env.NODE_ENV !== 'development'
					? 'Internal server error'
					: this.message,
			data: this.data,
			stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
		});
	}
}
