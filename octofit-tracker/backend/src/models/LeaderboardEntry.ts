import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  rank: number;
  name: string;
  points: number;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    rank: { type: Number, required: true, unique: true, min: 1 },
    name: { type: String, required: true, trim: true },
    points: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

const LeaderboardEntry: Model<ILeaderboardEntry> =
  mongoose.models.LeaderboardEntry || mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);

export default LeaderboardEntry;
