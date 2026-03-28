import { ROLE_GUIDELINES } from '../constants/roles.js';

/**
 * In-memory datastore for demo/prototyping.
 * Replace with PostgreSQL + Prisma or Mongo + Mongoose in production.
 */
export const db = {
  users: [],
  meetings: [],
  roleAssignments: [],
  orProgress: [],
  votes: [],
  notifications: [],
  roleGuidelines: ROLE_GUIDELINES
};
