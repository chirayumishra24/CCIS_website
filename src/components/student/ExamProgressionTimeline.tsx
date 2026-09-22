"use client";
import React, { useMemo } from "react";
import { StudentRecord, EXAM_WEIGHTS, EXAM_ORDER } from "@/lib/academicNormalizer";
import { calculateRequiredScoresPerSubject } from "@/lib/academicCalculations";
import { CheckCircle, Clock, Target, ArrowRight, TrendingUp, TrendingDown, Sparkles } from "lucide-react";

interface ExamProgressionTimelineProps {
  student: StudentRecord;
}

export default function ExamProgressionTimeline({ student }: ExamProgressionTimelineProps) {
  const calcResult = useMemo(() => calculateRequiredScoresPerSubject(student), [student]);
  const target = student.schoolTarget;

  const milestones = useMemo(() => {
    const list = EXAM_ORDER.map((examId, idx) => {
      const w = EXAM_WEIGHTS[examId];
      const exam = student.exams?.[examId];
      const isCompleted = exam !== undefined && !exam.isPredicted;
      const overallExamScore = calcResult.overall.examScores.find((es) => es.examId === examId);

      let scoreDisplay = "Pending";
      let badge = "Upcoming";

      if (isCompleted) {
        scoreDisplay = exam?.overall?.displayValue || `${overallExamScore?.rawScore}%`;
        badge = "Completed";
      } else if (overallExamScore?.predictedPct !== null && overallExamScore?.predictedPct !== undefined) {
        scoreDisplay = `~${overallExamScore.predictedPct}%`;
        badge = idx === 1 ? "Next Exam" : "Predicted";
      }

      return {
        id: examId,
        title: `${w.shortLabel} (${w.label})`,
        subtitle: `Weight: ${Math.round(w.weight * 100)}% • Max: ${w.maxMarks}`,
        score: scoreDisplay,
        badge,
        isCompleted,
        isPredicted: !isCompleted && overallExamScore?.predictedPct !== null,
      };
    });

    // Append target milestone
    list.push({
      id: "target",
      title: "School Benchmark Target",
      subtitle: "Institutional Target Goal",
      score: target?.overall?.displayValue && target.overall.displayValue !== "Not Assigned"
        ? target.overall.displayValue
        : "Target Pending",
      badge: "Goal",
      isCompleted: false,
      isPredicted: false,
    });

    return list;
  }, [student, calcResult, target]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-navy font-serif">
            Academic Assessment Timeline
          </h3>
          <p className="text-xs text-slate-500">
            Longitudinal progression across 4 assessment terms toward institutional target
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 relative">
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              m.isCompleted
                ? "bg-slate-50/70 border-slate-200"
                : m.id === "target"
                ? "bg-amber-50/40 border-amber-300 shadow-2xs"
                : "bg-slate-50/30 border-dashed border-slate-200"
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Step 0{idx + 1}
                </span>
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                    m.id === "target"
                      ? "bg-amber-500 text-white font-bold"
                      : m.isCompleted
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : m.badge === "Next Exam"
                      ? "bg-blue-50 text-blue-700 border border-blue-200 font-bold"
                      : "bg-violet-50 text-violet-600 border border-violet-200"
                  }`}
                >
                  {m.badge}
                </span>
              </div>

              <h4 className="text-xs font-bold text-navy mb-0.5 leading-snug">{m.title}</h4>
              <p className="text-[10px] text-slate-400 mb-2">{m.subtitle}</p>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {m.isCompleted ? "Score:" : m.id === "target" ? "Target:" : "Need:"}
              </span>
              <span className={`text-sm font-mono font-bold ${
                m.id === "target"
                  ? "text-amber-700"
                  : m.isCompleted
                  ? "text-navy"
                  : "text-violet-600 border-b border-dashed border-violet-300"
              }`}>
                {m.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
