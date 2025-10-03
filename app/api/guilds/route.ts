import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const cookie = req.headers.get('cookie') || '';
    if (!cookie.includes('admin_auth=true')) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json({ ok: false, error }, { status: res.status });
    }

    const guilds = await res.json();
    return NextResponse.json(guilds);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
    return NextResponse.json({ ok: false, message: 'Unknown error' }, { status: 500 });
  }
}
