import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/email.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost', 'http://localhost:5173'] }));
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/email', emailRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Export the app for Vercel Serverless Functions
export default app;
