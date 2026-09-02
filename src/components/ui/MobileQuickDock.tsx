"use client";
import React from "react";
import Link from "next/link";
import { Phone, BookOpen } from "lucide-react";

export default function MobileQuickDock() {
  return (
    <div className="fixed bottom-3 inset-x-0 mx-auto z-40 w-fit max-w-[90%] bg-navy/95 backdrop-blur-md text-white border border-gold/30 rounded-full shadow-2xl p-1.5 flex items-center gap-2 md:hidden transition-all duration-300">
      <Link
        href="/admissions"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold hover:bg-gold-light text-navy font-bold text-xs shadow-md active:scale-95 transition-all"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span>Apply Now</span>
      </Link>

      <a
        href="tel:+911412781498"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-white/10 font-medium text-xs text-white/95 active:scale-95 transition-all"
      >
        <Phone className="w-3.5 h-3.5 text-gold" />
        <span>Call Us</span>
      </a>
    </div>
  );
}
