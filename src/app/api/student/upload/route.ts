import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, setDoc, writeBatch, collection } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import type { StudentRecord, NormalizedValue, ExamEntry } from '@/lib/academicNormalizer';
import { parsePerformanceValue, generateStudentId, EXAM_WEIGHTS } from '@/lib/academicNormalizer';

const db = getFirestore(app);
const ADMIN_PASSCODE = 'ccis-admin-2026';

interface UploadRecord {
  name: string;
  section: string; // AURA, ZEN, NEO
  english?: number | string | null;
  hindi?: number | string | null;
  sanskrit?: number | string | null;
  french?: number | string | null;
  maths?: number | string | null;
  science?: number | string | null;
  socialScience?: number | string | null;
  it?: number | string | null;
}

interface UploadBody {
  passcode: string;
  examId: string;          // e.g. 'exam-3'
  examLabel: string;       // e.g. 'PT-2'
  maxMarksPerSubject: number; // 100 or 20
  records: UploadRecord[];
}

function normalizeStudentName(name: string): string {
  return name.trim().toUpperCase().replace(/\s+/g, ' ');
}

function resolveSecondLanguage(record: UploadRecord): {
  lang: 'Hindi' | 'Sanskrit' | 'French';
  value: NormalizedValue;
} {
  // Check which language has a value (not - or null)
  if (record.hindi !== null && record.hindi !== undefined && record.hindi !== '-') {
    return { lang: 'Hindi', value: parseMarkValue(record.hindi) };
  }
  if (record.sanskrit !== null && record.sanskrit !== undefined && record.sanskrit !== '-') {
    return { lang: 'Sanskrit', value: parseMarkValue(record.sanskrit) };
  }
  if (record.french !== null && record.french !== undefined && record.french !== '-') {
    return { lang: 'French', value: parseMarkValue(record.french) };
  }
  // Default to Hindi exempt
  return {
    lang: 'Hindi',
    value: { rawValue: '-', type: 'exempt', displayValue: 'Exempt (-)', unit: 'percent' },
  };
}

function parseMarkValue(raw: any): NormalizedValue {
  if (raw === null || raw === undefined || raw === '') {
    return { rawValue: null, type: 'empty', displayValue: 'Pending', unit: 'marks' };
  }

  const str = String(raw).trim().toLowerCase();

  if (str === '-' || str === 'exempt' || str === 'na') {
    return { rawValue: raw, type: 'exempt', displayValue: 'Exempt (-)', unit: 'marks' };
  }

  if (str === 'ab' || str === 'absent') {
    return {
      rawValue: raw, type: 'exact', value: 0, displayValue: 'Absent (AB)',
      unit: 'marks', statusNote: 'Absent — treated as 0',
    };
  }

  if (str === 'new') {
    return { rawValue: raw, type: 'empty', displayValue: 'New Student', unit: 'marks', statusNote: 'Newly admitted' };
  }

  const num = parseFloat(str);
  if (!isNaN(num)) {
    return { rawValue: raw, type: 'exact', value: num, displayValue: `${num}`, unit: 'marks' };
  }

  return { rawValue: raw, type: 'invalid', displayValue: String(raw), unit: 'marks', statusNote: 'Unrecognized' };
}

function buildSubjectList(
  subjects: ExamEntry['subjects'],
  lang: 'Hindi' | 'Sanskrit' | 'French',
  maxMarks: number
) {
  const langCode = lang.slice(0, 3).toUpperCase();
  const fmt = (subj: NormalizedValue, maxM: number) => {
    if (subj.type === 'exact' && subj.value !== undefined) {
      return { ...subj, displayValue: `${subj.value} / ${maxM}` };
    }
    return subj;
  };

  return [
    { id: 'eng', code: 'ENG', label: 'English Language & Lit', normalized: fmt(subjects.english, maxMarks) },
    { id: 'lang2', code: langCode, label: `2nd Lang: ${lang}`, normalized: fmt(subjects.secondLanguage, maxMarks) },
    { id: 'math', code: 'MATH', label: 'Mathematics', normalized: fmt(subjects.maths, maxMarks) },
    { id: 'sci', code: 'SCI', label: 'General Science', normalized: fmt(subjects.science, maxMarks) },
    { id: 'sst', code: 'S.ST', label: 'Social Science', normalized: fmt(subjects.socialScience, maxMarks) },
    { id: 'it', code: 'IT', label: 'Information Technology', normalized: fmt(subjects.it, maxMarks) },
  ];
}

function computeOverall(subjects: ExamEntry['subjects'], maxMarks: number): NormalizedValue {
  let total = 0;
  let count = 0;

  const vals = [subjects.english, subjects.secondLanguage, subjects.maths, subjects.science, subjects.socialScience, subjects.it];
  for (const v of vals) {
    if (v.type === 'exact' && v.value !== undefined) {
      total += v.value;
      count++;
    }
  }

  if (count === 0) return { rawValue: null, type: 'empty', displayValue: 'Pending', unit: 'percent' };

  const totalMax = count * maxMarks;
  const pct = Math.round((total / totalMax) * 10000) / 100;

  return {
    rawValue: `${pct}%`, type: 'exact', value: pct,
    displayValue: `${pct}%`, unit: 'percent',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: UploadBody = await request.json();

    // Auth
    if (body.passcode !== ADMIN_PASSCODE) {
      return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 });
    }

    // Validate
    if (!body.examId || !body.records || body.records.length === 0) {
      return NextResponse.json({ error: 'Missing examId or records' }, { status: 400 });
    }

    const validExamIds = Object.keys(EXAM_WEIGHTS);
    if (!validExamIds.includes(body.examId)) {
      return NextResponse.json({ error: `Invalid examId. Must be one of: ${validExamIds.join(', ')}` }, { status: 400 });
    }

    const maxMarks = body.maxMarksPerSubject || 100;
    const results = { matched: 0, created: 0, failed: 0, errors: [] as string[] };

    const BATCH_SIZE = 400;
    for (let i = 0; i < body.records.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = body.records.slice(i, i + BATCH_SIZE);

      for (const record of chunk) {
        try {
          const normalizedName = normalizeStudentName(record.name);
          const section = record.section.toUpperCase().replace(/^IX-?/, '');
          const studentId = generateStudentId(section, normalizedName);

          // Parse subjects
          const langResult = resolveSecondLanguage(record);

          const subjects: ExamEntry['subjects'] = {
            english: parseMarkValue(record.english),
            secondLanguage: langResult.value,
            maths: parseMarkValue(record.maths),
            science: parseMarkValue(record.science),
            socialScience: parseMarkValue(record.socialScience),
            it: parseMarkValue(record.it),
          };

          const overall = computeOverall(subjects, maxMarks);
          const subjectList = buildSubjectList(subjects, langResult.lang, maxMarks);

          // Compute total marks scored
          let totalMarksScored = 0;
          let scoredCount = 0;
          for (const v of Object.values(subjects)) {
            if (v.type === 'exact' && v.value !== undefined) {
              totalMarksScored += v.value;
              scoredCount++;
            }
          }

          const examEntry: ExamEntry = {
            id: body.examId,
            label: body.examLabel || EXAM_WEIGHTS[body.examId]?.label || body.examId,
            maxMarksPerSubject: maxMarks,
            overall,
            totalMarksScored,
            totalMaxMarks: scoredCount * maxMarks,
            secondLanguageTaken: langResult.lang,
            subjects,
            subjectList,
          };

          // Check if student exists
          const docRef = doc(db, 'students', studentId);
          const existing = await getDoc(docRef);

          if (existing.exists()) {
            // Merge exam data
            const data = existing.data() as StudentRecord;
            const updatedExams = { ...data.exams, [body.examId]: examEntry };
            const examOrder = Array.from(new Set([...(data.examOrder || []), body.examId]));

            batch.update(docRef, {
              exams: updatedExams,
              examOrder,
              updatedAt: new Date().toISOString(),
            });
            results.matched++;
          } else {
            results.errors.push(`Student not found: ${normalizedName} (${studentId})`);
            results.failed++;
          }
        } catch (err: any) {
          results.errors.push(`Error processing ${record.name}: ${err.message}`);
          results.failed++;
        }
      }

      await batch.commit();
    }

    // Log the sync
    const logRef = doc(collection(db, 'sync_logs'));
    await setDoc(logRef, {
      id: logRef.id,
      syncSource: 'Admin Upload API',
      examId: body.examId,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      totalRows: body.records.length,
      matched: results.matched,
      failed: results.failed,
      errors: results.errors.slice(0, 20),
    });

    return NextResponse.json({
      success: results.failed === 0,
      total: body.records.length,
      matched: results.matched,
      failed: results.failed,
      errors: results.errors.slice(0, 20),
      logId: logRef.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
