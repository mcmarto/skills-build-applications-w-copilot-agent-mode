import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivity extends Document {
  type: string;
  durationMinutes: number;
  calories: number;
}

const activitySchema = new Schema<IActivity>(
  {
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 0, default: 0 },
    calories: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

const Activity: Model<IActivity> = mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
