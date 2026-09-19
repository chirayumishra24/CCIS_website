"use client";
import React from "react";
import { NormalizedValue } from "@/lib/academicNormalizer";
import { Award, TrendingUp, AlertCircle } from "lucide-react";

interface OverallPerformanceCardProps {
  overall: NormalizedValue;
}

export default function OverallPerformanceCard({ overall }: OverallPerformanceCardProps) {
  // Determine badge styling based on value/type
  let statusText = "Performance Range";
  let statusBadgeClass = "bg-blue-50 text-navy border-blue-200";

  if (overall.type === "exact" && overall.value !== undefined) {
    if (overall.value >= 90) {
      statusText = "Exemplary Standing";
      statusBadgeClass = "bg-emerald-50 text-emerald-800 border-emerald-200";
    } else if (overall.value >= 75) {
      statusText = "Solid Standing";
      statusBadgeClass = "bg-blue-50 text-navy border-blue-200";
    } else {
      statusText = "Developing Standing";
      statusBadgeClass = "bg-amber-50 text-amber-800 border-amber-200";
    }
  } else if (overall.type === "empty") {
    statusText = "Assessment Pending";
    statusBadgeClass = "bg-slate-100 text-slate-700 border-slate-200";
  }

  // Calculate percentage bar width safely
  const progressWidth =
    overall.type === "exact" && overall.value !== undefined
      ? Math.min(100, Math.max(0, overall.value))
      : overall.type === "range" && overall.max !== undefined
      ? Math.min(100, Math.max(0, overall.max))
      : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-sm">
      {/* Decorative subtle background corner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />

      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 font-mono">
            Current Performance
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadgeClass}`}
          >
            {statusText}
          </span>
        </div>

        {/* Score Display */}
        <div className="mt-2 flex items-baseline gap-2">
          {overall.type === "empty" ? (
            <div className="flex items-center gap-2 text-slate-400 py-1">
              <AlertCircle className="w-6 h-6 text-slate-400 shrink-0" />
              <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-500">
                Pending
              </span>
            </div>
          ) : (
            <div className="space-y-0.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight font-serif">
                {overall.displayValue}
              </span>
              {overall.type === "range" && (
                <p className="text-xs text-slate-500">
                  Estimated academic band across recorded assessments
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Representation */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-navy" />
            Overall Aggregate
          </span>
          <span className="font-mono">{overall.type === "empty" ? "0%" : overall.displayValue}</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
          {overall.type === "range" && overall.min !== undefined && overall.max !== undefined ? (
            <div
              className="absolute h-full bg-gradient-to-r from-navy/60 to-navy rounded-full transition-all duration-700"
              style={{
                left: `${Math.max(0, overall.min)}%`,
                width: `${Math.max(4, overall.max - overall.min)}%`,
              }}
            />
          ) : (
            <div
              className="h-full bg-navy rounded-full transition-all duration-700"
              style={{ width: `${progressWidth}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
