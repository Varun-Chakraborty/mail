import { ExpressTypes } from '@/types';
import { ApiResponse } from '@/utils';

export function authorizeIfRequestedUserIsMe(
	req: ExpressTypes.Req,
	res: ExpressTypes.Res,
	next: ExpressTypes.Next,
) {
	if (!req.user) {
		new ApiResponse('Unauthorized', undefined, 401).error(res);
		return;
	}
	if (req.params.username !== req.user.username) {
		new ApiResponse('You can only access such data of yourself', undefined, 403).error(res);
		return;
	}
	return next();
}
