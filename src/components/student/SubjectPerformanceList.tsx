"use client";
import React from "react";
import { SubjectRecord } from "@/lib/academicNormalizer";
import { BookOpen, Check, AlertCircle, Minus } from "lucide-react";

interface SubjectPerformanceListProps {
  subjects: SubjectRecord[];
}

export default function SubjectPerformanceList({
  subjects,
}: SubjectPerformanceListProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-navy" />
            Subject-wise Breakdown
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual assessment metrics per curriculum discipline
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {subjects.map((sub) => {
          const norm = sub.normalized;
          const isExact = norm.type === "exact";
          const isRange = norm.type === "range";
          const isExempt = norm.type === "exempt";

          let scoreBadgeBg = "bg-blue-50 text-navy border-blue-200";
          if (isExact && norm.value !== undefined) {
            if (norm.value >= 85) scoreBadgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
            else if (norm.value < 65) scoreBadgeBg = "bg-amber-50 text-amber-800 border-amber-200";
          } else if (isExempt) {
            scoreBadgeBg = "bg-slate-50 text-slate-500 border-slate-200";
          }

          return (
            <div
              key={sub.id}
              className="p-4 rounded-lg border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {sub.code}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border ${scoreBadgeBg}`}
                  >
                    {norm.displayValue}
                  </span>
                </div>

                <h3 className="font-semibold text-sm text-navy mb-1">{sub.label}</h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">
                  {isExact
                    ? "Validated Assessment"
                    : isRange
                    ? "Estimated Score Band"
                    : isExempt
                    ? "Curriculum Exemption"
                    : "Data Pending"}
                </span>

                {isExact ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : isRange ? (
                  <span className="text-[10px] font-mono text-blue-600 font-medium">RANGE</span>
                ) : (
                  <Minus className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
