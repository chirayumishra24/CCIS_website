"use client";
import React, { useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { Mail, Phone, Search, Trash2, CheckCircle2, MessageSquare, Clock, ArrowUpRight } from "lucide-react";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status?: "read" | "unread" | "responded";
  createdAt: string;
}

interface ContactMessagesProps {
  messages: ContactMessage[];
  loading: boolean;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
}

export default function ContactMessagesManager({
  messages,
  loading,
  onUpdateStatus,
  onDeleteMessage,
}: ContactMessagesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>("All");

  const unreadCount = messages.filter((m) => m.status === "unread" || !m.status).length;

  const filtered = messages.filter((m) => {
    const s = m.status || "unread";
    const matchesTab = selectedStatusTab === "All" || s === selectedStatusTab;

    const q = searchQuery.toLowerCase();
    const name = (m.name || "").toLowerCase();
    const email = (m.email || "").toLowerCase();
    const msg = (m.message || "").toLowerCase();
    const subj = (m.subject || "").toLowerCase();

    const matchesSearch =
      q === "" ||
      name.includes(q) ||
      email.includes(q) ||
      msg.includes(q) ||
      subj.includes(q);

    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-navy text-2xl">
            Contact Messages &amp; Inquiries
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            View and respond to general queries submitted through the public Contact page.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-xs text-rose-900 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {unreadCount} unread parent message{unreadCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-cream-line p-4 rounded-2xl shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          {["All", "unread", "read", "responded"].map((tab) => {
            const count =
              tab === "All"
                ? messages.length
                : messages.filter((m) => (m.status || "unread") === tab).length;
            const isActive = selectedStatusTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setSelectedStatusTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-2 ${
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

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-cream/10"
          />
        </div>
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-cream-line rounded-2xl">
          <p className="font-serif font-bold text-navy text-base">No messages found</p>
          <p className="text-xs text-ink-muted mt-1">Inbox is all caught up.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((msg) => {
            const isUnread = msg.status === "unread" || !msg.status;

            return (
              <div
                key={msg.id}
                className={`bg-white border rounded-2xl p-5 shadow-card flex flex-col gap-3 transition-all ${
                  isUnread ? "border-gold/60 bg-gold/[0.02]" : "border-cream-line"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        isUnread ? "bg-rose-500 animate-pulse" : "bg-cream-line"
                      }`}
                      title={isUnread ? "Unread Message" : "Read"}
                    />
                    <div>
                      <h4 className="font-serif font-bold text-navy text-base leading-snug">
                        {msg.name}
                      </h4>
                      <span className="text-xs text-gold-dark font-semibold font-mono">
                        {msg.subject || "General Inquiry"}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-ink-muted flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-gold-dark" />
                    {new Date(msg.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>

                {/* Message Body */}
                <div className="bg-cream/15 p-4 rounded-xl border border-cream-line/60 text-xs text-ink leading-relaxed">
                  {msg.message}
                </div>

                {/* Sender details and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-cream-line/50">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-navy">
                    <a
                      href={`mailto:${msg.email}`}
                      className="hover:text-gold flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-gold-dark" /> {msg.email}
                    </a>
                    {msg.phone && (
                      <a
                        href={`tel:${msg.phone}`}
                        className="hover:text-gold flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold-dark" /> {msg.phone}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status switcher */}
                    <button
                      onClick={() =>
                        onUpdateStatus(msg.id, isUnread ? "read" : "unread")
                      }
                      className="px-3 py-1 bg-cream/40 hover:bg-cream text-navy rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Mark as {isUnread ? "Read" : "Unread"}
                    </button>
                    <a
                      href={`mailto:${msg.email}?subject=RE: CCIS Inquiry - ${encodeURIComponent(
                        msg.subject || "General Inquiry"
                      )}`}
                      className="px-3 py-1 bg-navy hover:bg-navy-dark text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      Reply <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete message"
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
