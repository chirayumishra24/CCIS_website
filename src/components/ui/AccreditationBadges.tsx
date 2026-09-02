import React from "react";
import Image from "next/image";

export default function AccreditationBadges() {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-cream-line/80 p-4 sm:p-5 md:p-6 hover:shadow-2xl transition-shadow duration-300">
      <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-around gap-4 sm:gap-6 md:gap-8">
        {/* IB Badge */}
        <div className="col-span-1 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2.5 sm:gap-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center p-1 border border-cream-line shadow-sm shrink-0">
            <Image
              src="/images/ib-pyp-logo.svg"
              alt="IB Primary Years Programme Candidate School Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h4 className="font-serif font-bold text-navy text-xs sm:text-sm md:text-base leading-snug">
              IB PYP PROGRAMME
            </h4>
            <p className="text-[10px] sm:text-[11px] text-gold-dark font-sans font-semibold uppercase tracking-wider mt-0.5">
              Candidate School *
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-cream-line/70" />

        {/* CBSE Badge */}
        <div className="col-span-1 flex flex-col sm:flex-row items-center text-center sm:text-left gap-2.5 sm:gap-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-xl flex items-center justify-center p-1 border border-cream-line shadow-sm shrink-0">
            <Image
              src="/images/cbse-logo.svg"
              alt="Central Board of Secondary Education Logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h4 className="font-serif font-bold text-navy text-xs sm:text-sm md:text-base leading-snug">
              CBSE AFFILIATED
            </h4>
            <p className="text-[10px] sm:text-[11px] text-ink-muted font-sans font-semibold uppercase tracking-wider mt-0.5">
              Affiliation No. 1730867
            </p>
          </div>
        </div>

        <div className="hidden md:block w-px h-10 bg-cream-line/70" />

        {/* Dual Edge Summary - Centered across both columns on mobile */}
        <div className="col-span-2 md:col-span-1 text-center md:text-left max-w-xs mx-auto md:mx-0 pt-3 md:pt-0 border-t border-cream-line/50 md:border-t-0 w-full">
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
