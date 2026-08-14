import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

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

    if (!firestore || !firestore.collection) {
      return NextResponse.json([]);
    }

    const snapshot = await firestore.collection('contact_messages')
      .orderBy('createdAt', 'desc')
      .get();

    const messages: any[] = [];
    snapshot.forEach((doc: any) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Fetch Contact Messages Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { passcode, id, status } = body;

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!id || !status) {
      return NextResponse.json({ error: 'Message ID and Status are required' }, { status: 400 });
    }

    const docRef = firestore.collection('contact_messages').doc(id);
    await docRef.update({
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Contact Message Error:', error);
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
      return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
    }

    await firestore.collection('contact_messages').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Contact Message Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
