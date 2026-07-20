import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "About Us — 25+ Years of Educational Excellence",
  description: "Discover the legacy, vision, and leadership behind Cambridge Court International School (CCIS) — Jaipur's premier dual-curriculum (IB + CBSE) school since 1998.",
};

const values = [
  { title: "Academic Rigor", desc: "Setting high testing and research benchmarks for all grades." },
  { title: "Global Mindedness", desc: "Nurturing empathy and awareness for diverse cultures and systems." },
  { title: "Traditional Ethics", desc: "Preserving traditional Indian values of respect, truth, and community." },
  { title: "Empathetic Leadership", desc: "Encouraging students to lead with care, service, and understanding." },
  { title: "Passion for Query", desc: "Fostering active student research, logic formulation, and experimentation." },
  { title: "Holistic Development", desc: "Balancing athletics, arts, science, and life skills dynamically." },
];

const milestones = [
  { year: "1998", title: "Foundation Laid", desc: "Cambridge Court Group (CCG) was established in Mansarovar, Jaipur, to deliver high-quality education with a strong character focus." },
  { year: "2012", title: "Expansion & Laboratories Upgrade", desc: "Advanced chemistry, physics, and computer science facilities were integrated to support state-of-the-art academic projects." },
  { year: "2025", title: "CCIS Established", desc: "CCIS was established, officially achieving candidacy status for the prestigious International Baccalaureate (IB) Primary Years Programme." },
  { year: "2026", title: "Jaipur's Best Dual-Curriculum Center", desc: "Serving over 3,000 active students with outstanding sports accolades and college acceptances globally." },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* ━━━ Split Hero — Image + Text side by side ━━━ */}
      <section className="relative bg-navy overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[360px] lg:min-h-[420px]">
          {/* Text side */}
          <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 lg:py-20 text-white relative z-10 order-2 lg:order-1">
            <span className="text-gold font-sans uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mb-4">
              About Our Institution
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold leading-tight">
              Nurturing Excellence Since 1998
            </h1>
            <p className="text-white/60 max-w-lg mt-4 leading-relaxed text-sm">
              Discover the legacy, values, and leadership behind Jaipur&apos;s premier dual-curriculum school.
            </p>
          </div>
          {/* Image side */}
          <div className="relative h-56 lg:h-auto order-1 lg:order-2">
            <Image
              src="/images/about_hero.png"
              alt="CCIS Campus aerial view"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/40 to-transparent lg:block hidden" />
            <div className="absolute inset-0 bg-navy/40 lg:hidden" />
          </div>
        </div>
        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />
      </section>

      {/* ━━━ Vision & Mission ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <AnimatedSection animation="fade-in-left" className="bg-white border border-cream-line p-8 md:p-10 rounded-xl shadow-card flex flex-col gap-4">
            <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full w-fit font-bold">
              Our Direction
            </span>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-navy">Our Vision</h3>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed mt-1 text-sm">
              To be a world-class center of learning where students are empowered to attain academic mastery, think critically, and grow as empathetic global citizens who honor their cultural heritage and lead with integrity.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-right" className="bg-white border border-cream-line p-8 md:p-10 rounded-xl shadow-card flex flex-col gap-4">
            <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full w-fit font-bold">
              Our Strategy
            </span>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-navy">Our Mission</h3>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed mt-1 text-sm">
              To provide a dynamic, dual-curriculum framework (CBSE + IB) that balances analytical rigor with enquiry-based discovery. We cultivate scientific curiosity, sporting determination, and creative self-expression in a modern, values-driven ecosystem.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ Campus Photo Divider ━━━ */}
      <section className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
        <Image
          src="/images/about-snapshot.png"
          alt="CCIS campus panoramic view"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/10 via-transparent to-white/20" />
      </section>

      {/* ━━━ Core Values ━━━ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Our Core Principles" subtitle="CCIS Ideals" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((val, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${(idx % 3) + 1}`}
                className="bg-cream/15 border border-cream-line/50 p-7 rounded-xl shadow-card flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm font-serif">
                  {idx + 1}
                </div>
                <h4 className="font-serif font-bold text-navy text-lg">{val.title}</h4>
                <p className="text-sm text-ink-muted leading-relaxed">{val.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Timeline with Drone Video Background ━━━ */}
      <section className="relative py-20 md:py-28 bg-navy text-white overflow-hidden border-y-2 border-gold/40">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-55 z-0"
        >
          <source src="/Video/ccis_campus_side.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/85 via-navy/70 to-navy-dark/85 z-10" />

        <div className="relative max-w-3xl mx-auto px-4 z-20">
          <SectionHeading title="Milestones of Our Journey" subtitle="Our Legacy" className="[&_h2]:text-white" />
          
          <div className="relative border-l-2 border-gold/40 pl-6 flex flex-col gap-8 mt-4">
            {milestones.map((m, idx) => (
              <AnimatedSection key={idx} animation="fade-in-left" delayClass={`stagger-${idx + 1}`} className="relative bg-navy-dark/60 p-6 rounded-xl border border-white/10 backdrop-blur-sm shadow-card">
                <div className="absolute -left-[31px] top-7 w-4 h-4 rounded-full bg-gold border-2 border-navy shadow-glow-gold" />
                <span className="font-sans text-sm font-extrabold text-gold tracking-wider">{m.year}</span>
                <h4 className="font-serif font-bold text-white text-xl mt-1">{m.title}</h4>
                <p className="text-sm text-white/75 leading-relaxed mt-1">{m.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
