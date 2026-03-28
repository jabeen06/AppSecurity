import { prisma } from './prisma.js';
import { env } from '../config/env.js';

let connected = false;

/**
 * Connects to PostgreSQL (Supabase) via Prisma.
 */
export async function connectDatabase() {
  if (connected) return;
  if (!env.databaseUrl) {
    throw new Error('Missing DATABASE_URL. Set it in backend/.env (Supabase PostgreSQL connection string).');
  }
  await prisma.$connect();
  connected = true;
}
