import { z } from 'zod';
import { db } from '../models/db.js';
import { sendMeetingSms } from '../services/sms.service.js';

const smsSchema = z.object({
  meetingDate: z.string().min(8),
  meetingTime: z.string().min(3),
  recipients: z.array(z.string().email())
});

export const dashboardMetrics = (_req, res) => {
  return res.json({
    users: db.users.length,
    meetings: db.meetings.length,
    assignments: db.roleAssignments.length,
    pendingOrApprovals: db.orProgress.filter((entry) => entry.status === 'Pending').length,
    votes: db.votes.length
  });
};

export const triggerMeetingNotification = (req, res) => {
  const parsed = smsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid SMS payload.' });

  const sms = sendMeetingSms({ ...parsed.data, requestedBy: req.user.id });
  return res.status(202).json(sms);
};
