import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM || 'CCIS Alumni Hub <info@ccischool.org>';

let transporter: nodemailer.Transporter | null = null;

if (host && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
  console.log('Nodemailer SMTP transporter initialized successfully.');
} else {
  console.warn('Nodemailer SMTP environment variables are missing. Emails will be logged to console.');
}

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: MailOptions) {
  try {
    if (transporter) {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });
      console.log(`Email successfully sent to ${to}. MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } else {
      console.log('--- MOCK EMAIL SENDER ---');
      console.log(`To: ${to}`);
      console.log(`From: ${from}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body:\n${text}`);
      console.log('-------------------------');
      return { success: true, mock: true };
    }
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    return { success: false, error };
  }
}

export async function sendRegistrationEmail(toEmail: string, name: string, school: string, verificationLink?: string) {
  const subject = `Welcome to the CCIS Alumni Hub - Verify Your Email`;
  const text = `Dear ${name},

Thank you for registering on the CCIS Alumni Hub portal for ${school}!

We have received your registration details. We will reach out to you for email verification shortly.

${verificationLink ? `You can also verify your email address directly by clicking the link below:\n\n${verificationLink}\n\n` : ''}Once your email and credentials are verified, we will activate your profile and publish it live on the school website directory.

If you have any questions, please reply to this email or reach out to us at info@ccischool.org.

Warm regards,
CCIS Alumni Coordinator Team
info@ccischool.org`;

  const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd3bf; border-radius: 12px; background-color: #f5f0e8;">
    <h2 style="color: #172853; margin-bottom: 20px; font-family: serif;">Verify Your Email Address</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Thank you for registering on the <strong>CCIS Alumni Hub</strong> portal for <strong>${school}</strong>!</p>
    <p>We have received your registration details. We will reach out to you for email verification shortly.</p>
    
    ${verificationLink ? `
    <p>You can also verify your email address directly by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationLink}" style="background-color: #172853; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 0.9em; border: 2px solid #c49a3c;">Verify Email Address</a>
    </div>
    <p style="font-size: 0.85em; color: #5a5a6e; margin-bottom: 25px;">
      If the button does not work, copy and paste this link into your browser: <br/>
      <a href="${verificationLink}" style="color: #172853; word-break: break-all;">${verificationLink}</a>
    </p>
    ` : ''}
    
    <p>Once approved, your details will go live on the school platform directory.</p>
    <p>If you have any questions, please reply directly to this email or contact us at <a href="mailto:info@ccischool.org" style="color: #172853;">info@ccischool.org</a>.</p>
    <br/>
    <p style="margin-top: 20px; font-size: 0.9em; color: #5a5a6e; border-top: 1px solid #ddd3bf; padding-top: 15px;">
      Warm regards,<br/>
      <strong>CCIS Alumni Coordinator Team</strong><br/>
      <a href="mailto:info@ccischool.org" style="color: #5a5a6e; text-decoration: none;">info@ccischool.org</a>
    </p>
  </div>`;

  return sendEmail({ to: toEmail, subject, text, html });
}

export async function sendVerificationEmail(toEmail: string, name: string, school: string) {
  const subject = `Your CCIS Alumni Profile is Verified!`;
  const text = `Dear ${name},

Congratulations! Your CCIS Alumni Profile for ${school} has been verified by the coordinator.

Your profile has now been published live to the school website directory.

Thank you for your support and contribution to the CCIS Alumni network!

Warm regards,
CCIS Alumni Coordinator Team
info@ccischool.org`;

  const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd3bf; border-radius: 12px; background-color: #f5f0e8;">
    <h2 style="color: #c49a3c; margin-bottom: 20px; font-family: serif;">Profile Verified!</h2>
    <p>Dear <strong>${name}</strong>,</p>
    <p>Congratulations! Your <strong>CCIS Alumni Profile</strong> for <strong>${school}</strong> has been verified by the coordinator.</p>
    <p>Your profile is now live on the school website directory, and other students can connect with you for career mentorship.</p>
    <p>Thank you for your support and active contribution to the CCIS Alumni network!</p>
    <br/>
    <p style="margin-top: 20px; font-size: 0.9em; color: #5a5a6e; border-top: 1px solid #ddd3bf; padding-top: 15px;">
      Warm regards,<br/>
      <strong>CCIS Alumni Coordinator Team</strong><br/>
      <a href="mailto:info@ccischool.org" style="color: #5a5a6e;">info@ccischool.org</a>
    </p>
  </div>`;

  return sendEmail({ to: toEmail, subject, text, html });
}

export async function sendAdmissionsNotificationEmail(parentName: string, parentEmail: string, parentPhone: string, grade: string, message: string) {
  const subject = `New Admission Enquiry for Grade ${grade} - CCIS`;
  const text = `Dear Admin,

A new admission enquiry has been submitted on the CCIS website.

Parent Name: ${parentName}
Parent Email: ${parentEmail}
Parent Phone: ${parentPhone}
Enquiring for Grade: ${grade}
Message: ${message}

Please log into the school admin panel to review and take action.

Best regards,
CCIS Portal Automated Mailer`;

  const html = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd3bf; border-radius: 12px; background-color: #f5f0e8;">
    <h2 style="color: #172853; margin-bottom: 20px; font-family: serif;">New Admission Enquiry</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <tr style="background-color: #ede5d5;">
        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Parent Name</td>
        <td style="padding: 10px; border: 1px solid #ddd3bf;">${parentName}</td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Parent Email</td>
        <td style="padding: 10px; border: 1px solid #ddd3bf;"><a href="mailto:${parentEmail}">${parentEmail}</a></td>
      </tr>
      <tr style="background-color: #ede5d5;">
        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Parent Phone</td>
        <td style="padding: 10px; border: 1px solid #ddd3bf;"><a href="tel:${parentPhone}">${parentPhone}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Grade Requested</td>
        <td style="padding: 10px; border: 1px solid #ddd3bf;">Grade ${grade}</td>
      </tr>
      <tr style="background-color: #ede5d5;">
        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd3bf;">Message</td>
        <td style="padding: 10px; border: 1px solid #ddd3bf;">${message || "No additional comments"}</td>
      </tr>
    </table>
    <p>Please log in to the CCIS School Portal Admin Panel to manage this enquiry.</p>
  </div>`;

  return sendEmail({ to: 'info@ccischool.org', subject, text, html });
}
