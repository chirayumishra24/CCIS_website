import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get('passcode');
    const correctPasscode = process.env.ADMIN_PASSWORD || 'ccis-admin-2026';

    if (passcode !== correctPasscode) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const snapshot = await firestore.collection('admissions_enquiries')
      .where('school', '==', 'CCIS')
      .orderBy('createdAt', 'desc')
      .get();

    const enquiries: any[] = [];
    snapshot.forEach((doc: any) => {
      enquiries.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Fetch Admissions Enquiries API Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
