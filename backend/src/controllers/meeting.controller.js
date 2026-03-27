import crypto from 'node:crypto';
import { z } from 'zod';
import { db } from '../models/db.js';

const meetingSchema = z.object({
  title: z.string().min(3),
  startsAt: z.string().datetime(),
  agenda: z.array(z.string()).default([])
});

export const createMeeting = (req, res) => {
  const parsed = meetingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid meeting payload.' });

  const meeting = {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };

  db.meetings.push(meeting);
  return res.status(201).json(meeting);
};

export const listMeetings = (_req, res) => res.json({ meetings: db.meetings });

const assignSchema = z.object({
  meetingId: z.string().uuid(),
  roleKey: z.string(),
  userId: z.string().uuid()
});

export const assignRole = (req, res) => {
  const parsed = assignSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid role assignment payload.' });

  const { meetingId, roleKey, userId } = parsed.data;
  const duplicateRole = db.roleAssignments.find((item) => item.meetingId === meetingId && item.roleKey === roleKey);
  if (duplicateRole) return res.status(409).json({ message: 'Role already assigned for this meeting.' });

  const duplicateUser = db.roleAssignments.find((item) => item.meetingId === meetingId && item.userId === userId);
  if (duplicateUser) return res.status(409).json({ message: 'User already has a role for this meeting.' });

  const assignment = { id: crypto.randomUUID(), meetingId, roleKey, userId };
  db.roleAssignments.push(assignment);
  return res.status(201).json(assignment);
};
