import { Router } from 'express';
import { approveOrStage, submitOrStage } from '../controllers/or.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/submit', requireAuth, submitOrStage);
router.patch('/:entryId/approve', requireAuth, requireAdmin, approveOrStage);

export default router;
