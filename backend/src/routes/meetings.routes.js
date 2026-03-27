import { Router } from 'express';
import { assignRole, createMeeting, listMeetings } from '../controllers/meeting.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, listMeetings);
router.post('/', requireAuth, requireAdmin, createMeeting);
router.post('/assign-role', requireAuth, assignRole);

export default router;
