import { Router } from 'express';
import { castVote, votingResults } from '../controllers/voting.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, castVote);
router.get('/results/:meetingId', requireAuth, votingResults);

export default router;
