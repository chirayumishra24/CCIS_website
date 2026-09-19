"use client";
import React from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
import { CheckCircle, Flag, ArrowUpRight, Compass } from "lucide-react";

interface TargetGapCardProps {
  schoolTarget: StudentRecord["schoolTarget"];
  currentPerformance: StudentRecord["currentPerformance"];
}

export default function TargetGapCard({
  schoolTarget,
  currentPerformance,
}: TargetGapCardProps) {
  const isTargetAssigned =
    schoolTarget.overall.type === "exact" || schoolTarget.overall.type === "range";
  const isAchieved = schoolTarget.targetStatus === "ACHIEVED";

  // Calculate target progress percentage (Current / Target * 100) if both numbers available
  let progressRatio: number | null = null;
  if (
    currentPerformance.overall.type === "exact" &&
    schoolTarget.overall.type === "exact" &&
    currentPerformance.overall.value &&
    schoolTarget.overall.value
  ) {
    progressRatio = Math.min(
      100,
      Math.round((currentPerformance.overall.value / schoolTarget.overall.value) * 100)
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-sm">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 font-mono flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-navy" />
            Target Status & Gap
          </span>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
              !isTargetAssigned
                ? "bg-slate-50 text-slate-600 border-slate-200"
                : isAchieved
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {!isTargetAssigned ? (
              "Awaiting Target"
            ) : isAchieved ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Target Met
              </>
            ) : (
              <>
                <ArrowUpRight className="w-3 h-3 text-amber-600" />
                In Progress
              </>
            )}
          </span>
        </div>

        {/* Gap Display */}
        <div className="mt-2">
          {!isTargetAssigned ? (
            <div className="py-1">
              <span className="text-xl sm:text-2xl font-semibold text-slate-600 font-serif block">
                Target not assigned
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Target gap metrics will calculate automatically when a target is entered
              </p>
            </div>
          ) : isAchieved ? (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-700 tracking-tight font-serif">
                  Target Achieved
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {schoolTarget.gapDescription || "Currently meeting or exceeding school academic target."}
              </p>
            </div>
          ) : schoolTarget.gapPercentagePoints !== undefined ? (
            <div className="space-y-0.5">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-800 tracking-tight font-serif">
                {schoolTarget.gapPercentagePoints}
                <span className="text-base sm:text-lg font-normal text-slate-500 ml-1.5 font-sans">
                  pts to target
                </span>
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {schoolTarget.gapDescription || "Remaining percentage points to reach assigned target."}
              </p>
            </div>
          ) : (
            <div className="py-1">
              <span className="text-xl sm:text-2xl font-semibold text-navy font-serif block">
                {schoolTarget.gapDescription}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Range-based target evaluation active
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Progress representation */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span className="flex items-center gap-1">
            <Flag className="w-3.5 h-3.5 text-navy" />
            Target Completion Rate
          </span>
          <span className="font-mono">
            {progressRatio !== null ? `${progressRatio}%` : isAchieved ? "100%" : "—"}
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          {isAchieved ? (
            <div className="h-full bg-emerald-600 rounded-full w-full" />
          ) : progressRatio !== null ? (
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${progressRatio}%` }}
            />
          ) : (
            <div className="h-full bg-slate-200 rounded-full w-0" />
          )}
        </div>
      </div>
    </div>
  );
}
