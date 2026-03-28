import { PrismaClient } from '@prisma/client';

/**
 * Single Prisma client instance (PostgreSQL / Supabase).
 */
export const prisma = new PrismaClient();
