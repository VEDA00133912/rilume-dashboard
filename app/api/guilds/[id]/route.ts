import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookie = req.headers.get('cookie') || '';
    if (!cookie.includes('admin_auth=true')) {
      return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id: guildId } = await context.params;

    const guildRes = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
      }
    );

    if (!guildRes.ok) {
      const error = await guildRes.json().catch(() => ({ message: 'Unknown error' }));
      return NextResponse.json({ ok: false, error }, { status: guildRes.status });
    }

    const guild = await guildRes.json();

    const ownerRes = await fetch(
      `https://discord.com/api/v10/users/${guild.owner_id}`,
      {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
      }
    );

    let owner = { username: '不明', id: guild.owner_id, discriminator: '0000' };
    if (ownerRes.ok) {
      owner = await ownerRes.json();
    }

    return NextResponse.json({ guild, owner });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ ok: false, message: err.message }, { status: 500 });
    }
    return NextResponse.json({ ok: false, message: 'Unknown error' }, { status: 500 });
  }
}
