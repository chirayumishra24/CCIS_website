"use client";
import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { StudentDirectoryItem } from "@/lib/firebaseDb";
import { Search, X, User, School, ArrowRight, ShieldCheck } from "lucide-react";

interface StudentLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (studentId: string) => void;
  directory: StudentDirectoryItem[];
  activeStudentId?: string;
}

export default function StudentLookupModal({
  isOpen,
  onClose,
  onSelectStudent,
  directory,
  activeStudentId,
}: StudentLookupModalProps) {
  const [selectedGroup, setSelectedGroup] = useState<"ALL" | "AURA" | "ZEN" | "NEO">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen, onClose]);

  const filteredStudents = useMemo(() => {
    return directory.filter((item) => {
      const matchGroup = selectedGroup === "ALL" || item.group === selectedGroup;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.enrollmentNumber.toLowerCase().includes(q);
      return matchGroup && matchQuery;
    });
  }, [directory, selectedGroup, searchQuery]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop click to close */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[88vh] flex flex-col overflow-hidden animate-scale-in z-10"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                <ShieldCheck className="w-3 h-3 text-navy" />
                Student Portal Directory
              </span>
            </div>
            <h3 className="text-xl font-bold text-navy font-serif">
              Select Class IX Student
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access individual academic progress and target records
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Filters & Search */}
        <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
          {/* Section Filter Pills */}
          <div className="flex items-center gap-2">
            {(["ALL", "AURA", "ZEN", "NEO"] as const).map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  selectedGroup === group
                    ? "bg-navy text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {group === "ALL" ? "All Sections" : `IX-${group}`}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by student name or roll ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-ink placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all font-sans"
              autoFocus
            />
          </div>
        </div>

        {/* Student List */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-2 flex-1 max-h-[380px]">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <User className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium text-slate-600">No student records found</p>
              <p className="text-xs mt-1">Try refining your search keyword or selected section.</p>
            </div>
          ) : (
            filteredStudents.map((item) => {
              const isCurrent = item.studentId === activeStudentId;
              return (
                <button
                  key={item.studentId}
                  type="button"
                  onClick={() => {
                    onSelectStudent(item.studentId);
                    onClose();
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between group ${
                    isCurrent
                      ? "bg-blue-50/70 border-blue-300 ring-1 ring-blue-300"
                      : "bg-white border-slate-200 hover:border-navy/30 hover:bg-slate-50/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-navy font-bold text-xs font-serif">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy group-hover:text-navy/80 transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-600">
                          Class IX • {item.group}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{item.enrollmentNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {item.overallDisplay && item.overallDisplay !== "Pending" && (
                      <span className="text-xs font-mono font-bold text-navy bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.overallDisplay}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} listed</span>
          <span className="font-mono text-[11px]">CCIS Secure Student Identity</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
