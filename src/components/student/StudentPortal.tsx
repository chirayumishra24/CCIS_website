"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StudentRecord } from "@/lib/academicNormalizer";
import {
  fetchStudentById,
  subscribeStudentById,
  fetchStudentDirectory,
  StudentDirectoryItem,
} from "@/lib/firebaseDb";
import DashboardHeader from "./DashboardHeader";
import AcademicInsightsCard from "./AcademicInsightsCard";
import ExamProgressionLineGraph from "./ExamProgressionLineGraph";
import TargetScoreTable from "./TargetScoreTable";
import StudentLookupModal from "./StudentLookupModal";
import { Loader2, Printer, BookOpen, Layers, Target } from "lucide-react";

export default function StudentPortal() {
  const searchParams = useSearchParams();
  const queryStudentId = searchParams.get("id");

  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>("");
  const [directory, setDirectory] = useState<StudentDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [landingSection, setLandingSection] = useState<"AURA" | "ZEN" | "NEO">("AURA");

  // 1. Fetch directory on mount
  useEffect(() => {
    fetchStudentDirectory()
      .then((items) => {
        setDirectory(items);

        // Only auto-load if explicit URL query parameter ?id=... is present
        if (queryStudentId) {
          setActiveStudentId(queryStudentId);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Directory fetch error:", err);
        setIsLoading(false);
      });
  }, [queryStudentId]);

  // 2. Real-time Firestore subscription for active student
  useEffect(() => {
    if (!activeStudentId) {
      setStudent(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Set up real-time listener
    const unsubscribe = subscribeStudentById(
      activeStudentId,
      (updatedStudent) => {
        if (updatedStudent) {
          setStudent(updatedStudent);
          setIsLiveUpdating(true);
          setTimeout(() => setIsLiveUpdating(false), 2000);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Subscription error:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeStudentId]);

  const handleSelectStudent = (id: string) => {
    setActiveStudentId(id);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  if (isLoading && !student) {
    return (
      <div className="bg-slate-50/50 min-h-screen">
        <DashboardHeader
          student={null}
          directory={directory}
          onSelectStudent={handleSelectStudent}
          onOpenLookup={() => setIsLookupOpen(true)}
          isLiveUpdating={false}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-10 h-10 animate-spin text-navy mb-4" />
          <h2 className="text-xl font-bold text-navy font-serif">
            Loading Academic Record...
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Connecting to CCIS Academic Performance Repository
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    const sectionStudents = directory.filter((d) => d.group === landingSection);

    return (
      <div className="bg-slate-50/50 min-h-screen">
        <DashboardHeader
          student={null}
          directory={directory}
          onSelectStudent={handleSelectStudent}
          onOpenLookup={() => setIsLookupOpen(true)}
          isLiveUpdating={false}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
          {/* Institutional Welcome Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs text-center relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-navy border border-blue-100 text-xs font-mono font-semibold">
                <span>CBSE Affiliated No. 1730867</span>
                <span>•</span>
                <span>Class IX Academic Performance Portal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-navy font-serif tracking-tight">
                Class IX Student Academic Records & Target Tracker
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                Continuous performance evaluation, weighted mark aggregation, and predictive target modeling for Cambridge Court International School scholars.
              </p>

              {/* Quick Section Tabs */}
              <div className="pt-4 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(["AURA", "ZEN", "NEO"] as const).map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setLandingSection(sec)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        landingSection === sec
                          ? "bg-navy text-white shadow-xs"
                          : "text-slate-600 hover:text-navy hover:bg-slate-200/60"
                      }`}
                    >
                      Section IX-{sec}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Showing {sectionStudents.length} enrolled students in Section IX-{landingSection}
                </span>
              </div>
            </div>

            {/* Quick-Pick Student Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {sectionStudents.slice(0, 8).map((item) => (
                <button
                  key={item.studentId}
                  type="button"
                  onClick={() => handleSelectStudent(item.studentId)}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-navy/40 hover:bg-blue-50/40 transition-all text-left group shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {item.enrollmentNumber}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        IX-{item.group}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-navy group-hover:text-blue-700 transition-colors truncate">
                      {item.name}
                    </h4>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Baseline Score:</span>
                    <span className="font-mono font-bold text-navy">{item.overallDisplay || "Recorded"}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Directory Button */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsLookupOpen(true)}
                type="button"
                className="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white font-semibold text-xs transition-all shadow-xs inline-flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Browse All 97 Class IX Students</span>
              </button>
            </div>
          </div>

          {/* Institutional Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-3">
                <Target className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-navy mb-1 font-serif">
                Predictive Target Score Modeling
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculates precise marks required in Mid Term (/80), PT-2 (/20), and Final (/80) exams to hit institutional benchmark targets.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center mb-3">
                <BookOpen className="w-4 h-4 text-navy" />
              </div>
              <h3 className="text-sm font-bold text-navy mb-1 font-serif">
                Continuous 6-Subject Evaluation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Side-by-side progression tracking across English, Maths, Science, Social Science, IT, and 2nd Language (Hindi/Sanskrit/French).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-navy mb-1 font-serif">
                CBSE Weighted Distribution
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evaluated under CBSE continuous scheme: PT-1 (10%), Mid Term (30%), PT-2 (10%), Final Exam (50%).
              </p>
            </div>
          </div>
        </div>

        <StudentLookupModal
          isOpen={isLookupOpen}
          onClose={() => setIsLookupOpen(false)}
          onSelectStudent={handleSelectStudent}
          directory={directory}
          activeStudentId={activeStudentId}
        />
      </div>
    );
  }

  // Helper values for delta calculation
  const e1Val = student.exams?.["exam-1"]?.overall?.value ?? student.currentPerformance.overall.value;
  const e2Val = student.exams?.["exam-2"]?.overall?.value;
  const targetVal = student.schoolTarget?.overall?.value;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Student Header with Enrollment Entry */}
      <DashboardHeader
        student={student}
        directory={directory}
        onSelectStudent={handleSelectStudent}
        onOpenLookup={() => setIsLookupOpen(true)}
        isLiveUpdating={isLiveUpdating}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Top 4 Core Metric Cards */}
        <section aria-label="Core Academic Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Exam-1: PT-1 Baseline */}
            <div className="bg-white rounded-xl border border-slate-200 border-t-2 border-t-navy p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    PT-1 Baseline
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-navy border border-blue-100">
                    Weight: 10%
                  </span>
                </div>
                <div className="text-2xl font-bold text-navy font-mono tracking-tight">
                  {student.exams?.["exam-1"]?.overall?.displayValue || student.currentPerformance.overall.displayValue}
                </div>
              </div>
              <div className="pt-2.5 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Scale:</span>
                <span className="font-mono text-slate-700 font-semibold">Out of 20 marks</span>
              </div>
            </div>

            {/* Gap to Target */}
            <div className="bg-white rounded-xl border border-slate-200 border-t-2 border-t-emerald-500 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Gap to Target
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    90% remaining
                  </span>
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight">
                  {e1Val !== undefined && targetVal !== undefined ? (
                    e1Val >= targetVal ? (
                      <span className="text-emerald-600">On Track</span>
                    ) : (
                      <span className="text-amber-600">{Math.round((targetVal - e1Val) * 10) / 10}% gap</span>
                    )
                  ) : (
                    <span className="text-slate-400 font-sans text-xl">N/A</span>
                  )}
                </div>
              </div>
              <div className="pt-2.5 border-t border-slate-100 mt-3 text-[11px] text-slate-500">
                3 exams remaining to close the gap
              </div>
            </div>

            {/* Upcoming: Mid Term */}
            <div className="bg-white rounded-xl border border-slate-200 border-t-2 border-t-blue-500 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Next: Mid Term
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                    Weight: 30%
                  </span>
                </div>
                <div className="text-2xl font-bold text-navy font-mono tracking-tight">
                  {student.exams?.["exam-2"]?.isPredicted === false
                    ? student.exams["exam-2"].overall?.displayValue || "Pending"
                    : "Predicted"}
                </div>
              </div>
              <div className="pt-2.5 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Scale:</span>
                <span className="font-mono text-slate-700 font-semibold">Out of 80 marks</span>
              </div>
            </div>

            {/* Target Goal */}
            <div className="bg-white rounded-xl border border-slate-200 border-t-2 border-t-amber-500 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    School Target
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    End-of-Year
                  </span>
                </div>
                <div className="text-2xl font-bold text-navy font-mono tracking-tight">
                  {student.schoolTarget?.overall?.displayValue && student.schoolTarget.overall.displayValue !== "Not Assigned"
                    ? student.schoolTarget.overall.displayValue
                    : "Not Assigned"}
                </div>
              </div>
              <div className="pt-2.5 border-t border-slate-100 mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Status:</span>
                <span className="font-semibold text-slate-700">
                  {student.schoolTarget?.targetStatus === "ACHIEVED" ? "Met" : "In Progress"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Target & Prediction Section */}
        <section aria-label="Target & Prediction Analytics" className="space-y-6 sm:space-y-8">
          {/* Longitudinal Exam Line Graph with Predictions */}
          <ExamProgressionLineGraph student={student} />

          {/* Per-Subject Target Score & Requirement Table */}
          <TargetScoreTable student={student} />

          {/* Academic Observations */}
          <div className="grid grid-cols-1 gap-6">
            <AcademicInsightsCard student={student} />
          </div>
        </section>

        {/* Print / Export Footer Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Cambridge Court International School • Class IX Academic Performance & Target Tracker
          </p>

          <button
            onClick={handlePrint}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Academic Card</span>
          </button>
        </div>
      </div>

      {/* Lookup Modal */}
      <StudentLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onSelectStudent={handleSelectStudent}
        directory={directory}
        activeStudentId={activeStudentId}
      />
    </div>
  );
}
