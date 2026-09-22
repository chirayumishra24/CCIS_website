"use client";
import React, { useMemo } from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
import {
  calculateRequiredScoresPerSubject,
  SubjectRequiredScore,
  RequiredScoreStatusTag,
} from "@/lib/academicCalculations";
import { Target } from "lucide-react";

interface TargetScoreTableProps {
  student: StudentRecord;
}

const STATUS_CONFIG: Record<
  RequiredScoreStatusTag,
  { label: string; emoji: string; color: string; barColor: string; bgColor: string }
> = {
  ACHIEVED:          { label: "Met",    emoji: "🎉", color: "text-emerald-600", barColor: "bg-emerald-500", bgColor: "bg-emerald-50" },
  ON_TRACK:          { label: "On Track", emoji: "✅", color: "text-blue-600",    barColor: "bg-blue-500",    bgColor: "bg-blue-50" },
  NEEDS_FOCUS:       { label: "Effort",   emoji: "⚡", color: "text-amber-600",   barColor: "bg-amber-500",   bgColor: "bg-amber-50" },
  NOT_REACHABLE:     { label: "Tough",    emoji: "🔴", color: "text-rose-600",    barColor: "bg-rose-500",    bgColor: "bg-rose-50" },
  EXEMPT:            { label: "N/A",      emoji: "➖", color: "text-slate-400",   barColor: "bg-slate-200",   bgColor: "bg-slate-50" },
  INSUFFICIENT_DATA: { label: "Pending",  emoji: "⏳", color: "text-slate-400",   barColor: "bg-slate-200",   bgColor: "bg-slate-50" },
};

function getProgressPercent(subj: SubjectRequiredScore): number {
  if (!subj.targetScore || subj.targetScore === 0) return 0;
  if (subj.completedWeight === 0) return 0;
  const currentAvg = subj.weightedContribution / subj.completedWeight;
  return Math.min(100, Math.round((currentAvg / subj.targetScore) * 100));
}

function getCurrentAvg(subj: SubjectRequiredScore): number | null {
  if (subj.completedWeight === 0) return null;
  return Math.round((subj.weightedContribution / subj.completedWeight) * 10) / 10;
}

export default function TargetScoreTable({ student }: TargetScoreTableProps) {
  const result = useMemo(() => calculateRequiredScoresPerSubject(student), [student]);
  const { subjects, overall, completedExams } = result;
  const visibleSubjects = subjects.filter((s) => s.status !== "EXEMPT");

  return (
    <div className="space-y-3">
      {/* Overall Hero */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-4 sm:px-5 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Left: target info */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider leading-none mb-0.5">
                Overall Target: <span className="font-bold text-navy">{overall.targetDisplayValue}</span>
              </p>
              {overall.requiredInRemaining !== null && overall.requiredInRemaining > 0 ? (
                <p className="text-xs text-slate-600">
                  Need <span className={`font-bold text-sm ${
                    overall.requiredInRemaining <= 60 ? "text-blue-600"
                    : overall.requiredInRemaining <= 80 ? "text-amber-600"
                    : "text-rose-600"
                  }`}>{Math.round(overall.requiredInRemaining)}%</span> avg in remaining exams
                </p>
              ) : overall.status === "ACHIEVED" ? (
                <p className="text-xs text-emerald-600 font-medium">🎉 Target on track!</p>
              ) : (
                <p className="text-xs text-slate-400">Calculating…</p>
              )}
            </div>
          </div>

          {/* Right: exam progress dots */}
          <div className="flex items-center gap-1.5">
            {["E1", "E2", "E3", "E4", "E5"].map((label, i) => {
              const done = i < completedExams.length;
              return (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                    done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {done ? "✓" : label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visibleSubjects.map((subj) => {
          const cfg = STATUS_CONFIG[subj.status];
          const progress = getProgressPercent(subj);
          const currentAvg = getCurrentAvg(subj);
          const isAchieved = subj.status === "ACHIEVED";

          return (
            <div
              key={subj.subjectKey}
              className={`rounded-xl border overflow-hidden transition-all hover:shadow-sm ${
                isAchieved ? "border-emerald-200 bg-emerald-50/20"
                : subj.status === "NOT_REACHABLE" ? "border-rose-200 bg-rose-50/10"
                : "border-slate-200 bg-white"
              }`}
            >
              {/* Subject header */}
              <div className="px-3 py-2 border-b border-slate-100/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] font-bold px-1.5 py-px rounded bg-slate-100 text-navy border border-slate-200">
                    {subj.subjectCode}
                  </span>
                  <span className="font-semibold text-[11px] text-slate-700 truncate">{subj.subjectLabel}</span>
                </div>
                <span className="text-xs leading-none" title={cfg.label}>{cfg.emoji}</span>
              </div>

              <div className="px-3 py-3">
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1">
                    <span>Progress</span>
                    <span className="font-mono font-bold">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>

                {/* 3 numbers */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-slate-50/80 rounded-lg py-1.5 px-1">
                    <div className="text-[8px] text-slate-400 font-medium leading-none mb-0.5">Scored</div>
                    <div className="text-sm font-bold text-slate-800 font-mono leading-tight">
                      {currentAvg !== null ? `${currentAvg}%` : "—"}
                    </div>
                  </div>
                  <div className="bg-slate-50/80 rounded-lg py-1.5 px-1">
                    <div className="text-[8px] text-slate-400 font-medium leading-none mb-0.5">Target</div>
                    <div className="text-sm font-bold text-navy font-mono leading-tight">
                      {subj.targetDisplayValue}
                    </div>
                  </div>
                  <div className={`rounded-lg py-1.5 px-1 ${cfg.bgColor}`}>
                    <div className={`text-[8px] font-medium leading-none mb-0.5 ${cfg.color} opacity-70`}>Need</div>
                    <div className={`text-sm font-bold font-mono leading-tight ${cfg.color}`}>
                      {subj.requiredInRemaining !== null
                        ? subj.requiredInRemaining <= 0 ? "✓" : `${Math.round(subj.requiredInRemaining)}%`
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <p className={`mt-2 text-center text-[10px] font-medium leading-tight ${cfg.color}`}>
                  {isAchieved ? "On track — keep it up!"
                  : subj.status === "ON_TRACK" ? "Consistent effort will get you there."
                  : subj.status === "NEEDS_FOCUS" ? "Push harder — still achievable."
                  : subj.status === "NOT_REACHABLE" ? "Focus on improvement."
                  : "More data needed."}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-center text-[9px] text-slate-400 font-mono">
        {completedExams.length}/5 exams done • Absent = 0 • PT-1 10% · Mid 20% · PT-2 10% · Pre-Board 20% · Final 40%
      </p>
    </div>
  );
}
