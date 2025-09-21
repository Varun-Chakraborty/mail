import { ExpressTypes } from '@/types/index.js';
import { ApiResponse } from '@/utils/index.js';

export function isNotAuthenticated(
	req: ExpressTypes.Req,
	res: ExpressTypes.Res,
	next: ExpressTypes.Next,
) {
	if (req.user) {
		new ApiResponse('You are already logged in', undefined, 403).error(res);
		return;
	}
	return next();
}
