import { Router } from 'express';
import { dashboardMetrics, triggerMeetingNotification } from '../controllers/admin.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/metrics', requireAuth, requireAdmin, dashboardMetrics);
router.post('/notifications/meeting-sms', requireAuth, requireAdmin, triggerMeetingNotification);

export default router;
