"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { StudentRecord } from "@/lib/academicNormalizer";
import { StudentDirectoryItem } from "@/lib/firebaseDb";
import {
  Search,
  UserCheck,
  Calendar,
  School,
  X,
  ArrowRight,
  AlertCircle,
  Hash,
  RefreshCw,
} from "lucide-react";

interface DashboardHeaderProps {
  student: StudentRecord | null;
  directory: StudentDirectoryItem[];
  onSelectStudent: (studentId: string) => void;
  onOpenLookup: () => void;
  isLiveUpdating?: boolean;
}

function findStudentByEnrollmentOrQuery(
  rawQuery: string,
  dir: StudentDirectoryItem[]
): StudentDirectoryItem | null {
  const q = rawQuery.trim();
  if (!q) return null;

  const upper = q.toUpperCase();
  const normalized = upper.replace(/\s+/g, "-");

  // 1. Exact enrollment number (e.g. CCIS-IX-AURA-02)
  const exactEnrollment = dir.find(
    (d) =>
      d.enrollmentNumber.toUpperCase() === upper ||
      d.enrollmentNumber.toUpperCase() === normalized
  );
  if (exactEnrollment) return exactEnrollment;

  // 2. Short section format: AURA-02, AURA-2, AURA 02, ZEN-15, NEO-01
  const shortMatch = dir.find((d) => {
    const parts = d.enrollmentNumber.toUpperCase().split("-");
    if (parts.length >= 4) {
      const sec = parts[2];
      const numStr = parts[3];
      const numInt = parseInt(numStr, 10).toString();

      const cleanInput = upper.replace(/[^A-Z0-9]/g, "");
      const targetFull = `${sec}${numStr}`;
      const targetShort = `${sec}${numInt}`;

      if (
        cleanInput === targetFull ||
        cleanInput === targetShort ||
        normalized === `${sec}-${numStr}` ||
        normalized === `${sec}-${numInt}`
      ) {
        return true;
      }
    }
    return false;
  });
  if (shortMatch) return shortMatch;

  // 3. Roll / Serial number alone if numeric (e.g. 02, 2)
  const numericOnly = parseInt(q, 10);
  if (!isNaN(numericOnly) && numericOnly > 0 && numericOnly <= 40) {
    const numPad = numericOnly.toString().padStart(2, "0");
    const numMatch = dir.find(
      (d) =>
        d.enrollmentNumber.endsWith(`-${numPad}`) ||
        d.enrollmentNumber.endsWith(`-${numericOnly}`)
    );
    if (numMatch) return numMatch;
  }

  // 4. Starts with enrollment (prefix search)
  const prefixMatch = dir.find(
    (d) =>
      d.enrollmentNumber.toUpperCase().startsWith(upper) ||
      d.enrollmentNumber.toUpperCase().startsWith(normalized)
  );
  if (prefixMatch) return prefixMatch;

  // 5. Name match (substring)
  const nameMatch = dir.find((d) => d.name.toUpperCase().includes(upper));
  if (nameMatch) return nameMatch;

  return null;
}

export default function DashboardHeader({
  student,
  directory,
  onSelectStudent,
  onOpenLookup,
  isLiveUpdating = false,
}: DashboardHeaderProps) {
  const [inputValue, setInputValue] = useState(student?.enrollmentNumber || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSyncSheet = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch("/api/student/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback({
          text: `Synced ${data.syncedCount || data.count || "all"} students from Google Sheet!`,
          isError: false,
        });
        setTimeout(() => setSyncFeedback(null), 5000);
      } else {
        setSyncFeedback({ text: data.error || "Sync failed", isError: true });
      }
    } catch (err: any) {
      setSyncFeedback({ text: err.message || "Failed to reach sync endpoint", isError: true });
    } finally {
      setIsSyncing(false);
    }
  };

  // Sync input value when student changes externally
  useEffect(() => {
    if (student?.enrollmentNumber) {
      setInputValue(student.enrollmentNumber);
      setErrorMsg(null);
    }
  }, [student?.enrollmentNumber]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter autocomplete suggestions based on query
  const filteredSuggestions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return [];
    return directory
      .filter(
        (item) =>
          item.enrollmentNumber.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          `ix-${item.group}`.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [directory, inputValue]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) {
      setErrorMsg("Please enter an enrollment number (e.g. CCIS-IX-AURA-02).");
      return;
    }

    const match = findStudentByEnrollmentOrQuery(inputValue, directory);
    if (match) {
      onSelectStudent(match.studentId);
      setInputValue(match.enrollmentNumber);
      setIsDropdownOpen(false);
      setErrorMsg(null);
    } else {
      setErrorMsg(
        `No student record found for "${inputValue}". Please check your enrollment number.`
      );
    }
  };

  const formattedDate = student?.source?.lastSyncedAt
    ? new Date(student.source.lastSyncedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recently synced";

  return (
    <header className="bg-white border-b border-slate-200/80 shadow-xs relative overflow-hidden">
      {/* Top brand color accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy via-[#25407d] to-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Option to enter enrollment number */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div>
              <label
                htmlFor="enrollment-search"
                className="flex items-center gap-1.5 text-xs font-bold text-navy uppercase tracking-wider font-mono"
              >
                <Hash className="w-3.5 h-3.5 text-gold" />
                Enter Student Enrollment Number
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Type your enrollment number (e.g. CCIS-IX-AURA-02) or section roll number to view student performance.
              </p>
            </div>

            {/* Quick Section Shortcuts */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Quick Sections:</span>
              {(["AURA", "ZEN", "NEO"] as const).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    const firstInSec = directory.find((d) => d.group === sec);
                    if (firstInSec) {
                      setInputValue(firstInSec.enrollmentNumber);
                      onSelectStudent(firstInSec.studentId);
                      setErrorMsg(null);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                    student?.group === sec
                      ? "bg-navy text-white border-navy"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  IX-{sec}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1" ref={dropdownRef}>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="enrollment-search"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsDropdownOpen(true);
                  setErrorMsg(null);
                }}
                onFocus={() => {
                  if (inputValue.trim()) setIsDropdownOpen(true);
                }}
                placeholder="Enter Enrollment No. (e.g. CCIS-IX-AURA-02, AURA-05, etc.)"
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-navy placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:border-navy focus:ring-2 focus:ring-navy/10 transition-all font-mono"
                autoComplete="off"
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Suggestions Dropdown */}
              {isDropdownOpen && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-100">
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item.studentId}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelectStudent(item.studentId);
                        setInputValue(item.enrollmentNumber);
                        setIsDropdownOpen(false);
                        setErrorMsg(null);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-50/60 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-navy border border-slate-200 rounded">
                          {item.enrollmentNumber}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 group-hover:text-navy">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        IX-{item.group}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-navy hover:bg-navy-light active:bg-navy-dark text-white font-semibold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>View Student Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenLookup}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <UserCheck className="w-4 h-4 text-navy" />
              <span>Full Directory</span>
            </button>

            <button
              type="button"
              onClick={handleSyncSheet}
              disabled={isSyncing}
              title="Pull latest live marks from Google Sheet"
              className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-navy ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Sheet"}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {syncFeedback && (
            <div className={`mt-2.5 flex items-center gap-1.5 text-xs font-medium ${syncFeedback.isError ? "text-rose-600" : "text-emerald-700"}`}>
              {syncFeedback.isError ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <span>{syncFeedback.text}</span>
            </div>
          )}
        </div>

        {/* Below the enrollment number option: Student details */}
        {student && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 pt-1">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-navy border border-blue-100">
                  <School className="w-3.5 h-3.5 text-navy" />
                  Class IX • Section {student.group}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200">
                  {student.enrollmentNumber}
                </span>
                {student.secondLanguage && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                    2nd Lang: {student.secondLanguage}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight font-serif">
                Welcome, {student.name}
              </h1>

              <p className="text-sm text-slate-500 flex items-center gap-2">
                <span>Academic Session 2026–27</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Synced: {formattedDate}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <button
                type="button"
                onClick={() => {
                  setInputValue("");
                  onSelectStudent("");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-navy bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Search Another Student</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
