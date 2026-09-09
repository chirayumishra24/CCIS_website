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

    let snapshot;
    try {
      snapshot = await firestore.collection('admissions_enquiries')
        .where('school', '==', 'CCIS')
        .orderBy('createdAt', 'desc')
        .get();
    } catch {
      snapshot = await firestore.collection('admissions_enquiries')
        .where('school', '==', 'CCIS')
        .get();
    }

    const enquiries: any[] = [];
    snapshot.forEach((doc: any) => {
      enquiries.push({ id: doc.id, ...doc.data() });
    });
    enquiries.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Fetch Admissions Enquiries API Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { passcode, id, status, note, notes } = body;

    if (!isAuthorized(passcode)) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    const docRef = firestore.collection('admissions_enquiries').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    const currentData = doc.data();
    const updatePayload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
    }

    if (note) {
      const existingNotes = currentData?.notes || [];
      updatePayload.notes = [
        ...existingNotes,
        {
          text: note,
          createdAt: new Date().toISOString(),
        }
      ];
    } else if (notes) {
      updatePayload.notes = notes;
    }

    await docRef.update(updatePayload);
    return NextResponse.json({ success: true, updated: { id, ...currentData, ...updatePayload } });
  } catch (error) {
    console.error('Update Admission Enquiry Error:', error);
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
      return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    await firestore.collection('admissions_enquiries').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Admission Enquiry Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
