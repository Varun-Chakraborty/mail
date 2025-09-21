import { Router } from 'express';

const router = Router();

import { mailController } from '@/controllers/index.js';
import { ApiResponse } from '@/utils/ApiResponse.js';

router.get('/messages', mailController.fetchMessages);

router.get('*path', (_, res) => {
	new ApiResponse('API v0.1\nAvailable Sub-Routes:\n- ./messages\n', undefined, 404).error(res);
});

export default router;
