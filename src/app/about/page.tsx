import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "About Us — 25+ Years of Educational Excellence",
  description: "Discover the legacy, vision, and leadership behind CCIS — Jaipur's premier dual-curriculum (IB + CBSE) school since 1998.",
};

const milestones = [
  { year: "1998", title: "Foundation Laid", desc: "CCGS was established in Mansarovar, Jaipur, to deliver high-quality education with a strong character focus." },
  { year: "2012", title: "Expansion & Laboratories Upgrade", desc: "Advanced chemistry, physics, and computer science facilities were integrated to support state-of-the-art academic projects." },
  { year: "2025", title: "CCIS Established", desc: "CCIS was established, officially authorized as an International Baccalaureate (IB) World School for the Primary Years Programme." },
  { year: "2026", title: "Jaipur's Best Dual-Curriculum Center", desc: "Serving over 3,000 active students with outstanding sports accolades and college acceptances globally." },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* ━━━ Hero ━━━ */}
      <section className="relative min-h-[56vh] sm:min-h-[62vh] md:min-h-[70vh] lg:min-h-[76vh] bg-navy overflow-hidden flex items-center pt-8 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/c.c.i.s (1).webp"
            alt="CCIS Main School Building"
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/60 to-navy-dark/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-black/20 z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full flex flex-col gap-4 text-white">
          <span className="inline-block px-3.5 py-1.5 bg-gold/95 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full font-extrabold shadow-glow-gold w-fit">
            About Our Institution
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold leading-[1.1] tracking-tight max-w-3xl">
            Nurturing Excellence Since 1998
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-sans max-w-2xl">
            Discover the legacy, values, and leadership behind Jaipur&apos;s premier dual-curriculum school.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-20" />
      </section>

      {/* ━━━ Guiding Purpose & Philosophy (Vision & Mission) ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Guiding Purpose & Philosophy" subtitle="Vision & Mission" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 my-8 items-stretch">
            {/* School Vision */}
            <AnimatedSection
              animation="fade-in-left"
              className="lg:col-span-5 bg-white border border-cream-line rounded-3xl p-8 sm:p-10 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col items-center text-center justify-center relative overflow-hidden group hover:border-gold/50"
            >
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-navy mb-3">
                School Vision
              </h3>
              <div className="gold-rule mx-auto mb-5" />
              <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
                To nurture lifelong learners and mentors, rooted in Indian values and modern inquiry, ready to lead with compassion and shape a just, peaceful, and connected world.
              </p>
            </AnimatedSection>

            {/* School Mission */}
            <AnimatedSection
              animation="fade-in-right"
              className="lg:col-span-7 bg-navy text-white rounded-3xl p-8 sm:p-10 shadow-glow-navy relative overflow-hidden flex flex-col justify-center border-2 border-gold/30 group"
            >
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="mb-5 text-center sm:text-left">
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">
                  School Mission
                </h3>
                <p className="text-gold font-sans text-xs uppercase tracking-widest font-semibold mt-1">
                  Holistic • Experiential • Purpose-Driven
                </p>
              </div>

              <div className="space-y-4 text-white/90 text-sm sm:text-[15px] leading-relaxed font-sans text-left">
                <p>
                  To empower every learner through a rich, balanced, and experiential curriculum that integrates academics, arts, sports, emotional well-being, and spiritual awareness — nurturing curious, compassionate, and courageous global citizens prepared to engage with the world thoughtfully and lead with purpose.
                </p>
                <p className="text-white/80 pt-3 border-t border-white/10">
                  We strive to cultivate a reflective and resilient learning culture where students take ownership of their journey, families are partners in growth, and the school community works together to shape a peaceful, inclusive, and sustainable world.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ━━━ Campus Infrastructure Divider ━━━ */}
      <section className="relative w-full bg-navy-dark overflow-hidden">
        <Image
          src="/images/c.c.i.s (1).webp"
          alt="CCIS Main Campus & Infrastructure Overview"
          width={1280}
          height={720}
          className="w-full h-auto object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-navy/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-10 bg-navy-dark/80 text-white font-sans text-xs px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 font-semibold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          CCIS Main Campus &amp; Infrastructure Overview
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
