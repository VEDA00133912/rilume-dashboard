import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITaikoSong extends Document {
  title: string;
  genre: string;
  difficulties: {
    easy?: number;
    normal?: number;
    hard?: number;
    oni?: number;
    edit?: number;
  };
}

const TaikoSongSchema: Schema = new Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  difficulties: {
    easy: Number,
    normal: Number,
    hard: Number,
    oni: Number,
    edit: Number,
  },
});

export const TaikoSong: Model<ITaikoSong> =
  mongoose.models.TaikoSong ||
  mongoose.model<ITaikoSong>('TaikoSong', TaikoSongSchema);
