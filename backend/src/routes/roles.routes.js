import { Router } from 'express';
import { listRoleGuidelines, roleDetails } from '../controllers/roles.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, listRoleGuidelines);
router.get('/:roleKey', requireAuth, roleDetails);

export default router;
