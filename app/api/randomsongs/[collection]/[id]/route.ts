import { connectMongo } from '@/lib/mongodb';
import { TaikoSong } from '@/models/Taiko';
import { PrskSong } from '@/models/Prsk';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { collection: string; id: string } }
) {
  await connectMongo();
  const { collection, id } = params;
  const body = await req.json();

  try {
    if (collection === 'taiko') {
      await TaikoSong.findByIdAndUpdate(id, body);
      return NextResponse.json({ ok: true });
    } else if (collection === 'prsk') {
      await PrskSong.findByIdAndUpdate(id, body);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { collection: string; id: string } }
) {
  await connectMongo();
  const { collection, id } = params;

  try {
    if (collection === 'taiko') {
      await TaikoSong.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    } else if (collection === 'prsk') {
      await PrskSong.findByIdAndDelete(id);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: 'Invalid collection' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
