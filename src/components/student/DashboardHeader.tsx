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
  const dropdownRef = useRef<HTMLFormElement>(null);

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
    <header className="bg-white border-b border-slate-200/80 shadow-xs relative">
      {/* Top brand gradient line */}
      <div className="h-1 w-full bg-gradient-to-r from-navy via-[#25407d] to-gold" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Top Institutional Bar: School identity + Tools */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* School Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center font-serif font-bold text-lg border border-navy-light shadow-xs shrink-0">
              CC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-navy tracking-tight font-serif uppercase">
                  Cambridge Court International School
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-navy font-semibold border border-blue-100">
                  Session 2026–27
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Class IX Academic Performance & Target Tracking Portal
              </p>
            </div>
          </div>

          {/* Header Action Tools: Search, Section Shortcuts, Directory, Sync */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Section Shortcuts */}
            <div className="hidden sm:flex items-center gap-1 mr-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mr-1">Sec:</span>
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
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all border ${
                    student?.group === sec
                      ? "bg-navy text-white border-navy shadow-xs"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Compact Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:flex-initial sm:w-64" ref={dropdownRef}>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  placeholder="Enrollment (e.g. AURA-02)"
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-navy placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-navy focus:ring-1 focus:ring-navy/20 transition-all font-mono"
                  autoComplete="off"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue("");
                      setIsDropdownOpen(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label="Clear input"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {isDropdownOpen && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-56 overflow-y-auto z-50 divide-y divide-slate-100">
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
                      className="w-full px-3 py-2 text-left hover:bg-blue-50/60 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 text-navy border border-slate-200 rounded">
                          {item.enrollmentNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-navy truncate max-w-[120px]">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        IX-{item.group}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Directory Button */}
            <button
              type="button"
              onClick={onOpenLookup}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shrink-0"
              title="Browse Complete Class IX Directory"
            >
              <UserCheck className="w-3.5 h-3.5 text-navy" />
              <span className="hidden sm:inline">Directory</span>
            </button>

            {/* Sync Sheet Button */}
            <button
              type="button"
              onClick={handleSyncSheet}
              disabled={isSyncing}
              title="Pull latest live marks from Google Sheet"
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-navy ${isSyncing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{isSyncing ? "Syncing..." : "Sync Sheet"}</span>
            </button>
          </div>
        </div>

        {/* Error / Sync notifications */}
        {errorMsg && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {syncFeedback && (
          <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${
            syncFeedback.isError ? "text-rose-600 bg-rose-50 border-rose-100" : "text-emerald-700 bg-emerald-50 border-emerald-100"
          }`}>
            {syncFeedback.isError ? (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
            <span>{syncFeedback.text}</span>
          </div>
        )}

        {/* Active Student Profile Banner */}
        {student ? (
          <div className="pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              {/* Initials Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-[#182848] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm border border-slate-200 shrink-0">
                {student.name
                  .split(" ")
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join("")}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-navy tracking-tight font-serif">
                    {student.name}
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200">
                    {student.enrollmentNumber}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-navy">
                    <School className="w-3 h-3 text-navy" />
                    Class IX - {student.group}
                  </span>
                  <span>•</span>
                  <span>
                    2nd Language: <strong className="text-slate-700">{student.secondLanguage || "Hindi"}</strong>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-full text-[10px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Sync Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center text-xs text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Synced: {formattedDate}</span>
            </div>
          </div>
        ) : (
          <div className="pt-4 text-center py-2">
            <p className="text-xs text-slate-500">
              Select or search a student above (or choose <span className="font-semibold text-navy">AURA</span>, <span className="font-semibold text-navy">ZEN</span>, or <span className="font-semibold text-navy">NEO</span>) to view academic performance & target predictions.
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
