import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import VirtualCampusTour from "@/components/campus/VirtualCampusTour";
import TrophyCabinet from "@/components/campus/TrophyCabinet";

export const metadata: Metadata = {
  title: "Campus Life — Clubs, Sports & World-Class Facilities",
  description: "Explore CCIS campus life — AI & Robotics studios, Olympic-standard courts, creative arts ateliers, and 20+ student clubs and societies.",
};

export default function CampusLife() {
  return (
    <div className="bg-white">
      {/* ━━━ Hero ━━━ */}
      <section className="relative min-h-[56vh] sm:min-h-[62vh] md:min-h-[70vh] lg:min-h-[76vh] bg-navy overflow-hidden flex items-center pt-8 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/c.c.i.s (1).webp"
            alt="CCIS Campus Life & Facilities"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/60 to-navy-dark/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-black/20 z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full flex flex-col gap-4 text-white">
          <span className="inline-block px-3.5 py-1.5 bg-gold/95 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full font-extrabold shadow-glow-gold w-fit">
            Campus Life &amp; Facilities
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold leading-[1.1] tracking-tight max-w-3xl">
            Beyond the Classroom
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-sans max-w-2xl">
            Our campus is built for discovery — from cutting-edge labs to expansive sports facilities and vibrant creative ateliers.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-20" />
      </section>

      {/* ━━━ Interactive Virtual 360 / Hotspots Campus Tour ━━━ */}
      <section className="py-16 md:py-20 bg-cream/15 border-b border-cream-line">
        <div className="max-w-7xl mx-auto px-4">
          <VirtualCampusTour />
        </div>
      </section>

      {/* ━━━ Extra-Curriculars ━━━ */}
      <section className="py-20 md:py-24 bg-white border-b border-cream-line">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection animation="fade-in-left" className="flex flex-col gap-5">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Passions &amp; Talents</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">Sports Academies &amp; Creative Clubs</h2>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed text-sm">
              At CCIS, we ensure that every student identifies and nurtures a lifelong talent. Our students choose from various societies, including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-navy">
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Robotics &amp; Coding Society</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Model United Nations (MUN)</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Theatre, Drama &amp; Fine Arts</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Basketball &amp; Athletics Academies</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Chess Club &amp; Logical Games</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ School Band &amp; Music Choir</li>
            </ul>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-cream-line shadow-card bg-navy-dark">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/Video/ccis_football_drone.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-3 left-3 bg-navy-dark/80 text-white font-sans text-xs px-3 py-1 rounded backdrop-blur-sm border border-white/10 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Drone Footage &bull; Sports &amp; Athletics Turf
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ Hall of Accolades & Virtual Trophy Cabinet ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4">
          <TrophyCabinet />
        </div>
      </section>
    </div>
  );
}
