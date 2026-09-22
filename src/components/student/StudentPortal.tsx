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
import OverallPerformanceCard from "./OverallPerformanceCard";
import SchoolTargetCard from "./SchoolTargetCard";
import TargetGapCard from "./TargetGapCard";
import SubjectPerformanceChart from "./SubjectPerformanceChart";
import SubjectPerformanceList from "./SubjectPerformanceList";
import AcademicInsightsCard from "./AcademicInsightsCard";
import MultiExamMatrix from "./MultiExamMatrix";
import ExamProgressionTimeline from "./ExamProgressionTimeline";
import ExamProgressionLineGraph from "./ExamProgressionLineGraph";
import TargetScoreTable from "./TargetScoreTable";
import TargetProgressionChart from "./TargetProgressionChart";
import StudentLookupModal from "./StudentLookupModal";
import { UpcomingExamsEmptyState, TargetSummaryCard } from "./EmptyStates";
import { Loader2, AlertCircle, RefreshCw, Printer, BookOpen, Layers, Target } from "lucide-react";

export default function StudentPortal() {
  const searchParams = useSearchParams();
  const queryStudentId = searchParams.get("id");

  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>("");
  const [directory, setDirectory] = useState<StudentDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<"matrix" | "exam-1" | "exam-2" | "target-calc">("matrix");

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
    return (
      <div className="bg-slate-50/50 min-h-screen">
        <DashboardHeader
          student={null}
          directory={directory}
          onSelectStudent={handleSelectStudent}
          onOpenLookup={() => setIsLookupOpen(true)}
          isLiveUpdating={false}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-navy mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-navy" />
            </div>
            <h2 className="text-2xl font-bold text-navy font-serif">
              Enter an Enrollment Number Above
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Use the search box above to enter your enrollment number (e.g. <span className="font-mono font-semibold text-navy">CCIS-IX-AURA-02</span>) or click below to browse the directory.
            </p>
            <button
              onClick={() => setIsLookupOpen(true)}
              type="button"
              className="mt-6 px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white font-semibold text-sm transition-all shadow-xs"
            >
              Browse Student Directory
            </button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Exam-1: Baseline */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Exam-1 • Baseline
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-navy border border-blue-100">
                    6 Subjects
                  </span>
                </div>
                <div className="text-3xl font-bold text-navy font-serif tracking-tight">
                  {student.exams?.["exam-1"]?.overall?.displayValue || student.currentPerformance.overall.displayValue}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 text-xs text-slate-500 flex items-center justify-between">
                <span>Diagnostic Baseline</span>
                <span className="font-mono text-slate-700 font-semibold">100% Scale</span>
              </div>
            </div>

            {/* Exam-2: Mid Term */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Exam-2 • Mid Term
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Latest Exam
                  </span>
                </div>
                <div className="text-3xl font-bold text-navy font-serif tracking-tight">
                  {student.exams?.["exam-2"]?.overall?.displayValue || "Pending"}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 text-xs text-slate-500 flex items-center justify-between">
                <span>Total Marks:</span>
                <span className="font-mono text-navy font-bold">
                  {student.exams?.["exam-2"]?.totalMarksScored ?? student.exams?.["exam-2"]?.totalMarks ?? "-"}
                </span>
              </div>
            </div>

            {/* Progression Delta */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    Progression Delta
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                    E1 vs E2
                  </span>
                </div>
                <div className="text-3xl font-bold font-serif tracking-tight flex items-baseline gap-2">
                  {e1Val !== undefined && e2Val !== undefined ? (
                    e2Val >= e1Val ? (
                      <span className="text-emerald-600">+{Math.round((e2Val - e1Val) * 10) / 10}%</span>
                    ) : (
                      <span className="text-rose-600">{Math.round((e2Val - e1Val) * 10) / 10}%</span>
                    )
                  ) : (
                    <span className="text-slate-400 text-2xl font-sans">N/A</span>
                  )}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 text-xs text-slate-500">
                {e1Val !== undefined && e2Val !== undefined && e2Val >= e1Val
                  ? "Positive upward trajectory"
                  : e1Val !== undefined && e2Val !== undefined
                  ? "Requires targeted focus"
                  : "Awaiting multiple scores"}
              </div>
            </div>

            {/* Target Goal & Gap */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    School Target
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gold/20 text-navy font-bold">
                    Goal
                  </span>
                </div>
                <div className="text-3xl font-bold text-navy font-serif tracking-tight">
                  {student.schoolTarget?.overall?.displayValue && student.schoolTarget.overall.displayValue !== "Not Assigned"
                    ? student.schoolTarget.overall.displayValue
                    : "Not Assigned"}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 text-xs text-slate-500 flex items-center justify-between">
                <span>Target Status:</span>
                <span className="font-semibold text-slate-700">
                  {student.schoolTarget?.targetStatus === "ACHIEVED" ? "Achieved" : "In Progress"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("matrix")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "matrix"
                ? "bg-navy text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Comparative Matrix & Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("exam-1")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "exam-1"
                ? "bg-navy text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Exam-1 (Baseline) Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("exam-2")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "exam-2"
                ? "bg-navy text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Exam-2 (Mid Term /20) Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("target-calc")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "target-calc"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>🎯 Target Calculator</span>
          </button>
        </div>

        {/* Realigned Content View */}
        {activeTab === "matrix" ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Assessment Timeline */}
            <ExamProgressionTimeline student={student} />

            {/* Longitudinal Exam Line Graph */}
            <ExamProgressionLineGraph student={student} />

            {/* 6-Subject Comparative Matrix */}
            <MultiExamMatrix student={student} />

            {/* Comparative Visual Chart */}
            <SubjectPerformanceChart
              subjects={student.currentPerformance.subjectList}
              exam2Subjects={student.exams?.["exam-2"]?.subjectList}
            />

            {/* Academic Observations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AcademicInsightsCard student={student} />
              <TargetSummaryCard student={student} onNavigate={() => setActiveTab("target-calc")} />
            </div>
          </div>
        ) : activeTab === "exam-1" ? (
          <div className="space-y-6 sm:space-y-8">
            <SubjectPerformanceChart subjects={student.currentPerformance.subjectList} />
            <SubjectPerformanceList subjects={student.currentPerformance.subjectList} />
          </div>
        ) : activeTab === "exam-2" ? (
          <div className="space-y-6 sm:space-y-8">
            <SubjectPerformanceChart
              subjects={student.exams?.["exam-2"]?.subjectList || student.currentPerformance.subjectList}
            />
            <SubjectPerformanceList
              subjects={student.exams?.["exam-2"]?.subjectList || student.currentPerformance.subjectList}
            />
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            <TargetScoreTable student={student} />
            <TargetProgressionChart student={student} />
          </div>
        )}

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
