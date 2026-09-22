"use client";
import React, { useMemo, useState } from "react";
import { StudentRecord, EXAM_WEIGHTS, EXAM_ORDER } from "@/lib/academicNormalizer";
import { calculateRequiredScoresPerSubject, compareActualVsPredicted } from "@/lib/academicCalculations";
import { TrendingUp, Layers, Sparkles, Target, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DataPoint {
  id: string;
  label: string;
  shortLabel: string;
  score: number | null;
  displayValue: string;
  isCompleted: boolean;
  isPredicted: boolean;
  maxMarks: number;
  confidence?: string | null;
  predictionDelta?: number | null;  // actual - predicted (positive = beat prediction)
}

interface ExamProgressionLineGraphProps {
  student: StudentRecord;
}

export default function ExamProgressionLineGraph({ student }: ExamProgressionLineGraphProps) {
  const [activeSubject, setActiveSubject] = useState("overall");

  const targetVal: number | null = useMemo(() => {
    const t = student.schoolTarget?.overall;
    if (!t) return null;
    if (t.type === "exact" && t.value !== undefined) return t.value;
    if (t.type === "range" && t.min !== undefined && t.max !== undefined) return (t.min + t.max) / 2;
    return null;
  }, [student]);

  const calcResult = useMemo(() => calculateRequiredScoresPerSubject(student), [student]);
  const achievementData = useMemo(() => compareActualVsPredicted(student), [student]);

  const availableSubjects = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: "overall", label: "Overall Aggregate" }];
    (student.exams?.["exam-1"]?.subjectList || student.currentPerformance.subjectList || []).forEach((s) => {
      list.push({ id: s.id, label: s.label });
    });
    return list;
  }, [student]);

  // Map subject dropdown IDs to subject keys
  const subjectIdToKey: Record<string, string> = {
    eng: "english",
    lang2: "secondLanguage",
    math: "maths",
    sci: "science",
    sst: "socialScience",
    it: "it",
  };

  // Build data points for the 4 exams + target
  const points: DataPoint[] = useMemo(() => {
    const result: DataPoint[] = [];

    for (const examId of EXAM_ORDER) {
      const w = EXAM_WEIGHTS[examId];
      const exam = student.exams?.[examId];
      const isCompleted = exam !== undefined && !exam.isPredicted;

      if (activeSubject === "overall") {
        if (isCompleted && exam) {
          const ov = exam.overall;
          const score = ov?.type === "exact" ? ov.value ?? null : null;
          result.push({
            id: examId,
            label: w.label,
            shortLabel: `${w.shortLabel} (${w.label})`,
            score,
            displayValue: ov?.displayValue || (score !== null ? `${score}%` : "-"),
            isCompleted: score !== null,
            isPredicted: false,
            maxMarks: w.maxMarks,
          });
        } else {
          const overallCalc = calcResult.overall.examScores.find((es) => es.examId === examId);
          const predicted = overallCalc?.predictedPct ?? null;
          result.push({
            id: examId,
            label: w.label,
            shortLabel: `${w.shortLabel} (${w.label})`,
            score: predicted,
            displayValue: predicted !== null ? `~${predicted}%` : "Pending",
            isCompleted: false,
            isPredicted: predicted !== null,
            maxMarks: w.maxMarks,
            confidence: overallCalc?.confidence,
          });
        }
      } else {
        const subjectKey = subjectIdToKey[activeSubject] || activeSubject;
        if (isCompleted && exam) {
          const subj = (exam as any).subjects?.[subjectKey];
          let score: number | null = null;
          let displayVal = "-";

          if (subj?.type === "exact" && subj.value !== undefined) {
            score = subj.unit === "marks" ? Math.round((subj.value / w.maxMarks) * 10000) / 100 : subj.value;
            displayVal = `${score}%`;
          } else if (subj?.type === "range" && subj.min !== undefined) {
            score = (subj.min + subj.max) / 2;
            displayVal = subj.displayValue;
          }

          result.push({
            id: examId,
            label: w.label,
            shortLabel: `${w.shortLabel} (${w.label})`,
            score,
            displayValue: displayVal,
            isCompleted: score !== null,
            isPredicted: false,
            maxMarks: w.maxMarks,
          });
        } else {
          const subjCalc = calcResult.subjects.find((s) => s.subjectKey === subjectKey);
          const examScore = subjCalc?.examScores.find((es) => es.examId === examId);
          const predicted = examScore?.predictedPct ?? null;
          result.push({
            id: examId,
            label: w.label,
            shortLabel: `${w.shortLabel} (${w.label})`,
            score: predicted,
            displayValue: predicted !== null ? `~${predicted}%` : "Pending",
            isCompleted: false,
            isPredicted: predicted !== null,
            maxMarks: w.maxMarks,
            confidence: examScore?.confidence,
          });
        }
      }
    }

    // Add target point
    let targetScore: number | null = null;
    if (activeSubject === "overall") {
      targetScore = targetVal;
    } else {
      const subjectKey = subjectIdToKey[activeSubject] || activeSubject;
      const subjCalc = calcResult.subjects.find((s) => s.subjectKey === subjectKey);
      targetScore = subjCalc?.targetScore ?? null;
    }

    result.push({
      id: "target",
      label: "Target",
      shortLabel: "Target",
      score: targetScore,
      displayValue: targetScore !== null ? `${targetScore}%` : "-",
      isCompleted: false,
      isPredicted: false,
      maxMarks: 100,
    });

    // Annotate prediction deltas for completed exams
    for (const dp of result) {
      if (!dp.isCompleted || dp.id === 'target') continue;
      const subjectKey = activeSubject === 'overall' ? null : (subjectIdToKey[activeSubject] || activeSubject);
      if (subjectKey) {
        const detail = achievementData.find(d => d.subjectKey === subjectKey && d.examId === dp.id);
        if (detail && detail.delta !== null) {
          dp.predictionDelta = detail.delta;
        }
      }
    }

    return result;
  }, [activeSubject, student, targetVal, calcResult, achievementData]);

  // SVG dimensions
  const svgWidth = 760;
  const svgHeight = 280;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 30;
  const paddingBottom = 50;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const yMin = 20;
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

  // Separate actual and predicted points
  const actualPoints = points
    .map((p, idx) => ({ ...p, idx, x: getX(idx), y: p.score !== null ? getY(p.score) : null }))
    .filter((p) => p.isCompleted && p.y !== null);

  const predictedPoints = points
    .map((p, idx) => ({ ...p, idx, x: getX(idx), y: p.score !== null ? getY(p.score) : null }))
    .filter((p) => p.isPredicted && p.y !== null);

  // Generate actual path
  let actualPath = "";
  let areaPath = "";
  if (actualPoints.length > 0) {
    actualPath = `M ${actualPoints[0].x} ${actualPoints[0].y}`;
    for (let i = 1; i < actualPoints.length; i++) {
      const prev = actualPoints[i - 1];
      const curr = actualPoints[i];
      const cx = prev.x + (curr.x - prev.x) / 2;
      actualPath += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const last = actualPoints[actualPoints.length - 1];
    const first = actualPoints[0];
    const baseY = getY(yMin);
    areaPath = `${actualPath} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
  }

  // Generate predicted path (from last actual to all predicted points)
  let predictedPath = "";
  const allFuturePoints = [
    ...(actualPoints.length > 0 ? [actualPoints[actualPoints.length - 1]] : []),
    ...predictedPoints,
  ];

  if (allFuturePoints.length > 1) {
    predictedPath = `M ${allFuturePoints[0].x} ${allFuturePoints[0].y}`;
    for (let i = 1; i < allFuturePoints.length; i++) {
      const prev = allFuturePoints[i - 1];
      const curr = allFuturePoints[i];
      const cx = prev.x + (curr.x - prev.x) / 2;
      predictedPath += ` C ${cx} ${prev.y!}, ${cx} ${curr.y!}, ${curr.x} ${curr.y}`;
    }
  }

  // Target reference line
  const targetPoint = points.find((p) => p.id === "target");
  const targetY = targetPoint?.score !== null && targetPoint?.score !== undefined ? getY(targetPoint.score) : null;

  // KPI values
  const baseline = points[0];
  const latestCompleted = [...actualPoints].pop();

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
                4-Exam Progression & Predictions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Actual scores (solid) vs predicted trajectory (dashed) toward target
              </p>
            </div>
          </div>
        </div>

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
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
            PT-1 Baseline
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-navy mt-0.5 block">
            {baseline.displayValue}
          </span>
        </div>

        <div className="bg-violet-50/60 rounded-xl p-3 border border-violet-100">
          <span className="text-[11px] font-mono text-violet-700 uppercase tracking-wider block">
            Predicted Final
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-violet-700 mt-0.5 block">
            {points[3]?.displayValue || "—"}
          </span>
        </div>

        <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
          <span className="text-[11px] font-mono text-amber-700 uppercase tracking-wider block">
            Target
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-amber-700 mt-0.5 block">
            {targetPoint?.displayValue || "—"}
          </span>
        </div>

        <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
          <span className="text-[11px] font-mono text-emerald-700 uppercase tracking-wider block">
            Gap
          </span>
          <span className="text-base sm:text-lg font-bold font-mono text-emerald-700 mt-0.5 block">
            {latestCompleted?.score !== null && latestCompleted?.score !== undefined && targetPoint?.score !== null && targetPoint?.score !== undefined
              ? `${Math.round((targetPoint.score - latestCompleted.score) * 10) / 10}%`
              : "—"}
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[600px]"
          style={{ maxHeight: "320px" }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[20, 40, 60, 80, 100].map((val) => (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={getY(val)}
                x2={svgWidth - paddingRight}
                y2={getY(val)}
                stroke="#e2e8f0"
                strokeDasharray="3,3"
                strokeWidth={0.5}
              />
              <text
                x={paddingLeft - 8}
                y={getY(val) + 3}
                fontSize={10}
                fill="#94a3b8"
                textAnchor="end"
                fontFamily="monospace"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* Target reference line */}
          {targetY !== null && (
            <>
              <line
                x1={paddingLeft}
                y1={targetY}
                x2={svgWidth - paddingRight}
                y2={targetY}
                stroke="#d97706"
                strokeDasharray="8,4"
                strokeWidth={1.5}
                opacity={0.6}
              />
              <text
                x={svgWidth - paddingRight + 4}
                y={targetY + 3}
                fontSize={9}
                fill="#d97706"
                fontFamily="monospace"
                fontWeight="bold"
              >
                TGT
              </text>
            </>
          )}

          {/* Area fill for actual */}
          {areaPath && (
            <path d={areaPath} fill="url(#actualGradient)" />
          )}

          {/* Actual trend line */}
          {actualPath && (
            <path
              d={actualPath}
              fill="none"
              stroke="#1e3a5f"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          )}

          {/* Predicted trend line (dashed) */}
          {predictedPath && (
            <path
              d={predictedPath}
              fill="none"
              stroke="#7c3aed"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="6,4"
              opacity={0.7}
            />
          )}

          {/* Data points */}
          {points.map((point, idx) => {
            if (point.score === null) return null;
            const x = getX(idx);
            const y = getY(point.score);

            return (
              <g key={point.id}>
                {/* Outer ring */}
                <circle
                  cx={x}
                  cy={y}
                  r={point.isCompleted ? 6 : 5}
                  fill="white"
                  stroke={point.isCompleted ? "#1e3a5f" : point.isPredicted ? "#7c3aed" : "#d97706"}
                  strokeWidth={2}
                  strokeDasharray={point.isPredicted ? "3,2" : "none"}
                />
                {/* Inner dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={point.isCompleted ? 3 : 2.5}
                  fill={point.isCompleted ? "#1e3a5f" : point.isPredicted ? "#7c3aed" : "#d97706"}
                />
                {/* Score label */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill={point.isCompleted ? "#1e3a5f" : point.isPredicted ? "#7c3aed" : "#d97706"}
                  fontFamily="monospace"
                >
                  {point.displayValue}
                </text>

                {/* Prediction delta annotation */}
                {point.predictionDelta !== null && point.predictionDelta !== undefined && (
                  <g>
                    <rect
                      x={x + 8}
                      y={y - 22}
                      width={point.predictionDelta > 0 ? 36 : 32}
                      height={14}
                      rx={3}
                      fill={point.predictionDelta > 2 ? "#dbeafe" : point.predictionDelta < -2 ? "#fef3c7" : "#f1f5f9"}
                      stroke={point.predictionDelta > 2 ? "#93c5fd" : point.predictionDelta < -2 ? "#fcd34d" : "#cbd5e1"}
                      strokeWidth={0.5}
                    />
                    <text
                      x={x + 10}
                      y={y - 12}
                      fontSize={8}
                      fontWeight="bold"
                      fill={point.predictionDelta > 2 ? "#2563eb" : point.predictionDelta < -2 ? "#d97706" : "#64748b"}
                      fontFamily="monospace"
                    >
                      {point.predictionDelta > 0 ? `↑+${point.predictionDelta}%` : `↓${point.predictionDelta}%`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* X-axis labels */}
          {points.map((point, idx) => (
            <g key={`label-${point.id}`}>
              <text
                x={getX(idx)}
                y={svgHeight - paddingBottom + 20}
                textAnchor="middle"
                fontSize={9}
                fill={point.isCompleted ? "#475569" : point.isPredicted ? "#7c3aed" : "#d97706"}
                fontFamily="monospace"
                fontWeight="600"
              >
                {point.id === "target" ? "TARGET" : EXAM_WEIGHTS[point.id]?.shortLabel || point.id.toUpperCase()}
              </text>
              <text
                x={getX(idx)}
                y={svgHeight - paddingBottom + 32}
                textAnchor="middle"
                fontSize={7}
                fill="#94a3b8"
                fontFamily="monospace"
              >
                {point.id === "target" ? "" : `/${EXAM_WEIGHTS[point.id]?.maxMarks || ""}`}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-6 h-0.5 bg-navy rounded" />
          <CheckCircle2 className="w-3 h-3 text-navy" />
          Actual Score
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-6 h-0.5 bg-violet-500 rounded" style={{ borderTop: "2px dashed #7c3aed" }} />
          <Sparkles className="w-3 h-3 text-violet-500" />
          Predicted Score
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-6 h-0.5 bg-amber-500 rounded" style={{ borderTop: "2px dashed #d97706" }} />
          <Target className="w-3 h-3 text-amber-600" />
          Target Line
        </span>
        {achievementData.some(d => d.delta !== null) && (
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">↑+X%</span>
            vs Prediction
          </span>
        )}
      </div>
    </div>
  );
}
