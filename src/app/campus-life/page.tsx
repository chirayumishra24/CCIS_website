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
      {/* ━━━ Compact Hero with breadcrumb styling ━━━ */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/campus_life_hero.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/70 via-navy/60 to-navy" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 z-10">
          <div className="flex items-center gap-2 text-white/40 text-xs font-sans mb-4">
            <span>Home</span>
            <span>/</span>
            <span className="text-gold">Campus Life</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight">
            Beyond the Classroom
          </h1>
          <p className="text-white/55 max-w-lg mt-3 leading-relaxed text-sm">
            Our campus is built for discovery — from cutting-edge labs to expansive sports facilities.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gold" />
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
