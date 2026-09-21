import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { StudentRecord, NormalizedValue, SubjectRecord } from "@/lib/academicNormalizer";

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbwMriBRBV5T3ZlJjQyhyOpIBN33u71Iqxe-zbhKihVQtcoDcnLpa3kVFeC95evCroX_IQ/exec";

function normalizeValue(
  raw: any,
  maxMarks = 100,
  isMarks = false
): NormalizedValue {
  if (raw === null || raw === undefined || raw === "") {
    return {
      rawValue: null,
      type: "empty",
      displayValue: "Pending",
      unit: isMarks ? "marks" : "percent",
    };
  }

  const str = String(raw).trim();
  if (str === "-" || str === "--") {
    return {
      rawValue: raw,
      type: "exempt",
      displayValue: "Exempt (-)",
      unit: isMarks ? "marks" : "percent",
    };
  }

  if (str.toLowerCase() === "ab") {
    return {
      rawValue: "ab",
      type: "invalid",
      displayValue: "Absent (AB)",
      unit: isMarks ? "marks" : "percent",
      statusNote: "Absent",
    };
  }

  const rangeMatch = str.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return {
      rawValue: raw,
      type: "range",
      min,
      max,
      displayValue: `${min}–${max}%`,
      unit: "percent",
    };
  }

  const cleanNum = str.replace("%", "").trim();
  const num = parseFloat(cleanNum);
  if (!isNaN(num)) {
    let finalVal = num;
    if (!isMarks && 0 < num && num <= 1.0 && cleanNum.includes(".")) {
      finalVal = Math.round(num * 10000) / 100;
    }
    return {
      rawValue: raw,
      type: "exact",
      value: finalVal,
      displayValue: `${finalVal}${isMarks && maxMarks === 20 ? " / 20" : "%"}`,
      unit: isMarks ? "marks" : "percent",
    };
  }

  return {
    rawValue: raw,
    type: "invalid",
    displayValue: str,
    unit: isMarks ? "marks" : "percent",
  };
}

export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}

async function handleSync() {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Apps Script HTTP ${res.status}: ${res.statusText}` },
        { status: 502 }
      );
    }

    const payload = await res.json();
    if (!payload.success || !Array.isArray(payload.students)) {
      return NextResponse.json(
        {
          success: false,
          error: payload.error || "Invalid response format from Apps Script",
        },
        { status: 400 }
      );
    }

    const records: StudentRecord[] = [];

    for (const rawStudent of payload.students) {
      const enr = String(rawStudent.enrollmentNumber || "").trim();
      const name = String(rawStudent.name || "").trim();
      if (!enr && !name) continue;

      const parts = enr.split("-");
      const section = (parts[2] as "AURA" | "ZEN" | "NEO") || "AURA";
      const studentId = enr ? enr.toLowerCase() : `student-${Math.random()}`;
      const secondLang = (rawStudent.secondLanguage as "Hindi" | "Sanskrit" | "French") || "Hindi";

      const exams = rawStudent.exams || {};
      const e1Raw = exams["exam-1"] || {};
      const e2Raw = exams["exam-2"] || {};
      const targetRaw = exams["target"] || {};

      const e1Scores = e1Raw.scores || {};
      const e2Scores = e2Raw.scores || {};

      const e1SubRecords: SubjectRecord[] = [
        { id: "english", code: "ENG", label: "English", normalized: normalizeValue(e1Scores.english, 100) },
        { id: "second-lang", code: secondLang.slice(0, 3).toUpperCase(), label: `${secondLang} (2nd Lang)`, normalized: normalizeValue(e1Scores.secondLanguage, 100) },
        { id: "maths", code: "MAT", label: "Mathematics", normalized: normalizeValue(e1Scores.maths, 100) },
        { id: "science", code: "SCI", label: "Science", normalized: normalizeValue(e1Scores.science, 100) },
        { id: "social-science", code: "SST", label: "Social Science", normalized: normalizeValue(e1Scores.socialScience, 100) },
        { id: "it", code: "IT", label: "Information Tech", normalized: normalizeValue(e1Scores.it, 100) },
      ];

      const e2SubRecords: SubjectRecord[] = [
        { id: "english", code: "ENG", label: "English", normalized: normalizeValue(e2Scores.english, 20, true) },
        { id: "second-lang", code: secondLang.slice(0, 3).toUpperCase(), label: `${secondLang} (2nd Lang)`, normalized: normalizeValue(e2Scores.secondLanguage, 20, true) },
        { id: "maths", code: "MAT", label: "Mathematics", normalized: normalizeValue(e2Scores.maths, 20, true) },
        { id: "science", code: "SCI", label: "Science", normalized: normalizeValue(e2Scores.science, 20, true) },
        { id: "social-science", code: "SST", label: "Social Science", normalized: normalizeValue(e2Scores.socialScience, 20, true) },
        { id: "it", code: "IT", label: "Information Tech", normalized: normalizeValue(e2Scores.it, 20, true) },
      ];

      const record: StudentRecord = {
        studentId,
        enrollmentNumber: enr,
        name,
        class: "IX",
        group: section,
        school: "CCIS",
        secondLanguage: secondLang,
        currentPerformance: {
          overall: normalizeValue(e1Raw.overallPercent, 100),
          subjects: {
            english: e1SubRecords[0].normalized,
            secondLanguage: e1SubRecords[1].normalized,
            maths: e1SubRecords[2].normalized,
            science: e1SubRecords[3].normalized,
            socialScience: e1SubRecords[4].normalized,
            it: e1SubRecords[5].normalized,
          },
          subjectList: e1SubRecords,
        },
        schoolTarget: {
          overall: normalizeValue(targetRaw.overallPercent, 100),
          targetStatus: "ACHIEVED",
        },
        exams: {
          "exam-1": {
            id: "exam-1",
            label: "Exam-1 (Baseline)",
            maxMarksPerSubject: 100,
            overall: normalizeValue(e1Raw.overallPercent, 100),
            totalMarksScored: e1Raw.totalMarks || undefined,
            totalMarks: e1Raw.totalMarks || undefined,
            totalMaxMarks: 600,
            secondLanguageTaken: secondLang,
            subjects: {
              english: e1SubRecords[0].normalized,
              secondLanguage: e1SubRecords[1].normalized,
              maths: e1SubRecords[2].normalized,
              science: e1SubRecords[3].normalized,
              socialScience: e1SubRecords[4].normalized,
              it: e1SubRecords[5].normalized,
            },
            subjectList: e1SubRecords,
          },
          "exam-2": {
            id: "exam-2",
            label: "Exam-2 (Mid Term)",
            maxMarksPerSubject: 20,
            overall: normalizeValue(e2Raw.overallPercent, 100),
            totalMarksScored: e2Raw.totalMarks || undefined,
            totalMarks: e2Raw.totalMarks || undefined,
            totalMaxMarks: 120,
            secondLanguageTaken: secondLang,
            subjects: {
              english: e2SubRecords[0].normalized,
              secondLanguage: e2SubRecords[1].normalized,
              maths: e2SubRecords[2].normalized,
              science: e2SubRecords[3].normalized,
              socialScience: e2SubRecords[4].normalized,
              it: e2SubRecords[5].normalized,
            },
            subjectList: e2SubRecords,
          },
        },
        examOrder: ["exam-1", "exam-2"],
        source: {
          sheetName: "Sheet1",
          sourceRow: 0,
          serialNo: 0,
          lastSyncedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      records.push(record);
    }

    const batch = adminDb.batch();
    for (const record of records) {
      const docRef = adminDb.collection("students").doc(record.studentId);
      batch.set(docRef, record, { merge: true });
    }
    await batch.commit();

    return NextResponse.json({
      success: true,
      syncedCount: records.length,
      students: records.map(r => ({ id: r.studentId, enr: r.enrollmentNumber, name: r.name })),
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
