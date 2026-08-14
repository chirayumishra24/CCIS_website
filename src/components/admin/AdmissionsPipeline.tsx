"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import {
  Search,
  Download,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  FileText,
  Trash2,
  CheckCircle,
  Clock,
  User,
  Plus,
  X,
  Sparkles,
} from "lucide-react";

interface Note {
  text: string;
  createdAt: string;
}

interface AdmissionLead {
  id: string;
  name: string;
  studentName?: string;
  parentName?: string;
  dob?: string;
  gender?: string;
  email: string;
  phone: string;
  grade: string;
  curriculum?: string;
  currentSchool?: string;
  needTransport?: string;
  visitDate?: string;
  visitTime?: string;
  message?: string;
  status?: "New" | "Contacted" | "Tour Scheduled" | "Assessment Done" | "Enrolled" | "Archived";
  notes?: Note[];
  createdAt: string;
}

interface PipelineProps {
  enquiries: AdmissionLead[];
  loading: boolean;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onAddNote: (id: string, note: string) => Promise<void>;
  onDeleteEnquiry: (id: string) => Promise<void>;
}

const statusOptions = [
  "New",
  "Contacted",
  "Tour Scheduled",
  "Assessment Done",
  "Enrolled",
  "Archived",
] as const;

export default function AdmissionsPipeline({
  enquiries,
  loading,
  onUpdateStatus,
  onAddNote,
  onDeleteEnquiry,
}: PipelineProps) {
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [activeNotesLead, setActiveNotesLead] = useState<AdmissionLead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Filter leads
  const filteredLeads = enquiries.filter((lead) => {
    const currentStatus = lead.status || "New";
    const matchesStatus = selectedStatusTab === "All" || currentStatus === selectedStatusTab;

    const matchesGrade = selectedGrade === "All" || lead.grade.includes(selectedGrade);

    const q = searchQuery.toLowerCase();
    const sName = (lead.studentName || lead.name || "").toLowerCase();
    const pName = (lead.parentName || "").toLowerCase();
    const email = (lead.email || "").toLowerCase();
    const phone = (lead.phone || "").toLowerCase();

    const matchesSearch =
      q === "" ||
      sName.includes(q) ||
      pName.includes(q) ||
      email.includes(q) ||
      phone.includes(q);

    return matchesStatus && matchesGrade && matchesSearch;
  });

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = [
      "Application ID",
      "Date",
      "Student Name",
      "Parent Name",
      "Phone",
      "Email",
      "Grade",
      "Curriculum",
      "Status",
      "Campus Visit Date",
      "Parent Query",
    ];

    const rows = filteredLeads.map((e) => [
      e.id,
      new Date(e.createdAt).toLocaleDateString("en-IN"),
      `"${e.studentName || e.name || ""}"`,
      `"${e.parentName || ""}"`,
      `"${e.phone || ""}"`,
      `"${e.email || ""}"`,
      `"${e.grade || ""}"`,
      `"${e.curriculum || "CBSE"}"`,
      `"${e.status || "New"}"`,
      `"${e.visitDate ? `${e.visitDate} (${e.visitTime || ""})` : "Not scheduled"}"`,
      `"${(e.message || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `CCIS_Admissions_Export_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeNotesLead || !newNoteText.trim()) return;

    setSavingNote(true);
    try {
      await onAddNote(activeNotesLead.id, newNoteText.trim());
      setNewNoteText("");
      // Update local active lead state
      const updatedNotes = [
        ...(activeNotesLead.notes || []),
        { text: newNoteText.trim(), createdAt: new Date().toISOString() },
      ];
      setActiveNotesLead({ ...activeNotesLead, notes: updatedNotes });
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header controls bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-navy text-2xl">
            Admissions Pipeline &amp; CRM
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage prospective student leads, follow-ups, and campus tour bookings.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={exportToCSV}
          className="rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" /> Export to CSV ({filteredLeads.length})
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-cream-line p-4 rounded-2xl shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student, parent, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-cream/10"
          />
        </div>

        {/* Grade Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-navy uppercase tracking-wider shrink-0">
            Grade:
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="p-2 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-white"
          >
            <option value="All">All Grades</option>
            <option value="Nursery">Nursery / Playgroup</option>
            <option value="KG">KG / Prep</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 2">Grade 2</option>
            <option value="Grade 3">Grade 3</option>
            <option value="Grade 4">Grade 4</option>
            <option value="Grade 5">Grade 5</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
          </select>
        </div>
      </div>

      {/* Status Pipeline Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-cream-line pb-2">
        {["All", ...statusOptions].map((tab) => {
          const count =
            tab === "All"
              ? enquiries.length
              : enquiries.filter((e) => (e.status || "New") === tab).length;
          const isActive = selectedStatusTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setSelectedStatusTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-navy text-white border-navy shadow-card"
                  : "bg-white text-ink-muted border-cream-line hover:border-gold hover:text-navy"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-gold text-navy" : "bg-cream text-ink-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pipeline Table */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-16 bg-white border border-cream-line rounded-2xl">
          <p className="font-serif font-bold text-navy text-lg">No admissions leads found</p>
          <p className="text-xs text-ink-muted mt-1">Try modifying your search or status filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream/30 border-b border-cream-line text-navy font-bold uppercase tracking-wider">
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Student / Parent</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Grade / Board</th>
                  <th className="p-3.5">Campus Visit</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Staff Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-line/50 font-sans">
                {filteredLeads.map((lead) => {
                  const sName = lead.studentName || lead.name;
                  const currentStatus = lead.status || "New";

                  return (
                    <tr key={lead.id} className="hover:bg-cream/10 transition-colors">
                      {/* Date */}
                      <td className="p-3.5 font-mono text-ink-muted whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Student & Parent */}
                      <td className="p-3.5">
                        <div className="font-serif font-bold text-navy text-sm">{sName}</div>
                        <div className="text-ink-muted text-[11px]">
                          Parent: <strong className="text-navy">{lead.parentName || "-"}</strong>
                        </div>
                      </td>

                      {/* Contact & Quick actions */}
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-navy hover:text-gold flex items-center gap-1.5 font-semibold"
                          >
                            <Phone className="w-3 h-3 text-gold-dark" /> {lead.phone}
                          </a>
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-ink-muted hover:text-navy flex items-center gap-1.5 truncate max-w-[150px]"
                            title={lead.email}
                          >
                            <Mail className="w-3 h-3 text-gold-dark" /> {lead.email}
                          </a>
                        </div>
                      </td>

                      {/* Grade & Curriculum */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 bg-navy/5 text-navy font-bold rounded font-mono text-[11px] block w-fit">
                          {lead.grade}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gold-dark mt-1 block">
                          {lead.curriculum || "CBSE"}
                        </span>
                      </td>

                      {/* Visit Date */}
                      <td className="p-3.5">
                        {lead.visitDate ? (
                          <div className="flex flex-col">
                            <span className="font-semibold text-navy flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gold" /> {lead.visitDate}
                            </span>
                            <span className="text-[10px] text-ink-muted">{lead.visitTime || ""}</span>
                          </div>
                        ) : (
                          <span className="text-ink-muted italic text-[11px]">Not scheduled</span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-3.5">
                        <select
                          value={currentStatus}
                          onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg font-bold text-[11px] uppercase tracking-wider outline-none border cursor-pointer ${
                            currentStatus === "New"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : currentStatus === "Contacted"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : currentStatus === "Tour Scheduled"
                              ? "bg-purple-50 text-purple-800 border-purple-200"
                              : currentStatus === "Enrolled"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Staff Notes button */}
                      <td className="p-3.5">
                        <button
                          onClick={() => setActiveNotesLead(lead)}
                          className="px-2.5 py-1 bg-cream/30 hover:bg-gold/20 text-navy rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <FileText className="w-3 h-3 text-gold-dark" />
                          <span>Notes ({(lead.notes || []).length})</span>
                        </button>
                      </td>

                      {/* Row Quick Triggers */}
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                              lead.parentName || lead.name
                            )},%20greetings%20from%20Cambridge%20Court%20International%20School%20Admissions.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => onDeleteEnquiry(lead.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Notes Modal */}
      {activeNotesLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-cream-line rounded-2xl p-6 shadow-2xl max-w-lg w-full flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-line">
              <div>
                <h3 className="font-serif font-bold text-navy text-lg">
                  Staff Notes for {activeNotesLead.studentName || activeNotesLead.name}
                </h3>
                <p className="text-xs text-ink-muted">
                  Grade: {activeNotesLead.grade} &bull; Parent: {activeNotesLead.parentName || "-"}
                </p>
              </div>
              <button
                onClick={() => setActiveNotesLead(null)}
                className="text-ink-muted hover:text-navy p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Parent original message if any */}
            {activeNotesLead.message && (
              <div className="bg-cream/20 p-3 rounded-xl border border-cream-line/60 text-xs">
                <span className="font-bold text-navy block mb-0.5">Parent&apos;s Initial Query:</span>
                <p className="text-ink-muted leading-relaxed">{activeNotesLead.message}</p>
              </div>
            )}

            {/* Existing notes list */}
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {(activeNotesLead.notes || []).length === 0 ? (
                <p className="text-xs text-ink-muted italic py-4 text-center">
                  No internal staff notes recorded yet.
                </p>
              ) : (
                activeNotesLead.notes!.map((note, idx) => (
                  <div key={idx} className="p-3 bg-cream/10 border border-cream-line rounded-xl text-xs">
                    <p className="text-navy">{note.text}</p>
                    <span className="text-[10px] font-mono text-ink-muted/70 mt-1 block">
                      {new Date(note.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Add note input */}
            <form onSubmit={handleSaveNote} className="flex flex-col gap-2 pt-2 border-t border-cream-line">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">
                Add Staff Follow-Up Note:
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Spoke with mother on phone; confirmed campus visit for Saturday at 11 AM..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none resize-none"
              />
              <div className="flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setActiveNotesLead(null)}
                  className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-navy uppercase tracking-wider"
                >
                  Close
                </button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  isLoading={savingNote}
                  className="rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
