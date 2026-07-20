import React from "react";

export default function AccreditationBadges() {
  return (
    <div className="w-full bg-cream/40 border-y border-cream-line py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center text-white font-serif font-bold text-xl border-2 border-gold shadow-glow-navy">
            IB
          </div>
          <div>
            <h4 className="font-serif font-bold text-navy text-base">IB WORLD SCHOOL</h4>
            <p className="text-xs text-ink-muted font-sans font-medium uppercase tracking-wider">Candidate School *</p>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-cream-line" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center text-gold font-sans font-bold text-sm border-2 border-cream-line shadow-glow-navy">
            CBSE
          </div>
          <div>
            <h4 className="font-serif font-bold text-navy text-base">CBSE AFFILIATED</h4>
            <p className="text-xs text-ink-muted font-sans font-medium uppercase tracking-wider">Affiliation No. 1730867</p>
          </div>
        </div>

        <div className="hidden md:block w-px h-8 bg-cream-line" />

        <div className="text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-gold/10 text-gold-dark font-sans font-bold text-xs uppercase tracking-widest rounded-full mb-1">
            Dual Edge
          </span>
          <p className="font-serif font-semibold text-navy text-sm md:text-base">
            Global Vision through IB &amp; Academic Rigor through CBSE
          </p>
        </div>
      </div>
    </div>
  );
}
