import mongoose from 'mongoose';
import { TaikoSong } from '@/models/Taiko';
import { PrskSong } from '@/models/Prsk';
import { NextRequest, NextResponse } from 'next/server';

const MONGODB_URI = process.env.RANDOM_MONGODB_URI;

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI!);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> }
) {
  await connectMongo();
  const { collection, id } = await context.params;
  const body = await req.json();

  try {
    if (collection === 'taiko') {
      await TaikoSong.findByIdAndUpdate(id, body);
      return NextResponse.json({ ok: true });
    } else if (collection === 'prsk') {
      await PrskSong.findByIdAndUpdate(id, body);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid collection' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('[PUT] error', err);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ collection: string; id: string }> }
) {
  await connectMongo();
  const { collection, id } = await context.params;

  try {
    if (collection === 'taiko') {
      await TaikoSong.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    } else if (collection === 'prsk') {
      await PrskSong.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid collection' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('[DELETE] error', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
