import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-prod',
  allowedDomain: process.env.ALLOWED_DOMAIN || '@arborinternationalschool.com',
  adminEmails: (process.env.ADMIN_EMAILS || 'alsuha5c@arborinternationalschool.com')
    .split(',')
    .map((value) => value.trim().toLowerCase())
};
