import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';
import { sendAdmissionsNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, grade, message } = body;

    if (!name || !email || !phone || !grade) {
      return NextResponse.json({ error: 'Missing required admission enquiry fields' }, { status: 400 });
    }

    const docRef = firestore.collection('admissions_enquiries').doc();
    const enquiryData = {
      id: docRef.id,
      name,
      email,
      phone,
      grade,
      message: message || '',
      school: 'CCIS',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    await docRef.set(enquiryData);

    // Send email alert to admin
    try {
      await sendAdmissionsNotificationEmail(name, email, phone, grade, message);
    } catch (err) {
      console.error('Failed to send admissions notification email:', err);
    }

    return NextResponse.json({ success: true, enquiry: enquiryData });
  } catch (error) {
    console.error('Create Admissions Enquiry Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
