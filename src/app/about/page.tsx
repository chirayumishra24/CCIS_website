"use client";
import React from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

const values = [
  { title: "Academic Rigor", desc: "Setting high testing and research benchmarks for all grades." },
  { title: "Global Mindedness", desc: "Nurturing empathy and awareness for diverse cultures and systems." },
  { title: "Traditional Ethics", desc: "Preserving traditional Indian values of respect, truth, and community." },
  { title: "Empathetic Leadership", desc: "Encouraging students to lead with care, service, and understanding." },
  { title: "Passion for Query", desc: "Fostering active student research, logic formulation, and experimentation." },
  { title: "Holistic Development", desc: "Balancing athletics, arts, science, and life skills dynamically." },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/hero1.webp')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            About Our Institution
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            Nurturing Excellence Since 1999
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Discover the legacy, values, and leadership behind Jaipur's premier dual-curriculum school.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fade-in-left" className="bg-white border border-cream-line p-8 md:p-12 rounded-lg shadow-card flex flex-col gap-4">
            <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-mono text-xs uppercase tracking-widest rounded-full w-fit font-bold">
              Our Direction
            </span>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-navy">Our Vision</h3>
            <div className="w-12 h-1 bg-gold rounded" />
            <p className="text-ink-muted leading-relaxed mt-2 text-sm md:text-base">
              To be a world-class center of learning where students are empowered to attain academic mastery, think critically, and grow as empathetic global citizens who honor their cultural heritage and lead with integrity.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-right" className="bg-white border border-cream-line p-8 md:p-12 rounded-lg shadow-card flex flex-col gap-4">
            <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-mono text-xs uppercase tracking-widest rounded-full w-fit font-bold">
              Our Strategy
            </span>
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-navy">Our Mission</h3>
            <div className="w-12 h-1 bg-gold rounded" />
            <p className="text-ink-muted leading-relaxed mt-2 text-sm md:text-base">
              To provide a dynamic, dual-curriculum framework (CBSE + IB) that balances analytical rigor with enquiry-based discovery. We cultivate scientific curiosity, sporting determination, and creative self-expression in a modern, values-driven ecosystem.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Our Core Principles" subtitle="CCIS Ideals" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${(idx % 3) + 1}`}
                className="bg-cream/20 border border-cream-line/50 p-8 rounded-lg shadow-card flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <h4 className="font-serif font-bold text-navy text-lg">{val.title}</h4>
                <p className="text-sm text-ink-muted leading-relaxed">{val.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-cream/10 border-y border-cream-line">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeading title="Milestones of Our Journey" subtitle="Our Legacy" />
          
          <div className="relative border-l-2 border-cream-line pl-6 flex flex-col gap-10">
            {/* Milestones */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-navy border-2 border-gold" />
              <span className="font-mono text-sm font-extrabold text-gold-dark">1999</span>
              <h4 className="font-serif font-bold text-navy text-lg mt-1">Foundation Laid</h4>
              <p className="text-sm text-ink-muted leading-relaxed mt-1">
                Cambridge Court High School was founded in Mansarovar, Jaipur, to deliver high-quality CBSE board education with character focus.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-navy border-2 border-gold" />
              <span className="font-mono text-sm font-extrabold text-gold-dark">2012</span>
              <h4 className="font-serif font-bold text-navy text-lg mt-1">Expansion &amp; Laboratories Upgrade</h4>
              <p className="text-sm text-ink-muted leading-relaxed mt-1">
                Advanced chemistry, physics, and computer science facilities were integrated to support state-of-the-art academic projects.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-navy border-2 border-gold" />
              <span className="font-mono text-sm font-extrabold text-gold-dark">2024</span>
              <h4 className="font-serif font-bold text-navy text-lg mt-1">IB Candidate Status Obtained</h4>
              <p className="text-sm text-ink-muted leading-relaxed mt-1">
                CCIS officially achieved IB Primary Years Programme candidacy, introducing conceptual-driven learning.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-navy border-2 border-gold" />
              <span className="font-mono text-sm font-extrabold text-gold-dark">2026</span>
              <h4 className="font-serif font-bold text-navy text-lg mt-1">Jaipur's Best Dual-Curriculum Center</h4>
              <p className="text-sm text-ink-muted leading-relaxed mt-1">
                Serving over 3,000 active students with outstanding sports accolades and college acceptances globally.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
