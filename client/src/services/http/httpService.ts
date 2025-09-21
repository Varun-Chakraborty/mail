import { toast } from 'sonner';
import { BaseResponseTypes } from '@/types/responseTypes';
import axios, { AxiosError } from 'axios';

export class HTTPService {
	private currentRequestResponseObject: BaseResponseTypes.APIResponse | undefined = undefined;
	protected readonly api = axios.create({
		baseURL: `http://localhost:3000/api/v1/`,
		withCredentials: true,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	constructor() {
		this.api.interceptors.response.use(
			(response) => response,
			async (error: AxiosError) => {
				if (error.message === 'Network Error') {
					if (!error.config?.url?.includes('/health')) toast('Network error');
					return Promise.reject(new Error('Network Error'));
				} else if (error.response?.status === 500) {
					const response = error.response.data as BaseResponseTypes.ErrorResponse | undefined;
					toast(response?.message ?? 'Server error');
					return Promise.reject(error as Error);
				} else if (error.response?.status === 401) {
					if (error.request?.responseURL?.includes('/auth')) {
						console.log(this.currentRequestResponseObject);
						if (this.currentRequestResponseObject)
							error.response.data = this.currentRequestResponseObject;
						this.currentRequestResponseObject = undefined;
						return Promise.reject(error as Error);
					} else {
						const currentRequest = error.config!;
						console.log(error.response.data);
						this.currentRequestResponseObject = error.response
							.data as BaseResponseTypes.APIResponse;
						console.log(this.currentRequestResponseObject);
						await this.refreshToken();
						return await this.api.request(currentRequest);
					}
				}
				return Promise.reject(error as Error);
			},
		);
	}

	private async refreshToken() {
		const response = await this.api.get('/auth/refresh');
		return response.data;
	}

	async ping() {
		await this.api.get('/health');
	}
}
