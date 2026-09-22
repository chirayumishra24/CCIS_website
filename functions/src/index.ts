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

// ═══════════════════════════════════════════════════════════════════════════════
// PREDICTION ENGINE — Server-Side (mirrors academicCalculations.ts)
// ═══════════════════════════════════════════════════════════════════════════════

/** 4-exam CBSE Class IX structure */
const EXAM_CONFIG: Record<string, { weight: number; label: string; shortLabel: string; maxMarks: number }> = {
  'exam-1': { weight: 0.10, label: 'PT-1 (Baseline)', shortLabel: 'E1', maxMarks: 20 },
  'exam-2': { weight: 0.30, label: 'Mid Term',        shortLabel: 'E2', maxMarks: 80 },
  'exam-3': { weight: 0.10, label: 'PT-2',            shortLabel: 'E3', maxMarks: 20 },
  'exam-4': { weight: 0.50, label: 'Final Exam',      shortLabel: 'E4', maxMarks: 80 },
};
const EXAM_ORDER = ['exam-1', 'exam-2', 'exam-3', 'exam-4'];
const SUBJECT_KEYS = ['english', 'maths', 'socialScience', 'secondLanguage', 'science', 'it'] as const;
const PREDICTION_CEILING = 95;

type StatusTag = 'ACHIEVED' | 'ON_TRACK' | 'NEEDS_FOCUS' | 'AT_RISK' | 'NOT_REACHABLE' | 'INSUFFICIENT_DATA';

interface NormValue {
  rawValue: any;
  type: 'exact' | 'range' | 'exempt' | 'empty' | 'invalid';
  displayValue: string;
  value?: number;
  min?: number;
  max?: number;
  unit: 'percent' | 'marks';
  statusNote?: string;
}

function parseValue(raw: any, isPercentage = false): NormValue {
  if (raw === null || raw === undefined || raw === '' || String(raw).trim() === '') {
    return { rawValue: raw ?? null, type: 'empty', displayValue: isPercentage ? 'Not Assigned' : 'Pending', unit: 'percent' };
  }
  const str = String(raw).trim();
  if (str === '-' || str.toLowerCase() === 'exempt' || str.toLowerCase() === 'na') {
    return { rawValue: raw, type: 'exempt', displayValue: 'Exempt (-)', unit: 'percent', statusNote: 'Subject exempted / not opted' };
  }
  if (str.toLowerCase() === 'ab' || str.toLowerCase() === 'absent') {
    return { rawValue: raw, type: 'exact', value: 0, displayValue: 'Absent (AB)', unit: 'marks', statusNote: 'Absent — scored 0' };
  }
  const cleaned = str.replace(/%+$/, '%').trim();
  const rangeMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*[-–—/]\s*(\d+(?:\.\d+)?)\s*%?$/);
  if (rangeMatch) {
    const min = Math.min(parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2]));
    const max = Math.max(parseFloat(rangeMatch[1]), parseFloat(rangeMatch[2]));
    return { rawValue: raw, type: 'range', min, max, displayValue: `${min}–${max}%`, unit: 'percent' };
  }
  const num = parseFloat(cleaned.replace('%', ''));
  if (!isNaN(num)) {
    const finalVal = (num > 0 && num <= 1.0) ? Math.round(num * 10000) / 100 : Math.round(num * 100) / 100;
    return { rawValue: raw, type: 'exact', value: finalVal, displayValue: `${finalVal}%`, unit: 'percent' };
  }
  return { rawValue: raw, type: 'invalid', displayValue: str, unit: 'percent' };
}

/** Parse a raw marks value into NormValue with unit=marks */
function parseMarks(raw: any, maxMarks: number): NormValue {
  if (raw === null || raw === undefined || raw === '' || String(raw).trim() === '') {
    return { rawValue: null, type: 'empty', displayValue: 'Pending', unit: 'marks' };
  }
  const str = String(raw).trim();
  if (str === '-' || str.toLowerCase() === 'exempt' || str.toLowerCase() === 'na') {
    return { rawValue: raw, type: 'exempt', displayValue: 'Exempt (-)', unit: 'marks', statusNote: 'Subject exempted / not opted' };
  }
  if (str.toLowerCase() === 'ab' || str.toLowerCase() === 'absent') {
    return { rawValue: raw, type: 'exact', value: 0, displayValue: 'Absent (AB)', unit: 'marks', statusNote: 'Absent — scored 0' };
  }
  const num = parseFloat(str);
  if (!isNaN(num)) {
    const clamped = Math.max(0, Math.min(num, maxMarks));
    return { rawValue: raw, type: 'exact', value: clamped, displayValue: `${clamped}`, unit: 'marks' };
  }
  return { rawValue: raw, type: 'invalid', displayValue: str, unit: 'marks' };
}

function normToPercent(rawScore: number | null | undefined, maxMarks: number): number | null {
  if (rawScore === null || rawScore === undefined) return null;
  if (maxMarks === 100) return rawScore;
  return Math.round((rawScore / maxMarks) * 10000) / 100;
}

function computeStatus(requiredAvg: number): StatusTag {
  if (requiredAvg <= 0) return 'ACHIEVED';
  if (requiredAvg <= 75) return 'ON_TRACK';
  if (requiredAvg <= 90) return 'NEEDS_FOCUS';
  if (requiredAvg <= 100) return 'AT_RISK';
  return 'NOT_REACHABLE';
}

/**
 * Distribute predictions across pending exams with momentum ramp.
 * If student has actual scores that beat previous predictions, boost momentum.
 */
function distributePredictions(
  requiredAvg: number,
  pendingExamIds: string[],
  currentAvg: number | null,
  momentumBoost: number = 0
): Map<string, { pct: number; confidence: 'high' | 'medium' | 'low' }> {
  const predictions = new Map<string, { pct: number; confidence: 'high' | 'medium' | 'low' }>();
  if (pendingExamIds.length === 0) return predictions;

  const boosted = requiredAvg + momentumBoost;
  const capped = Math.min(boosted, PREDICTION_CEILING);
  const isUnreachable = requiredAvg > 100;

  if (pendingExamIds.length === 1) {
    const conf = isUnreachable ? 'low' : capped <= 75 ? 'high' : capped <= 90 ? 'medium' : 'low';
    predictions.set(pendingExamIds[0], { pct: Math.round(capped * 10) / 10, confidence: conf });
    return predictions;
  }

  const rampFactor = 0.08;
  const rampStep = (capped * rampFactor) / (pendingExamIds.length - 1);
  const baseOffset = -(capped * rampFactor) / 2;

  for (let i = 0; i < pendingExamIds.length; i++) {
    let predicted = capped + baseOffset + rampStep * i;

    if (currentAvg !== null && predicted > currentAvg + 20) {
      const realisticCeiling = currentAvg + 20;
      predicted = predicted * 0.6 + realisticCeiling * 0.4;
    }

    predicted = Math.max(0, Math.min(PREDICTION_CEILING, predicted));
    predicted = Math.round(predicted * 10) / 10;

    const conf: 'high' | 'medium' | 'low' = isUnreachable
      ? 'low'
      : predicted <= 75 ? 'high' : predicted <= 90 ? 'medium' : 'low';

    predictions.set(pendingExamIds[i], { pct: predicted, confidence: conf });
  }

  return predictions;
}

/**
 * Calculate adaptive momentum boost based on how actual scores compare to prior predictions.
 * If student beat predictions → positive boost; if missed → negative dampen.
 */
function calcMomentumBoost(
  completedExamIds: string[],
  examData: Record<string, any>,
  subjectKey: string,
  maxMarksMap: Record<string, number>
): number {
  let boost = 0;
  let count = 0;

  for (const examId of completedExamIds) {
    const exam = examData[examId];
    if (!exam) continue;

    const predicted = exam.predictedScores?.[subjectKey]?.predictedPct;
    const subj = exam.subjects?.[subjectKey];
    if (predicted === undefined || predicted === null) continue;
    if (!subj || subj.type !== 'exact' || subj.value === undefined) continue;

    const maxM = maxMarksMap[examId] || 100;
    const actualPct = subj.unit === 'marks' ? (subj.value / maxM) * 100 : subj.value;
    const delta = actualPct - predicted;

    // +5% boost for beating prediction, -3% dampen for missing
    boost += delta > 0 ? Math.min(delta * 0.3, 5) : Math.max(delta * 0.2, -3);
    count++;
  }

  return count > 0 ? boost / count : 0;
}

interface AchievementDetail {
  achieved: boolean;
  delta: number | null; // actual - target (positive = exceeded)
  verdict: 'ACHIEVED' | 'ON_TRACK' | 'NEEDS_FOCUS' | 'AT_RISK' | 'NOT_REACHABLE' | 'PENDING';
  predictionDelta: number | null; // actual - predicted (positive = beat prediction)
  predictionVerdict: 'ABOVE' | 'BELOW' | 'MATCH' | 'PENDING';
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SYNC ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════════

export const syncClass9Performance = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, x-sync-secret, Authorization');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const firestore = admin.firestore();

  // ─── GET: Health check or data export ───
  if (req.method === 'GET') {
    const action = String(req.query.action || '').toLowerCase();

    if (action === 'export') {
      // Export all student records for "Push to Sheet" functionality
      const expectedSecret = process.env.SYNC_SECRET || 'ccis-alumni-sync-2026';
      const providedSecret = req.headers['x-sync-secret'] || req.query.secret;
      if (providedSecret !== expectedSecret) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      try {
        const snapshot = await firestore.collection('students').where('class', '==', 'IX').get();
        const students: any[] = [];
        snapshot.forEach((doc) => students.push(doc.data()));
        students.sort((a, b) => {
          if (a.group !== b.group) return (a.group || '').localeCompare(b.group || '');
          return (a.name || '').localeCompare(b.name || '');
        });
        res.status(200).json({ success: true, students, count: students.length });
      } catch (err: any) {
        res.status(500).json({ error: 'Export failed', details: err.message });
      }
      return;
    }

    res.status(200).json({
      status: 'online',
      function: 'syncClass9Performance',
      version: '2.0.0-prediction-engine',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // ─── POST: Sync student data with prediction engine ───
  const expectedSecret = process.env.SYNC_SECRET || 'ccis-alumni-sync-2026';
  const providedSecret = req.headers['x-sync-secret'] || req.query.secret || req.body?.secret;

  if (providedSecret !== expectedSecret) {
    res.status(401).json({ error: 'Unauthorized: Invalid sync secret' });
    return;
  }

  try {
    const body = req.body;
    let rows: any[] = [];
    if (body.singleStudent) {
      rows = [body.singleStudent];
    } else if (Array.isArray(body.students)) {
      rows = body.students;
    } else if (Array.isArray(body.rows)) {
      rows = body.rows;
    }

    if (rows.length === 0) {
      res.status(200).json({ message: 'No rows to synchronize.' });
      return;
    }

    let successful = 0;
    let failed = 0;
    const errors: any[] = [];
    const BATCH_SIZE = 400;
    const now = new Date().toISOString();

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = firestore.batch();
      const chunk = rows.slice(i, i + BATCH_SIZE);

      for (const row of chunk) {
        try {
          const group = (row.section || row.group || 'AURA').toUpperCase().replace(/^IX-?/, '');
          const name = String(row.name || 'Unknown').trim().toUpperCase();
          const serialNo = Number(row.sNo) || 1;
          const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          const studentId = `ccis-ix-${group.toLowerCase()}-${cleanName}`;
          const enrollmentNumber = row.enrollmentNumber || row.enrollment || `CCIS-IX-${group}-${String(serialNo).padStart(2, '0')}`;

          // ─── Parse Exam-1 (PT-1 /20) from flat fields or exam1 object ───
          const e1MaxMarks = EXAM_CONFIG['exam-1'].maxMarks;
          const e1Raw = (row.exam1 && typeof row.exam1 === 'object') ? row.exam1 : row;
          const e1English = parseMarks(e1Raw.english, e1MaxMarks);
          const e1Maths = parseMarks(e1Raw.maths, e1MaxMarks);
          const e1SSt = parseMarks(e1Raw.sSt, e1MaxMarks);
          const e1Hsf = parseMarks(e1Raw.hsf, e1MaxMarks);
          const e1Science = parseMarks(e1Raw.science, e1MaxMarks);
          const e1It = parseMarks(e1Raw.it, e1MaxMarks);

          // Calculate Exam-1 overall
          const e1Subjects = [e1English, e1Maths, e1SSt, e1Hsf, e1Science, e1It];
          const e1Scores = e1Subjects
            .filter(s => s.type === 'exact' && s.value !== undefined && s.value !== null)
            .map(s => s.value!);
          const e1OverallPct = e1Scores.length > 0
            ? Math.round(((e1Scores.reduce((a, b) => a + b, 0) / (e1Scores.length * e1MaxMarks)) * 100) * 100) / 100
            : null;
          const e1Overall: NormValue = e1OverallPct !== null
            ? { rawValue: e1OverallPct, type: 'exact', value: e1OverallPct, displayValue: `${e1OverallPct}%`, unit: 'percent' }
            : { rawValue: null, type: 'empty', displayValue: 'Pending', unit: 'percent' };
          const e1TotalMarks = e1Scores.reduce((a, b) => a + b, 0);
          const e1TotalMax = e1Scores.length * e1MaxMarks;

          const e1HasData = e1Scores.length > 0;

          // ─── Build exams object ───
          const exams: Record<string, any> = {};

          // Exam-1
          if (e1HasData) {
            exams['exam-1'] = {
              id: 'exam-1',
              label: EXAM_CONFIG['exam-1'].label,
              maxMarksPerSubject: e1MaxMarks,
              overall: e1Overall,
              totalMarksScored: e1TotalMarks,
              totalMaxMarks: e1TotalMax,
              isPredicted: false,
              subjects: {
                english: e1English,
                secondLanguage: e1Hsf,
                maths: e1Maths,
                science: e1Science,
                socialScience: e1SSt,
                it: e1It,
              },
              subjectList: [
                { id: 'english', code: 'ENG', label: 'English Language & Lit', normalized: e1English },
                { id: 'maths', code: 'MATH', label: 'Mathematics', normalized: e1Maths },
                { id: 'socialScience', code: 'SST', label: 'Social Science', normalized: e1SSt },
                { id: 'secondLanguage', code: 'H/S/F', label: '2nd Language', normalized: e1Hsf },
                { id: 'science', code: 'SCI', label: 'Science', normalized: e1Science },
                { id: 'it', code: 'IT', label: 'Information Technology', normalized: e1It },
              ],
            };
          }

          // ─── Parse Exam-2, 3, 4 from nested objects ───
          const examFieldMap: Record<string, string> = { 'exam-2': 'exam2', 'exam-3': 'exam3', 'exam-4': 'exam4' };

          for (const examId of ['exam-2', 'exam-3', 'exam-4']) {
            const fieldKey = examFieldMap[examId];
            const examRaw = row[fieldKey];
            if (!examRaw || typeof examRaw !== 'object') continue;

            const maxM = EXAM_CONFIG[examId].maxMarks;
            const eng = parseMarks(examRaw.english, maxM);
            const math = parseMarks(examRaw.maths, maxM);
            const sst = parseMarks(examRaw.sSt, maxM);
            const hsf = parseMarks(examRaw.hsf, maxM);
            const sci = parseMarks(examRaw.science, maxM);
            const it = parseMarks(examRaw.it, maxM);

            const subjects = [eng, math, sst, hsf, sci, it];
            const scores = subjects
              .filter(s => s.type === 'exact' && s.value !== undefined)
              .map(s => s.value!);

            if (scores.length === 0) continue; // no valid data for this exam

            const overallPct = Math.round(((scores.reduce((a, b) => a + b, 0) / (scores.length * maxM)) * 100) * 100) / 100;
            const overall: NormValue = {
              rawValue: overallPct, type: 'exact', value: overallPct,
              displayValue: `${overallPct}%`, unit: 'percent',
            };

            exams[examId] = {
              id: examId,
              label: EXAM_CONFIG[examId].label,
              maxMarksPerSubject: maxM,
              overall,
              totalMarksScored: scores.reduce((a, b) => a + b, 0),
              totalMaxMarks: scores.length * maxM,
              isPredicted: false,
              subjects: {
                english: eng, secondLanguage: hsf, maths: math,
                science: sci, socialScience: sst, it,
              },
              subjectList: [
                { id: 'english', code: 'ENG', label: 'English', normalized: eng },
                { id: 'maths', code: 'MATH', label: 'Mathematics', normalized: math },
                { id: 'socialScience', code: 'SST', label: 'Social Science', normalized: sst },
                { id: 'secondLanguage', code: 'H/S/F', label: '2nd Language', normalized: hsf },
                { id: 'science', code: 'SCI', label: 'Science', normalized: sci },
                { id: 'it', code: 'IT', label: 'IT', normalized: it },
              ],
            };
          }

          // ─── Determine completed and pending exams ───
          const completedExamIds = EXAM_ORDER.filter(eid => exams[eid] && !exams[eid].isPredicted);
          const pendingExamIds = EXAM_ORDER.filter(eid => !completedExamIds.includes(eid));

          // ─── Also try to read existing Firestore doc to preserve previous targets & predictions ───
          let existingDoc: any = null;
          try {
            const existingSnap = await firestore.collection('students').doc(studentId).get();
            if (existingSnap.exists) existingDoc = existingSnap.data();
          } catch (_) { /* ignore */ }

          // ─── Parse target (with fallback to existing) ───
          let targetNorm = parseValue(row.target, true);
          if (targetNorm.type === 'empty' && existingDoc?.schoolTarget?.overall) {
            targetNorm = existingDoc.schoolTarget.overall;
          }

          // ─── Build per-subject target from existing data or currentPerformance ───
          const existingTargetSubjects = existingDoc?.schoolTarget?.subjects;

          // ─── PREDICTION ENGINE — Per Subject ───
          const maxMarksMap: Record<string, number> = {};
          for (const eid of EXAM_ORDER) {
            maxMarksMap[eid] = EXAM_CONFIG[eid].maxMarks;
          }

          const achievementDetails: Record<string, AchievementDetail> = {};

          for (const sk of SUBJECT_KEYS) {
            // Get target for this subject
            let subjectTargetPct: number | null = null;
            if (existingTargetSubjects?.[sk]?.type === 'exact') {
              subjectTargetPct = existingTargetSubjects[sk].value;
            }

            // Calculate weighted contribution from completed exams
            let weightedContrib = 0;
            let completedWeight = 0;

            for (const eid of completedExamIds) {
              const exam = exams[eid];
              if (!exam?.subjects?.[sk]) continue;
              const subj = exam.subjects[sk];
              if (subj.type !== 'exact' || subj.value === undefined) continue;

              const maxM = EXAM_CONFIG[eid].maxMarks;
              const pct = subj.unit === 'marks' ? (subj.value / maxM) * 100 : subj.value;
              weightedContrib += pct * EXAM_CONFIG[eid].weight;
              completedWeight += EXAM_CONFIG[eid].weight;
            }

            const remainingWeight = 1.0 - completedWeight;
            const currentAvg = completedWeight > 0 ? weightedContrib / completedWeight : null;

            // Calculate momentum boost from actual vs predicted
            const momentum = calcMomentumBoost(completedExamIds, exams, sk, maxMarksMap);

            // Determine required avg in remaining exams
            let requiredAvg: number | null = null;
            let status: StatusTag = 'INSUFFICIENT_DATA';

            if (subjectTargetPct !== null && completedWeight > 0) {
              const deficit = subjectTargetPct - weightedContrib;
              if (deficit <= 0) {
                requiredAvg = 0;
                status = 'ACHIEVED';
              } else if (remainingWeight > 0) {
                requiredAvg = Math.round((deficit / remainingWeight) * 10) / 10;
                status = computeStatus(requiredAvg);
              } else {
                status = deficit <= 0 ? 'ACHIEVED' : 'NOT_REACHABLE';
              }
            }

            // Generate predictions for pending exams
            if (remainingWeight > 0 && requiredAvg !== null && pendingExamIds.length > 0) {
              const predictions = distributePredictions(requiredAvg, pendingExamIds, currentAvg, momentum);

              for (const pendingId of pendingExamIds) {
                const pred = predictions.get(pendingId);
                if (!pred) continue;

                if (!exams[pendingId]) {
                  // Create a predicted exam entry
                  const maxM = EXAM_CONFIG[pendingId].maxMarks;
                  exams[pendingId] = {
                    id: pendingId,
                    label: EXAM_CONFIG[pendingId].label,
                    maxMarksPerSubject: maxM,
                    overall: { rawValue: null, type: 'empty', displayValue: 'Predicted', unit: 'percent' },
                    isPredicted: true,
                    predictedScores: {},
                    subjects: {},
                    subjectList: [],
                  };
                }

                if (!exams[pendingId].predictedScores) exams[pendingId].predictedScores = {};
                exams[pendingId].predictedScores[sk] = {
                  predictedPct: pred.pct,
                  predictedRawMarks: Math.round((pred.pct / 100) * EXAM_CONFIG[pendingId].maxMarks * 10) / 10,
                  confidence: pred.confidence,
                };
              }
            }

            // ─── Achievement detail for this subject ───
            const achieved = status === 'ACHIEVED';
            const deltaToTarget = (subjectTargetPct !== null && currentAvg !== null)
              ? Math.round((currentAvg - subjectTargetPct) * 10) / 10
              : null;

            // Compare latest completed exam's actual vs its prediction
            let predDelta: number | null = null;
            let predVerdict: 'ABOVE' | 'BELOW' | 'MATCH' | 'PENDING' = 'PENDING';
            if (completedExamIds.length > 0) {
              const latestExamId = completedExamIds[completedExamIds.length - 1];
              const latestExam = exams[latestExamId];
              const prevPred = existingDoc?.exams?.[latestExamId]?.predictedScores?.[sk]?.predictedPct;
              const actualSubj = latestExam?.subjects?.[sk];
              if (prevPred !== undefined && prevPred !== null && actualSubj?.type === 'exact' && actualSubj.value !== undefined) {
                const maxM = EXAM_CONFIG[latestExamId].maxMarks;
                const actualPct = actualSubj.unit === 'marks' ? (actualSubj.value / maxM) * 100 : actualSubj.value;
                predDelta = Math.round((actualPct - prevPred) * 10) / 10;
                predVerdict = predDelta > 2 ? 'ABOVE' : predDelta < -2 ? 'BELOW' : 'MATCH';
              }
            }

            achievementDetails[sk] = {
              achieved,
              delta: deltaToTarget,
              verdict: status === 'INSUFFICIENT_DATA' ? 'PENDING' : status as any,
              predictionDelta: predDelta,
              predictionVerdict: predVerdict,
            };
          }

          // ─── Overall calculations ───
          const overallNorm = parseValue(row.overall, true);
          let overallTargetStatus = 'NOT_ASSIGNED';
          let overallGapPoints: number | undefined;
          let overallGapDesc = 'School target has not been assigned yet.';

          // Compute overall from completed exam data
          let overallWeightedContrib = 0;
          let overallCompWeight = 0;

          for (const eid of completedExamIds) {
            const exam = exams[eid];
            if (!exam?.overall || exam.overall.type !== 'exact' || exam.overall.value === undefined) continue;
            overallWeightedContrib += exam.overall.value * EXAM_CONFIG[eid].weight;
            overallCompWeight += EXAM_CONFIG[eid].weight;
          }

          const overallCurrentPct = overallCompWeight > 0
            ? Math.round((overallWeightedContrib / overallCompWeight) * 100) / 100
            : null;

          const computedOverall: NormValue = overallCurrentPct !== null
            ? { rawValue: overallCurrentPct, type: 'exact', value: overallCurrentPct, displayValue: `${overallCurrentPct}%`, unit: 'percent' }
            : overallNorm;

          // Compare with target
          if (targetNorm.type === 'exact' && targetNorm.value !== undefined && computedOverall.type === 'exact' && computedOverall.value !== undefined) {
            const gap = Math.round((targetNorm.value - computedOverall.value) * 100) / 100;
            if (gap <= 0) {
              overallTargetStatus = 'ACHIEVED';
              overallGapPoints = 0;
              overallGapDesc = `Target achieved (${Math.abs(gap).toFixed(1)} percentage points above target)`;
            } else {
              overallTargetStatus = 'IN_PROGRESS';
              overallGapPoints = gap;
              overallGapDesc = `${gap.toFixed(1)} percentage points to target`;
            }
          }

          // ─── Write to Firestore ───
          const docRef = firestore.collection('students').doc(studentId);
          batch.set(docRef, {
            studentId,
            enrollmentNumber,
            name,
            class: 'IX',
            group,
            school: 'CCIS',
            currentPerformance: {
              overall: computedOverall,
              subjects: {
                english: e1English,
                maths: e1Maths,
                socialScience: e1SSt,
                secondLanguage: e1Hsf,
                science: e1Science,
                it: e1It,
              },
              subjectList: [
                { id: 'english', code: 'ENG', label: 'English Language & Lit', normalized: e1English },
                { id: 'maths', code: 'MATH', label: 'Mathematics', normalized: e1Maths },
                { id: 'socialScience', code: 'SST', label: 'Social Science (S.St)', normalized: e1SSt },
                { id: 'secondLanguage', code: 'H/S/F', label: 'H / S / F (2nd Language)', normalized: e1Hsf },
                { id: 'science', code: 'SCI', label: 'Science', normalized: e1Science },
                { id: 'it', code: 'IT', label: 'Information Technology (IT)', normalized: e1It },
              ],
            },
            schoolTarget: {
              overall: targetNorm,
              subjects: existingTargetSubjects || undefined,
              targetStatus: overallTargetStatus,
              gapPercentagePoints: overallGapPoints,
              gapDescription: overallGapDesc,
              achievementDetails,
            },
            exams,
            examOrder: EXAM_ORDER,
            source: {
              sheetName: row.sheetName || 'Class-IX',
              sourceRow: Number(row.sourceRow) || serialNo + 1,
              serialNo,
              lastSyncedAt: now,
            },
            updatedAt: now,
          }, { merge: true });

          successful++;
        } catch (err: any) {
          failed++;
          errors.push({ student: row.name, error: err.message });
        }
      }

      await batch.commit();
    }

    // ─── Sync log ───
    const logRef = firestore.collection('sync_logs').doc();
    await logRef.set({
      id: logRef.id,
      syncSource: body.syncSource || 'Cloud Function syncClass9Performance v2',
      startedAt: now,
      completedAt: new Date().toISOString(),
      totalRows: rows.length,
      successfulRows: successful,
      failedRows: failed,
      errors,
    });

    res.status(200).json({
      success: true,
      message: `Synchronized ${successful} student(s) with prediction engine.`,
      successful,
      failed,
      logId: logRef.id,
    });
  } catch (err: any) {
    console.error('syncClass9Performance error:', err);
    res.status(500).json({ error: 'Sync failed', details: err.message || String(err) });
  }
});
