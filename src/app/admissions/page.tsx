"use client";
import React from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import AdmissionEnquiryForm from "@/components/admissions/AdmissionEnquiryForm";
import AgeCalculator from "@/components/ui/AgeCalculator";
import {
  FileText,
  Users,
  ClipboardCheck,
  PartyPopper,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "1. Online Application",
    desc: "Complete the digital enquiry form with applicant background, grade, and board preference.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "2. Campus Walkthrough",
    desc: "Parent and child attend a personalized tour of science labs, AI robotics studio, and sports turf.",
  },
  {
    icon: <ClipboardCheck className="w-5 h-5" />,
    title: "3. Interaction & Review",
    desc: "Informal, grade-appropriate interaction with the academic coordinator to understand learning readiness.",
  },
  {
    icon: <PartyPopper className="w-5 h-5" />,
    title: "4. Admission Offer",
    desc: "Receive the provisional offer letter, complete formalities, and receive your student welcome kit.",
  },
];

export default function Admissions() {
  return (
    <div className="bg-white">
      {/* ━━━ 1. Hero ━━━ */}
      <section className="relative min-h-[56vh] sm:min-h-[62vh] md:min-h-[70vh] lg:min-h-[76vh] bg-navy overflow-hidden flex items-center pt-8 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="/generated/global-graduates-pathways-2026.jpg"
            alt="CCIS Student in School Uniform"
            fill
            className="object-cover object-top opacity-30"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/60 to-navy-dark/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-black/20 z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full flex flex-col items-center text-center gap-4 sm:gap-5 text-white">
          <span className="inline-block px-3.5 py-1.5 bg-gold/95 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full font-extrabold shadow-glow-gold w-fit flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Admissions Open 2026-27
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold leading-[1.1] tracking-tight max-w-3xl">
            Begin Your Child&apos;s Journey of <span className="text-gold">Excellence</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-sans max-w-2xl">
            Join Jaipur&apos;s leading dual-curriculum institution offering world-class CBSE &amp; International Baccalaureate (IB PYP) pathways from Nursery to Grade XI.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <a href="#application-form">
              <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider rounded-xl shadow-glow-gold">
                Apply Online Now
              </Button>
            </a>
            <a href="#calculator">
              <Button variant="ghost" size="lg" className="text-white hover:text-gold border border-white/25 rounded-xl">
                Age &amp; Grade Calculator
              </Button>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-20" />
      </section>

      {/* ━━━ 2. Step-by-Step Admission Process ━━━ */}
      <section className="py-20 bg-cream/10 border-b border-cream-line">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeading title="Four-Step Admission Journey" subtitle="Streamlined Process" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 relative">
            {steps.map((step, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${idx + 1}`}
                className="bg-white border border-cream-line p-6 rounded-2xl shadow-card flex flex-col gap-3 relative hover:-translate-y-1 transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center shadow-md">
                  {step.icon}
                </div>
                <h4 className="font-serif font-bold text-navy text-base mt-2">{step.title}</h4>
                <p className="text-xs text-ink-muted leading-relaxed">{step.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 3. Application Form ━━━ */}
      <section id="application-form" className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Guidelines & Required Documents */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-gold-dark">
                  Admissions Office
                </span>
                <h2 className="font-serif font-bold text-navy text-3xl md:text-4xl mt-1">
                  Online Admission Application
                </h2>
                <div className="gold-rule my-3" />
                <p className="text-sm text-ink-muted leading-relaxed">
                  Fill out our enrollment form. Our admissions counselor will contact you within 24 hours to schedule your campus tour and orientation.
                </p>
              </div>

              {/* Document Checklist Card */}
              <div className="bg-cream/20 border border-cream-line rounded-2xl p-6 shadow-sm">
                <h4 className="font-serif font-bold text-navy text-base flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5 text-gold-dark" /> Required Documents (For Interaction)
                </h4>
                <ul className="flex flex-col gap-2 text-xs text-ink-muted">
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold font-bold">&bull;</span> Copy of Birth Certificate / Passport
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold font-bold">&bull;</span> Previous school report card (Grades 1 and above)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold font-bold">&bull;</span> Transfer Certificate (TC) from recognized board
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold font-bold">&bull;</span> 4 passport-size photographs of student &amp; parents
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-gold font-bold">&bull;</span> Aadhaar card copy of student &amp; parents
                  </li>
                </ul>
              </div>

              {/* Quick Helpline */}
              <div className="bg-navy text-white rounded-2xl p-6 flex flex-col gap-2 border border-gold/30 shadow-card">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                  Counseling Helpline
                </span>
                <h4 className="font-serif font-bold text-xl">Speak to an Admissions Officer</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Have questions regarding admission procedures, campus visits, or curriculum selection?
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold text-gold-light">
                  <a href="tel:+919660551977" className="hover:text-gold">
                    📞 +91 9660551977
                  </a>
                  <a href="mailto:info@ccischool.org" className="hover:text-gold">
                    ✉️ info@ccischool.org
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Unified Admission Enquiry Form */}
            <div className="lg:col-span-7">
              <AdmissionEnquiryForm />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 4. Age & Grade Calculator Section ━━━ */}
      <section id="calculator" className="py-16 md:py-20 bg-cream/10 border-t border-cream-line">
        <div className="max-w-4xl mx-auto px-4">
          <AgeCalculator />
        </div>
      </section>
    </div>
  );
}
