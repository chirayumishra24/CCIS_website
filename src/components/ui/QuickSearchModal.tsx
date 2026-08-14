"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, BookOpen, User, FileText, Compass, Sparkles, Phone, ArrowRight, Shield } from "lucide-react";

interface SearchItem {
  title: string;
  category: "Pages" | "Admissions & Fees" | "Academics" | "Campus Life" | "Faculty" | "Circulars" | "Policies";
  description: string;
  href: string;
  badge?: string;
}

const searchableDatabase: SearchItem[] = [
  { title: "Admissions 2026-27 (How to Apply)", category: "Admissions & Fees", description: "Online registration, entrance criteria, interaction rounds and step-by-step onboarding", href: "/admissions", badge: "Open" },
  { title: "Fee Structure & Scholarships", category: "Admissions & Fees", description: "Transparent installment fee schedule, sibling discounts, and merit scholarships", href: "/admissions#fees", badge: "Policy" },
  { title: "Age & Grade Eligibility Calculator", category: "Admissions & Fees", description: "Check eligibility for Nursery through Class XI for CBSE and IB boards", href: "/admissions#calculator" },
  { title: "CBSE Curriculum (Nursery to Class XII)", category: "Academics", description: "Rigorous national board with integrated JEE/NEET/CUET coaching and science/commerce streams", href: "/academics" },
  { title: "International Baccalaureate (IB PYP)", category: "Academics", description: "Inquiry-based international curriculum fostering self-directed query and global mindedness", href: "/academics", badge: "Candidate" },
  { title: "AI & Robotics Studios", category: "Campus Life", description: "Drone kits, programmable microcontrollers, 3D printers, coding arenas, and tech labs", href: "/campus-life" },
  { title: "Sports & Athletics Turf Complex", category: "Campus Life", description: "Synthetic basketball arenas, cricket nets, football turfs, athletics track, and martial arts", href: "/campus-life" },
  { title: "Central Research Library", category: "Campus Life", description: "Over 15,000 prints, quiet reading pods, digital archives, and scientific journal terminals", href: "/campus-life" },
  { title: "Faculty & Educator Directory", category: "Faculty", description: "Meet our principal, vice principal, IB coordinators, and subject specialists", href: "/faculty" },
  { title: "Mrs. Priyanshi Chandra (Principal)", category: "Faculty", description: "M.Sc, B.Ed, 18+ Yrs Exp — Group Leadership & Academic Vision", href: "/faculty" },
  { title: "Official Notices & PDF Circulars", category: "Circulars", description: "Download CBSE exam datesheets, circulars, syllabi, and administrative updates", href: "/news-events" },
  { title: "School News & Achievement Highlights", category: "Circulars", description: "National Science Exposition gold medals, inter-school athletics championships, and art shows", href: "/news-events" },
  { title: "Alumni Network & Verification Hub", category: "Pages", description: "Connect with 13,500+ graduates across global universities, tech firms, and leadership roles", href: "/alumni" },
  { title: "Campus Location & Map Directions", category: "Pages", description: "Sector-3, Mansarovar, Jaipur, Rajasthan 302020. Office hours Mon-Sat 8AM-3PM", href: "/contact" },
  { title: "School Bus Transport Routes & GPS", category: "Pages", description: "Safe GPS-tracked buses covering Mansarovar, Vaishali Nagar, Malviya Nagar, Jagatpura", href: "/contact" },
  { title: "Mandatory Public Disclosures & Policies", category: "Policies", description: "CBSE Affiliation #1730867, safety guidelines, POCSO compliance, anti-bullying and fee refund", href: "/policies", badge: "CBSE" },
];

export default function QuickSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const filteredItems = query.trim() === ""
    ? searchableDatabase.slice(0, 7)
    : searchableDatabase.filter(item => {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      });

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-navy-dark/70 backdrop-blur-md animate-fadeIn">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-cream-line overflow-hidden z-10 flex flex-col max-h-[75vh]">
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-cream-line bg-cream/15 gap-3">
          <Search className="w-5 h-5 text-gold shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search programs, admissions, faculty, circulars, fees..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm font-sans text-navy placeholder:text-ink-muted/60 outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-ink-muted hover:text-navy p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline text-[10px] uppercase font-mono font-bold text-ink-muted bg-white px-2 py-0.5 rounded border border-cream-line">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 flex flex-col gap-1 divide-y divide-cream-line/30">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8 text-gold/60 animate-pulse" />
              <p className="font-serif font-bold text-navy text-sm">No exact match found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-ink-muted max-w-xs">Try searching for keywords like &ldquo;Admissions&rdquo;, &ldquo;CBSE&rdquo;, &ldquo;Fee&rdquo;, &ldquo;Robotics&rdquo;, or &ldquo;Contact&rdquo;.</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.title + item.href}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl cursor-pointer flex items-center justify-between gap-4 transition-all duration-200 ${
                    isSelected ? "bg-navy text-white shadow-md" : "hover:bg-cream/20 text-navy"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? "bg-gold text-navy" : "bg-cream text-navy"}`}>
                      {item.category === "Academics" && <BookOpen className="w-4 h-4" />}
                      {item.category === "Admissions & Fees" && <Compass className="w-4 h-4" />}
                      {item.category === "Faculty" && <User className="w-4 h-4" />}
                      {item.category === "Circulars" && <FileText className="w-4 h-4" />}
                      {item.category === "Policies" && <Shield className="w-4 h-4" />}
                      {(item.category === "Pages" || item.category === "Campus Life") && <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSelected ? "text-gold-light" : "text-gold-dark"}`}>
                          {item.category}
                        </span>
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase font-mono ${isSelected ? "bg-white/20 text-white" : "bg-gold/15 text-gold-dark"}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <h4 className={`text-sm font-serif font-bold truncate mt-0.5 ${isSelected ? "text-white" : "text-navy"}`}>
                        {item.title}
                      </h4>
                      <p className={`text-xs truncate ${isSelected ? "text-white/70" : "text-ink-muted"}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-gold translate-x-0.5" : "text-cream-line"}`} />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-cream/15 border-t border-cream-line flex items-center justify-between text-[11px] text-ink-muted">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-cream-line text-[9px]">↑</kbd> <kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-cream-line text-[9px]">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-white px-1.5 py-0.5 rounded border border-cream-line text-[9px]">↵</kbd> to select</span>
          </div>
          <span className="text-gold-dark font-bold font-serif">Cambridge Court Portal</span>
        </div>
      </div>
    </div>
  );
}
