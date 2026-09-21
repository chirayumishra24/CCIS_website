"use client";
import React, { useState, useMemo } from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
import { TrendingUp, Target, CheckCircle2, ArrowUpRight, ArrowDownRight, Layers } from "lucide-react";

interface ExamProgressionLineGraphProps {
  student: StudentRecord;
}

interface DataPoint {
  id: string;
  label: string;
  shortLabel: string;
  score: number | null;
  displayValue: string;
  isCompleted: boolean;
  maxMarks: number;
}

export default function ExamProgressionLineGraph({ student }: ExamProgressionLineGraphProps) {
  const [activeSubject, setActiveSubject] = useState<string>("overall"); // "overall" | subject id

  const e1 = useMemo(() => {
    return (
      student.exams?.["exam-1"] || {
        overall: student.currentPerformance.overall,
        subjectList: student.currentPerformance.subjectList,
      }
    );
  }, [student]);

  const e2 = student.exams?.["exam-2"];
  const targetVal = student.schoolTarget.overall.value || null;

  // Available subjects for toggle
  const availableSubjects = useMemo(() => {
    const list = [{ id: "overall", label: "Overall Aggregate" }];
    const subjects = student.currentPerformance.subjectList || [];
    subjects.forEach((s) => {
      list.push({ id: s.id, label: s.label });
    });
    return list;
  }, [student]);

  // Extract points along the 6 milestone exams: Exam-1, Exam-2, Exam-3, Exam-4, Exam-5, Target
  const points: DataPoint[] = useMemo(() => {
    if (activeSubject === "overall") {
      const e1Score = e1.overall.value ?? null;
      const e2Score = e2?.overall.value ?? null;

      return [
        {
          id: "exam-1",
          label: "Exam-1",
          shortLabel: "E1 (Baseline)",
          score: e1Score,
          displayValue: e1.overall.displayValue || (e1Score ? `${e1Score}%` : "-"),
          isCompleted: e1Score !== null,
          maxMarks: 100,
        },
        {
          id: "exam-2",
          label: "Exam-2",
          shortLabel: "E2 (Mid Term)",
          score: e2Score,
          displayValue: e2?.overall.displayValue || (e2Score ? `${e2Score}%` : "-"),
          isCompleted: e2Score !== null,
          maxMarks: 20,
        },
        {
          id: "exam-3",
          label: "Exam-3",
          shortLabel: "E3 (PT-2)",
          score: null,
          displayValue: "Pending",
          isCompleted: false,
          maxMarks: 100,
        },
        {
          id: "exam-4",
          label: "Exam-4",
          shortLabel: "E4 (Pre-Board)",
          score: null,
          displayValue: "Pending",
          isCompleted: false,
          maxMarks: 100,
        },
        {
          id: "exam-5",
          label: "Exam-5",
          shortLabel: "E5 (Final Term)",
          score: null,
          displayValue: "Pending",
          isCompleted: false,
          maxMarks: 100,
        },
        {
          id: "target",
          label: "Target",
          shortLabel: "Target Benchmark",
          score: targetVal,
          displayValue: student.schoolTarget.overall.displayValue || (targetVal ? `${targetVal}%` : "-"),
          isCompleted: false,
          maxMarks: 100,
        },
      ];
    } else {
      // Individual subject trajectory
      const sub1 = student.currentPerformance.subjectList.find((s) => s.id === activeSubject);
      const sub2 = e2?.subjectList?.find((s) => s.id === activeSubject);

      const val1: number | null = sub1?.normalized.value ?? null;
      let val2: number | null = sub2?.normalized.value ?? null;
      // Convert Exam-2 /20 marks into percentage if scored out of 20
      if (val2 !== null && sub2?.normalized.unit === "marks") {
        val2 = Math.round((val2 / 20) * 1000) / 10;
      }

      return [
        {
          id: "exam-1",
          label: "Exam-1",
          shortLabel: "E1 (Baseline)",
          score: val1,
          displayValue: sub1?.normalized.displayValue || "-",
          isCompleted: val1 !== null,
          maxMarks: 100,
        },
        {
          id: "exam-2",
          label: "Exam-2",
          shortLabel: "E2 (Mid Term)",
          score: val2,
          displayValue: sub2?.normalized.displayValue || (val2 ? `${val2}%` : "-"),
          isCompleted: val2 !== null,
          maxMarks: 20,
        },
        {
          id: "exam-3",
          label: "Exam-3",
          shortLabel: "E3 (PT-2)",
          score: null,
          displayValue: "Pending",
          isCompleted: false,
          maxMarks: 100,
        },
        {
          id: "exam-4",
          label: "Exam-4",
          shortLabel: "E4 (Pre-Board)",
          score: null,
          displayValue: "Pending",
          isCompleted: false,
          maxMarks: 100,
        },
        {
          id: "exam-5",
          label: "Exam-5",
          shortLabel: "E5 (Final Term)",
          score: null,
          displayValue: "Pending",
          isCompleted: false,
          maxMarks: 100,
        },
        {
          id: "target",
          label: "Target",
          shortLabel: "Target Benchmark",
          score: targetVal,
          displayValue: targetVal ? `${targetVal}%` : "-",
          isCompleted: false,
          maxMarks: 100,
        },
      ];
    }
  }, [activeSubject, e1, e2, targetVal, student]);

  // SVG dimensions
  const svgWidth = 760;
  const svgHeight = 260;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 30;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const yMin = 30;
  const yMax = 100;

  const getY = (val: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, val));
    const normalized = (clamped - yMin) / (yMax - yMin);
    return paddingTop + chartHeight * (1 - normalized);
  };

  const getX = (index: number) => {
    const step = chartWidth / (points.length - 1);
    return paddingLeft + index * step;
  };

  // Completed recorded points for actual trend line
  const completedPoints = points
    .map((p, idx) => ({ ...p, idx, x: getX(idx), y: p.score !== null ? getY(p.score) : null }))
    .filter((p) => p.isCompleted && p.y !== null);

  // Generate path string for completed points
  let actualPath = "";
  let areaPath = "";
  if (completedPoints.length > 0) {
    actualPath = `M ${completedPoints[0].x} ${completedPoints[0].y}`;
    for (let i = 1; i < completedPoints.length; i++) {
      const prev = completedPoints[i - 1];
      const curr = completedPoints[i];
      const cx1 = prev.x + (curr.x - prev.x) / 2;
      const cy1 = prev.y!;
      const cx2 = prev.x + (curr.x - prev.x) / 2;
      const cy2 = curr.y!;
      actualPath += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
    }

    const last = completedPoints[completedPoints.length - 1];
    const first = completedPoints[0];
    const baseY = getY(yMin);
    areaPath = `${actualPath} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
  }

  // Projected line from latest completed exam to Target
  let projectedPath = "";
  if (completedPoints.length > 0 && targetVal !== null) {
    const lastCompleted = completedPoints[completedPoints.length - 1];
    const targetPoint = {
      x: getX(points.length - 1),
      y: getY(targetVal),
    };
    projectedPath = `M ${lastCompleted.x} ${lastCompleted.y} L ${targetPoint.x} ${targetPoint.y}`;
  }

  // Delta between latest recorded exams
  const e1Score = points[0].score;
  const e2Score = points[1].score;
  const delta = e1Score !== null && e2Score !== null ? Math.round((e2Score - e1Score) * 10) / 10 : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center text-navy">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-navy font-serif">
                Exam Progression & Trajectory Line Graph
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Longitudinal performance curve from Baseline through Target Benchmark
              </p>
            </div>
          </div>
        </div>

        {/* Subject Filter Dropdown / Pills */}
        <div className="flex items-center gap-2">
          <label htmlFor="subject-select" className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Metric:</span>
          </label>
          <select
            id="subject-select"
            value={activeSubject}
            onChange={(e) => setActiveSubject(e.target.value)}
            className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 cursor-pointer"
          >
            {availableSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Baseline (Exam-1)
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-navy mt-0.5 block">
            {points[0].displayValue}
          </span>
        </div>

        <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-100">
          <span className="text-[11px] font-mono text-blue-700 uppercase tracking-wider block">
            Latest (Exam-2)
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-blue-900 mt-0.5 block">
            {points[1].displayValue}
          </span>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            Progress Delta
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            {delta !== null ? (
              delta >= 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  <span className="text-base sm:text-lg font-bold font-mono text-emerald-700">
                    +{delta}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                  <span className="text-base sm:text-lg font-bold font-mono text-rose-700">
                    {delta}%
                  </span>
                </>
              )
            ) : (
              <span className="text-base sm:text-lg font-bold font-mono text-slate-400">-</span>
            )}
          </div>
        </div>

        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
          <span className="text-[11px] font-mono text-amber-700 uppercase tracking-wider block">
            Target Goal
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-900 mt-0.5 block">
            {targetVal ? `${targetVal}%` : "Not Assigned"}
          </span>
        </div>
      </div>

      {/* SVG Line Graph View */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[620px]">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Gradient for area fill under actual line */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
              </linearGradient>

              {/* Shadow filter for node points */}
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Horizontal Grid lines & Y-Axis Labels */}
            {[40, 60, 80, 100].map((level) => {
              const y = getY(level);
              return (
                <g key={level}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={svgWidth - paddingRight}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={level === 100 ? "none" : "3 3"}
                    strokeWidth={1}
                  />
                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-slate-400 font-medium"
                  >
                    {level}%
                  </text>
                </g>
              );
            })}

            {/* Target Goal Horizontal Line */}
            {targetVal !== null && (
              <g>
                <line
                  x1={paddingLeft}
                  y1={getY(targetVal)}
                  x2={svgWidth - paddingRight}
                  y2={getY(targetVal)}
                  stroke="#d97706"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                />
                <rect
                  x={svgWidth - paddingRight - 85}
                  y={getY(targetVal) - 10}
                  width="85"
                  height="18"
                  rx="4"
                  fill="#fef3c7"
                  stroke="#fde68a"
                />
                <text
                  x={svgWidth - paddingRight - 42}
                  y={getY(targetVal) + 3}
                  textAnchor="middle"
                  className="text-[9px] font-bold font-mono fill-amber-800"
                >
                  TARGET: {targetVal}%
                </text>
              </g>
            )}

            {/* Projected dotted trajectory from latest recorded exam to Target */}
            {projectedPath && (
              <path
                d={projectedPath}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}

            {/* Area fill under recorded line */}
            {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

            {/* Actual Recorded Continuous Curve */}
            {actualPath && (
              <path
                d={actualPath}
                fill="none"
                stroke="#1e3a8a"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Milestone Node Points & Labels */}
            {points.map((p, idx) => {
              const x = getX(idx);
              const y = p.score !== null ? getY(p.score) : getY(50);
              const isRecorded = p.isCompleted && p.score !== null;
              const isTargetPoint = p.id === "target";

              return (
                <g key={p.id} className="cursor-pointer group">
                  {/* Vertical Guideline */}
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={svgHeight - paddingBottom}
                    stroke="#f1f5f9"
                    strokeWidth={1}
                  />

                  {/* Node Circle */}
                  {isRecorded ? (
                    <g filter="url(#shadow)">
                      {/* Outer pulse ring for latest completed exam */}
                      {idx === completedPoints.length - 1 && (
                        <circle
                          cx={x}
                          cy={y}
                          r={10}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          opacity={0.6}
                          className="animate-ping origin-center"
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={6}
                        fill="#ffffff"
                        stroke="#1e3a8a"
                        strokeWidth={3}
                      />
                      <circle cx={x} cy={y} r={2.5} fill="#1e3a8a" />

                      {/* Score Value Pill above Node */}
                      <g transform={`translate(${x}, ${y - 12})`}>
                        <rect
                          x="-22"
                          y="-16"
                          width="44"
                          height="18"
                          rx="9"
                          fill="#0f172a"
                        />
                        <text
                          x="0"
                          y="-3.5"
                          textAnchor="middle"
                          className="text-[10px] font-mono font-bold fill-white"
                        >
                          {p.displayValue}
                        </text>
                      </g>
                    </g>
                  ) : isTargetPoint && targetVal !== null ? (
                    /* Target Goal Node */
                    <g filter="url(#shadow)">
                      <circle
                        cx={x}
                        cy={getY(targetVal)}
                        r={6}
                        fill="#fef3c7"
                        stroke="#d97706"
                        strokeWidth={2.5}
                      />
                      <circle cx={x} cy={getY(targetVal)} r={2.5} fill="#b45309" />
                      <g transform={`translate(${x}, ${getY(targetVal) - 12})`}>
                        <rect
                          x="-22"
                          y="-16"
                          width="44"
                          height="18"
                          rx="9"
                          fill="#d97706"
                        />
                        <text
                          x="0"
                          y="-3.5"
                          textAnchor="middle"
                          className="text-[10px] font-mono font-bold fill-white"
                        >
                          {targetVal}%
                        </text>
                      </g>
                    </g>
                  ) : (
                    /* Upcoming Empty Node */
                    <g>
                      <circle
                        cx={x}
                        cy={y}
                        r={5}
                        fill="#ffffff"
                        stroke="#cbd5e1"
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                      />
                      <text
                        x={x}
                        y={y - 8}
                        textAnchor="middle"
                        className="text-[9px] font-mono fill-slate-400"
                      >
                        Pending
                      </text>
                    </g>
                  )}

                  {/* X-Axis Label */}
                  <g transform={`translate(${x}, ${svgHeight - paddingBottom + 16})`}>
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      className={`text-[11px] font-semibold ${
                        isRecorded ? "fill-navy font-mono" : isTargetPoint ? "fill-amber-700 font-mono" : "fill-slate-400 font-mono"
                      }`}
                    >
                      {p.label}
                    </text>
                    <text
                      x={0}
                      y={13}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-400 font-sans"
                    >
                      {idx === 0 ? "Baseline" : idx === 1 ? "Mid Term" : idx === 5 ? "Target" : "Upcoming"}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend & Note Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-4 h-1 bg-navy rounded-full" />
            Recorded Progress
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-slate-400" />
            Projected Trajectory
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-amber-500" />
            Target Benchmark
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Strict 6-subject calculation enforced</span>
        </div>
      </div>
    </div>
  );
}
