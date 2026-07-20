"use client";
import React, { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { FileText, Users, ClipboardCheck, PartyPopper } from "lucide-react";

const steps = [
  { icon: <FileText className="w-5 h-5" />, title: "Submit Application", desc: "Fill out the online form with academic transcripts, identity proofs, and recent photographs." },
  { icon: <Users className="w-5 h-5" />, title: "Interaction Round", desc: "The student and parents attend a campus walkthrough, interview with the academic coordinator." },
  { icon: <ClipboardCheck className="w-5 h-5" />, title: "Assessment & Review", desc: "Students undertake grade-appropriate assessments. Results reviewed by the admissions panel." },
  { icon: <PartyPopper className="w-5 h-5" />, title: "Confirmation & Onboarding", desc: "Receive the acceptance letter, complete fee formalities, and join the CCIS family." },
];

const feeHighlights = [
  "Transparent fee structure — no hidden charges",
  "Sibling discounts and early-bird concessions available",
  "Installment plans for annual fee payments",
  "Additional scholarships for academic and sports merit",
];

export default function Admissions() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "sent">("idle");

  return (
    <div className="bg-white">
      {/* ━━━ Hero — Gradient with left-aligned text ━━━ */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/admissions_hero.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-dark via-navy to-navy-light/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-24 z-10 flex flex-col gap-4">
          <span className="text-gold font-sans uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit">
            Join CCIS Family
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight max-w-2xl">
            Admissions 2026-27
          </h1>
          <p className="text-white/55 max-w-lg leading-relaxed text-sm">
            Begin your child&apos;s journey at Jaipur&apos;s leading dual-curriculum school. Applications are now open for Nursery through Grade XI.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-gold-light to-gold" />
      </section>

      {/* ━━━ Admission Process — Horizontal Stepper ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10 border-b border-cream-line">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading title="Admission Process" subtitle="How to Apply" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-[2px] bg-cream-line z-0" />
            
            {steps.map((step, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${idx + 1}`}
                className="relative z-10 flex flex-col items-center text-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-navy text-gold flex items-center justify-center shadow-card border-4 border-cream">
                  {step.icon}
                </div>
                <span className="text-[10px] font-sans font-extrabold text-gold-dark uppercase tracking-widest">
                  Step {idx + 1}
                </span>
                <h4 className="font-serif font-bold text-navy text-base">{step.title}</h4>
                <p className="text-xs text-ink-muted leading-relaxed">{step.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Fee Highlights ━━━ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection animation="fade-in" className="bg-cream/20 border border-cream-line rounded-xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-card">
            <div className="flex-1">
              <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs mb-2 block">Fee Information</span>
              <h3 className="font-serif font-bold text-navy text-xl md:text-2xl">Transparent & Flexible Fee Structure</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {feeHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <span className="text-gold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0">
              <Button
                variant="gold"
                size="lg"
                className="rounded font-bold uppercase tracking-wider"
                onClick={() => window.open("/CCIS_Fee_Brochure.pdf", "_blank")}
              >
                Download Brochure
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ Application Form ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10 border-t border-cream-line">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <AnimatedSection animation="fade-in-left" className="flex flex-col gap-5">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Start Here</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">Application Form</h2>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed text-sm">
              Fill out the enquiry form below, and our admissions counselor will contact you within 24 hours to schedule a campus walkthrough and assessment.
            </p>
            
            <div className="bg-cream/30 border border-cream-line rounded-lg p-5 mt-2">
              <h4 className="font-serif font-bold text-navy text-sm mb-3">Required Documents</h4>
              <ul className="flex flex-col gap-2 text-xs text-ink-muted">
                <li className="flex items-center gap-2">📄 Previous school report cards</li>
                <li className="flex items-center gap-2">📸 Passport-sized photographs</li>
                <li className="flex items-center gap-2">🪪 Aadhaar/Birth certificate copy</li>
                <li className="flex items-center gap-2">📋 Transfer certificate (if applicable)</li>
              </ul>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-in-right">
            {/* Gravity Forms Integration — iframe kept for backward compatibility */}
            <div className="bg-white border border-cream-line rounded-xl shadow-card overflow-hidden p-1">
              <iframe
                src="https://ccischool.org/wp-admin/admin-ajax.php?action=gf_button_get_form&form_id=1&title=false&description=false&ajax=true"
                className="w-full min-h-[550px] border-0"
                title="CCIS Admission Enquiry Form"
                loading="lazy"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
