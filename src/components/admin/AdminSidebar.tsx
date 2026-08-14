"use client";
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Megaphone,
  BarChart3,
  Mail,
  Video,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "admissions"
  | "faculty"
  | "alumni"
  | "news"
  | "announcement"
  | "stats"
  | "contact"
  | "testimonials";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  counts: {
    newAdmissions: number;
    pendingAlumni: number;
    unreadMessages: number;
  };
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  counts,
}: AdminSidebarProps) {
  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: "admissions",
      label: "Admissions CRM",
      icon: <Users className="w-4 h-4" />,
      badge: counts.newAdmissions,
      badgeColor: "bg-gold text-navy",
    },
    { id: "faculty", label: "Faculty Directory", icon: <GraduationCap className="w-4 h-4" /> },
    {
      id: "alumni",
      label: "Alumni Hub",
      icon: <Shield className="w-4 h-4" />,
      badge: counts.pendingAlumni,
      badgeColor: "bg-amber-500 text-white",
    },
    { id: "news", label: "News & Circulars", icon: <FileText className="w-4 h-4" /> },
    { id: "announcement", label: "Notice Ticker", icon: <Megaphone className="w-4 h-4" /> },
    { id: "stats", label: "Key Metrics", icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: "contact",
      label: "Messages Inbox",
      icon: <Mail className="w-4 h-4" />,
      badge: counts.unreadMessages,
      badgeColor: "bg-rose-500 text-white",
    },
    { id: "testimonials", label: "Testimonials", icon: <Video className="w-4 h-4" /> },
  ];

  return (
    <aside
      className={`bg-navy-dark text-white border-r border-gold/20 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Top Header */}
      <div>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gold text-navy flex items-center justify-center font-serif font-bold text-base shrink-0 shadow-glow-gold">
              CC
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-serif font-bold text-sm text-white truncate leading-tight">
                  CCIS Admin
                </span>
                <span className="text-[10px] text-gold-light uppercase font-mono font-semibold truncate">
                  Control Suite
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="text-white/50 hover:text-gold p-1 rounded transition-colors hidden md:block"
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-gold text-navy shadow-glow-gold font-bold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                } ${isCollapsed ? "justify-center px-0" : "justify-between"}`}
                title={item.label}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || "bg-gold text-navy"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-white/10 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-white/60 hover:text-gold hover:bg-white/5 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Open Public Website"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate font-sans uppercase text-[11px] font-semibold">View Website</span>}
        </Link>
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-rose-300 hover:text-white hover:bg-rose-600/30 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate font-sans uppercase text-[11px] font-bold">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
