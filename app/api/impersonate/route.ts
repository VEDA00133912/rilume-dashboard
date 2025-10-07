import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import ImpersonateGuilds from '@/models/ImpersonateGuilds';

const MONGODB_URI = process.env.MAIN_MONGODB_URI!;

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET() {
  await connectMongo();
  const data = await ImpersonateGuilds.find();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  await connectMongo();
  const { guildId, impersonate, channelId } = await req.json();

  if (!guildId)
    return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });

  const updated = await ImpersonateGuilds.findOneAndUpdate(
    { guildId },
    { impersonate, channelId },
    { new: true }
  );

  if (!updated)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Updated successfully', data: updated });
}

export async function DELETE(req: Request) {
  await connectMongo();
  const { guildId } = await req.json();

  if (!guildId)
    return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });

  const deleted = await ImpersonateGuilds.deleteOne({ guildId });
  if (deleted.deletedCount === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ message: 'Deleted successfully' });
}
