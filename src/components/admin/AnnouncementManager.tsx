"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Megaphone, Bell, Sparkles, AlertTriangle, Info, Check, ArrowRight } from "lucide-react";

export interface AnnouncementSettings {
  active: boolean;
  message: string;
  linkText?: string;
  linkUrl?: string;
  type: "admissions" | "urgent" | "info";
  updatedAt?: string;
}

interface AnnouncementManagerProps {
  announcement: AnnouncementSettings;
  onSaveAnnouncement: (data: AnnouncementSettings) => Promise<void>;
}

export default function AnnouncementManager({
  announcement,
  onSaveAnnouncement,
}: AnnouncementManagerProps) {
  const [formData, setFormData] = useState<AnnouncementSettings>(announcement);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await onSaveAnnouncement(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn max-w-3xl">
      <div>
        <h2 className="font-serif font-bold text-navy text-2xl">
          Global Campus Notice Ticker
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Configure the top emergency, admissions, or administrative alert banner visible across the entire website.
        </p>
      </div>

      {/* Live Preview Box */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-gold-dark" /> Live Banner Preview:
        </label>
        {formData.active ? (
          <div
            className={`py-3 px-4 rounded-xl border flex items-center justify-between gap-3 shadow-md ${
              formData.type === "urgent"
                ? "bg-maroon-dark text-white border-rose-500/40"
                : formData.type === "admissions"
                ? "bg-navy-dark text-white border-gold/40"
                : "bg-navy text-white border-blue-400/40"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-[10px] font-sans font-extrabold uppercase px-2 py-0.5 tracking-widest rounded shrink-0 flex items-center gap-1 ${
                  formData.type === "urgent"
                    ? "bg-rose-500 text-white"
                    : formData.type === "admissions"
                    ? "bg-gold text-navy shadow-glow-gold"
                    : "bg-blue-400 text-navy"
                }`}
              >
                <Bell className="w-3 h-3" />{" "}
                {formData.type === "urgent" ? "URGENT" : formData.type === "admissions" ? "ADMISSIONS" : "NOTICE"}
              </span>
              <p className="text-xs text-white/90 font-medium truncate">{formData.message}</p>
            </div>
            {formData.linkText && (
              <span className="text-xs font-bold text-gold flex items-center gap-1 shrink-0">
                {formData.linkText} <ArrowRight className="w-3 h-3" />
              </span>
            )}
          </div>
        ) : (
          <div className="p-4 bg-cream/20 border border-dashed border-cream-line rounded-xl text-center text-xs text-ink-muted">
            Ticker banner is currently <strong>disabled</strong> and hidden from visitors.
          </div>
        )}
      </div>

      {/* Configuration Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-cream-line p-6 sm:p-8 rounded-2xl shadow-card flex flex-col gap-5"
      >
        {/* Active Toggle */}
        <div className="flex items-center justify-between p-4 bg-cream/15 rounded-xl border border-cream-line">
          <div>
            <span className="font-serif font-bold text-navy text-base block">Enable Notice Ticker</span>
            <span className="text-xs text-ink-muted">Show top notification banner across all public pages</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-cream-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
          </label>
        </div>

        {/* Message Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy uppercase tracking-wider">Announcement Message *</label>
          <textarea
            rows={2}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="p-3 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none resize-none"
            placeholder="e.g. CBSE Board Registration dates announced. Submit documents before deadline..."
          />
        </div>

        {/* Mode Selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-navy uppercase tracking-wider">Banner Visual Theme</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "admissions", label: "Admissions Spotlight", desc: "Gold accent badge", icon: <Sparkles className="w-4 h-4 text-gold" /> },
              { id: "urgent", label: "Urgent Alert", desc: "Red alert highlight", icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
              { id: "info", label: "General Info", desc: "Navy notice bar", icon: <Info className="w-4 h-4 text-blue-400" /> },
            ].map((mode) => (
              <div
                key={mode.id}
                onClick={() => setFormData({ ...formData, type: mode.id as any })}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                  formData.type === mode.id
                    ? "border-navy bg-navy text-white shadow-card"
                    : "border-cream-line bg-white hover:border-gold text-navy"
                }`}
              >
                <div className="flex items-center gap-2">
                  {mode.icon}
                  <span className="font-serif font-bold text-sm">{mode.label}</span>
                </div>
                <span className={`text-[11px] ${formData.type === mode.id ? "text-white/70" : "text-ink-muted"}`}>
                  {mode.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Link Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-line">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Action Button Text</label>
            <input
              type="text"
              placeholder="e.g. View Circular or Apply Now"
              value={formData.linkText || ""}
              onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
              className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Destination URL</label>
            <input
              type="text"
              placeholder="e.g. /news-events or /admissions"
              value={formData.linkUrl || ""}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-cream-line">
          {savedSuccess ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 font-mono">
              <Check className="w-4 h-4" /> Published to Public Site Successfully
            </span>
          ) : (
            <span className="text-[11px] text-ink-muted">Changes apply immediately.</span>
          )}

          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={saving}
            className="rounded-xl font-bold uppercase tracking-wider text-xs"
          >
            Save Announcement Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
