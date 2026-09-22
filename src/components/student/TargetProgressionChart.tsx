"use client";
import React, { useState, useMemo } from "react";
import { StudentRecord, EXAM_WEIGHTS, EXAM_ORDER } from "@/lib/academicNormalizer";
import {
  calculateRequiredScoresPerSubject,
  SubjectRequiredScore,
} from "@/lib/academicCalculations";
import { TrendingUp } from "lucide-react";

interface TargetProgressionChartProps {
  student: StudentRecord;
}

const COLORS: Record<string, { stroke: string; light: string }> = {
  overall:        { stroke: "#1e293b", light: "#e2e8f0" },
  english:        { stroke: "#2563eb", light: "#bfdbfe" },
  secondLanguage: { stroke: "#7c3aed", light: "#ddd6fe" },
  maths:          { stroke: "#059669", light: "#a7f3d0" },
  science:        { stroke: "#d97706", light: "#fde68a" },
  socialScience:  { stroke: "#dc2626", light: "#fecaca" },
  it:             { stroke: "#0891b2", light: "#a5f3fc" },
};

export default function TargetProgressionChart({ student }: TargetProgressionChartProps) {
  const result = useMemo(() => calculateRequiredScoresPerSubject(student), [student]);
  const allSubjects: SubjectRequiredScore[] = useMemo(
    () => [result.overall, ...result.subjects.filter((s) => s.status !== "EXEMPT")],
    [result]
  );

  const [activeKey, setActiveKey] = useState("overall");
  const active = allSubjects.find((s) => s.subjectKey === activeKey) || allSubjects[0];
  const c = COLORS[activeKey] || COLORS.overall;

  const W = 640, H = 260;
  const pad = { top: 34, right: 44, bottom: 52, left: 42 };
  const cW = W - pad.left - pad.right, cH = H - pad.top - pad.bottom;

  const examMeta = EXAM_ORDER.map((id) => ({
    label: EXAM_WEIGHTS[id].shortLabel,
    weight: `${Math.round(EXAM_WEIGHTS[id].weight * 100)}%`,
    maxMarks: EXAM_WEIGHTS[id].maxMarks,
  }));
  const xStep = cW / (EXAM_ORDER.length - 1);
  const x = (i: number) => pad.left + i * xStep;
  const y = (v: number) => pad.top + cH - (v / 100) * cH;

  const actual: { x: number; y: number; v: number }[] = [];
  const predicted: { x: number; y: number; v: number }[] = [];

  active.examScores.forEach((es, i) => {
    if (es.isCompleted && es.normalizedPct !== null) {
      const pct = Math.max(0, Math.min(100, es.normalizedPct));
      actual.push({ x: x(i), y: y(pct), v: Math.round(pct * 10) / 10 });
    } else if (es.isPredicted && es.predictedPct !== null) {
      const pct = Math.max(0, Math.min(100, es.predictedPct));
      predicted.push({ x: x(i), y: y(pct), v: Math.round(pct * 10) / 10 });
    } else if (active.requiredInRemaining !== null && active.requiredInRemaining > 0) {
      const req = Math.max(0, Math.min(100, active.requiredInRemaining));
      predicted.push({ x: x(i), y: y(req), v: Math.round(req * 10) / 10 });
    }
  });

  const solidPath = actual.length >= 2
    ? actual.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") : "";
  const dashPath = actual.length > 0 && predicted.length > 0
    ? `M ${actual[actual.length - 1].x} ${actual[actual.length - 1].y} ` + predicted.map((p) => `L ${p.x} ${p.y}`).join(" ") : "";
  const areaPath = actual.length >= 2
    ? `${solidPath} L ${actual[actual.length - 1].x} ${y(0)} L ${actual[0].x} ${y(0)} Z` : "";

  const tgtY = active.targetScore ? y(Math.min(100, active.targetScore)) : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-navy" />
            <h3 className="text-xs sm:text-sm font-bold text-navy font-serif">
              Score Trajectory — Actual & Predicted
            </h3>
          </div>
          <p className="text-[10px] text-slate-400 ml-5">
            Solid = scored&ensp;·&ensp;Dashed = need to score&ensp;·&ensp;Dotted = target
          </p>
        </div>
      </div>

      {/* Subject pills */}
      <div className="px-4 py-2 border-b border-slate-100 flex flex-wrap gap-1">
        {allSubjects.map((s) => {
          const on = s.subjectKey === activeKey;
          const sc = COLORS[s.subjectKey] || COLORS.overall;
          return (
            <button
              key={s.subjectKey}
              onClick={() => setActiveKey(s.subjectKey)}
              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all border ${
                on ? "text-white shadow-xs" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
              style={on ? { backgroundColor: sc.stroke, borderColor: sc.stroke } : {}}
            >
              {s.subjectKey === "overall" ? "Overall" : s.subjectCode}
            </button>
          );
        })}
      </div>

      {/* SVG */}
      <div className="px-3 sm:px-4 py-3 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: 380 }}>
          <defs>
            <linearGradient id={`g-${activeKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.stroke} stopOpacity={0.1} />
              <stop offset="100%" stopColor={c.stroke} stopOpacity={0.01} />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={pad.left} y1={y(v)} x2={pad.left + cW} y2={y(v)}
                stroke="#e2e8f0" strokeWidth={v === 0 ? 1 : 0.4} strokeDasharray={v === 0 ? "" : "2,3"} />
              <text x={pad.left - 6} y={y(v) + 3} textAnchor="end" fontSize={8}
                fontFamily="monospace" className="fill-slate-400">{v}</text>
            </g>
          ))}

          {/* X labels */}
          {examMeta.map((meta, i) => {
            const done = i < result.completedExams.length;
            return (
              <g key={meta.label}>
                <line x1={x(i)} y1={pad.top} x2={x(i)} y2={pad.top + cH} stroke="#f1f5f9" strokeWidth={0.4} />
                <text x={x(i)} y={pad.top + cH + 13} textAnchor="middle" fontSize={9}
                  fontWeight={done ? 700 : 400} className={done ? "fill-navy" : "fill-slate-400"}>
                  {meta.label}
                </text>
                <text x={x(i)} y={pad.top + cH + 23} textAnchor="middle" fontSize={7}
                  fontFamily="monospace" className="fill-slate-300">
                  ({meta.weight} • /{meta.maxMarks})
                </text>
                <circle cx={x(i)} cy={pad.top + cH + 33} r={2.5}
                  fill={done ? "#10b981" : "none"} stroke={done ? "#10b981" : "#cbd5e1"}
                  strokeWidth={done ? 0 : 1} />
              </g>
            );
          })}

          {/* Target line */}
          {tgtY !== null && (
            <g>
              <line x1={pad.left} y1={tgtY} x2={pad.left + cW} y2={tgtY}
                stroke={c.stroke} strokeWidth={1} strokeDasharray="6,4" opacity={0.3} />
              <rect x={pad.left + cW + 2} y={tgtY - 7} width={30} height={14} rx={3}
                fill={c.light} stroke={c.stroke} strokeWidth={0.4} opacity={0.5} />
              <text x={pad.left + cW + 17} y={tgtY + 3} textAnchor="middle" fontSize={7}
                fontWeight={700} fontFamily="monospace" fill={c.stroke}>
                🎯{active.targetScore}
              </text>
            </g>
          )}

          {/* Area */}
          {areaPath && <path d={areaPath} fill={`url(#g-${activeKey})`} />}

          {/* Solid line */}
          {solidPath && <path d={solidPath} fill="none" stroke={c.stroke} strokeWidth={2.5}
            strokeLinecap="round" strokeLinejoin="round" />}

          {/* Dashed line */}
          {dashPath && <path d={dashPath} fill="none" stroke={c.stroke} strokeWidth={2}
            strokeDasharray="6,4" strokeLinecap="round" opacity={0.5} />}

          {/* Actual dots */}
          {actual.map((p, i) => (
            <g key={`a${i}`}>
              <circle cx={p.x} cy={p.y} r={5} fill="white" stroke={c.stroke} strokeWidth={2.5} />
              <rect x={p.x - 14} y={p.y - 18} width={28} height={12} rx={3} fill={c.stroke} />
              <text x={p.x} y={p.y - 9.5} textAnchor="middle" fontSize={8} fontWeight={700}
                fontFamily="monospace" fill="white">{p.v}%</text>
            </g>
          ))}

          {/* Predicted dots */}
          {predicted.map((p, i) => (
            <g key={`p${i}`}>
              <circle cx={p.x} cy={p.y} r={4.5} fill={c.light} stroke={c.stroke}
                strokeWidth={1.5} strokeDasharray="2,1.5" />
              <rect x={p.x - 16} y={p.y - 19} width={32} height={13} rx={3}
                fill={c.light} stroke={c.stroke} strokeWidth={0.4} />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={8} fontWeight={700}
                fontFamily="monospace" fill={c.stroke}>⬆{p.v}%</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Summary */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/30">
        <p className="text-[11px] text-slate-600 leading-relaxed">
          {active.requiredInRemaining !== null && active.requiredInRemaining > 0 ? (
            <>
              To meet <strong className="text-navy">{active.targetDisplayValue}</strong> in{" "}
              <strong>{active.subjectKey === "overall" ? "Overall" : active.subjectLabel}</strong>,
              score at least <strong className="text-amber-600">{Math.round(active.requiredInRemaining)}%</strong> avg
              in remaining {result.pendingExams.length} exam{result.pendingExams.length > 1 ? "s" : ""}.
            </>
          ) : active.status === "ACHIEVED" ? (
            <>🎉 <strong>{active.subjectKey === "overall" ? "Overall" : active.subjectLabel}</strong> target is on track!</>
          ) : <>More exam data needed.</>}
        </p>
      </div>

      {/* Legend */}
      <div className="px-4 py-1.5 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[9px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded" style={{ backgroundColor: c.stroke }} /> Scored
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${c.stroke} 0, ${c.stroke} 3px, transparent 3px, transparent 6px)` }} /> Need to Score
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded opacity-30" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${c.stroke} 0, ${c.stroke} 2px, transparent 2px, transparent 5px)` }} /> 🎯 Target
        </span>
      </div>
    </div>
  );
}
