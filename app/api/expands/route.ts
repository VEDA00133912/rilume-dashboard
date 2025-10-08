import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Expands from '@/models/Expands';

const MONGODB_URI = process.env.MAIN_MONGODB_URI!;

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI);
    } catch (err) {
      console.error('[DB] Connection failed:', err);
      throw new Error('Failed to connect to MongoDB');
    }
  }
}

export async function GET() {
  try {
    await connectMongo();
    const data = await Expands.find();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /expands error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expands' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectMongo();
    const { guildId, expand } = await req.json();

    if (!guildId) {
      return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });
    }

    const updated = await Expands.findOneAndUpdate(
      { guildId },
      { expand },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('PATCH /expands error:', error);
    return NextResponse.json(
      { error: 'Failed to update expand' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectMongo();
    const { guildId } = await req.json();

    if (!guildId) {
      return NextResponse.json({ error: 'Missing guildId' }, { status: 400 });
    }

    const deleted = await Expands.deleteOne({ guildId });

    if (deleted.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE /expands error:', error);
    return NextResponse.json(
      { error: 'Failed to delete expand' },
      { status: 500 }
    );
  }
}
