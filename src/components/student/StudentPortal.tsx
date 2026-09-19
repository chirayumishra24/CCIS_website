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
import { UpcomingExamsEmptyState, PerformanceTrendEmptyState } from "./EmptyStates";
import StudentLookupModal from "./StudentLookupModal";
import { Loader2, AlertCircle, RefreshCw, Printer } from "lucide-react";

export default function StudentPortal() {
  const searchParams = useSearchParams();
  const queryStudentId = searchParams.get("id");

  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string>("");
  const [directory, setDirectory] = useState<StudentDirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);

  // 1. Fetch directory on mount
  useEffect(() => {
    fetchStudentDirectory()
      .then((items) => {
        setDirectory(items);

        // Determine starting student ID:
        // A) URL query parameter ?id=...
        // B) Session storage
        // C) First student in directory
        const storedId =
          typeof window !== "undefined"
            ? sessionStorage.getItem("ccis_active_student_id")
            : null;

        const initialId =
          queryStudentId ||
          storedId ||
          (items.length > 0 ? items[0].studentId : "");

        if (initialId) {
          setActiveStudentId(initialId);
        } else {
          setIsLoading(false);
          setIsLookupOpen(true);
        }
      })
      .catch((err) => {
        console.error("Directory fetch error:", err);
        setIsLoading(false);
      });
  }, [queryStudentId]);

  // 2. Real-time Firestore subscription for active student
  useEffect(() => {
    if (!activeStudentId) return;

    setIsLoading(true);

    // Save in sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ccis_active_student_id", activeStudentId);
    }

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
        {/* Top 3 Core Metric Cards */}
        <section aria-label="Core Academic Metrics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <OverallPerformanceCard overall={student.currentPerformance.overall} />
            <SchoolTargetCard target={student.schoolTarget.overall} />
            <TargetGapCard
              schoolTarget={student.schoolTarget}
              currentPerformance={student.currentPerformance}
            />
          </div>
        </section>

        {/* Subject Performance Section */}
        <section aria-label="Subject Performance Visualization and Breakdown" className="space-y-6">
          <SubjectPerformanceChart subjects={student.currentPerformance.subjectList} />
          <SubjectPerformanceList subjects={student.currentPerformance.subjectList} />
        </section>

        {/* Analytical Observations & Empty States */}
        <section aria-label="Insights and Future Assessment Projections">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AcademicInsightsCard student={student} />
            <UpcomingExamsEmptyState />
          </div>
        </section>

        {/* Longitudinal Performance Trend Section */}
        <section aria-label="Longitudinal Trend">
          <PerformanceTrendEmptyState />
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
