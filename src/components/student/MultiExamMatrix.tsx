"use client";
import React from "react";
import { StudentRecord, EXAM_WEIGHTS, EXAM_ORDER } from "@/lib/academicNormalizer";
import {
  calculateRequiredScoresPerSubject,
} from "@/lib/academicCalculations";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";

interface MultiExamMatrixProps {
  student: StudentRecord;
}

export default function MultiExamMatrix({ student }: MultiExamMatrixProps) {
  const target = student.schoolTarget;
  const lang2 = student.secondLanguage || "Hindi";
  const calcResult = calculateRequiredScoresPerSubject(student);

  const subjectKeys = [
    { key: "english", code: "ENG", label: "English Language & Lit", isLang: false },
    { key: "secondLanguage", code: lang2.slice(0, 3).toUpperCase(), label: `${lang2} (2nd Language)`, isLang: true },
    { key: "maths", code: "MATH", label: "Mathematics", isLang: false },
    { key: "science", code: "SCI", label: "General Science", isLang: false },
    { key: "socialScience", code: "S.ST", label: "Social Science", isLang: false },
    { key: "it", code: "IT", label: "Information Technology", isLang: false },
  ] as const;

  // Build exam columns from the 4-exam structure
  const examColumns = EXAM_ORDER.map((examId) => {
    const w = EXAM_WEIGHTS[examId];
    const exam = student.exams?.[examId];
    const isCompleted = exam !== undefined && !exam.isPredicted;
    return {
      examId,
      label: w.label,
      shortLabel: w.shortLabel,
      maxMarks: w.maxMarks,
      weight: w.weight,
      isCompleted,
      isPredicted: !isCompleted,
    };
  });

  function getSubjectValue(examId: string, subjectKey: string): {
    display: string;
    rawMarks: string;
    pct: number | null;
    isExempt: boolean;
    isAbsent: boolean;
    isPredicted: boolean;
    confidence: string | null;
  } {
    const exam = student.exams?.[examId];
    const w = EXAM_WEIGHTS[examId];

    if (!exam) {
      // Check prediction from calcResult
      const subjCalc = calcResult.subjects.find((s) => s.subjectKey === subjectKey);
      const examScore = subjCalc?.examScores.find((es) => es.examId === examId);
      if (examScore?.isPredicted && examScore.predictedPct !== null) {
        return {
          display: `~${examScore.predictedPct}%`,
          rawMarks: `~${examScore.predictedRawMarks}/${w.maxMarks}`,
          pct: examScore.predictedPct,
          isExempt: false,
          isAbsent: false,
          isPredicted: true,
          confidence: examScore.confidence,
        };
      }
      return { display: "—", rawMarks: "—", pct: null, isExempt: false, isAbsent: false, isPredicted: false, confidence: null };
    }

    const subj = (exam as any).subjects?.[subjectKey];
    if (!subj) return { display: "—", rawMarks: "—", pct: null, isExempt: false, isAbsent: false, isPredicted: false, confidence: null };

    if (subj.type === "exempt") {
      return { display: "Exempt", rawMarks: "-", pct: null, isExempt: true, isAbsent: false, isPredicted: false, confidence: null };
    }

    if (subj.displayValue === "Absent (AB)") {
      return { display: "AB", rawMarks: "0", pct: 0, isExempt: false, isAbsent: true, isPredicted: false, confidence: null };
    }

    if (subj.type === "exact" && subj.value !== undefined) {
      const pct = subj.unit === "marks" ? Math.round((subj.value / w.maxMarks) * 10000) / 100 : subj.value;
      const rawDisplay = subj.unit === "marks" ? `${subj.value}/${w.maxMarks}` : `${subj.value}%`;
      return { display: `${pct}%`, rawMarks: rawDisplay, pct, isExempt: false, isAbsent: false, isPredicted: false, confidence: null };
    }

    if (subj.type === "range") {
      return { display: subj.displayValue, rawMarks: subj.displayValue, pct: null, isExempt: false, isAbsent: false, isPredicted: false, confidence: null };
    }

    return { display: subj.displayValue || "—", rawMarks: subj.displayValue || "—", pct: null, isExempt: false, isAbsent: false, isPredicted: false, confidence: null };
  }

  function getTargetValue(subjectKey: string): string {
    const targetSubjects = target?.subjects;
    if (!targetSubjects) return "N/A";
    const t = (targetSubjects as any)[subjectKey];
    if (!t) return "N/A";
    return t.displayValue || "N/A";
  }

  function getDeltaIcon(prev: number | null, curr: number | null) {
    if (prev === null || curr === null) return <Minus className="w-3 h-3 text-slate-300" />;
    if (curr > prev) return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    if (curr < prev) return <TrendingDown className="w-3 h-3 text-rose-500" />;
    return <Minus className="w-3 h-3 text-slate-400" />;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-navy border border-blue-100 font-mono">
              <BookOpen className="w-3.5 h-3.5 text-navy" />
              4-Exam Performance Matrix
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-navy font-serif">
            Comparative Subject Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-exam progression with predictive scoring for upcoming assessments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {examColumns.map((col) => (
            <span
              key={col.examId}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border font-mono ${
                col.isCompleted
                  ? "bg-white border-slate-200 text-slate-600"
                  : "bg-violet-50 border-violet-200 text-violet-600 border-dashed"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${col.isCompleted ? "bg-navy" : "bg-violet-400"}`} />
              {col.shortLabel}: {col.label} (/{col.maxMarks})
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 w-48 sticky left-0 bg-slate-50/80 z-10">
                Subject
              </th>
              {examColumns.map((col) => (
                <th
                  key={col.examId}
                  className={`text-center px-3 py-3 font-semibold min-w-[100px] ${
                    col.isPredicted ? "text-violet-600" : "text-slate-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span>{col.shortLabel}</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      {col.isCompleted ? (
                        <span className="inline-flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          Actual
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-violet-500">
                          <Sparkles className="w-3 h-3" />
                          Predicted
                        </span>
                      )}
                    </span>
                  </div>
                </th>
              ))}
              <th className="text-center px-3 py-3 font-semibold text-amber-700 min-w-[80px]">
                Target
              </th>
            </tr>
          </thead>
          <tbody>
            {subjectKeys.map((subj, idx) => {
              const values = examColumns.map((col) => getSubjectValue(col.examId, subj.key));
              const targetDisplay = getTargetValue(subj.key);

              return (
                <tr
                  key={subj.key}
                  className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                    idx % 2 === 1 ? "bg-slate-50/30" : ""
                  }`}
                >
                  <td className="px-4 py-3.5 sticky left-0 bg-white z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                        {subj.code}
                      </span>
                      <span className="font-semibold text-slate-700 truncate text-xs">{subj.label}</span>
                    </div>
                  </td>
                  {values.map((val, vi) => (
                    <td key={examColumns[vi].examId} className="text-center px-3 py-3.5">
                      {val.isExempt ? (
                        <span className="text-slate-400 italic text-[11px]">Exempt</span>
                      ) : val.isAbsent ? (
                        <span className="text-rose-500 font-bold text-[11px]">AB</span>
                      ) : val.isPredicted ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-mono font-bold text-violet-600 text-sm border-b border-dashed border-violet-300">
                            {val.rawMarks}
                          </span>
                          <span className="text-[10px] text-violet-400">
                            {val.confidence === "high" ? "Likely" : val.confidence === "medium" ? "Moderate" : "Stretch"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-mono font-bold text-navy text-sm">{val.rawMarks}</span>
                          {vi > 0 && (
                            <span>{getDeltaIcon(values[vi - 1].pct, val.pct)}</span>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="text-center px-3 py-3.5">
                    <span className="font-mono font-bold text-amber-700 text-sm">{targetDisplay}</span>
                  </td>
                </tr>
              );
            })}

            {/* Overall Row */}
            <tr className="bg-navy/5 border-t-2 border-navy/20 font-bold">
              <td className="px-4 py-4 sticky left-0 bg-blue-50/50 z-10">
                <span className="text-navy font-bold text-xs">OVERALL AGGREGATE</span>
              </td>
              {examColumns.map((col) => {
                const exam = student.exams?.[col.examId];
                const overall = exam?.overall;
                const isActual = col.isCompleted && overall;
                const overallCalc = calcResult.overall.examScores.find((es) => es.examId === col.examId);

                return (
                  <td key={col.examId} className="text-center px-3 py-4">
                    {isActual && overall?.type === "exact" ? (
                      <span className="font-mono text-navy text-sm">{overall.displayValue}</span>
                    ) : overallCalc?.isPredicted && overallCalc.predictedPct !== null ? (
                      <span className="font-mono text-violet-600 text-sm border-b border-dashed border-violet-300">
                        ~{overallCalc.predictedPct}%
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                );
              })}
              <td className="text-center px-3 py-4">
                <span className="font-mono text-amber-700 text-sm">
                  {target?.overall?.displayValue || "N/A"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/30 flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-navy" /> Actual Score
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-violet-400" /> Predicted Score
        </span>
        <span className="inline-flex items-center gap-1">
          <TrendingUp className="w-3 h-3 text-emerald-500" /> Improvement
        </span>
        <span className="inline-flex items-center gap-1">
          <TrendingDown className="w-3 h-3 text-rose-500" /> Decline
        </span>
      </div>
    </div>
  );
}
