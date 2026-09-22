"use client";
import React, { useState, useMemo } from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
import {
  calculateRequiredScoresPerSubject,
  compareActualVsPredicted,
  SubjectRequiredScore,
  RequiredScoreStatusTag,
  AchievementDetail,
} from "@/lib/academicCalculations";
import { Target, Table as TableIcon, LayoutGrid, CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";

interface TargetScoreTableProps {
  student: StudentRecord;
}

const STATUS_CONFIG: Record<
  RequiredScoreStatusTag,
  { label: string; badgeClass: string; rowBg: string; textClass: string; barColor: string }
> = {
  ACHIEVED: {
    label: "Target Met",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rowBg: "bg-emerald-50/20",
    textClass: "text-emerald-700",
    barColor: "bg-emerald-500",
  },
  ON_TRACK: {
    label: "On Track",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    rowBg: "",
    textClass: "text-blue-700",
    barColor: "bg-blue-500",
  },
  NEEDS_FOCUS: {
    label: "Effort Needed",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    rowBg: "bg-amber-50/15",
    textClass: "text-amber-700",
    barColor: "bg-amber-500",
  },
  AT_RISK: {
    label: "At Risk",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    rowBg: "bg-orange-50/20",
    textClass: "text-orange-700",
    barColor: "bg-orange-500",
  },
  NOT_REACHABLE: {
    label: "Challenging",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    rowBg: "bg-rose-50/20",
    textClass: "text-rose-700",
    barColor: "bg-rose-500",
  },
  EXEMPT: {
    label: "Exempt",
    badgeClass: "bg-slate-100 text-slate-500 border-slate-200",
    rowBg: "bg-slate-50/50 opacity-60",
    textClass: "text-slate-400",
    barColor: "bg-slate-200",
  },
  INSUFFICIENT_DATA: {
    label: "Pending",
    badgeClass: "bg-slate-100 text-slate-500 border-slate-200",
    rowBg: "",
    textClass: "text-slate-400",
    barColor: "bg-slate-200",
  },
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
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const result = useMemo(() => calculateRequiredScoresPerSubject(student), [student]);
  const { subjects, overall, completedExams, pendingExams } = result;
  const visibleSubjects = subjects.filter((s) => s.status !== "EXEMPT");

  const overallProgress = getProgressPercent(overall);
  const overallAvg = getCurrentAvg(overall);
  const remainingWeightPct = Math.round(overall.remainingWeight * 100);

  // Achievement comparison data
  const achievementData = useMemo(() => compareActualVsPredicted(student), [student]);

  // Helper to get the latest achievement detail for a subject
  const getSubjectAchievement = (subjectKey: string): AchievementDetail | null => {
    const details = achievementData.filter((d) => d.subjectKey === subjectKey);
    if (details.length === 0) return null;
    // Return the most recent completed exam's detail
    return details[details.length - 1];
  };

  return (
    <div className="space-y-4">
      {/* Executive Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Overall Target & Required Prediction */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400">
                  Target Score Predictor
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                  {completedExams.length}/4 Exams Evaluated
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-xs text-slate-500">School Target:</span>
                <span className="text-sm font-bold text-navy font-mono">
                  {overall.targetDisplayValue}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">Scored So Far:</span>
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {overallAvg !== null ? `${overallAvg}%` : "—"}
                </span>
              </div>
              {overall.requiredInRemaining !== null && overall.requiredInRemaining > 0 ? (
                <p className="text-xs text-slate-600 mt-1">
                  Required in remaining {pendingExams.length} exams ({remainingWeightPct}% weight):{" "}
                  <strong className={`font-mono text-sm ${
                    overall.requiredInRemaining <= 65 ? "text-blue-600"
                    : overall.requiredInRemaining <= 85 ? "text-amber-600"
                    : "text-rose-600"
                  }`}>
                    {Math.round(overall.requiredInRemaining)}% avg
                  </strong>
                </p>
              ) : overall.status === "ACHIEVED" ? (
                <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Target benchmark is on track! Maintain consistency in remaining terms.
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-1">Calculating required scores…</p>
              )}
            </div>
          </div>

          {/* Right: Milestone Checkpoints + View Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Exam Milestones */}
            <div className="flex items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              {[
                { label: "PT-1", w: "10% (/20)" },
                { label: "Mid", w: "30% (/80)" },
                { label: "PT-2", w: "10% (/20)" },
                { label: "Final", w: "50% (/80)" },
              ].map((m, i, arr) => {
                const done = i < completedExams.length;
                return (
                  <React.Fragment key={m.label}>
                    <div className="flex flex-col items-center min-w-[48px]">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                        done
                          ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}>
                        {done ? "✓" : i + 1}
                      </span>
                      <span className={`text-[10px] font-semibold mt-1 leading-none ${done ? "text-emerald-600" : "text-slate-500"}`}>
                        {m.label}
                      </span>
                      <span className="text-[8px] font-mono text-slate-400 mt-0.5 whitespace-nowrap">{m.w}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`w-5 h-px mx-0.5 mt-[-14px] ${done && i + 1 < completedExams.length ? "bg-emerald-400" : "bg-slate-200"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-500 hover:text-navy"
                }`}
                title="Structured Table View"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-navy shadow-xs"
                    : "text-slate-500 hover:text-navy"
                }`}
                title="Visual Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode: Structured Table */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-navy font-serif">
                Per-Subject Target & Score Requirement Matrix
              </h3>
              <p className="text-[11px] text-slate-500">
                Formula: [Target - (PT-1 × 10%)] ÷ Remaining Weight ({remainingWeightPct}%)
              </p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
              CBSE 4-Exam Weighted Model
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-navy uppercase tracking-wider font-mono">
                  <th className="py-2.5 px-3 sm:px-4">Subject</th>
                  <th className="py-2.5 px-2 text-center">PT-1 (10% • /20)</th>
                  <th className="py-2.5 px-2 text-center text-violet-700">Mid Term (30% • /80)</th>
                  <th className="py-2.5 px-2 text-center text-violet-700">PT-2 (10% • /20)</th>
                  <th className="py-2.5 px-2 text-center text-violet-700">Final (50% • /80)</th>
                  <th className="py-2.5 px-2 text-center">Target Goal</th>
                  <th className="py-2.5 px-2 text-center bg-amber-50/50 border-x border-amber-200/50 text-amber-900 font-bold">
                    Need in Rem ({remainingWeightPct}%)
                  </th>
                  <th className="py-2.5 px-2 text-center">Status</th>
                  <th className="py-2.5 px-2 text-center bg-emerald-50/40 border-l border-emerald-200/50 text-emerald-900 font-bold">
                    Target Achieved
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleSubjects.map((subj) => {
                  const cfg = STATUS_CONFIG[subj.status];
                  const isOptional = subj.subjectKey === "secondLanguage";
                  const pt1 = subj.examScores[0];
                  const mid = subj.examScores[1];
                  const pt2 = subj.examScores[2];
                  const finalExam = subj.examScores[3];

                  return (
                    <tr
                      key={subj.subjectKey}
                      className={`hover:bg-slate-50/80 transition-colors ${cfg.rowBg}`}
                    >
                      {/* Subject Name */}
                      <td className="py-2.5 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-navy border border-slate-200">
                            {subj.subjectCode}
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800">{subj.subjectLabel}</span>
                            {isOptional && (
                              <span className="ml-1.5 text-[9px] text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100 font-medium">
                                2nd Lang
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* PT-1 Score (Actual /20) */}
                      <td className="py-2.5 px-2 text-center font-mono text-slate-700">
                        {pt1?.rawScore !== null && pt1?.rawScore !== undefined ? (
                          <div className="flex flex-col items-center">
                            <span className="font-bold">{pt1.rawScore}/20</span>
                            <span className="text-[10px] text-slate-400">({pt1.normalizedPct}%)</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Mid Term Score (Predicted /80) */}
                      <td className="py-2.5 px-2 text-center font-mono">
                        {mid?.isCompleted && mid?.rawScore !== null ? (
                          <div className="flex flex-col items-center text-slate-700">
                            <span className="font-bold">{mid.rawScore}/80</span>
                            <span className="text-[10px] text-slate-400">({mid.normalizedPct}%)</span>
                          </div>
                        ) : mid?.predictedRawMarks !== null ? (
                          <div className="flex flex-col items-center text-violet-700">
                            <span className="font-bold border-b border-dashed border-violet-300">
                              ~{mid.predictedRawMarks}/80
                            </span>
                            <span className="text-[10px] text-violet-400">({mid.predictedPct}%)</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* PT-2 Score (Predicted /20) */}
                      <td className="py-2.5 px-2 text-center font-mono">
                        {pt2?.isCompleted && pt2?.rawScore !== null ? (
                          <div className="flex flex-col items-center text-slate-700">
                            <span className="font-bold">{pt2.rawScore}/20</span>
                            <span className="text-[10px] text-slate-400">({pt2.normalizedPct}%)</span>
                          </div>
                        ) : pt2?.predictedRawMarks !== null ? (
                          <div className="flex flex-col items-center text-violet-700">
                            <span className="font-bold border-b border-dashed border-violet-300">
                              ~{pt2.predictedRawMarks}/20
                            </span>
                            <span className="text-[10px] text-violet-400">({pt2.predictedPct}%)</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Final Exam Score (Predicted /80) */}
                      <td className="py-2.5 px-2 text-center font-mono">
                        {finalExam?.isCompleted && finalExam?.rawScore !== null ? (
                          <div className="flex flex-col items-center text-slate-700">
                            <span className="font-bold">{finalExam.rawScore}/80</span>
                            <span className="text-[10px] text-slate-400">({finalExam.normalizedPct}%)</span>
                          </div>
                        ) : finalExam?.predictedRawMarks !== null ? (
                          <div className="flex flex-col items-center text-violet-700">
                            <span className="font-bold border-b border-dashed border-violet-300">
                              ~{finalExam.predictedRawMarks}/80
                            </span>
                            <span className="text-[10px] text-violet-400">({finalExam.predictedPct}%)</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Target Goal */}
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-navy">
                        {subj.targetDisplayValue}
                      </td>

                      {/* Required in Remaining Exams (Hero Column) */}
                      <td className="py-2.5 px-2 text-center bg-amber-50/30 border-x border-amber-200/50">
                        {subj.requiredInRemaining !== null ? (
                          subj.requiredInRemaining <= 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                              ✓ Goal Met
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-0.5 font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                              subj.requiredInRemaining <= 65
                                ? "bg-blue-100 text-blue-800"
                                : subj.requiredInRemaining <= 85
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}>
                              <ArrowUpRight className="w-3 h-3" />
                              {Math.round(subj.requiredInRemaining)}% avg
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400 font-mono">—</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-2.5 px-2 text-center">
                        <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badgeClass}`}>
                          {cfg.label}
                        </span>
                      </td>

                      {/* Target Achieved Column */}
                      <td className="py-2.5 px-2 text-center bg-emerald-50/10 border-l border-emerald-200/30">
                        {(() => {
                          const achievement = getSubjectAchievement(subj.subjectKey);
                          if (!achievement) {
                            return <span className="text-[10px] text-slate-400 font-medium">⏳ Pending</span>;
                          }

                          if (achievement.targetAchieved) {
                            return (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Achieved
                              </span>
                            );
                          }

                          if (achievement.verdict === 'ABOVE') {
                            return (
                              <div className="flex flex-col items-center">
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                  <TrendingUp className="w-3 h-3" />
                                  Above
                                </span>
                                {achievement.delta !== null && (
                                  <span className="text-[9px] text-blue-500 font-mono mt-0.5">+{achievement.delta}%</span>
                                )}
                              </div>
                            );
                          }

                          if (achievement.verdict === 'BELOW') {
                            return (
                              <div className="flex flex-col items-center">
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                  <TrendingDown className="w-3 h-3" />
                                  Below
                                </span>
                                {achievement.delta !== null && (
                                  <span className="text-[9px] text-amber-500 font-mono mt-0.5">{achievement.delta}%</span>
                                )}
                              </div>
                            );
                          }

                          if (achievement.verdict === 'MATCH') {
                            return (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                                ≈ On Track
                              </span>
                            );
                          }

                          return <span className="text-[10px] text-slate-400 font-medium">⏳ Pending</span>;
                        })()}
                      </td>
                    </tr>
                  );
                })}

                {/* Overall Aggregate Row */}
                <tr className="bg-navy/5 border-t-2 border-navy/20 font-bold">
                  <td className="py-3 px-3 sm:px-4">
                    <span className="text-navy font-bold text-xs uppercase font-serif">
                      Overall Aggregate
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-navy font-bold">
                    {overall.examScores[0]?.normalizedPct !== null ? `${overall.examScores[0].normalizedPct}%` : "—"}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-violet-700 font-bold">
                    {overall.examScores[1]?.predictedPct !== null ? `~${overall.examScores[1].predictedPct}%` : "—"}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-violet-700 font-bold">
                    {overall.examScores[2]?.predictedPct !== null ? `~${overall.examScores[2].predictedPct}%` : "—"}
                  </td>
                  <td className="py-3 px-2 text-center font-mono text-violet-700 font-bold">
                    {overall.examScores[3]?.predictedPct !== null ? `~${overall.examScores[3].predictedPct}%` : "—"}
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-bold text-navy">
                    {overall.targetDisplayValue}
                  </td>
                  <td className="py-3 px-2 text-center bg-amber-50/40 border-x border-amber-200/50">
                    {overall.requiredInRemaining !== null ? (
                      <span className="font-mono text-xs font-bold text-amber-900">
                        {Math.round(overall.requiredInRemaining)}% avg
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_CONFIG[overall.status].badgeClass}`}>
                      {STATUS_CONFIG[overall.status].label}
                    </span>
                  </td>
                  {/* Overall Target Achieved */}
                  <td className="py-3 px-2 text-center bg-emerald-50/10 border-l border-emerald-200/30">
                    {overall.status === 'ACHIEVED' ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Achieved
                      </span>
                    ) : overall.status === 'ON_TRACK' ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        On Track
                      </span>
                    ) : overall.status === 'INSUFFICIENT_DATA' ? (
                      <span className="text-[10px] text-slate-400">⏳ Pending</span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        In Progress
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode: Visual Cards */
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
                  isAchieved
                    ? "border-emerald-200 bg-emerald-50/20"
                    : subj.status === "NOT_REACHABLE"
                    ? "border-rose-200 bg-rose-50/10"
                    : "border-slate-200 bg-white"
                }`}
              >
                {/* Subject header */}
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-navy border border-slate-200">
                      {subj.subjectCode}
                    </span>
                    <span className="font-semibold text-xs text-slate-800 truncate">
                      {subj.subjectLabel}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${cfg.badgeClass}`}>
                    {cfg.label}
                  </span>
                </div>

                <div className="p-3">
                  {/* Progress bar */}
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Target Progress</span>
                      <span className="font-mono font-bold text-slate-600">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>

                  {/* 3 Metric Pills: Scored / Target / Need */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="bg-slate-50 rounded-lg py-1.5 px-1 border border-slate-100">
                      <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">
                        Scored
                      </div>
                      <div className="text-xs font-bold text-slate-800 font-mono">
                        {currentAvg !== null ? `${currentAvg}%` : "—"}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg py-1.5 px-1 border border-slate-100">
                      <div className="text-[8px] text-slate-400 font-medium uppercase tracking-wider mb-0.5">
                        Target
                      </div>
                      <div className="text-xs font-bold text-navy font-mono">
                        {subj.targetDisplayValue}
                      </div>
                    </div>

                    <div className={`rounded-lg py-1.5 px-1 border ${
                      subj.requiredInRemaining !== null && subj.requiredInRemaining > 85
                        ? "bg-rose-50 border-rose-100 text-rose-700"
                        : "bg-amber-50 border-amber-100 text-amber-700"
                    }`}>
                      <div className="text-[8px] font-medium uppercase tracking-wider mb-0.5 opacity-75">
                        Need
                      </div>
                      <div className="text-xs font-bold font-mono">
                        {subj.requiredInRemaining !== null
                          ? subj.requiredInRemaining <= 0
                            ? "✓ Met"
                            : `${Math.round(subj.requiredInRemaining)}%`
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Verbal Guidance */}
                  <p className={`mt-2 text-center text-[10px] font-medium leading-tight ${cfg.textClass}`}>
                    {isAchieved
                      ? "Target achieved! Maintain consistency."
                      : subj.status === "ON_TRACK"
                      ? "On track — steady preparation needed."
                      : subj.status === "NEEDS_FOCUS"
                      ? "Push harder in upcoming terms."
                      : subj.status === "NOT_REACHABLE"
                      ? "High focus required to maximize score."
                      : "Awaiting exam records."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Institutional Explanatory Footnote */}
      <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="font-mono">
          CBSE Assessment Structure: PT-1 (10% • max 20) + Mid Term (30% • max 80) + PT-2 (10% • max 20) + Final Exam (50% • max 80) = 100%
        </span>
        <span className="text-slate-400 shrink-0">
          Absent (AB) evaluated as 0 • Optional: {student.secondLanguage || "Hindi/Sanskrit/French"}
        </span>
      </div>
    </div>
  );
}
