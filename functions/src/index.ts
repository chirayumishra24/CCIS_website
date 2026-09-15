import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// SMTP config — set via: firebase functions:config:set smtp.host smtp.port smtp.user smtp.pass smtp.from
const smtpConfig = functions.config().smtp || {};
const transporter = smtpConfig.host
  ? nodemailer.createTransport({
      host: smtpConfig.host,
      port: Number(smtpConfig.port) || 465,
      secure: Number(smtpConfig.port) === 465,
      auth: { user: smtpConfig.user, pass: smtpConfig.pass },
    })
  : null;

const FROM = smtpConfig.from || 'CCIS Alumni Hub <info@cambridgecourtgroup.com>';

async function sendMail(to: string, subject: string, text: string, html?: string) {
  if (!transporter) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, text, html });
  console.log(`Email sent to ${to}`);
}

// ─── On Contact Message Created ───
export const onContactMessageCreate = functions.firestore
  .document('contact_messages/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const { name, email, phone, subject, message } = data;

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

    await sendMail('info@ccischool.org', emailSubject, text, html);
  });

// ─── On Admission Enquiry Created ───
export const onAdmissionEnquiryCreate = functions.firestore
  .document('admissions_enquiries/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    const { name, email, phone, grade, message, parentName, curriculum } = data;

    const subject = `New Admission Enquiry for Grade ${grade} - CCIS`;
    const text = `Parent Name: ${parentName || name}\nEmail: ${email}\nPhone: ${phone}\nGrade: ${grade}\nMessage: ${message || `Curriculum: ${curriculum || 'CBSE'}`}`;
    const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd3bf; border-radius: 12px; background-color: #f5f0e8;">
      <h2 style="color: #172853; margin-bottom: 20px; font-family: serif;">New Admission Enquiry</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #ede5d5;"><td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Parent Name</td><td style="padding: 10px; border: 1px solid #ddd3bf;">${parentName || name}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Email</td><td style="padding: 10px; border: 1px solid #ddd3bf;">${email}</td></tr>
        <tr style="background-color: #ede5d5;"><td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Phone</td><td style="padding: 10px; border: 1px solid #ddd3bf;">${phone}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Grade</td><td style="padding: 10px; border: 1px solid #ddd3bf;">Grade ${grade}</td></tr>
        <tr style="background-color: #ede5d5;"><td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Message</td><td style="padding: 10px; border: 1px solid #ddd3bf;">${message || 'No additional comments'}</td></tr>
      </table>
    </div>`;

    await sendMail('info@ccischool.org', subject, text, html);
  });

// ─── On Alumni Registration (Profile Created) ───
export const onAlumniProfileCreate = functions.firestore
  .document('alumni_profiles/{docId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    if (!data.user?.email || !data.user?.name) return;

    const verificationLink = `https://ccischool.org/verify?id=${snap.id}`;
    const subject = 'Welcome to the CCIS Alumni Hub - Verify Your Email';
    const text = `Dear ${data.user.name},\n\nThank you for registering on the CCIS Alumni Hub!\n\nVerify your email: ${verificationLink}\n\nWarm regards,\nCCIS Alumni Coordinator Team`;
    const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd3bf; border-radius: 12px; background-color: #f5f0e8;">
      <h2 style="color: #172853; margin-bottom: 20px; font-family: serif;">Verify Your Email Address</h2>
      <p>Dear <strong>${data.user.name}</strong>,</p>
      <p>Thank you for registering on the <strong>CCIS Alumni Hub</strong>!</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #172853; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; border: 2px solid #c49a3c;">Verify Email Address</a>
      </div>
      <p style="font-size: 0.85em; color: #5a5a6e;">If the button does not work, copy and paste this link: <a href="${verificationLink}">${verificationLink}</a></p>
      <p style="margin-top: 20px; font-size: 0.9em; color: #5a5a6e; border-top: 1px solid #ddd3bf; padding-top: 15px;">
        Warm regards,<br/><strong>CCIS Alumni Coordinator Team</strong><br/><a href="mailto:info@ccischool.org">info@ccischool.org</a>
      </p>
    </div>`;

    await sendMail(data.user.email, subject, text, html);
  });
