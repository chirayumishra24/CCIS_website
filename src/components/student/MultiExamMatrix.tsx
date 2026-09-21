"use client";
import React from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
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
  const e1 = student.exams?.["exam-1"];
  const e2 = student.exams?.["exam-2"];
  const target = student.schoolTarget;
  const lang2 = student.secondLanguage || "Hindi";

  // Build the 6 canonical subjects
  const subjectKeys = [
    { key: "english", code: "ENG", label: "English Language & Lit", isLang: false },
    { key: "secondLanguage", code: lang2.slice(0, 3).toUpperCase(), label: `${lang2} (2nd Language)`, isLang: true },
    { key: "maths", code: "MATH", label: "Mathematics", isLang: false },
    { key: "science", code: "SCI", label: "General Science", isLang: false },
    { key: "socialScience", code: "S.ST", label: "Social Science", isLang: false },
    { key: "it", code: "IT", label: "Information Technology", isLang: false },
  ] as const;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header / Title */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-navy border border-blue-100 font-mono">
              <BookOpen className="w-3.5 h-3.5 text-navy" />
              6-Subject Performance Matrix
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-navy font-serif">
            Comparative Subject Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-exam progression tracking across all 6 active curriculum disciplines
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-navy" />
            Exam-1: Baseline
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Exam-2: Mid Term (/20)
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-navy uppercase tracking-wider font-mono">
              <th className="py-3.5 px-4 sm:px-6">Subject</th>
              <th className="py-3.5 px-4 text-center">Exam-1 (Baseline)</th>
              <th className="py-3.5 px-4 text-center">Exam-2 (Marks /20)</th>
              <th className="py-3.5 px-4 text-center">Exam-2 (%)</th>
              <th className="py-3.5 px-4 text-center">Progression (Δ)</th>
              <th className="py-3.5 px-4 text-center">Target Goal</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {subjectKeys.map((subj) => {
              const v1 = e1?.subjects[subj.key];
              const v2 = e2?.subjects[subj.key];

              // Numbers for calculation
              const num1 = v1?.value ?? (v1?.min !== undefined && v1?.max !== undefined ? (v1.min + v1.max) / 2 : null);
              const num2Marks = v2?.value ?? null;
              const num2Pct = num2Marks !== null ? (num2Marks / 20) * 100 : null;

              // Delta between Exam-2 % and Exam-1 %
              let delta: number | null = null;
              if (num1 !== null && num2Pct !== null) {
                delta = Math.round((num2Pct - num1) * 10) / 10;
              }

              // Status check
              let statusLabel = "On Track";
              let statusClass = "bg-emerald-50 text-emerald-700 border-emerald-200";

              if (v2?.displayValue === "Absent (AB)") {
                statusLabel = "Absent";
                statusClass = "bg-rose-50 text-rose-700 border-rose-200";
              } else if (v2?.displayValue === "Exempt (-)") {
                statusLabel = "Exempt";
                statusClass = "bg-slate-100 text-slate-600 border-slate-200";
              } else if (delta !== null && delta < -10) {
                statusLabel = "Needs Focus";
                statusClass = "bg-amber-50 text-amber-700 border-amber-200";
              } else if (num2Pct !== null && num2Pct >= 80) {
                statusLabel = "Strong";
                statusClass = "bg-blue-50 text-navy border-blue-200";
              }

              return (
                <tr key={subj.key} className="hover:bg-slate-50/60 transition-colors">
                  {/* Subject Name */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-navy border border-slate-200 shrink-0">
                        {subj.code}
                      </span>
                      <div>
                        <div className="font-semibold text-slate-900">{subj.label}</div>
                        {subj.isLang && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Optional Language Selected
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Exam-1 Baseline */}
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800">
                    {v1?.displayValue || "Pending"}
                  </td>

                  {/* Exam-2 Marks (/20) */}
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-navy">
                    {v2 ? (
                      v2.type === "exact" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-navy border border-blue-100">
                          {v2.value} / 20
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">{v2.displayValue}</span>
                      )
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Exam-2 Percentage */}
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                    {num2Pct !== null ? `${Math.round(num2Pct * 10) / 10}%` : "-"}
                  </td>

                  {/* Delta */}
                  <td className="py-3.5 px-4 text-center font-mono">
                    {delta !== null ? (
                      delta > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                          <TrendingUp className="w-3.5 h-3.5" />
                          +{delta}%
                        </span>
                      ) : delta < 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-rose-600">
                          <TrendingDown className="w-3.5 h-3.5" />
                          {delta}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-slate-500">
                          <Minus className="w-3 h-3" />
                          0%
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </td>

                  {/* Target Goal */}
                  <td className="py-3.5 px-4 text-center font-mono text-slate-600">
                    {target?.overall?.displayValue && target.overall.displayValue !== "Not Assigned" && target.overall.displayValue !== "Pending"
                      ? target.overall.displayValue
                      : <span className="text-slate-400 text-xs">Target Pending</span>}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}

            {/* Total / Overall Row */}
            <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-200">
              <td className="py-4 px-4 sm:px-6 text-navy font-serif">
                OVERALL AGGREGATE (6 SUBJECTS)
              </td>
              <td className="py-4 px-4 text-center font-mono text-navy text-base">
                {e1?.overall?.displayValue || "Pending"}
              </td>
              <td className="py-4 px-4 text-center font-mono text-navy text-base">
                {(e2?.totalMarksScored ?? e2?.totalMarks) !== undefined ? (
                  <span className="px-2 py-1 rounded bg-blue-100 text-navy font-bold">
                    {e2?.totalMarksScored ?? e2?.totalMarks}
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td className="py-4 px-4 text-center font-mono text-navy text-base">
                {e2?.overall?.displayValue || "Pending"}
              </td>
              <td className="py-4 px-4 text-center font-mono text-xs">
                {e1?.overall?.value && e2?.overall?.value ? (
                  e2.overall.value >= e1.overall.value ? (
                    <span className="text-emerald-600 font-bold">
                      +{Math.round((e2.overall.value - e1.overall.value) * 10) / 10}%
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">
                      {Math.round((e2.overall.value - e1.overall.value) * 10) / 10}%
                    </span>
                  )
                ) : (
                  "-"
                )}
              </td>
              <td className="py-4 px-4 text-center font-mono text-navy text-base">
                {target?.overall?.displayValue || "Pending"}
              </td>
              <td className="py-4 px-4 text-center">
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-navy text-white font-mono font-medium">
                  <Sparkles className="w-3 h-3 text-gold" />
                  Official 6-Subj
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Table Footer Note */}
      <div className="p-3.5 sm:p-4 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          * Overall percentage is strictly computed across 6 taken subjects (English + {lang2} + Maths + Science + S.St + IT).
        </p>
        <span className="font-mono text-[11px] text-slate-400">CCIS Class IX Academic Engine</span>
      </div>
    </div>
  );
}
