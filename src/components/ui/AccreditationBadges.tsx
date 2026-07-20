import React from "react";

export default function AccreditationBadges() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-cream-line/80 p-6 md:p-8 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:gap-8">
        {/* IB Badge */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 md:w-14 md:h-14 bg-navy rounded-full flex items-center justify-center text-white font-serif font-bold text-xl border-2 border-gold shadow-md shrink-0">
            IB
          </div>
          <div>
            <h4 className="font-serif font-bold text-navy text-sm md:text-base leading-snug">
              IB WORLD SCHOOL
            </h4>
            <p className="text-[11px] text-gold-dark font-sans font-semibold uppercase tracking-wider mt-0.5">
              Candidate School *
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-cream-line/70" />

        {/* CBSE Badge */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 md:w-14 md:h-14 bg-navy rounded-full flex items-center justify-center text-gold font-sans font-bold text-sm border-2 border-gold/60 shadow-md shrink-0">
            CBSE
          </div>
          <div>
            <h4 className="font-serif font-bold text-navy text-sm md:text-base leading-snug">
              CBSE AFFILIATED
            </h4>
            <p className="text-[11px] text-ink-muted font-sans font-semibold uppercase tracking-wider mt-0.5">
              Affiliation No. 1730867
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-cream-line/70" />

        {/* Dual Edge Summary */}
        <div className="text-center md:text-left max-w-xs">
          <span className="inline-block px-3 py-0.5 bg-gold/15 text-gold-dark font-sans font-extrabold text-[10px] uppercase tracking-widest rounded-full mb-1">
            Dual Edge
          </span>
          <p className="font-serif font-semibold text-navy text-xs md:text-sm leading-relaxed">
            Global Vision through IB &amp; Academic Rigor through CBSE
          </p>
        </div>
      </div>
    </div>
  );
}
