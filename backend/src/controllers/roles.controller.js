import { ROLE_GUIDELINES } from '../constants/roles.js';

export const listRoleGuidelines = (_req, res) => {
  return res.json({ roles: ROLE_GUIDELINES });
};

export const roleDetails = (req, res) => {
  const role = ROLE_GUIDELINES.find((entry) => entry.key === req.params.roleKey);
  if (!role) return res.status(404).json({ message: 'Role not found.' });
  return res.json(role);
};
