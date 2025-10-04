import mongoose from 'mongoose';

const MONGODB_URI = process.env.RANDOM_MONGODB_URI as string;

export async function connectMongo() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
}
