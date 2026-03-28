import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-prod',
  allowedDomain: process.env.ALLOWED_DOMAIN || '@arborinternationalschool.com',
  /** PostgreSQL connection string (Supabase: use sslmode=require; encode @ in password as %40). */
  databaseUrl: process.env.DATABASE_URL || '',
  // Optional one-time bootstrap token for initial admin creation.
  // This avoids hardcoding any email in code while still allowing first-time setup.
  initialAdminSetupToken: process.env.INITIAL_ADMIN_SETUP_TOKEN || ''
};
