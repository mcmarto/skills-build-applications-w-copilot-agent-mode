import express, { Express } from 'express';
import db from './config/database';

const app: Express = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'OctoFit Tracker backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`OctoFit Tracker backend server running on http://localhost:${PORT}`);
});

export default app;
