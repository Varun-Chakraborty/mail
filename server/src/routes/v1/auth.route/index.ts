import { Router } from 'express';

const router = Router();

import oauthrouter from './oauth.route/index.js';
import { ApiResponse } from '@/utils/index.js';
import { isAuthenticated, isNotAuthenticated } from '@/middlewares/auth/index.js';
import { authController } from '@/controllers/index.js';

router.use('/oauth', oauthrouter);
router.get('/authStatus', isAuthenticated, isNotAuthenticated);
// router.post('/signin', authController.signin);
// router.post('/signup', authController.signup);
router.post('/signout', authController.signout);
router.get('/refresh', authController.refreshToken);

router.get('*path', (_, res) => {
	new ApiResponse(
		'API v1.0\nAvailable Sub-Routes:\n- ./oauth\n- ./signin\n- ./signup\n- ./signout\n- ./refresh\n',
		undefined,
		404,
	).error(res);
});

export default router;
