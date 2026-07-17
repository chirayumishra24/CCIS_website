"use client";
import React, { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

const cbseGrades = [
  { grade: "Primary (Grades I-V)", focus: "Fundamental literacy, basic math, environmental science, art integrations, moral values." },
  { grade: "Middle School (Grades VI-VIII)", focus: "Scientific enquiry, advanced mathematics, social studies, secondary languages, computer studies." },
  { grade: "Secondary School (Grades IX-X)", focus: "Board preparation, analytical sciences, mathematical equations, social histories, vocational electives." },
  { grade: "Senior Secondary (Grades XI-XII)", focus: "Specialized streams (Science, Commerce, Humanities), pre-entrance mocks (JEE/NEET), elective portfolio works." },
];

const ibConcepts = [
  { title: "Transdisciplinary Themes", desc: "Learning is structured around global inquiries: Who we are, Where we are in place &amp; time, How we express ourselves." },
  { title: "Learner Profile Attributes", desc: "Fostering students who are Inquirers, Knowledgeable, Thinkers, Communicators, Principled, Open-minded, Caring." },
  { title: "Inquiry-Based Discovery", desc: "Moving away from rote textbooks to unit projects, investigative portfolios, and real-world experiments." },
  { title: "Global Accreditation Link", desc: "Aligning credits with international secondary qualifications and credit pathways." },
];

export default function Academics() {
  const [activeTab, setActiveTab] = useState<"cbse" | "ib">("cbse");

  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/hero1.webp')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            Academic Pathways
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            Curriculum Rigor &amp; Global Vision
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Explore our dual CBSE and IB paths, designed to suit the unique capabilities of every student.
          </p>
        </div>
      </section>

      {/* Pathways Selection */}
      <section className="py-12 bg-cream/10 border-b border-cream-line">
        <div className="max-w-md mx-auto px-4">
          <div className="flex bg-cream p-1.5 rounded border border-cream-line">
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

      {/* Active Tab Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === "cbse" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection animation="fade-in-left" className="flex flex-col gap-6">
                <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm">Rigorous National Curriculum</span>
                <h2 className="text-3xl font-serif font-bold text-navy">Central Board of Secondary Education</h2>
                <div className="gold-rule" />
                <p className="text-ink-muted leading-relaxed">
                  The CBSE pathway at CCIS offers structured learning designed around national curriculum guidelines. We prepare students for competitive entrance examinations (JEE, NEET, CLAT, CUET) while ensuring they achieve top grades in their senior board exams.
                </p>
                <div className="flex flex-col gap-6 mt-4">
                  {cbseGrades.map((grade, idx) => (
                    <div key={idx} className="flex gap-4 p-4 border border-cream-line bg-cream/15 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-navy text-white font-mono font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
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
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-cream-line shadow-card">
                  <img
                    src="/images/hero2.webp"
                    alt="CBSE Students learning"
                    className="object-cover w-full h-full"
                  />
                </div>
              </AnimatedSection>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <AnimatedSection animation="fade-in-left">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-cream-line shadow-card">
                  <img
                    src="/images/hero3.webp"
                    alt="IB Students group research"
                    className="object-cover w-full h-full"
                  />
                </div>
              </AnimatedSection>
              <AnimatedSection animation="fade-in-right" className="flex flex-col gap-6">
                <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm">Inquiry-Based International Path</span>
                <h2 className="text-3xl font-serif font-bold text-navy">International Baccalaureate (Candidate)</h2>
                <div className="gold-rule" />
                <p className="text-ink-muted leading-relaxed">
                  As an IB candidate school, CCIS implements an inquiry-driven study process. We stimulate critical questioning, self-directed research, and student portfolios. Learners develop conceptual connections that go beyond standard rote textbook learning.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  {ibConcepts.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-2 p-5 border border-cream-line bg-cream/15 rounded-lg">
                      <h4 className="font-serif font-bold text-navy text-base">{item.title}</h4>
                      <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
