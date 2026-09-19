"use client";
import React from "react";
import { LineChart, CalendarClock, Info } from "lucide-react";

export function PerformanceTrendEmptyState() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <LineChart className="w-5 h-5 text-navy" />
            Performance Trend Over Time
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Longitudinal progression across academic terms
          </p>
        </div>
      </div>

      <div className="py-8 px-4 text-center rounded-lg bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-navy mb-3">
          <LineChart className="w-6 h-6 text-navy/70" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-navy font-serif">
          Performance Trend Pending Additional Assessments
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          Historical trend curves and longitudinal progress analysis will appear automatically once multiple term assessment cycles are recorded in the academic database.
        </p>
      </div>
    </div>
  );
}

export function UpcomingExamsEmptyState() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 sm:p-6 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-navy font-serif flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-navy" />
            Upcoming Exam Targets & Requirements
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            &ldquo;How much do I need to score?&rdquo; required score calculator
          </p>
        </div>
      </div>

      <div className="py-8 px-4 text-center rounded-lg bg-slate-50/70 border border-dashed border-slate-200 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-navy mb-3">
          <CalendarClock className="w-6 h-6 text-navy/70" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-navy font-serif">
          Exam Schedule & Target Calculator
        </h3>
        <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
          Upcoming exam targets and weighted score requirements will activate once the examination datesheet and term weightage distribution are published by the examination cell.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50/80 text-navy border border-blue-100">
          <Info className="w-3.5 h-3.5" />
          <span>Formulas validated & ready for Term assessment deployment</span>
        </div>
      </div>
    </div>
  );
}
