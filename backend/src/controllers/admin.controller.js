import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';
import { OR_STAGES } from '../constants/or.js';

const emailSchema = z.object({ email: z.string().email() });

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isAllowedSchoolEmail(email) {
  return email.endsWith(env.allowedDomain);
}

export const listAdmins = async (_req, res) => {
  const admins = await prisma.adminList.findMany({ orderBy: { createdAt: 'asc' } });
  return res.json({ admins });
};

/** All registered guilders (for admin roster / notifications). */
export const listGuilders = async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      classGrade: true,
      section: true,
      phoneNumber: true,
      completedOrStages: true
    },
    orderBy: [{ classGrade: 'asc' }, { section: 'asc' }, { name: 'asc' }]
  });
  return res.json({ users });
};

/** SMS-style reminder text for a meeting (copy/paste or external SMS gateway). */
export const meetingSmsTemplate = async (req, res) => {
  const meeting = await prisma.meeting.findUnique({ where: { id: req.params.meetingId } });
  if (!meeting) return res.status(404).json({ message: 'Meeting not found.' });
  const text = `The Oratory Guild meeting is on ${meeting.date} at ${meeting.time}.`;
  return res.json({ text, meetingId: meeting.id, date: meeting.date, time: meeting.time });
};

export const addAdmin = async (req, res) => {
  const parsed = emailSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid email.' });

  const { email } = parsed.data;
  const normalized = normalizeEmail(email);
  if (!isAllowedSchoolEmail(normalized)) {
    return res.status(400).json({ message: `Only ${env.allowedDomain} emails are allowed for admins.` });
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return res.status(404).json({ message: 'User does not exist. Register first.' });

  try {
    const admin = await prisma.adminList.create({ data: { email: normalized } });
    return res.status(201).json(admin);
  } catch {
    return res.status(409).json({ message: 'Admin already exists.' });
  }
};

export const removeAdmin = async (req, res) => {
  const email = normalizeEmail(req.params.email || '');
  if (!email) return res.status(400).json({ message: 'Invalid email.' });
  if (!isAllowedSchoolEmail(email)) return res.status(400).json({ message: 'Email domain not allowed.' });

  try {
    await prisma.adminList.delete({ where: { email } });
    return res.json({ ok: true });
  } catch {
    return res.status(404).json({ message: 'Admin not found.' });
  }
};

export const bootstrapInitialAdmin = async (req, res) => {
  const schema = z.object({
    token: z.string(),
    email: z.string().email()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid payload.' });

  const { token, email } = parsed.data;
  if (!env.initialAdminSetupToken) return res.status(400).json({ message: 'Bootstrap token not configured.' });
  if (token !== env.initialAdminSetupToken) return res.status(403).json({ message: 'Invalid bootstrap token.' });

  const existingCount = await prisma.adminList.count();
  if (existingCount > 0) return res.status(409).json({ message: 'Initial admin already configured.' });

  const normalized = normalizeEmail(email);
  if (!isAllowedSchoolEmail(normalized)) {
    return res.status(400).json({ message: `Only ${env.allowedDomain} emails are allowed.` });
  }

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return res.status(404).json({ message: 'User does not exist. Register first.' });

  const admin = await prisma.adminList.create({ data: { email: normalized } });
  return res.status(201).json(admin);
};

export const completeOrStage = async (req, res) => {
  const stageSchema = z.object({
    stage: z.coerce.number().int().min(1).max(5)
  });

  const parsed = stageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid OR stage.', errors: parsed.error.flatten() });

  const { stage } = parsed.data;
  const orDef = OR_STAGES.find((o) => o.stage === stage);
  if (!orDef) return res.status(400).json({ message: 'Unknown OR stage.' });

  const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const completed = new Set(user.completedOrStages || []);
  if (completed.has(stage)) return res.status(409).json({ message: `OR-${stage} is already marked complete.` });

  const nextStages = new Set(completed);
  for (let s = 1; s <= stage; s++) nextStages.add(s);
  const sorted = Array.from(nextStages).sort((a, b) => a - b);

  await prisma.user.update({
    where: { id: user.id },
    data: { completedOrStages: sorted }
  });

  return res.json({ ok: true, completedOrStages: sorted });
};

/** Same as completeOrStage but resolves user by school email (username). */
export const completeOrStageByEmail = async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    stage: z.coerce.number().int().min(1).max(5)
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid payload. Use a valid school email and OR stage 1–5.',
      errors: parsed.error.flatten()
    });
  }

  const { email, stage } = parsed.data;
  const normalized = normalizeEmail(email);

  const orDef = OR_STAGES.find((o) => o.stage === stage);
  if (!orDef) return res.status(400).json({ message: 'Unknown OR stage.' });

  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) return res.status(404).json({ message: 'User not found for that email. Student must register first.' });

  const completed = new Set(user.completedOrStages || []);
  if (completed.has(stage)) {
    return res.status(409).json({ message: `OR-${stage} is already marked complete for this student.` });
  }

  /** Admin convenience: marking OR-N also records OR-1 … OR-(N-1) as complete. */
  const nextStages = new Set(completed);
  for (let s = 1; s <= stage; s++) nextStages.add(s);
  const sorted = Array.from(nextStages).sort((a, b) => a - b);

  await prisma.user.update({
    where: { id: user.id },
    data: { completedOrStages: sorted }
  });

  return res.json({ ok: true, completedOrStages: sorted, userId: user.id, email: user.email });
};
