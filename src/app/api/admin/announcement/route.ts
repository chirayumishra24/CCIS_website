import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

const defaultAnnouncement = {
  active: true,
  message: 'CBSE & IB Admissions Open for Academic Session 2026-27. Book a personalized campus tour today.',
  linkText: 'Apply Now',
  linkUrl: '/admissions',
  type: 'admissions', // 'info' | 'urgent' | 'admissions'
  updatedAt: new Date().toISOString(),
};

function isAuthorized(passcode: string | null): boolean {
  const correctPasscode = process.env.ADMIN_PASSWORD || 'ccis-admin-2026';
  return passcode === correctPasscode;
}

export async function GET() {
  try {
    if (!firestore || !firestore.collection) {
      return NextResponse.json(defaultAnnouncement);
    }

    const doc = await firestore.collection('site_settings').doc('global_announcement').get();
    if (!doc.exists) {
      return NextResponse.json(defaultAnnouncement);
    }

    return NextResponse.json(doc.data() || defaultAnnouncement);
  } catch (error) {
    console.error('Fetch Announcement API Error:', error);
    return NextResponse.json(defaultAnnouncement);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode, active, message, linkText, linkUrl, type } = body;

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const payload = {
      active: typeof active === 'boolean' ? active : true,
      message: message || defaultAnnouncement.message,
      linkText: linkText || '',
      linkUrl: linkUrl || '',
      type: type || 'admissions',
      updatedAt: new Date().toISOString(),
    };

    await firestore.collection('site_settings').doc('global_announcement').set(payload);
    return NextResponse.json({ success: true, announcement: payload });
  } catch (error) {
    console.error('Update Announcement Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
