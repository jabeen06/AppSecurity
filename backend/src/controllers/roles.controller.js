import { db } from '../models/db.js';

export const listRoleGuidelines = (_req, res) => {
  // Dedicated role guidelines endpoint used by the mobile screens.
  return res.json({ roles: db.roleGuidelines });
};

export const roleDetails = (req, res) => {
  const role = db.roleGuidelines.find((entry) => entry.key === req.params.roleKey);
  if (!role) return res.status(404).json({ message: 'Role not found.' });
  return res.json(role);
};
