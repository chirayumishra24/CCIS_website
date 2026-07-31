"use client";
import React from "react";
import Link from "next/link";
import { Phone, BookOpen, MessageSquare } from "lucide-react";

export default function MobileQuickDock() {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md bg-navy/95 backdrop-blur-md text-white border border-gold/30 rounded-full shadow-2xl p-2 flex items-center justify-around md:hidden transition-all duration-300">
      <Link
        href="/admissions"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gold text-navy font-semibold text-xs shadow-md active:scale-95 transition-all"
      >
        <BookOpen className="w-4 h-4" />
        <span>Apply Now</span>
      </Link>

      <a
        href="tel:+911412781498"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/10 font-medium text-xs text-white/90 active:scale-95 transition-all"
      >
        <Phone className="w-4 h-4 text-gold" />
        <span>Call Us</span>
      </a>

      <Link
        href="/contact"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-white/10 font-medium text-xs text-white/90 active:scale-95 transition-all"
      >
        <MessageSquare className="w-4 h-4 text-gold" />
        <span>Enquire</span>
      </Link>
    </div>
  );
}
