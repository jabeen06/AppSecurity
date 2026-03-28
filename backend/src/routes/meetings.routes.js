import { Router } from 'express';
import {
  assignRoleByAdmin,
  createMeeting,
  getMeetingById,
  getUpcomingMeeting,
  listMeetings,
  selectRole
} from '../controllers/meeting.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Admin: list all meetings (useful in admin panel).
router.get('/', requireAuth, requireAdmin, listMeetings);

// Students and admins: view the next scheduled meeting.
router.get('/upcoming', requireAuth, getUpcomingMeeting);
router.get('/:meetingId', requireAuth, getMeetingById);

// Admin: create an upcoming meeting with a set of available roles.
router.post('/', requireAuth, requireAdmin, createMeeting);

// Student: pick one open role for this meeting (self).
router.post('/:meetingId/select-role', requireAuth, selectRole);

// Admin: assign a role to any student by email (optional override / support).
router.post('/:meetingId/assign-role', requireAuth, requireAdmin, assignRoleByAdmin);

export default router;
