import { Router } from 'express';

const router = Router();

import { authController } from '@/controllers/index.js';
import { ApiResponse } from '@/utils/index.js';

router.get('/google', authController.oauthGoogle);

router.get('*path', (_, res) => {
	new ApiResponse('API v1.0\nAvailable Sub-Routes:\n- ./google\n', undefined, 404).error(res);
});

export default router;
