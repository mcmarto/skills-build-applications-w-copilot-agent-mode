import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  members: number;
  sport: string;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    members: { type: Number, required: true, min: 0, default: 0 },
    sport: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Team: Model<ITeam> = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);

export default Team;
