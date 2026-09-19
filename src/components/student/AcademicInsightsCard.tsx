"use client";
import React from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
import { generateAcademicInsights } from "@/lib/academicCalculations";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface AcademicInsightsCardProps {
  student: StudentRecord;
}

export default function AcademicInsightsCard({ student }: AcademicInsightsCardProps) {
  const insights = generateAcademicInsights(student);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-navy" />
            Academic Observations & Insights
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective performance findings verified against validated assessment marks
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3.5 rounded-lg bg-blue-50/40 border border-blue-100/80 text-xs sm:text-sm text-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-navy shrink-0 mt-0.5" />
            <p className="leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
