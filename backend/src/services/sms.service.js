import crypto from 'node:crypto';
import { db } from '../models/db.js';

/**
 * Stub for SMS integration.
 * In production connect Twilio/MSG91 and enqueue jobs through BullMQ.
 */
export const sendMeetingSms = ({ meetingDate, meetingTime, recipients, requestedBy }) => {
  const payload = {
    id: crypto.randomUUID(),
    type: 'MEETING_REMINDER',
    message: `The Oratory Guild meeting is scheduled on ${meetingDate} at ${meetingTime}.`,
    recipients,
    requestedBy,
    status: 'queued',
    createdAt: new Date().toISOString()
  };

  db.notifications.push(payload);
  return payload;
};
