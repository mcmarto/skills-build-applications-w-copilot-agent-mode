import mongoose from 'mongoose';
import { User, Team, Activity, LeaderboardEntry, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { name: 'Ava Patel', email: 'ava.patel@example.com', fitnessLevel: 'advanced' },
      { name: 'Noah Kim', email: 'noah.kim@example.com', fitnessLevel: 'intermediate' },
      { name: 'Mila Rodriguez', email: 'mila.rodriguez@example.com', fitnessLevel: 'beginner' },
      { name: 'Leo Chen', email: 'leo.chen@example.com', fitnessLevel: 'advanced' },
    ]);

    const teams = await Team.insertMany([
      { name: 'Storm Riders', members: 6, sport: 'Cycling' },
      { name: 'Summit Striders', members: 5, sport: 'Running' },
      { name: 'Velocity Vets', members: 7, sport: 'Volleyball' },
    ]);

    const activities = await Activity.insertMany([
      { type: 'Running', durationMinutes: 35, calories: 280 },
      { type: 'Strength', durationMinutes: 50, calories: 320 },
      { type: 'Cycling', durationMinutes: 40, calories: 260 },
      { type: 'Yoga', durationMinutes: 25, calories: 150 },
    ]);

    const leaderboard = await LeaderboardEntry.insertMany([
      { rank: 1, name: users[0].name, points: 980 },
      { rank: 2, name: users[3].name, points: 930 },
      { rank: 3, name: users[1].name, points: 890 },
      { rank: 4, name: users[2].name, points: 820 },
    ]);

    const workouts = await Workout.insertMany([
      { title: 'Hill Intervals', difficulty: 'Hard', durationMinutes: 30 },
      { title: 'Core Burn', difficulty: 'Moderate', durationMinutes: 25 },
      { title: 'Tempo Run', difficulty: 'Easy', durationMinutes: 20 },
      { title: 'Mobility Reset', difficulty: 'Easy', durationMinutes: 15 },
    ]);

    console.log('Seeded users:', users.length);
    console.log('Seeded teams:', teams.length);
    console.log('Seeded activities:', activities.length);
    console.log('Seeded leaderboard entries:', leaderboard.length);
    console.log('Seeded workouts:', workouts.length);
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
