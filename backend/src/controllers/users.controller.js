import { prisma } from '../db/prisma.js';
import { OR_STAGES } from '../constants/or.js';
import { resolveUserRole } from '../constants/superAdmins.js';
import { startOfLocalDay } from '../utils/meetingSchedule.js';

function computeOrLevel(completedOrStages) {
  const completedCount = Array.isArray(completedOrStages) ? completedOrStages.length : 0;
  return Math.min(completedCount + 1, 5);
}

function computeOrProgress(completedOrStages) {
  const completed = new Set(completedOrStages || []);
  let firstPending = null;
  for (let s = 1; s <= 5; s++) {
    if (!completed.has(s)) {
      firstPending = s;
      break;
    }
  }

  return OR_STAGES.map((stageDef) => {
    const status = completed.has(stageDef.stage)
      ? 'Completed'
      : firstPending === stageDef.stage
        ? 'Pending'
        : 'Locked';

    return { stage: stageDef.stage, key: stageDef.key, title: stageDef.title, status, ...stageDef };
  });
}

/**
 * `role` from AdminList (or super-admin list). Dashboard splits club role tracking:
 * `upcomingMeetingRole` = signup for the next meeting; `rolesPerformed` = past meetings only.
 */
export const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const adminRow = await prisma.adminList.findUnique({ where: { email: user.email } });
  const stages = user.completedOrStages || [];
  const orLevel = computeOrLevel(stages);
  const orProgress = computeOrProgress(stages);

  const now = new Date();

  /** Roles you already took in past club meetings (not the upcoming signup). */
  const pastAssignments = await prisma.assignedRole.findMany({
    where: {
      userId: user.id,
      meeting: { startsAt: { lt: now } }
    },
    include: { meeting: true },
    orderBy: { assignedAt: 'desc' }
  });
  const rolesPerformed = pastAssignments.map((a) => ({
    id: a.id,
    roleKey: a.roleKey,
    meetingId: a.meetingId,
    meetingDate: a.meeting?.date ?? '',
    meetingTime: a.meeting?.time ?? '',
    assignedAt: a.assignedAt
  }));

  const upcomingMeeting = await prisma.meeting.findFirst({
    where: { startsAt: { gte: startOfLocalDay() } },
    orderBy: { startsAt: 'asc' },
    include: { assignedRoles: true }
  });
  const myUpcoming = upcomingMeeting?.assignedRoles?.find((a) => a.userId === user.id);
  const upcomingMeetingRole = upcomingMeeting && myUpcoming
    ? {
        meetingId: upcomingMeeting.id,
        date: upcomingMeeting.date,
        time: upcomingMeeting.time,
        roleKey: myUpcoming.roleKey
      }
    : null;

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      classGrade: user.classGrade,
      section: user.section,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: resolveUserRole(user.email, !!adminRow),
      orLevel,
      orProgress,
      rolesPerformed,
      upcomingMeetingRole
    }
  });
};
