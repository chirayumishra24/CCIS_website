"use client";
import React from "react";
import { AdminTab } from "./AdminSidebar";
import {
  Users,
  Shield,
  FileText,
  Mail,
  Megaphone,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle,
  Plus,
} from "lucide-react";

interface OverviewProps {
  onNavigate: (tab: AdminTab) => void;
  stats: {
    totalEnquiries: number;
    newEnquiries: number;
    totalFaculty: number;
    pendingAlumni: number;
    totalNews: number;
    unreadMessages: number;
    tickerActive: boolean;
  };
  recentEnquiries: any[];
  recentNews: any[];
}

export default function OverviewDashboard({
  onNavigate,
  stats,
  recentEnquiries,
  recentNews,
}: OverviewProps) {
  return (
    <div className="flex flex-col gap-8 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-navy via-navy-light to-navy p-6 sm:p-8 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card border border-gold/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-gold/10 rounded-full blur-2xl" />
        <div className="flex flex-col gap-1.5 z-10">
          <span className="text-gold font-mono uppercase tracking-widest text-[11px] font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Institutional Administration
          </span>
          <h2 className="font-serif font-bold text-2xl md:text-3xl">
            Welcome to CCIS Control Hub
          </h2>
          <p className="text-xs text-white/70 max-w-xl leading-relaxed mt-1">
            Manage student admissions CRM, update CBSE/IB faculty directories, verify alumni registrations, and control global campus notices in real time.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 z-10">
          <button
            onClick={() => onNavigate("admissions")}
            className="px-4 py-2.5 bg-gold hover:bg-gold-light text-navy font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-glow-gold flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" /> Admissions ({stats.newEnquiries} New)
          </button>
          <button
            onClick={() => onNavigate("news")}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Publish Circular
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Admissions */}
        <div
          onClick={() => onNavigate("admissions")}
          className="bg-white border border-cream-line p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:border-gold cursor-pointer transition-all duration-300 group flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-ink-muted">
              Admissions CRM
            </span>
            <div className="p-2.5 bg-navy/5 group-hover:bg-gold/20 text-navy group-hover:text-gold-dark rounded-xl transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-navy text-3xl">{stats.totalEnquiries}</div>
            <div className="flex items-center gap-1.5 text-xs text-gold-dark font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              {stats.newEnquiries} New unreviewed lead{stats.newEnquiries !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="text-[11px] text-ink-muted flex items-center justify-between pt-2 border-t border-cream-line/50">
            <span>Manage pipeline</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-dark" />
          </div>
        </div>

        {/* Alumni Hub */}
        <div
          onClick={() => onNavigate("alumni")}
          className="bg-white border border-cream-line p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:border-gold cursor-pointer transition-all duration-300 group flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-ink-muted">
              Alumni Verification
            </span>
            <div className="p-2.5 bg-navy/5 group-hover:bg-gold/20 text-navy group-hover:text-gold-dark rounded-xl transition-colors">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-navy text-3xl">
              {stats.pendingAlumni}
            </div>
            <div className="text-xs text-amber-600 font-semibold mt-1">
              Pending review requests
            </div>
          </div>
          <div className="text-[11px] text-ink-muted flex items-center justify-between pt-2 border-t border-cream-line/50">
            <span>Review directory</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-dark" />
          </div>
        </div>

        {/* Circulars & News */}
        <div
          onClick={() => onNavigate("news")}
          className="bg-white border border-cream-line p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:border-gold cursor-pointer transition-all duration-300 group flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-ink-muted">
              News & Circulars
            </span>
            <div className="p-2.5 bg-navy/5 group-hover:bg-gold/20 text-navy group-hover:text-gold-dark rounded-xl transition-colors">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-navy text-3xl">{stats.totalNews}</div>
            <div className="text-xs text-ink-muted font-semibold mt-1">
              Active published posts & notices
            </div>
          </div>
          <div className="text-[11px] text-ink-muted flex items-center justify-between pt-2 border-t border-cream-line/50">
            <span>Edit circulars</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-dark" />
          </div>
        </div>

        {/* Contact Messages */}
        <div
          onClick={() => onNavigate("contact")}
          className="bg-white border border-cream-line p-5 rounded-2xl shadow-card hover:shadow-card-hover hover:border-gold cursor-pointer transition-all duration-300 group flex flex-col justify-between gap-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-sans font-bold uppercase tracking-wider text-ink-muted">
              Contact Messages
            </span>
            <div className="p-2.5 bg-navy/5 group-hover:bg-gold/20 text-navy group-hover:text-gold-dark rounded-xl transition-colors">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-navy text-3xl">
              {stats.unreadMessages}
            </div>
            <div className="text-xs text-rose-600 font-semibold mt-1">
              Unread parent inquiries
            </div>
          </div>
          <div className="text-[11px] text-ink-muted flex items-center justify-between pt-2 border-t border-cream-line/50">
            <span>View inbox</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-gold-dark" />
          </div>
        </div>
      </div>

      {/* Two-column streams: Recent Admissions & Recent Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Admissions */}
        <div className="bg-white border border-cream-line rounded-2xl p-6 shadow-card flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-line">
            <h3 className="font-serif font-bold text-navy text-lg flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-dark" /> Recent Admission Applications
            </h3>
            <button
              onClick={() => onNavigate("admissions")}
              className="text-xs font-bold text-gold-dark hover:text-navy uppercase tracking-wider"
            >
              View All ({stats.totalEnquiries})
            </button>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-ink-muted py-8 text-center">No applications received yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-cream-line/50">
              {recentEnquiries.slice(0, 5).map((e) => (
                <div key={e.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex flex-col min-w-0">
                    <span className="font-serif font-bold text-navy text-sm truncate">
                      {e.name || e.studentName}
                    </span>
                    <span className="text-xs text-ink-muted truncate">
                      Parent: {e.parentName || "-"} &bull; Grade: <strong className="text-navy">{e.grade}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                        e.status === "New" || !e.status
                          ? "bg-gold/15 text-gold-dark"
                          : e.status === "Admitted" || e.status === "Enrolled"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-navy/10 text-navy"
                      }`}
                    >
                      {e.status || "New"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Published Circulars & Fast Ticker status */}
        <div className="flex flex-col gap-6">
          {/* Ticker status pill */}
          <div className="bg-cream/20 border border-cream-line rounded-2xl p-5 shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-navy text-gold rounded-xl">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  Global Notice Ticker
                </span>
                <p className="font-serif font-bold text-navy text-sm">
                  {stats.tickerActive ? "Notice Ticker is currently ACTIVE" : "Notice Ticker is OFF"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("announcement")}
              className="px-3.5 py-1.5 bg-navy text-white hover:bg-navy-dark font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Configure
            </button>
          </div>

          {/* Published News */}
          <div className="bg-white border border-cream-line rounded-2xl p-6 shadow-card flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-line">
              <h3 className="font-serif font-bold text-navy text-lg flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold-dark" /> Latest Circulars & News
              </h3>
              <button
                onClick={() => onNavigate("news")}
                className="text-xs font-bold text-gold-dark hover:text-navy uppercase tracking-wider"
              >
                Manage All
              </button>
            </div>

            {recentNews.length === 0 ? (
              <p className="text-xs text-ink-muted py-8 text-center">No posts published yet.</p>
            ) : (
              <div className="flex flex-col divide-y divide-cream-line/50">
                {recentNews.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-0">
                      <span className="font-serif font-bold text-navy text-sm truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-ink-muted font-mono">
                        {item.date} &bull; <span className="uppercase text-gold-dark font-bold">{item.category}</span>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-cream px-2 py-0.5 rounded font-mono shrink-0">
                      {item.type || "news"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
