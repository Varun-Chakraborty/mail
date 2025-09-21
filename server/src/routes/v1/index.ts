import { Router } from 'express';

const router = Router();

import authRouter from './auth.route/index.js';
import userRouter from './user.route/index.js';
import mailRouter from './mail.route/index.js';

import { userController } from '@/controllers/index.js';
import { ApiResponse } from '@/utils/ApiResponse.js';
import { authenticate, isAuthenticated } from '@/middlewares/auth/index.js';

router.use(authenticate);
router.use('/auth', authRouter);
router.use('/user', isAuthenticated, userRouter);
router.use('/mail', isAuthenticated, mailRouter);
router.get('/isUsernameAvailable', userController.isUsernameAvailable);

router.get('*path', (_, res) => {
	new ApiResponse(
		'API v0.1\nAvailable Sub-Routes:\n- ./auth\n- ./mail\n- ./user/:username\n',
		undefined,
		404,
	).error(res);
});

export default router;
