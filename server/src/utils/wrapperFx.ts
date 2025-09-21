import type { ExpressTypes } from '@/types/index.js';
import { ApiResponse } from './ApiResponse.js';

export function wrapperFx(
	fx: (req: ExpressTypes.Req, res: ExpressTypes.Res, next: ExpressTypes.Next) => Promise<void>,
) {
	return async function (req: ExpressTypes.Req, res: ExpressTypes.Res, next: ExpressTypes.Next) {
		try {
			await fx(req, res, next);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				new ApiResponse(error.message, undefined, 500, error.stack).error(res);
			} else {
				new ApiResponse((error as Error).message, undefined, 500).error(res);
			}
		}
	};
}
