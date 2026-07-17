import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    const correctPasscode = process.env.ADMIN_PASSWORD || 'ccis-admin-2026';

    if (passcode === correctPasscode) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Incorrect Admin Passcode' }, { status: 401 });
  } catch (error) {
    console.error('Admin Auth Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
