"use client";
import React, { useState } from "react";
import { SubjectRecord } from "@/lib/academicNormalizer";
import { BarChart3, LineChart } from "lucide-react";

interface SubjectPerformanceChartProps {
  subjects: SubjectRecord[];
  exam2Subjects?: SubjectRecord[];
}

export default function SubjectPerformanceChart({
  subjects,
  exam2Subjects,
}: SubjectPerformanceChartProps) {
  const [viewMode, setViewMode] = useState<"bar" | "line">("line"); // Default to Line Graph per user priority

  // Prepare line graph points
  const svgWidth = 720;
  const svgHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const getY = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, pct));
    return paddingTop + chartHeight * (1 - clamped / 100);
  };

  const getX = (index: number) => {
    const step = chartWidth / (subjects.length - 1 || 1);
    return paddingLeft + index * step;
  };

  // Exam-1 coordinates
  const e1Coords = subjects.map((s, idx) => {
    const val = s.normalized.type === "exact" ? s.normalized.value ?? 0 : s.normalized.type === "range" ? s.normalized.max ?? 0 : null;
    return {
      x: getX(idx),
      y: val !== null ? getY(val) : null,
      val,
      display: s.normalized.displayValue,
      label: s.code,
    };
  });

  // Exam-2 coordinates (scaled to 100%)
  const e2Coords = (exam2Subjects || []).map((s, idx) => {
    let pct: number | null = null;
    if (s.normalized.type === "exact" && s.normalized.value !== undefined) {
      pct = s.normalized.unit === "marks" ? (s.normalized.value / 20) * 100 : s.normalized.value;
    }
    return {
      x: getX(idx),
      y: pct !== null ? getY(pct) : null,
      val: pct !== null ? Math.round(pct * 10) / 10 : null,
      display: s.normalized.displayValue,
      label: s.code,
    };
  });

  // SVG Paths
  const validE1 = e1Coords.filter((c) => c.y !== null);
  const pathE1 = validE1.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  const validE2 = e2Coords.filter((c) => c.y !== null);
  const pathE2 = validE2.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            {viewMode === "line" ? (
              <LineChart className="w-5 h-5 text-navy" />
            ) : (
              <BarChart3 className="w-5 h-5 text-navy" />
            )}
            Subject Performance Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {exam2Subjects
              ? "Comparative progress tracking across Exam-1 (Baseline) and Exam-2 (Mid Term)"
              : "Current achievement levels across Grade IX curriculum disciplines"}
          </p>
        </div>

        {/* View Toggle + Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Toggle between Line Graph and Bar Chart */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("line")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "line"
                  ? "bg-white text-navy shadow-xs font-bold"
                  : "text-slate-600 hover:text-navy"
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              <span>Line Graph</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("bar")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                viewMode === "bar"
                  ? "bg-white text-navy shadow-xs font-bold"
                  : "text-slate-600 hover:text-navy"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bar Chart</span>
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-3 h-3 rounded-xs bg-navy" />
              Exam-1
            </span>
            {exam2Subjects && (
              <span className="flex items-center gap-1.5 font-mono">
                <span className="w-3 h-3 rounded-xs bg-blue-500" />
                Exam-2
              </span>
            )}
          </div>
        </div>
      </div>

      {viewMode === "line" ? (
        /* ================= LINE GRAPH VIEW ================= */
        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
              {/* Grid Lines */}
              {[25, 50, 75, 100].map((level) => {
                const y = getY(level);
                return (
                  <g key={level}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={svgWidth - paddingRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] font-mono fill-slate-400 font-medium"
                    >
                      {level}%
                    </text>
                  </g>
                );
              })}

              {/* Exam-1 Line */}
              {pathE1 && (
                <path
                  d={pathE1}
                  fill="none"
                  stroke="#1e3a8a"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Exam-2 Line */}
              {pathE2 && (
                <path
                  d={pathE2}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Exam-1 Points */}
              {e1Coords.map((c, idx) =>
                c.y !== null ? (
                  <g key={`e1-${idx}`}>
                    <circle cx={c.x} cy={c.y} r={5} fill="#ffffff" stroke="#1e3a8a" strokeWidth={2.5} />
                    <text
                      x={c.x}
                      y={c.y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-navy"
                    >
                      {c.val !== null ? `${Math.round(c.val)}%` : ""}
                    </text>
                  </g>
                ) : null
              )}

              {/* Exam-2 Points */}
              {e2Coords.map((c, idx) =>
                c.y !== null ? (
                  <g key={`e2-${idx}`}>
                    <circle cx={c.x} cy={c.y} r={4.5} fill="#3b82f6" stroke="#ffffff" strokeWidth={2} />
                    <text
                      x={c.x}
                      y={c.y + 16}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-blue-600"
                    >
                      {c.val !== null ? `${Math.round(c.val)}%` : ""}
                    </text>
                  </g>
                ) : null
              )}

              {/* X-Axis Subject Labels */}
              {subjects.map((sub, idx) => {
                const x = getX(idx);
                return (
                  <g key={sub.id} transform={`translate(${x}, ${svgHeight - paddingBottom + 18})`}>
                    <line
                      x1={0}
                      y1={-18}
                      x2={0}
                      y2={-paddingBottom + 5}
                      stroke="#f1f5f9"
                      strokeWidth={1}
                    />
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      className="text-[11px] font-mono font-bold fill-navy"
                    >
                      {sub.code}
                    </text>
                    <text
                      x={0}
                      y={13}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-500 max-w-[80px] truncate"
                    >
                      {sub.label.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      ) : (
        /* ================= BAR CHART VIEW ================= */
        <div className="space-y-5 pt-1">
          {subjects.map((sub, idx) => {
            const norm1 = sub.normalized;
            const sub2 = exam2Subjects?.[idx];
            const norm2 = sub2?.normalized;

            const isExact1 = norm1.type === "exact" && norm1.value !== undefined;
            const isRange1 = norm1.type === "range" && norm1.min !== undefined && norm1.max !== undefined;
            const isExempt1 = norm1.type === "exempt";
            const barWidth1 = isExact1 ? Math.min(100, Math.max(0, norm1.value!)) : isRange1 ? Math.min(100, Math.max(0, norm1.max!)) : 0;
            const rangeStart1 = isRange1 ? Math.min(100, Math.max(0, norm1.min!)) : 0;
            const rangeSpan1 = isRange1 ? Math.max(4, norm1.max! - norm1.min!) : 0;

            const isExact2 = norm2?.type === "exact" && norm2?.value !== undefined;
            const val2Pct = isExact2 ? (norm2!.value! / 20) * 100 : null;
            const barWidth2 = val2Pct !== null ? Math.min(100, Math.max(0, val2Pct)) : 0;
            const isAbsent2 = norm2?.displayValue === "Absent (AB)";
            const isExempt2 = norm2?.displayValue === "Exempt (-)";

            return (
              <div key={sub.id} className="group">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-12 sm:w-14 font-mono font-semibold text-xs text-navy px-1.5 py-0.5 rounded bg-blue-50/80 border border-blue-100 text-center">
                      {sub.code}
                    </span>
                    <span className="font-semibold text-slate-800 group-hover:text-navy transition-colors truncate max-w-[180px] sm:max-w-none">
                      {sub.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-navy font-bold">
                      E1: {norm1.displayValue}
                    </span>
                    {norm2 && (
                      <span className="text-blue-600 font-bold">
                        E2: {norm2.displayValue} {val2Pct !== null ? `(${Math.round(val2Pct)}%)` : ""}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative h-4 w-full bg-slate-100/90 rounded overflow-hidden p-0.5 mb-1">
                  {isExact1 && (
                    <div
                      className="h-full bg-navy rounded transition-all duration-700 relative"
                      style={{ width: `${barWidth1}%` }}
                    />
                  )}
                  {isRange1 && (
                    <div
                      className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 rounded border border-blue-400/80 transition-all duration-700"
                      style={{ left: `${rangeStart1}%`, width: `${rangeSpan1}%` }}
                    />
                  )}
                  {isExempt1 && (
                    <div className="h-full flex items-center px-2 text-[10px] text-slate-400 font-mono italic">
                      Exempted
                    </div>
                  )}
                </div>

                {exam2Subjects && (
                  <div className="relative h-4 w-full bg-blue-50/70 rounded overflow-hidden p-0.5">
                    {isExact2 && val2Pct !== null && (
                      <div
                        className="h-full bg-blue-500 rounded transition-all duration-700 relative"
                        style={{ width: `${barWidth2}%` }}
                      />
                    )}
                    {isAbsent2 && (
                      <div className="h-full flex items-center px-2 text-[10px] text-rose-500 font-mono font-semibold">
                        Absent in Mid Term
                      </div>
                    )}
                    {isExempt2 && (
                      <div className="h-full flex items-center px-2 text-[10px] text-slate-400 font-mono italic">
                        Exempted
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-5 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] font-mono text-slate-400">
            <span>0%</span>
            <span className="hidden sm:inline">25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>90%</span>
            <span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
}
