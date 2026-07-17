"use client";
import React from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { FileText, Download } from "lucide-react";

const policies = [
  { title: "Academic Integrity Policy", desc: "Outlining guidelines for authentic student work, citation rules, and anti-plagiarism criteria.", size: "1.2 MB", url: "https://ccischool.org/wp-content/uploads/2026/02/academic-integrity.pdf" },
  { title: "Language Policy &amp; Philosophy", desc: "Describing our multilingual approach supporting English instruction, Hindi, and secondary international languages.", size: "840 KB", url: "https://ccischool.org/wp-content/uploads/2026/02/language-policy.pdf" },
  { title: "Assessment Guidelines (IB + CBSE)", desc: "Criteria for formulative, formative, and summative grading pathways under CBSE and IB guidelines.", size: "2.1 MB", url: "https://ccischool.org/wp-content/uploads/2026/02/assessment-policy.pdf" },
  { title: "Inclusive Education &amp; Support Policy", desc: "Our frameworks for special needs adjustments, physical facilities access, and customized counseling assistance.", size: "950 KB", url: "https://ccischool.org/wp-content/uploads/2026/02/inclusive-policy.pdf" },
  { title: "Student Code of Conduct &amp; Dress Rules", desc: "Essential rules regarding dress codes, campus decorum, anti-bullying measures, and digital safety standards.", size: "1.5 MB", url: "https://ccischool.org/wp-content/uploads/2026/02/code-of-conduct.pdf" },
  { title: "Admission Fee Refund &amp; Cancellation", desc: "Clear criteria, timelines, and refund percentage details for registration withdrawals.", size: "520 KB", url: "https://ccischool.org/wp-content/uploads/2026/02/fee-refund-policy.pdf" },
];

export default function Policies() {
  const handleDownload = (url: string, filename: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            Rules &amp; Standards
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            School Policies &amp; Guidelines
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Read and download the regulatory frameworks governing academics, conduct, and safety at CCIS.
          </p>
        </div>
      </section>

      {/* Policies Grid */}
      <section className="py-20 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Official Documents" subtitle="Downloads" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {policies.map((item, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${(idx % 3) + 1}`}
                className="bg-white border border-cream-line p-6 rounded-lg shadow-card flex flex-col justify-between gap-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="p-3 bg-navy/5 text-navy rounded-lg w-fit shrink-0 h-fit">
                    <FileText className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-serif font-bold text-navy text-base leading-snug" dangerouslySetInnerHTML={{ __html: item.title }} />
                    <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-cream-line/50 pt-4 mt-auto">
                  <span className="text-[10px] font-mono font-semibold text-ink-muted uppercase tracking-wider">
                    PDF • {item.size}
                  </span>
                  <button
                    onClick={() => handleDownload(item.url, `${item.title.replace(/&amp;/g, "and")}.pdf`)}
                    className="flex items-center gap-1 text-gold-dark hover:text-gold font-sans font-bold text-xs uppercase tracking-wider"
                  >
                    View / Download <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
