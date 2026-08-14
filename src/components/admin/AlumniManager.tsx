"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import {
  CheckCircle,
  XCircle,
  Award,
  Search,
  Trash2,
  ExternalLink,
  Mail,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export interface AlumniProfile {
  id: string;
  userId?: string;
  name?: string;
  batch: number;
  program?: string;
  school?: string;
  company?: string;
  role?: string;
  industry?: string;
  skills?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  isMentor?: boolean;
  isFeatured?: boolean;
  linkedin?: string;
  phone?: string;
  bio?: string;
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
  };
  createdAt?: string;
}

interface AlumniManagerProps {
  alumniList: AlumniProfile[];
  loading: boolean;
  onUpdateAlumni: (id: string, updates: Partial<AlumniProfile>) => Promise<void>;
  onDeleteAlumni: (id: string) => Promise<void>;
}

export default function AlumniManager({
  alumniList,
  loading,
  onUpdateAlumni,
  onDeleteAlumni,
}: AlumniManagerProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "verified" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const pendingCount = alumniList.filter((a) => !a.isVerified).length;
  const verifiedCount = alumniList.filter((a) => a.isVerified).length;

  const filtered = alumniList.filter((a) => {
    const isV = !!a.isVerified;
    const matchesTab =
      activeTab === "all" ? true : activeTab === "pending" ? !isV : isV;

    const q = searchQuery.toLowerCase();
    const name = (a.user?.name || a.name || "").toLowerCase();
    const comp = (a.company || "").toLowerCase();
    const role = (a.role || "").toLowerCase();
    const skills = (a.skills || "").toLowerCase();

    const matchesSearch =
      q === "" ||
      name.includes(q) ||
      comp.includes(q) ||
      role.includes(q) ||
      skills.includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-navy text-2xl">
            Alumni Hub &amp; Verification Suite
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Moderate graduate registrations, approve directory visibility, and assign mentor badges.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {pendingCount} graduate profile{pendingCount !== 1 ? "s" : ""} awaiting verification approval
          </div>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-cream-line p-4 rounded-2xl shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
              activeTab === "pending"
                ? "bg-amber-500 text-white border-amber-500 shadow-card"
                : "bg-white text-ink-muted border-cream-line hover:border-gold hover:text-navy"
            }`}
          >
            <span>Pending Review</span>
            <span className="bg-white/20 text-white px-1.5 py-0.2 rounded-full font-mono text-[10px]">
              {pendingCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`px-4 py-2 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
              activeTab === "verified"
                ? "bg-navy text-white border-navy shadow-card"
                : "bg-white text-ink-muted border-cream-line hover:border-gold hover:text-navy"
            }`}
          >
            <span>Verified Active</span>
            <span className="bg-white/20 text-white px-1.5 py-0.2 rounded-full font-mono text-[10px]">
              {verifiedCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all border ${
              activeTab === "all"
                ? "bg-navy text-white border-navy shadow-card"
                : "bg-white text-ink-muted border-cream-line hover:border-gold hover:text-navy"
            }`}
          >
            All ({alumniList.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alumni by name, company, role, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-cream/10"
          />
        </div>
      </div>

      {/* Alumni Cards */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-cream-line rounded-2xl">
          <p className="font-serif font-bold text-navy text-base">No alumni profiles in this category</p>
          <p className="text-xs text-ink-muted mt-1">All registrations have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const name = item.user?.name || item.name || "Alumni Member";
            const email = item.user?.email || "";
            const avatar =
              item.user?.avatarUrl ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl p-5 shadow-card flex flex-col justify-between gap-4 transition-all ${
                  item.isVerified ? "border-cream-line" : "border-amber-300 bg-amber-50/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cream-line shrink-0"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-serif font-bold text-navy text-base truncate">{name}</h4>
                      <span className="px-2 py-0.5 bg-gold/15 text-gold-dark font-mono font-bold text-[10px] rounded shrink-0">
                        Class of {item.batch}
                      </span>
                    </div>

                    <p className="text-xs text-navy font-semibold flex items-center gap-1 mt-0.5">
                      <Briefcase className="w-3 h-3 text-gold-dark shrink-0" />
                      <span className="truncate">
                        {item.role ? `${item.role} at ${item.company || "Self-Employed"}` : "Graduate"}
                      </span>
                    </p>

                    {email && (
                      <p className="text-[11px] text-ink-muted truncate mt-0.5">{email}</p>
                    )}

                    {item.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.skills.split(",").slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-sans font-semibold bg-cream px-2 py-0.5 rounded text-ink-muted"
                          >
                            {s.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges and Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cream-line/60">
                  <div className="flex items-center gap-2">
                    {/* Verified Status */}
                    {item.isVerified ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 font-mono">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    ) : (
                      <button
                        onClick={() => onUpdateAlumni(item.id, { isVerified: true })}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Approve Profile
                      </button>
                    )}

                    {/* Mentor Toggle */}
                    <button
                      onClick={() => onUpdateAlumni(item.id, { isMentor: !item.isMentor })}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors border flex items-center gap-1 ${
                        item.isMentor
                          ? "bg-gold text-navy border-gold"
                          : "bg-white text-ink-muted border-cream-line hover:border-gold hover:text-navy"
                      }`}
                    >
                      <Award className="w-3 h-3" /> Mentor: {item.isMentor ? "ON" : "OFF"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.linkedin && (
                      <a
                        href={item.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-[#0A66C2] hover:bg-blue-50 rounded-lg transition-colors"
                        title="LinkedIn Profile"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      </a>
                    )}
                    <button
                      onClick={() => onDeleteAlumni(item.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Alumni Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
