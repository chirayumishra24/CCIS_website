"use client";
import React from "react";
import { NormalizedValue } from "@/lib/academicNormalizer";
import { Target, CheckCircle2, Clock } from "lucide-react";

interface SchoolTargetCardProps {
  target: NormalizedValue;
}

export default function SchoolTargetCard({ target }: SchoolTargetCardProps) {
  const isAssigned = target.type === "exact" || target.type === "range";

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-sm">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 font-mono flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-navy" />
            School Target
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
              isAssigned
                ? "bg-blue-50 text-navy border-blue-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}
          >
            {isAssigned ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-navy" />
                Assigned
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-slate-400" />
                Pending
              </>
            )}
          </span>
        </div>

        {/* Target Value Display */}
        <div className="mt-2">
          {isAssigned ? (
            <div className="space-y-0.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight font-serif">
                {target.displayValue}
              </span>
              <p className="text-xs text-slate-500">
                Institutional academic benchmark assigned by faculty
              </p>
            </div>
          ) : (
            <div className="py-1">
              <span className="text-xl sm:text-2xl font-semibold text-slate-600 font-serif block">
                Target not assigned yet
              </span>
              <p className="text-xs text-slate-400 mt-1">
                A formal target will be set by the academic coordinator
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Target Meter / Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Benchmark Goal</span>
          <span className="font-mono">{isAssigned ? target.displayValue : "Not Set"}</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          {isAssigned && target.value !== undefined ? (
            <div
              className="h-full bg-navy/80 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, target.value)}%` }}
            />
          ) : (
            <div className="h-full bg-slate-200 rounded-full w-0" />
          )}
        </div>
      </div>
    </div>
  );
}
