import { Router } from 'express';
import {
  bootstrapInitialAdmin,
  completeOrStage,
  completeOrStageByEmail,
  addAdmin,
  listAdmins,
  removeAdmin,
  listGuilders,
  meetingSmsTemplate
} from '../controllers/admin.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Admin management (AdminList collection).
router.get('/admins', requireAuth, requireAdmin, listAdmins);
router.post('/admins', requireAuth, requireAdmin, addAdmin);
router.delete('/admins/:email', requireAuth, requireAdmin, removeAdmin);

router.get('/guilders', requireAuth, requireAdmin, listGuilders);
router.get('/meetings/:meetingId/sms-template', requireAuth, requireAdmin, meetingSmsTemplate);

// One-time bootstrap to create the first admin entry without hardcoding an email in code.
router.post('/bootstrap', bootstrapInitialAdmin);

// OR tracking: Admin marks OR-1..OR-5 as completed (by email or user id).
router.post('/users/complete-or-by-email', requireAuth, requireAdmin, completeOrStageByEmail);
router.post('/users/:userId/complete-or', requireAuth, requireAdmin, completeOrStage);

export default router;
