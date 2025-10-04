import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.headers.set(
      'Set-Cookie',
      serialize('admin_auth', 'true', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60,
      })
    );
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
