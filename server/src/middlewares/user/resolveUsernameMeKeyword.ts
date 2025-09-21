import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils';

export function resolveUsernameMeKeyword(
	req: ExpressTypes.Req,
	res: ExpressTypes.Res,
	next: ExpressTypes.Next,
) {
	if (req.params.username === 'me') {
		if (!req.user) {
			new ApiResponse('You need to login to access this keyword username', undefined, 401).error(
				res,
			);
			return;
		}
		req.params.username = req.user.username;
	}
	return next();
}
