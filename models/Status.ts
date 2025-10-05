import mongoose, { Schema, Document, models } from 'mongoose';

export interface IStatus extends Document {
  timestamp: Date;
  online: boolean;
  guildCount: number;
  guildMember: number;
}

const statusSchema = new Schema<IStatus>({
  timestamp: { type: Date, default: Date.now },
  online: { type: Boolean, required: true },
  guildCount: { type: Number, required: true },
  guildMember: { type: Number, required: true },
});

const Status = models.Status || mongoose.model<IStatus>('Status', statusSchema);

export default Status;
