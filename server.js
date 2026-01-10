import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/database.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from back/public/uploads directory
// Files are uploaded to back/public/uploads, so we need to serve from there
const backPublicUploads = join(__dirname, '..', 'back', 'public', 'uploads');
app.use('/uploads', express.static(backPublicUploads));

// Routes
import trainersRoutes from './routes/trainers.js';
import coursesRoutes from './routes/courses.js';
import usersRoutes from './routes/users.js';
import registrationsRoutes from './routes/registrations.js';
import statsRoutes from './routes/stats.js';
import hireRequestsRoutes from './routes/hireRequests.js';
import membershipsRoutes from './routes/memberships.js';
import membersRoutes from './routes/members.js';
import uiSettingsRoutes from './routes/uiSettings.js';

app.use('/api/trainers', trainersRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/hire-requests', hireRequestsRoutes);
app.use('/api/memberships', membershipsRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/ui-settings', uiSettingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});

