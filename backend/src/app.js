import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import meetingsRoutes from './routes/meetings.routes.js';
import orRoutes from './routes/or.routes.js';
import votingRoutes from './routes/voting.routes.js';
import adminRoutes from './routes/admin.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/or', orRoutes);
app.use('/api/votes', votingRoutes);
app.use('/api/admin', adminRoutes);
