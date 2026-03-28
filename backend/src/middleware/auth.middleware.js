import { verifyToken } from '../utils/auth.js';
import { prisma } from '../db/prisma.js';
import { isSuperAdminEmail } from '../constants/superAdmins.js';

export const requireAuth = (req, res, next) => {
  const raw = req.headers.authorization || '';
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : null;

  if (!token) return res.status(401).json({ message: 'Missing auth token.' });

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid auth token.' });
  }
};

export const requireAdmin = async (req, res, next) => {
  const email = req.user?.email?.toLowerCase?.() || '';
  if (!email) return res.status(401).json({ message: 'Invalid auth token payload.' });

  if (isSuperAdminEmail(email)) return next();
  const admin = await prisma.adminList.findUnique({ where: { email } });
  if (!admin) return res.status(403).json({ message: 'Admin access required.' });
  return next();
};
