import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Status from "@/models/Status";

const MONGODB_URI = process.env.STATUS_MONGODB_URI;

async function connectMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI!);
  }
}

export async function GET() {
  try {
    await connectMongo();
    const latestStatus = await Status.findOne().sort({ timestamp: -1 });

    const userRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch bot info" },
        { status: userRes.status },
      );
    }

    const user = await userRes.json();

    let online = false;
    let guildCount = 0;
    let totalMembers = 0;
    let lastUpdate: Date | null = null;

    if (latestStatus) {
      const now = new Date();
      const diffMinutes =
        (now.getTime() - latestStatus.timestamp.getTime()) / (1000 * 60);
      online = diffMinutes <= 30;
      guildCount = latestStatus.guildCount;
      totalMembers = latestStatus.guildMember;
      lastUpdate = latestStatus.timestamp;
    }

    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    const bannerUrl = user.banner
      ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=1024`
      : null;

    const data = {
      id: user.id,
      username: user.username,
      global_name: user.global_name,
      discriminator: user.discriminator,
      avatarUrl,
      bannerUrl,
      online,
      guildCount,
      totalMembers,
      lastUpdate,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
