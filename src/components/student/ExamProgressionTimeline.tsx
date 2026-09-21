"use client";
import React from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
import { CheckCircle, Clock, Target, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

interface ExamProgressionTimelineProps {
  student: StudentRecord;
}

export default function ExamProgressionTimeline({ student }: ExamProgressionTimelineProps) {
  const e1 = student.exams?.["exam-1"];
  const e2 = student.exams?.["exam-2"];
  const target = student.schoolTarget;

  const milestones = [
    {
      id: "exam-1",
      title: "Exam-1 (Baseline)",
      subtitle: "Diagnostic Entry Assessment",
      score: e1?.overall?.displayValue || "Completed",
      badge: "Completed",
      isCompleted: true,
      color: "bg-navy text-white",
    },
    {
      id: "exam-2",
      title: "Exam-2 (Mid Term)",
      subtitle: "Internal Assessment / 20 Marks",
      score: e2?.overall?.displayValue || (e2?.totalMarksScored ? `${e2.totalMarksScored}` : "Recorded"),
      badge: "Latest Exam",
      isCompleted: true,
      color: "bg-blue-600 text-white",
    },
    {
      id: "exam-3",
      title: "Exam-3 (Periodic Test 2)",
      subtitle: "Upcoming Term Assessment",
      score: "Awaiting Schedule",
      badge: "Upcoming",
      isCompleted: false,
      color: "bg-slate-100 text-slate-500",
    },
    {
      id: "target",
      title: "Final Benchmark Target",
      subtitle: "Institutional Target Goal",
      score: target?.overall?.displayValue && target.overall.displayValue !== "Not Assigned"
        ? target.overall.displayValue
        : "Target Pending",
      badge: "Goal",
      isCompleted: false,
      color: "bg-gold/20 text-navy font-bold border border-gold/40",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-navy font-serif">
            Academic Assessment Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Longitudinal progression across academic terms toward institutional target
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className={`p-4 rounded-xl border transition-all ${
              m.isCompleted
                ? "bg-slate-50/70 border-slate-200"
                : m.id === "target"
                ? "bg-amber-50/40 border-gold/30"
                : "bg-slate-50/30 border-dashed border-slate-200 opacity-75"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                Step 0{idx + 1}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  m.id === "target"
                    ? "bg-gold text-navy font-bold"
                    : m.isCompleted
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {m.badge}
              </span>
            </div>

            <h4 className="text-sm font-bold text-navy mb-0.5">{m.title}</h4>
            <p className="text-[11px] text-slate-400 mb-3">{m.subtitle}</p>

            <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
              <span className="text-xs text-slate-500 font-medium">Score:</span>
              <span className="text-sm font-mono font-bold text-navy">{m.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
