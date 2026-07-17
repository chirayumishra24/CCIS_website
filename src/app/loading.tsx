import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-cream-dark border-t-gold animate-spin" />
        <div className="absolute w-8 h-8 rounded-full bg-navy flex items-center justify-center font-serif font-bold text-white text-[10px]">
          CC
        </div>
      </div>
      <p className="text-[10px] text-ink-muted uppercase font-sans tracking-widest mt-4 font-bold">
        Loading CCIS Portal...
      </p>
    </div>
  );
}
