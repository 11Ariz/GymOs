import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import memberRoutes from './routes/members.js';
import emailRoutes from './routes/email.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins in production
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/email', emailRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Export the app for Vercel Serverless Functions
export default app;
