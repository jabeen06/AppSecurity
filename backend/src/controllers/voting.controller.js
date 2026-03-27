import crypto from 'node:crypto';
import { z } from 'zod';
import { db } from '../models/db.js';

const voteSchema = z.object({
  meetingId: z.string().uuid(),
  award: z.enum(['Best Speaker', 'Best Evaluator', 'Best Roleplayer', 'Best TTM Speaker']),
  nomineeUserId: z.string().uuid(),
  withinTime: z.boolean()
});

export const castVote = (req, res) => {
  const parsed = voteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid vote payload.' });
  if (!parsed.data.withinTime) {
    return res.status(400).json({ message: 'Nominee must meet timing eligibility.' });
  }

  const duplicate = db.votes.find(
    (vote) => vote.meetingId === parsed.data.meetingId && vote.award === parsed.data.award && vote.byUserId === req.user.id
  );
  if (duplicate) return res.status(409).json({ message: 'Vote already submitted for this award.' });

  const vote = { id: crypto.randomUUID(), ...parsed.data, byUserId: req.user.id };
  db.votes.push(vote);
  return res.status(201).json(vote);
};

export const votingResults = (req, res) => {
  const meetingVotes = db.votes.filter((vote) => vote.meetingId === req.params.meetingId);
  const tally = meetingVotes.reduce((acc, vote) => {
    const key = `${vote.award}:${vote.nomineeUserId}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return res.json({ tally });
};
