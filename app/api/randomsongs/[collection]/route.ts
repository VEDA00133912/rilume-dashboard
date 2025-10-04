import { connectMongo } from "@/lib/mongodb";
import { TaikoSong } from "@/models/Taiko";
import { PrskSong } from "@/models/Prsk";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ collection: string }> },
) {
  await connectMongo();

  const { collection } = await context.params;

  try {
    if (collection === "taiko") {
      const data = await TaikoSong.find({});
      return NextResponse.json(data);
    } else if (collection === "prsk") {
      const data = await PrskSong.find({});
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Invalid collection" },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("[GET] error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ collection: string }> },
) {
  await connectMongo();

  const { collection } = await context.params;
  const body = await req.json();

  try {
    if (collection === "taiko") {
      const song = new TaikoSong(body);
      await song.save();
      return NextResponse.json({ ok: true });
    } else if (collection === "prsk") {
      const song = new PrskSong(body);
      await song.save();
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json(
        { error: "Invalid collection" },
        { status: 400 },
      );
    }
  } catch (err) {
    console.error("[POST] error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
