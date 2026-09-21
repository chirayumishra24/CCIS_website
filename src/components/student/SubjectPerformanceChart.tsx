"use client";
import React from "react";
import { SubjectRecord } from "@/lib/academicNormalizer";
import { BarChart3 } from "lucide-react";

interface SubjectPerformanceChartProps {
  subjects: SubjectRecord[];
  exam2Subjects?: SubjectRecord[];
}

export default function SubjectPerformanceChart({
  subjects,
  exam2Subjects,
}: SubjectPerformanceChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-navy" />
            Subject Performance Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {exam2Subjects
              ? "Comparative progress tracking across Exam-1 (Baseline) and Exam-2 (Mid Term)"
              : "Current achievement levels across Grade IX curriculum disciplines"}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-3 h-3 rounded-xs bg-navy" />
            Exam-1: Baseline
          </span>
          {exam2Subjects && (
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-3 h-3 rounded-xs bg-blue-500" />
              Exam-2: Mid Term
            </span>
          )}
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-3 h-3 rounded-xs bg-blue-200 border border-blue-300" />
            Range Band
          </span>
        </div>
      </div>

      {/* Responsive Bar Chart View */}
      <div className="space-y-5 pt-1">
        {subjects.map((sub, idx) => {
          const norm1 = sub.normalized;
          const sub2 = exam2Subjects?.[idx];
          const norm2 = sub2?.normalized;

          // Exam 1 coordinates
          const isExact1 = norm1.type === "exact" && norm1.value !== undefined;
          const isRange1 = norm1.type === "range" && norm1.min !== undefined && norm1.max !== undefined;
          const isExempt1 = norm1.type === "exempt";
          const barWidth1 = isExact1 ? Math.min(100, Math.max(0, norm1.value!)) : isRange1 ? Math.min(100, Math.max(0, norm1.max!)) : 0;
          const rangeStart1 = isRange1 ? Math.min(100, Math.max(0, norm1.min!)) : 0;
          const rangeSpan1 = isRange1 ? Math.max(4, norm1.max! - norm1.min!) : 0;

          // Exam 2 coordinates
          const isExact2 = norm2?.type === "exact" && norm2?.value !== undefined;
          const val2Pct = isExact2 ? (norm2!.value! / 20) * 100 : null;
          const barWidth2 = val2Pct !== null ? Math.min(100, Math.max(0, val2Pct)) : 0;
          const isAbsent2 = norm2?.displayValue === "Absent (AB)";
          const isExempt2 = norm2?.displayValue === "Exempt (-)";

          return (
            <div key={sub.id} className="group">
              {/* Subject Label Row */}
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

              {/* Bar 1 (Exam-1: Baseline) */}
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

              {/* Bar 2 (Exam-2: Mid Term, if available) */}
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
      </div>

      {/* Axis Scale */}
      <div className="mt-5 pt-2.5 border-t border-slate-100 flex justify-between text-[11px] font-mono text-slate-400">
        <span>0%</span>
        <span className="hidden sm:inline">25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>90%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
