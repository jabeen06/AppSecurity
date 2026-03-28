import crypto from 'node:crypto';
import { z } from 'zod';
import { db } from '../models/db.js';

const stageSchema = z.object({
  stage: z.number().int().min(1).max(5),
  reflection: z.string().min(10)
});

export const submitOrStage = (req, res) => {
  const parsed = stageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'Invalid OR payload.' });

  const entry = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    stage: parsed.data.stage,
    reflection: parsed.data.reflection,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.orProgress.push(entry);
  return res.status(201).json(entry);
};

export const approveOrStage = (req, res) => {
  const entry = db.orProgress.find((item) => item.id === req.params.entryId);
  if (!entry) return res.status(404).json({ message: 'OR request not found.' });

  entry.status = 'Approved';
  entry.approvedBy = req.user.id;
  entry.approvedAt = new Date().toISOString();
  return res.json(entry);
};
