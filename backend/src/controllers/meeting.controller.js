import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { ROLE_GUIDELINES } from '../constants/roles.js';
import {
  computeStartsAtLocal,
  isValidMeetingDateISO,
  normalizeMeetingTimeHHmm,
  startOfLocalDay
} from '../utils/meetingSchedule.js';

const allowedRoleKeys = new Set(ROLE_GUIDELINES.map((r) => r.key));

function computeOrLevel(completedOrStages) {
  const completedCount = Array.isArray(completedOrStages) ? completedOrStages.length : 0;
  return Math.min(completedCount + 1, 5);
}

/** Persists one role slot for a user and appends role history (used by student select + admin assign). */
async function persistMeetingRoleAssignment(meeting, roleKey, targetUser) {
  await prisma.$transaction([
    prisma.assignedRole.create({
      data: {
        meetingId: meeting.id,
        roleKey,
        userId: targetUser.id,
        userEmail: targetUser.email
      }
    }),
    prisma.roleHistory.create({
      data: {
        userId: targetUser.id,
        meetingId: meeting.id,
        roleKey,
        meetingDate: meeting.date,
        meetingTime: meeting.time
      }
    })
  ]);
}

export const createMeeting = async (req, res) => {
  const schema = z.object({
    date: z.string().min(1),
    time: z.string().min(1),
    title: z.string().min(3).optional(),
    availableRoles: z.array(z.string()).min(1)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid meeting payload.', errors: parsed.error.flatten() });
  }

  const date = parsed.data.date.trim();
  const timeNorm = normalizeMeetingTimeHHmm(parsed.data.time);
  if (!isValidMeetingDateISO(date)) {
    return res.status(400).json({ message: 'Invalid date. Use YYYY-MM-DD (e.g. 2026-04-15).' });
  }
  if (!timeNorm) {
    return res.status(400).json({
      message:
        'Invalid time. Use 24-hour HH:mm or HH:mm:ss (e.g. 09:30 or 16:45). Single-digit hours like 9:30 are OK.'
    });
  }

  const { availableRoles } = parsed.data;
  const normalizedRoles = availableRoles.map((r) => r.trim());

  for (const roleKey of normalizedRoles) {
    if (!allowedRoleKeys.has(roleKey)) {
      return res.status(400).json({ message: `Unknown roleKey: ${roleKey}` });
    }
  }

  const startsAt = computeStartsAtLocal(date, timeNorm);
  if (!startsAt) {
    return res.status(400).json({ message: 'Could not build meeting date and time. Check date and time values.' });
  }

  try {
    const meeting = await prisma.meeting.create({
      data: {
        date,
        time: timeNorm,
        startsAt,
        availableRoles: normalizedRoles,
        createdById: req.user.id
      },
      include: { assignedRoles: true }
    });
    return res.status(201).json(meeting);
  } catch (e) {
    console.error('createMeeting', e);
    return res.status(500).json({ message: 'Database error while saving the meeting. Is the API connected to Postgres?' });
  }
};

export const listMeetings = async (_req, res) => {
  const meetings = await prisma.meeting.findMany({
    orderBy: { startsAt: 'asc' },
    include: { assignedRoles: true }
  });
  return res.json({ meetings });
};

export const getUpcomingMeeting = async (req, res) => {
  /** Earliest meeting from start of *today* (local server clock), so today's session still shows after start time. */
  const dayStart = startOfLocalDay();
  const meeting = await prisma.meeting.findFirst({
    where: { startsAt: { gte: dayStart } },
    orderBy: { startsAt: 'asc' },
    include: { assignedRoles: true }
  });

  if (!meeting) return res.json({ meeting: null });

  const assignedRoleKeys = new Set((meeting.assignedRoles || []).map((a) => a.roleKey));
  const openRoles = (meeting.availableRoles || []).filter((rk) => !assignedRoleKeys.has(rk));

  const myAssignment = (meeting.assignedRoles || []).find((a) => a.userId === req.user.id);

  return res.json({
    meeting: {
      id: meeting.id,
      date: meeting.date,
      time: meeting.time,
      availableRoles: meeting.availableRoles,
      openRoles,
      assignedRoles: meeting.assignedRoles.map((a) => ({
        id: a.id,
        roleKey: a.roleKey,
        userId: a.userId,
        userEmail: a.userEmail,
        assignedAt: a.assignedAt
      })),
      myRoleKey: myAssignment?.roleKey || null
    }
  });
};

export const getMeetingById = async (req, res) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id: req.params.meetingId },
    include: { assignedRoles: true }
  });
  if (!meeting) return res.status(404).json({ message: 'Meeting not found.' });

  return res.json({
    meeting: {
      id: meeting.id,
      date: meeting.date,
      time: meeting.time,
      availableRoles: meeting.availableRoles,
      assignedRoles: meeting.assignedRoles
    }
  });
};

/**
 * Admin assigns an open role to a student (by school email / username).
 * Students do not self-assign; normal users are read-only for mutations.
 */
export const assignRoleByAdmin = async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    roleKey: z.string().min(1)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid assign payload.', errors: parsed.error.flatten() });
  }

  const { email, roleKey } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();
  if (!allowedRoleKeys.has(roleKey)) return res.status(400).json({ message: 'Invalid roleKey.' });

  const meeting = await prisma.meeting.findUnique({
    where: { id: req.params.meetingId },
    include: { assignedRoles: true }
  });
  if (!meeting) return res.status(404).json({ message: 'Meeting not found.' });

  const targetUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!targetUser) return res.status(404).json({ message: 'User not found for that email.' });

  const isRoleAvailable = (meeting.availableRoles || []).includes(roleKey);
  if (!isRoleAvailable) return res.status(400).json({ message: 'Role is not available for this meeting.' });

  const alreadyAssignedForRole = meeting.assignedRoles.some((a) => a.roleKey === roleKey);
  if (alreadyAssignedForRole) return res.status(409).json({ message: 'That role is already taken.' });

  const alreadyAssignedForUser = meeting.assignedRoles.some((a) => a.userId === targetUser.id);
  if (alreadyAssignedForUser) return res.status(409).json({ message: 'That user already has a role for this meeting.' });

  if (roleKey === 'god') {
    const orLevel = computeOrLevel(targetUser.completedOrStages || []);
    if (orLevel < 3) {
      return res.status(403).json({ message: 'G.O.D role is locked until that user’s OR level >= 3.' });
    }
  }

  try {
    await persistMeetingRoleAssignment(meeting, roleKey, targetUser);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ message: 'Role assignment conflict. Try again.' });
    }
    throw e;
  }

  return res.status(201).json({
    roleKey,
    meetingId: meeting.id,
    userId: targetUser.id,
    userEmail: targetUser.email
  });
};

/**
 * Student picks one open role for the upcoming meeting (self only).
 * Same rules as admin assign: no duplicate role/user, G.O.D requires ORLevel >= 3.
 */
export const selectRole = async (req, res) => {
  const schema = z.object({
    roleKey: z.string().min(1)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid role selection payload.', errors: parsed.error.flatten() });
  }

  const { roleKey } = parsed.data;
  if (!allowedRoleKeys.has(roleKey)) return res.status(400).json({ message: 'Invalid roleKey.' });

  const meeting = await prisma.meeting.findUnique({
    where: { id: req.params.meetingId },
    include: { assignedRoles: true }
  });
  if (!meeting) return res.status(404).json({ message: 'Meeting not found.' });

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const isRoleAvailable = (meeting.availableRoles || []).includes(roleKey);
  if (!isRoleAvailable) return res.status(400).json({ message: 'Role is not available for this meeting.' });

  const alreadyAssignedForRole = meeting.assignedRoles.some((a) => a.roleKey === roleKey);
  if (alreadyAssignedForRole) return res.status(409).json({ message: 'That role is already taken.' });

  const alreadyAssignedForUser = meeting.assignedRoles.some((a) => a.userId === user.id);
  if (alreadyAssignedForUser) return res.status(409).json({ message: 'You already have a role for this meeting.' });

  if (roleKey === 'god') {
    const orLevel = computeOrLevel(user.completedOrStages || []);
    if (orLevel < 3) {
      return res.status(403).json({ message: 'G.O.D role is locked until OR level >= 3.' });
    }
  }

  try {
    await persistMeetingRoleAssignment(meeting, roleKey, user);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ message: 'Role selection conflict. Try again.' });
    }
    throw e;
  }

  return res.status(201).json({ roleKey, meetingId: meeting.id });
};
