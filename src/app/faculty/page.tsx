"use client";
import React, { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Image from "next/image";

const departments = ["All", "Leadership", "Primary", "Middle", "Senior", "IB PYP"];

const facultyList = [
  { name: "Mrs. Priyanshi Chandra", role: "Principal, CCIS Group", dept: "Leadership", qual: "M.Sc, B.Ed, 18+ Yrs Exp", img: "/images/director-priyanshi.jpg" },
  { name: "Mr. Rajiv Varma", role: "Vice Principal", dept: "Leadership", qual: "M.A, M.Ed, 15+ Yrs Exp", img: "/images/faculty-placeholder.svg" },
  { name: "Mrs. Sneha Mathur", role: "IB PYP Coordinator", dept: "IB PYP", qual: "IB Certified Educator, B.Ed", img: "/images/faculty-placeholder.svg" },
  { name: "Mr. Amit Sharma", role: "Head of Science Dept", dept: "Senior", qual: "M.Sc (Physics), B.Ed", img: "/images/faculty-placeholder.svg" },
  { name: "Ms. Anjali Sen", role: "Mathematics Head (Grades VI-VIII)", dept: "Middle", qual: "M.Sc (Maths), B.Ed", img: "/images/faculty-placeholder.svg" },
  { name: "Mrs. Kavita Roy", role: "Primary Years Tutor", dept: "Primary", qual: "B.A, B.Ed, Montessori Trained", img: "/images/faculty-placeholder.svg" },
  { name: "Mr. Nitin Joshi", role: "AI & Robotics Instructor", dept: "Middle", qual: "B.Tech (Computer Science)", img: "/images/faculty-placeholder.svg" },
  { name: "Ms. Priya Das", role: "IB Language Specialist", dept: "IB PYP", qual: "M.A (English), IB trained", img: "/images/faculty-placeholder.svg" },
];

export default function Faculty() {
  const [selectedDept, setSelectedDept] = useState("All");

  const filteredFaculty = selectedDept === "All"
    ? facultyList
    : facultyList.filter(f => f.dept === selectedDept);

  return (
    <div className="bg-white">
      {/* ━━━ Hero — Minimal with breadcrumb ━━━ */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/faculty_hero.png" alt="" fill className="object-cover opacity-15" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy/80 to-navy-dark" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 z-10">
          <div className="flex items-center gap-2 text-white/40 text-xs font-sans mb-4">
            <span>Home</span>
            <span>/</span>
            <span className="text-gold">Our Faculty</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight">
            Academic Mentors & Leaders
          </h1>
          <p className="text-white/55 max-w-lg mt-3 leading-relaxed text-sm">
            Meet the experienced educators and specialists shaping minds at Cambridge Court.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gold" />
      </section>

      {/* ━━━ Filter Tabs ━━━ */}
      <section className="py-6 bg-cream/10 border-b border-cream-line sticky top-[72px] z-30 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2 justify-center">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-wider border transition-all duration-300 ${
                selectedDept === dept
                  ? "bg-navy text-white border-navy shadow-card"
                  : "bg-white text-navy/60 border-cream-line hover:border-gold hover:text-gold"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </section>

      {/* ━━━ Faculty Grid ━━━ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Faculty Directory" subtitle={`${filteredFaculty.length} Educator${filteredFaculty.length !== 1 ? "s" : ""}`} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFaculty.map((item, idx) => (
              <AnimatedSection
                key={`${item.name}-${selectedDept}`}
                animation="scale-in"
                delayClass={`stagger-${(idx % 4) + 1}`}
                className="bg-white border border-cream-line rounded-xl overflow-hidden shadow-card flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="relative h-56 w-full overflow-hidden bg-cream/20">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5 flex flex-col gap-1.5 flex-1">
                  <h4 className="font-serif font-bold text-navy text-base leading-snug group-hover:text-gold transition-colors duration-300">{item.name}</h4>
                  <p className="text-xs text-gold-dark font-sans font-semibold uppercase tracking-wider">{item.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-ink-muted bg-cream px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                      {item.dept}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted italic mt-auto pt-2 leading-relaxed border-t border-cream-line/50">{item.qual}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filteredFaculty.length === 0 && (
            <p className="text-center text-ink-muted text-sm py-12">No faculty members found in this department.</p>
          )}
        </div>
      </section>
    </div>
  );
}
