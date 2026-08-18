import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import db, { connectToDatabase } from './config/database';
import { User, Team, Activity, LeaderboardEntry, Workout } from './models';

const app: Express = express();
const PORT = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

const readResource = async <T>(loader: () => Promise<T[]>, res: Response) => {
  const items = await loader();
  res.json({ success: true, count: items.length, data: items, apiBaseUrl });
};

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'OctoFit Tracker backend is running',
    apiBaseUrl,
    database: db.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get(['/api/users', '/api/users/'], async (_req: Request, res: Response) => {
  await readResource(() => User.find().lean(), res);
});

app.post('/api/users', async (req: Request, res: Response) => {
  const { name, email, fitnessLevel = 'beginner' } = req.body ?? {};

  if (!name || !email) {
    res.status(400).json({ success: false, message: 'Name and email are required.' });
    return;
  }

  const user = await User.create({ name, email, fitnessLevel });
  res.status(201).json({ success: true, data: user.toObject(), apiBaseUrl });
});

app.get(['/api/teams', '/api/teams/'], async (_req: Request, res: Response) => {
  await readResource(() => Team.find().lean(), res);
});

app.post('/api/teams', async (req: Request, res: Response) => {
  const { name, members = 0, sport = 'General' } = req.body ?? {};

  if (!name) {
    res.status(400).json({ success: false, message: 'Team name is required.' });
    return;
  }

  const team = await Team.create({ name, members, sport });
  res.status(201).json({ success: true, data: team.toObject(), apiBaseUrl });
});

app.get(['/api/activities', '/api/activities/'], async (_req: Request, res: Response) => {
  await readResource(() => Activity.find().lean(), res);
});

app.post('/api/activities', async (req: Request, res: Response) => {
  const { type, durationMinutes = 0, calories = 0 } = req.body ?? {};

  if (!type) {
    res.status(400).json({ success: false, message: 'Activity type is required.' });
    return;
  }

  const activity = await Activity.create({ type, durationMinutes, calories });
  res.status(201).json({ success: true, data: activity.toObject(), apiBaseUrl });
});

app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req: Request, res: Response) => {
  await readResource(() => LeaderboardEntry.find().sort({ rank: 1 }).lean(), res);
});

app.post('/api/leaderboard', async (req: Request, res: Response) => {
  const { name, points = 0 } = req.body ?? {};

  if (!name) {
    res.status(400).json({ success: false, message: 'Name is required.' });
    return;
  }

  const nextRank = (await LeaderboardEntry.countDocuments()) + 1;
  const entry = await LeaderboardEntry.create({ rank: nextRank, name, points });
  res.status(201).json({ success: true, data: entry.toObject(), apiBaseUrl });
});

app.get(['/api/workouts', '/api/workouts/'], async (_req: Request, res: Response) => {
  await readResource(() => Workout.find().lean(), res);
});

app.post('/api/workouts', async (req: Request, res: Response) => {
  const { title, difficulty = 'Easy', durationMinutes = 0 } = req.body ?? {};

  if (!title) {
    res.status(400).json({ success: false, message: 'Workout title is required.' });
    return;
  }

  const workout = await Workout.create({ title, difficulty, durationMinutes });
  res.status(201).json({ success: true, data: workout.toObject(), apiBaseUrl });
});

const startServer = async () => {
  await connectToDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OctoFit Tracker backend server running on http://localhost:${PORT}`);
    console.log(`API base URL: ${apiBaseUrl}`);
  });
};

startServer();

export { apiBaseUrl, app, PORT };
export default app;
