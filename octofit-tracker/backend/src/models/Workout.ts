import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkout extends Document {
  title: string;
  difficulty: string;
  durationMinutes: number;
}

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    difficulty: { type: String, required: true, enum: ['Easy', 'Moderate', 'Hard'], default: 'Easy' },
    durationMinutes: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

const Workout: Model<IWorkout> = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);

export default Workout;
