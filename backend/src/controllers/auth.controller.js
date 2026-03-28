import { z } from 'zod';
import { ALLOWED_CLASSES } from '../constants/roles.js';
import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { hashPassword, comparePassword, createToken } from '../utils/auth.js';
import { resolveUserRole } from '../constants/superAdmins.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  studentClass: z.enum(ALLOWED_CLASSES),
  section: z.string().min(1),
  phoneNumber: z.string().min(6)
});

export const register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input.', errors: parsed.error.flatten() });
  }

  const input = parsed.data;
  const email = input.email.toLowerCase();

  if (!email.endsWith(env.allowedDomain)) {
    return res.status(400).json({ message: `Only ${env.allowedDomain} emails are allowed.` });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Account already exists.' });

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email,
      passwordHash: await hashPassword(input.password),
      classGrade: Number(input.studentClass),
      section: input.section,
      phoneNumber: input.phoneNumber
    }
  });

  // No JWT on register — client must sign in after registration (frontend-only auth flow).
  return res.status(201).json({
    message: 'Account created. Please sign in.',
    email: user.email
  });
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid credentials format.' });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const adminRow = await prisma.adminList.findUnique({ where: { email } });
  const token = createToken({ id: user.id, email: user.email });

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      classGrade: user.classGrade,
      section: user.section,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: resolveUserRole(user.email, !!adminRow)
    }
  });
};
