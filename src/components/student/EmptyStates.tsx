"use client";
import React, { useMemo } from "react";
import { LineChart, CalendarClock, Info, Target, ArrowRight, CheckCircle2, AlertTriangle, TrendingDown } from "lucide-react";
import { StudentRecord } from "@/lib/academicNormalizer";
import { calculateRequiredScoresPerSubject } from "@/lib/academicCalculations";

export function PerformanceTrendEmptyState() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <LineChart className="w-5 h-5 text-navy" />
            Performance Trend Over Time
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Longitudinal progression across academic terms
          </p>
        </div>
      </div>

      <div className="py-8 px-4 text-center rounded-lg bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-navy mb-3">
          <LineChart className="w-6 h-6 text-navy/70" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-navy font-serif">
          Performance Trend Pending Additional Assessments
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          Historical trend curves and longitudinal progress analysis will appear automatically once multiple term assessment cycles are recorded in the academic database.
        </p>
      </div>
    </div>
  );
}

export function UpcomingExamsEmptyState() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-navy" />
            Upcoming Exam Targets & Requirements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            &ldquo;How much do I need to score?&rdquo; required score calculator
          </p>
        </div>
      </div>

      <div className="py-8 px-4 text-center rounded-lg bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-navy mb-3">
          <CalendarClock className="w-6 h-6 text-navy/70" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-navy font-serif">
          Exam Schedule & Target Calculator
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          Upcoming exam targets and weighted score requirements will activate once the examination datesheet and term weightage distribution are published by the examination cell.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50/80 text-navy border border-blue-100">
          <Info className="w-3.5 h-3.5" />
          <span>Formulas validated & ready for Term assessment deployment</span>
        </div>
      </div>
    </div>
  );
}

interface TargetSummaryCardProps {
  student: StudentRecord;
  onNavigate: () => void;
}

export function TargetSummaryCard({ student, onNavigate }: TargetSummaryCardProps) {
  const result = useMemo(() => calculateRequiredScoresPerSubject(student), [student]);

  const { overall, subjects } = result;
  const hasTarget = overall.targetScore !== null;
  const needsFocus = subjects.filter((s) => s.status === "NEEDS_FOCUS" || s.status === "NOT_REACHABLE");

  if (!hasTarget) {
    return <UpcomingExamsEmptyState />;
  }

  const overallReq = overall.requiredInRemaining;
  const statusColor =
    overall.status === "ACHIEVED"
      ? "text-emerald-600"
      : overall.status === "ON_TRACK"
      ? "text-navy"
      : overall.status === "NEEDS_FOCUS"
      ? "text-amber-600"
      : "text-rose-600";

  const StatusIcon =
    overall.status === "ACHIEVED"
      ? CheckCircle2
      : overall.status === "ON_TRACK"
      ? Target
      : overall.status === "NEEDS_FOCUS"
      ? AlertTriangle
      : TrendingDown;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              Target Calculator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Required score in upcoming exams
            </p>
          </div>
        </div>

        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <StatusIcon className={`w-6 h-6 ${statusColor}`} />
            <span className={`text-4xl font-extrabold font-serif tracking-tight ${statusColor}`}>
              {overallReq !== null
                ? overallReq <= 0
                  ? "Met ✓"
                  : `${overallReq}%`
                : "N/A"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {overallReq !== null && overallReq > 0
              ? `Required average in remaining exams to hit ${overall.targetDisplayValue} target`
              : overall.status === "ACHIEVED"
              ? "Overall target has been achieved!"
              : "Insufficient data for calculation"}
          </p>
        </div>

        {/* Quick subject alerts */}
        {needsFocus.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {needsFocus.slice(0, 3).map((s) => (
              <div
                key={s.subjectKey}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-amber-50/60 border border-amber-100 text-xs"
              >
                <span className="font-semibold text-amber-800">{s.subjectCode} — {s.subjectLabel}</span>
                <span className={`font-mono font-bold ${
                  s.status === "NOT_REACHABLE" ? "text-rose-600" : "text-amber-700"
                }`}>
                  {s.requiredInRemaining !== null ? `${s.requiredInRemaining}%` : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNavigate}
        className="mt-4 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2"
      >
        <span>View Full Breakdown</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
