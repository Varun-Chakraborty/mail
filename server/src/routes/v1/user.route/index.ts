import { userController } from '@/controllers/index.js';
import { ApiResponse } from '@/utils/ApiResponse.js';
import { Router } from 'express';

const router = Router();

router.get('/', userController.fetchUser);
router.get('/fetchAccounts', userController.fetchAccounts);
router.get('/conversations', userController.fetchConversations);

router.get('*path', (_, res) => {
	new ApiResponse('API v1.0\nAvailable Sub-Routes:\n- ./fetchAccounts\n', undefined, 404).error(
		res,
	);
});

export default router;
