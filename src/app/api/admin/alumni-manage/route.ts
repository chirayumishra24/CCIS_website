import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';
import { invalidateAlumniCache } from '@/lib/cache';

export const dynamic = 'force-dynamic';

function isAuthorized(passcode: string | null): boolean {
  const correctPasscode = process.env.ADMIN_PASSWORD || 'ccis-admin-2026';
  return passcode === correctPasscode;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get('passcode');

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const snapshot = await firestore.collection('alumni_profiles')
      .orderBy('batch', 'desc')
      .get();

    const profiles: any[] = [];
    snapshot.forEach((doc: any) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Fetch Alumni Profiles Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { passcode, id, isVerified, isMentor, isFeatured } = body;

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Alumni profile ID is required' }, { status: 400 });
    }

    const docRef = firestore.collection('alumni_profiles').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updatePayload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (typeof isVerified === 'boolean') updatePayload.isVerified = isVerified;
    if (typeof isMentor === 'boolean') updatePayload.isMentor = isMentor;
    if (typeof isFeatured === 'boolean') updatePayload.isFeatured = isFeatured;

    await docRef.update(updatePayload);
    invalidateAlumniCache();

    return NextResponse.json({ success: true, updated: { id, ...doc.data(), ...updatePayload } });
  } catch (error) {
    console.error('Update Alumni Profile Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passcode = searchParams.get('passcode');
    const id = searchParams.get('id');

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Alumni Profile ID is required' }, { status: 400 });
    }

    await firestore.collection('alumni_profiles').doc(id).delete();
    invalidateAlumniCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Alumni Profile Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
