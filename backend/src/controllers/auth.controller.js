import { z } from 'zod';
import crypto from 'node:crypto';
import { ALLOWED_CLASSES } from '../constants/roles.js';
import { db } from '../models/db.js';
import { env } from '../config/env.js';
import { hashPassword, comparePassword, createToken } from '../utils/auth.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  studentClass: z.enum(ALLOWED_CLASSES),
  section: z.string().min(1)
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

  if (db.users.some((user) => user.email === email)) {
    return res.status(409).json({ message: 'Account already exists.' });
  }

  const user = {
    id: crypto.randomUUID(),
    name: input.name,
    email,
    passwordHash: await hashPassword(input.password),
    studentClass: input.studentClass,
    section: input.section,
    isAdmin: env.adminEmails.includes(email),
    createdAt: new Date().toISOString()
  };

  db.users.push(user);

  const token = createToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
  return res.status(201).json({ token, user: { ...user, passwordHash: undefined } });
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
  const user = db.users.find((entry) => entry.email === email);

  if (!user || !(await comparePassword(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
  return res.status(200).json({ token, user: { ...user, passwordHash: undefined } });
};
