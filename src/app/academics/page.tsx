"use client";
import React, { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Curriculum3DViewer from "@/components/3d/Curriculum3DViewer";

const cbseGrades = [
  { grade: "Primary (Grades I-V)", focus: "Fundamental literacy, basic math, environmental science, art integrations, moral values." },
  { grade: "Middle School (Grades VI-VIII)", focus: "Scientific enquiry, advanced mathematics, social studies, secondary languages, computer studies." },
  { grade: "Secondary School (Grades IX-X)", focus: "Board preparation, analytical sciences, mathematical equations, social histories, vocational electives." },
  { grade: "Senior Secondary (Grades XI-XII)", focus: "Specialized streams (Science, Commerce, Humanities), pre-entrance mocks (JEE/NEET), elective portfolio works." },
];

const ibConcepts = [
  { title: "Transdisciplinary Themes", desc: "Learning is structured around global inquiries: Who we are, Where we are in place & time, How we express ourselves." },
  { title: "Learner Profile Attributes", desc: "Fostering students who are Inquirers, Knowledgeable, Thinkers, Communicators, Principled, Open-minded, Caring." },
  { title: "Inquiry-Based Discovery", desc: "Moving away from rote textbooks to unit projects, investigative portfolios, and real-world experiments." },
  { title: "Global Accreditation Link", desc: "Aligning credits with international secondary qualifications and credit pathways." },
];

const comparisonTable = [
  { feature: "Curriculum Origin", cbse: "National (India)", ib: "International (Geneva)" },
  { feature: "Grade Range", cbse: "Nursery – Class XII", ib: "PYP (Ages 3–12)" },
  { feature: "Teaching Style", cbse: "Structured & exam-focused", ib: "Inquiry-based & project-led" },
  { feature: "Assessment", cbse: "Board examinations", ib: "Continuous + portfolio" },
  { feature: "Entrance Prep", cbse: "JEE, NEET, CUET coaching", ib: "Global university credits" },
  { feature: "Best For", cbse: "National competitive exams", ib: "International higher education" },
];

export default function Academics() {
  const [activeTab, setActiveTab] = useState<"cbse" | "ib">("cbse");

  return (
    <div className="bg-white">
      {/* ━━━ Hero ━━━ */}
      <section className="relative min-h-[56vh] sm:min-h-[62vh] md:min-h-[70vh] lg:min-h-[76vh] bg-navy overflow-hidden flex items-center pt-8 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/students/teacher-mentorship.jpg"
            alt="CCIS Academic Mentorship"
            fill
            className="object-cover object-top"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/60 to-navy-dark/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-black/20 z-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full flex flex-col gap-4 text-white">
          <span className="inline-block px-3.5 py-1.5 bg-gold/95 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full font-extrabold shadow-glow-gold w-fit">
            Academic Pathways
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold leading-[1.1] tracking-tight max-w-3xl">
            Curriculum Rigor &amp; Global Vision
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-sans max-w-2xl">
            Explore our dual CBSE and IB paths, designed to suit the unique capabilities of every student.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-20" />
      </section>

      {/* ━━━ Pathway Tabs ━━━ */}
      <section className="py-10 bg-cream/10 border-b border-cream-line">
        <div className="max-w-md mx-auto px-4">
          <div className="flex bg-cream p-1.5 rounded-lg border border-cream-line">
            <button
              onClick={() => setActiveTab("cbse")}
              className={`flex-1 py-2.5 text-center font-sans font-bold text-sm uppercase tracking-wider rounded transition-all ${activeTab === "cbse" ? "bg-navy text-white shadow-card" : "text-navy-light hover:text-navy"}`}
            >
              CBSE Program
            </button>
            <button
              onClick={() => setActiveTab("ib")}
              className={`flex-1 py-2.5 text-center font-sans font-bold text-sm uppercase tracking-wider rounded transition-all ${activeTab === "ib" ? "bg-navy text-white shadow-card" : "text-navy-light hover:text-navy"}`}
            >
              IB Programme
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ Tab Content ━━━ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === "cbse" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <AnimatedSection animation="fade-in-left" className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Rigorous National Curriculum</span>
                  <div className="relative w-14 h-14 bg-white p-1 rounded-xl border border-cream-line flex items-center justify-center shrink-0 shadow-xs">
                    <Image src="/images/cbse-logo.webp" alt="CBSE Affiliated Logo" width={48} height={48} className="object-contain" />
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-navy">Central Board of Secondary Education</h2>
                <div className="gold-rule" />
                <p className="text-ink-muted leading-relaxed text-sm">
                  The CBSE pathway at CCIS offers structured learning designed around national curriculum guidelines. We prepare students for competitive entrance examinations (JEE, NEET, CLAT, CUET) while ensuring they achieve top grades in their senior board exams.
                </p>
                <div className="flex flex-col gap-4 mt-2">
                  {cbseGrades.map((grade, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border border-cream-line bg-cream/10 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-navy text-white font-sans font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-navy text-base">{grade.grade}</h4>
                        <p className="text-sm text-ink-muted mt-1 leading-relaxed">{grade.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-in-right">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-cream-line shadow-card">
                  <Image src="/images/students/teacher-mentorship.jpg" alt="CBSE Classroom Mentorship" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" quality={95} />
                </div>
              </AnimatedSection>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <AnimatedSection animation="fade-in-left">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-cream-line shadow-card">
                  <Image src="/images/students/kids-collaborative.jpg" alt="IB Inquiry and Collaborative Learning" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" quality={95} />
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-in-right" className="flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Inquiry-Based International Path</span>
                  <div className="relative w-14 h-14 bg-white p-1 rounded-xl border border-cream-line flex items-center justify-center shrink-0 shadow-xs">
                    <Image src="/images/ib-pyp-logo.png" alt="IB PYP Candidate School Logo" width={48} height={48} className="object-contain" />
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-navy">International Baccalaureate (Candidate)</h2>
                <div className="gold-rule" />
                <p className="text-ink-muted leading-relaxed text-sm">
                  As an IB candidate school, CCIS implements an inquiry-driven study process. We stimulate critical questioning, self-directed research, and student portfolios. Learners develop conceptual connections that go beyond standard rote textbook learning.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  {ibConcepts.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-4 border border-cream-line bg-cream/10 rounded-lg">
                      <h4 className="font-serif font-bold text-navy text-sm">{item.title}</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </section>

      {/* ━━━ Dual-Curriculum Grade Progression & Pathway Matrix ━━━ */}
      <section className="py-16 md:py-20 bg-cream/15 border-t border-cream-line">
        <div className="max-w-6xl mx-auto px-4">
          <Curriculum3DViewer />
        </div>
      </section>

      {/* ━━━ Comparison Table ━━━ */}
      <section className="py-16 md:py-20 bg-cream/10 border-y border-cream-line">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading title="CBSE vs IB at a Glance" subtitle="Quick Comparison" />
          <AnimatedSection animation="fade-in" className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 text-xs font-sans font-bold uppercase tracking-wider text-ink-muted border-b-2 border-cream-line bg-cream/30 rounded-tl-lg">Feature</th>
                  <th className="text-left p-4 text-xs font-sans font-bold uppercase tracking-wider text-navy border-b-2 border-cream-line bg-cream/30">CBSE</th>
                  <th className="text-left p-4 text-xs font-sans font-bold uppercase tracking-wider text-gold-dark border-b-2 border-cream-line bg-cream/30 rounded-tr-lg">IB (PYP)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className="border-b border-cream-line/50 hover:bg-cream/15 transition-colors">
                    <td className="p-4 text-sm font-semibold text-navy">{row.feature}</td>
                    <td className="p-4 text-sm text-ink-muted">{row.cbse}</td>
                    <td className="p-4 text-sm text-ink-muted">{row.ib}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
