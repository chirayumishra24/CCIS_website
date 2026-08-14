import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

const defaultStats = [
  { id: 'stat_1', end: 25, suffix: '+', label: 'Years of Excellence', order: 1 },
  { id: 'stat_2', end: 13500, suffix: '+', label: 'Alumni Network', order: 2 },
  { id: 'stat_3', end: 8, suffix: '+', label: 'Group Institutions', order: 3 },
  { id: 'stat_4', end: 100, suffix: '%', label: 'Board Pass Rate', order: 4 },
];

function isAuthorized(passcode: string | null): boolean {
  const correctPasscode = process.env.ADMIN_PASSWORD || 'ccis-admin-2026';
  return passcode === correctPasscode;
}

export async function GET() {
  try {
    if (!firestore || !firestore.collection) {
      return NextResponse.json(defaultStats);
    }

    const doc = await firestore.collection('site_settings').doc('homepage_stats').get();
    if (!doc.exists) {
      return NextResponse.json(defaultStats);
    }

    const data = doc.data();
    return NextResponse.json(data?.stats || defaultStats);
  } catch (error) {
    console.error('Fetch Stats API Error:', error);
    return NextResponse.json(defaultStats);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode, stats } = body;

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!Array.isArray(stats)) {
      return NextResponse.json({ error: 'Stats must be an array' }, { status: 400 });
    }

    await firestore.collection('site_settings').doc('homepage_stats').set({
      stats,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Update Stats Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
