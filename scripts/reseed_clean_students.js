const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env') });

const admin = require('../functions/node_modules/firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** 4-exam CBSE Class IX structure */
const EXAM_CONFIG = {
  'exam-1': { weight: 0.10, label: 'PT-1 (Baseline)', shortLabel: 'E1', maxMarks: 20 },
  'exam-2': { weight: 0.30, label: 'Mid Term',        shortLabel: 'E2', maxMarks: 80 },
  'exam-3': { weight: 0.10, label: 'PT-2',            shortLabel: 'E3', maxMarks: 20 },
  'exam-4': { weight: 0.50, label: 'Final Exam',      shortLabel: 'E4', maxMarks: 80 },
};
const EXAM_ORDER = ['exam-1', 'exam-2', 'exam-3', 'exam-4'];
const SUBJECT_KEYS = ['english', 'maths', 'socialScience', 'secondLanguage', 'science', 'it'];
const PREDICTION_CEILING = 95;

function parseMarks(raw, maxMarks) {
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

function parseTargetVal(raw) {
  if (raw === null || raw === undefined || raw === '' || String(raw).trim() === '') {
    return { rawValue: raw ?? null, type: 'empty', displayValue: 'Not Assigned', unit: 'percent' };
  }
  const str = String(raw).trim();
  if (str === '-' || str.toLowerCase() === 'exempt') {
    return { rawValue: raw, type: 'exempt', displayValue: 'Exempt (-)', unit: 'percent' };
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

function computeStatus(requiredAvg) {
  if (requiredAvg <= 0) return 'ACHIEVED';
  if (requiredAvg <= 75) return 'ON_TRACK';
  if (requiredAvg <= 90) return 'NEEDS_FOCUS';
  if (requiredAvg <= 100) return 'AT_RISK';
  return 'NOT_REACHABLE';
}

function distributePredictions(requiredAvg, pendingExamIds, currentAvg) {
  const predictions = new Map();
  if (pendingExamIds.length === 0) return predictions;

  const capped = Math.min(requiredAvg, PREDICTION_CEILING);
  const isUnreachable = requiredAvg > 100;

  if (pendingExamIds.length === 1) {
    const conf = isUnreachable ? 'low' : capped <= 75 ? 'high' : capped <= 90 ? 'medium' : 'low';
    predictions.set(pendingExamIds[0], { pct: Math.round(capped * 10) / 10, confidence: conf });
    return predictions;
  }

  const rampFactor = 0.08;
  const startVal = currentAvg ? Math.min(currentAvg, capped) : capped * 0.92;
  const totalRamp = capped - startVal;
  const stepCount = pendingExamIds.length;

  for (let i = 0; i < stepCount; i++) {
    const t = (i + 1) / stepCount;
    const curvedT = Math.pow(t, 1 - rampFactor);
    const predPct = Math.round(Math.min(startVal + totalRamp * curvedT, PREDICTION_CEILING) * 10) / 10;
    const conf = isUnreachable ? 'low' : predPct <= 75 ? 'high' : predPct <= 88 ? 'medium' : 'low';
    predictions.set(pendingExamIds[i], { pct: Math.max(0, predPct), confidence: conf });
  }

  return predictions;
}

async function reseed() {
  const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'clean_students.json'), 'utf-8'));
  console.log(`Reseeding Firestore with ${students.length} clean students...`);

  // 1. Get existing students to delete stale/duplicate documents
  const existingSnap = await db.collection('students').where('class', '==', 'IX').get();
  const validIds = new Set();

  for (const s of students) {
    const group = s.section.toUpperCase();
    const cleanName = slugify(s.name);
    validIds.add(`ccis-ix-${group.toLowerCase()}-${cleanName}`);
  }

  let deletedCount = 0;
  const deleteBatch = db.batch();
  existingSnap.forEach(doc => {
    if (!validIds.has(doc.id)) {
      deleteBatch.delete(doc.ref);
      deletedCount++;
      console.log(`  Deleting stale/duplicate student: ${doc.id}`);
    }
  });
  if (deletedCount > 0) {
    await deleteBatch.commit();
    console.log(`Deleted ${deletedCount} stale/duplicate documents.`);
  }

  // 2. Ingest 97 clean students with 4-exam CBSE engine
  const batch = db.batch();
  const now = new Date().toISOString();

  for (const s of students) {
    const group = s.section.toUpperCase();
    const name = s.name.toUpperCase();
    const serialNo = s.sNo;
    const cleanName = slugify(name);
    const studentId = `ccis-ix-${group.toLowerCase()}-${cleanName}`;
    const enrollmentNumber = `CCIS-IX-${group}-${String(serialNo).padStart(2, '0')}`;

    // Targets
    const targetNorm = parseTargetVal(s.target);
    const tgtSubjects = s.targetSubjects || {};
    const normalizedTargetSubjects = {
      english: parseTargetVal(tgtSubjects.english),
      maths: parseTargetVal(tgtSubjects.maths),
      socialScience: parseTargetVal(tgtSubjects.socialScience),
      secondLanguage: parseTargetVal(tgtSubjects.secondLanguage),
      science: parseTargetVal(tgtSubjects.science),
      it: parseTargetVal(tgtSubjects.it),
    };

    // Exam-1 Marks (/20)
    const e1Raw = s.exam1 || {};
    const e1MaxMarks = EXAM_CONFIG['exam-1'].maxMarks; // 20
    const e1Eng = parseMarks(e1Raw.english, e1MaxMarks);
    const e1Math = parseMarks(e1Raw.maths, e1MaxMarks);
    const e1SSt = parseMarks(e1Raw.sSt, e1MaxMarks);
    const e1Hsf = parseMarks(e1Raw.hsf, e1MaxMarks);
    const e1Sci = parseMarks(e1Raw.science, e1MaxMarks);
    const e1It = parseMarks(e1Raw.it, e1MaxMarks);

    const e1Subjects = [e1Eng, e1Math, e1SSt, e1Hsf, e1Sci, e1It];
    const e1Scores = e1Subjects
      .filter(subj => subj.type === 'exact' && subj.value !== undefined && subj.value !== null)
      .map(subj => subj.value);

    const e1HasData = e1Scores.length > 0;
    const e1OverallPct = e1HasData
      ? Math.round(((e1Scores.reduce((a, b) => a + b, 0) / (e1Scores.length * e1MaxMarks)) * 100) * 100) / 100
      : null;

    const e1Overall = e1OverallPct !== null
      ? { rawValue: e1OverallPct, type: 'exact', value: e1OverallPct, displayValue: `${e1OverallPct}%`, unit: 'percent' }
      : { rawValue: null, type: 'empty', displayValue: 'Pending', unit: 'percent' };

    const exams = {};

    // Exam-1 Object
    if (e1HasData) {
      exams['exam-1'] = {
        id: 'exam-1',
        label: EXAM_CONFIG['exam-1'].label,
        maxMarksPerSubject: e1MaxMarks,
        overall: e1Overall,
        totalMarksScored: e1Scores.reduce((a, b) => a + b, 0),
        totalMaxMarks: e1Scores.length * e1MaxMarks,
        isPredicted: false,
        subjects: {
          english: e1Eng,
          secondLanguage: e1Hsf,
          maths: e1Math,
          science: e1Sci,
          socialScience: e1SSt,
          it: e1It,
        },
        subjectList: [
          { id: 'english', code: 'ENG', label: 'English Language & Lit', normalized: e1Eng },
          { id: 'maths', code: 'MATH', label: 'Mathematics', normalized: e1Math },
          { id: 'socialScience', code: 'SST', label: 'Social Science', normalized: e1SSt },
          { id: 'secondLanguage', code: 'H/S/F', label: '2nd Language', normalized: e1Hsf },
          { id: 'science', code: 'SCI', label: 'Science', normalized: e1Sci },
          { id: 'it', code: 'IT', label: 'Information Technology', normalized: e1It },
        ],
      };
    }

    // Run prediction engine for pending exams (exam-2, exam-3, exam-4)
    const pendingExamIds = ['exam-2', 'exam-3', 'exam-4'];
    const subjectMap = {
      english: e1Eng,
      maths: e1Math,
      socialScience: e1SSt,
      secondLanguage: e1Hsf,
      science: e1Sci,
      it: e1It,
    };

    const subjectPredictions = {};
    for (const sk of SUBJECT_KEYS) {
      const tgt = normalizedTargetSubjects[sk]?.value || targetNorm.value || 75;
      const completedSubj = subjectMap[sk];
      let currentScorePct = null;
      let weightedContrib = 0;

      if (completedSubj?.type === 'exact' && completedSubj.value !== undefined) {
        currentScorePct = (completedSubj.value / e1MaxMarks) * 100;
        weightedContrib = currentScorePct * EXAM_CONFIG['exam-1'].weight; // 10%
      }

      const remainingWeight = 0.90; // Exam 2, 3, 4 = 30% + 10% + 50%
      const deficit = tgt - weightedContrib;
      const requiredAvg = Math.max(0, deficit / remainingWeight);

      const preds = distributePredictions(requiredAvg, pendingExamIds, currentScorePct);
      subjectPredictions[sk] = {
        requiredAvg: Math.round(requiredAvg * 10) / 10,
        status: computeStatus(requiredAvg),
        predictions: preds,
      };
    }

    // Build predicted exam objects for exam-2, exam-3, exam-4
    for (const eid of pendingExamIds) {
      const maxM = EXAM_CONFIG[eid].maxMarks;
      const predSubjList = [];
      const predSubjObj = {};
      let sumPredPct = 0;
      let count = 0;

      const labels = {
        english: { code: 'ENG', label: 'English Language & Lit' },
        maths: { code: 'MATH', label: 'Mathematics' },
        socialScience: { code: 'SST', label: 'Social Science' },
        secondLanguage: { code: 'H/S/F', label: '2nd Language' },
        science: { code: 'SCI', label: 'Science' },
        it: { code: 'IT', label: 'Information Technology' },
      };

      for (const sk of SUBJECT_KEYS) {
        const predInfo = subjectPredictions[sk]?.predictions.get(eid);
        const predPct = predInfo?.pct || 0;
        const predRawMarks = Math.round((predPct / 100) * maxM * 10) / 10;
        sumPredPct += predPct;
        count++;

        const normVal = {
          rawValue: predRawMarks,
          type: 'exact',
          value: predRawMarks,
          displayValue: `${predRawMarks}/${maxM} (${predPct}%)`,
          unit: 'marks',
        };

        predSubjObj[sk] = normVal;
        predSubjList.push({
          id: sk,
          code: labels[sk].code,
          label: labels[sk].label,
          normalized: normVal,
          predictedPct: predPct,
          confidence: predInfo?.confidence || 'medium',
        });
      }

      const overallPct = count > 0 ? Math.round((sumPredPct / count) * 10) / 10 : 0;
      exams[eid] = {
        id: eid,
        label: EXAM_CONFIG[eid].label,
        maxMarksPerSubject: maxM,
        overall: {
          rawValue: overallPct,
          type: 'exact',
          value: overallPct,
          displayValue: `${overallPct}%`,
          unit: 'percent',
        },
        isPredicted: true,
        subjects: predSubjObj,
        subjectList: predSubjList,
      };
    }

    // Target Status
    let targetStatus = 'NOT_ASSIGNED';
    let gapPoints = undefined;
    let gapDesc = 'School target has not been assigned yet.';

    if (targetNorm.type === 'exact' && e1Overall.type === 'exact') {
      const gap = Math.round((targetNorm.value - e1Overall.value) * 100) / 100;
      if (gap <= 0) {
        targetStatus = 'ACHIEVED';
        gapPoints = 0;
        gapDesc = `Target achieved (${Math.abs(gap).toFixed(1)} percentage points above target)`;
      } else {
        targetStatus = 'IN_PROGRESS';
        gapPoints = gap;
        gapDesc = `${gap.toFixed(1)} percentage points to target`;
      }
    }

    const docRef = db.collection('students').doc(studentId);
    batch.set(docRef, {
      studentId,
      enrollmentNumber,
      name,
      class: 'IX',
      group,
      school: 'CCIS',
      currentPerformance: {
        overall: e1Overall,
        subjects: {
          english: e1Eng,
          maths: e1Math,
          socialScience: e1SSt,
          secondLanguage: e1Hsf,
          science: e1Sci,
          it: e1It,
        },
        subjectList: [
          { id: 'english', code: 'ENG', label: 'English Language & Lit', normalized: e1Eng },
          { id: 'maths', code: 'MATH', label: 'Mathematics', normalized: e1Math },
          { id: 'socialScience', code: 'SST', label: 'Social Science (S.St)', normalized: e1SSt },
          { id: 'secondLanguage', code: 'H/S/F', label: 'H / S / F (2nd Language)', normalized: e1Hsf },
          { id: 'science', code: 'SCI', label: 'Science', normalized: e1Sci },
          { id: 'it', code: 'IT', label: 'Information Technology (IT)', normalized: e1It },
        ],
      },
      schoolTarget: {
        overall: targetNorm,
        subjects: normalizedTargetSubjects,
        targetStatus,
        gapPercentagePoints: gapPoints,
        gapDescription: gapDesc,
      },
      exams,
      examOrder: EXAM_ORDER,
      source: {
        sheetName: 'Class-IX',
        sourceRow: serialNo + 1,
        serialNo,
        lastSyncedAt: now,
      },
      updatedAt: now,
    });
  }

  await batch.commit();
  console.log(`✅ Successfully reseeded all ${students.length} students into Firestore!`);
  process.exit(0);
}

reseed().catch(err => {
  console.error("Reseed failed:", err);
  process.exit(1);
});
