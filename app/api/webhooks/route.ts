import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Webhooks from '@/models/Webhooks';

const MONGODB_URI = process.env.MAIN_MONGODB_URI!;

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET() {
  await connectMongo();
  const data = await Webhooks.find();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  await connectMongo();
  const { channelId, webhookId, token } = await req.json();

  if (!channelId || !webhookId || !token)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const updated = await Webhooks.findOneAndUpdate(
    { channelId },
    { webhookId, token },
    { new: true }
  );

  if (!updated)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Updated successfully', data: updated });
}

export async function DELETE(req: Request) {
  await connectMongo();
  const { channelId } = await req.json();

  if (!channelId)
    return NextResponse.json({ error: 'Missing channelId' }, { status: 400 });

  const deleted = await Webhooks.deleteOne({ channelId });
  if (deleted.deletedCount === 0)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ message: 'Deleted successfully' });
}
