"use client";
import React from "react";
import { SubjectRecord } from "@/lib/academicNormalizer";
import { BarChart3 } from "lucide-react";

interface SubjectPerformanceChartProps {
  subjects: SubjectRecord[];
}

export default function SubjectPerformanceChart({
  subjects,
}: SubjectPerformanceChartProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-navy" />
            Subject Performance Comparison
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Current achievement levels across Grade IX curriculum disciplines
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-navy" />
            Exact Score
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-300 border border-blue-400" />
            Range Band
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-slate-200" />
            Exempt / Pending
          </span>
        </div>
      </div>

      {/* Responsive Bar Chart View */}
      <div className="space-y-4 pt-1">
        {subjects.map((sub) => {
          const norm = sub.normalized;
          const isExact = norm.type === "exact" && norm.value !== undefined;
          const isRange = norm.type === "range" && norm.min !== undefined && norm.max !== undefined;
          const isExempt = norm.type === "exempt";

          // Calculate visual coordinates for the bar
          const barWidth = isExact
            ? Math.min(100, Math.max(0, norm.value!))
            : isRange
            ? Math.min(100, Math.max(0, norm.max!))
            : 0;

          const rangeStart = isRange ? Math.min(100, Math.max(0, norm.min!)) : 0;
          const rangeSpan = isRange ? Math.max(4, norm.max! - norm.min!) : 0;

          return (
            <div key={sub.id} className="group">
              {/* Subject Label Row */}
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-12 sm:w-14 font-mono font-semibold text-xs text-navy px-1.5 py-0.5 rounded bg-blue-50/80 border border-blue-100 text-center">
                    {sub.code}
                  </span>
                  <span className="font-medium text-ink group-hover:text-navy transition-colors truncate max-w-[180px] sm:max-w-none">
                    {sub.label}
                  </span>
                </div>

                <span className="font-semibold text-xs sm:text-sm font-mono text-navy">
                  {norm.displayValue}
                </span>
              </div>

              {/* Bar Container */}
              <div className="relative h-6 w-full bg-slate-100/90 rounded-md overflow-hidden p-0.5">
                {/* 50%, 75%, 90% Grid lines */}
                <div className="absolute inset-0 pointer-events-none flex justify-between px-0">
                  <div className="h-full w-px bg-slate-200/80 left-[50%] absolute" />
                  <div className="h-full w-px bg-slate-200/80 left-[75%] absolute" />
                  <div className="h-full w-px bg-slate-200/80 left-[90%] absolute" />
                </div>

                {/* Exact Bar */}
                {isExact && (
                  <div
                    className="h-full bg-navy rounded transition-all duration-700 relative group-hover:bg-[#1f376f]"
                    style={{ width: `${barWidth}%` }}
                  >
                    {barWidth > 15 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-white/95">
                        {norm.value}%
                      </span>
                    )}
                  </div>
                )}

                {/* Range Bar */}
                {isRange && (
                  <div
                    className="h-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 rounded border border-blue-400/80 transition-all duration-700 relative"
                    style={{
                      left: `${rangeStart}%`,
                      width: `${rangeSpan}%`,
                    }}
                  >
                    <span className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-navy whitespace-nowrap px-1">
                      {norm.min}–{norm.max}%
                    </span>
                  </div>
                )}

                {/* Exempt Label */}
                {isExempt && (
                  <div className="h-full flex items-center px-3 text-xs text-slate-400 font-mono italic">
                    Subject Exempted / Not Opted
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Scale */}
      <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between text-[11px] font-mono text-slate-400">
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
