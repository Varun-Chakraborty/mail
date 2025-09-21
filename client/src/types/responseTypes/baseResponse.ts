export interface APIResponse {
	status: number;
	message: string;
	data?: any;
}

export interface ErrorResponse extends APIResponse {
	status: number;
	message: string;
}
