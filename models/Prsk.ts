import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPrskSong extends Document {
  name: string;
  difficulties: {
    easy?: number | null;
    normal?: number | null;
    hard?: number | null;
    expert?: number | null;
    master?: number | null;
    append?: number | null;
  };
}

const PrskSongSchema: Schema = new Schema({
  name: { type: String, required: true },
  difficulties: {
    easy: { type: Number, default: null },
    normal: { type: Number, default: null },
    hard: { type: Number, default: null },
    expert: { type: Number, default: null },
    master: { type: Number, default: null },
    append: { type: Number, default: null },
  },
});

export const PrskSong: Model<IPrskSong> =
  mongoose.models.PrskSong || mongoose.model<IPrskSong>('PrskSong', PrskSongSchema);