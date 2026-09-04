import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';
import { sendAdmissionsNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      studentName,
      dob,
      gender,
      parentName,
      email,
      phone,
      grade,
      curriculum,
      currentSchool,
      visitDate,
      visitTime,
      message,
    } = body;

    const applicantName = studentName || name;
    const parent = parentName || name;

    if (!applicantName || !email || !phone || !grade) {
      return NextResponse.json({ error: 'Missing required admission enquiry fields' }, { status: 400 });
    }

    const docRef = firestore.collection('admissions_enquiries').doc();
    const enquiryData = {
      id: docRef.id,
      name: applicantName,
      studentName: applicantName,
      parentName: parent,
      dob: dob || '',
      gender: gender || '',
      email,
      phone,
      grade,
      curriculum: curriculum || 'CBSE',
      currentSchool: currentSchool || '',
      visitDate: visitDate || '',
      visitTime: visitTime || '',
      message: message || '',
      school: 'CCIS',
      status: 'New',
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to Firestore
    try {
      if (firestore && firestore.collection) {
        await docRef.set(enquiryData);
      }
    } catch (dbErr) {
      console.warn('Firestore write warning:', dbErr);
    }

    // 2. Forward to Google Sheets Webhook
    const googleSheetsWebhook = process.env.GOOGLE_SHEETS_ADMISSIONS_WEBHOOK;
    if (googleSheetsWebhook) {
      fetch(googleSheetsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
      }).catch((err) => console.error('Google Sheets sync error:', err));
    }

    // 3. Forward to Zoho CRM Webhook / Flow
    const zohoCrmWebhook = process.env.ZOHO_CRM_ADMISSIONS_WEBHOOK;
    if (zohoCrmWebhook) {
      fetch(zohoCrmWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...enquiryData,
          leadSource: 'Website - Admission Form',
          schoolName: 'City Children International School',
        }),
      }).catch((err) => console.error('Zoho CRM sync error:', err));
    }

    // 4. Send email alert to admin
    try {
      await sendAdmissionsNotificationEmail(applicantName, email, phone, grade, message || `Parent: ${parent}, Curriculum: ${curriculum || 'CBSE'}`);
    } catch (err) {
      console.error('Failed to send admissions notification email:', err);
    }

    return NextResponse.json({ success: true, enquiry: enquiryData });
  } catch (error) {
    console.error('Create Admissions Enquiry Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
