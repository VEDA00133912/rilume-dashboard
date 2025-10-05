import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import BlacklistUser from '@/models/BlackListUser';

const MONGODB_URI = process.env.MAIN_MONGODB_URI;

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI!);
  }
}

const DISCORD_API = 'https://discord.com/api/v10';

export async function GET() {
  try {
    await connectMongo();
    const users = await BlacklistUser.find().sort({ addedAt: -1 });

    const detailedUsers = await Promise.all(
      users.map(async (u) => {
        try {
          const res = await fetch(`${DISCORD_API}/users/${u.userId}`, {
            headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
          });

          if (!res.ok) throw new Error('Failed');

          const user = await res.json();
          const avatarUrl = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
            : `https://cdn.discordapp.com/embed/avatars/0.png`;

          return {
            ...u.toObject(),
            username: user.global_name || user.username,
            avatarUrl,
          };
        } catch {
          return {
            ...u.toObject(),
            username: 'Unknown User',
            avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png',
          };
        }
      })
    );

    return NextResponse.json(detailedUsers);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch blacklist' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await connectMongo();

    const existing = await BlacklistUser.findOne({ userId });
    if (existing) {
      return NextResponse.json(
        { message: 'User already blacklisted' },
        { status: 200 }
      );
    }

    const newUser = new BlacklistUser({ userId });
    await newUser.save();

    return NextResponse.json({
      message: 'User added to blacklist',
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to add user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await connectMongo();
    const result = await BlacklistUser.deleteOne({ userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User removed from blacklist' });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to remove user' },
      { status: 500 }
    );
  }
}
