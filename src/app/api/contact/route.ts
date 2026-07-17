import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required contact form fields' }, { status: 400 });
    }

    const emailSubject = `CCIS Contact Form: ${subject || 'General Inquiry'}`;
    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`;

    const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd3bf; border-radius: 12px; background-color: #f5f0e8;">
      <h2 style="color: #172853; font-family: serif; border-bottom: 2px solid #c49a3c; padding-bottom: 8px;">New Contact Form Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
      <p style="margin-top: 20px; border-top: 1px solid #ddd3bf; padding-top: 15px; white-space: pre-wrap;"><strong>Message:</strong><br/>${message}</p>
    </div>`;

    await sendEmail({
      to: 'info@ccischool.org',
      subject: emailSubject,
      text,
      html,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact Form Send Error: ', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
