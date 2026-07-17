"use client";
import React, { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Image from "next/image";

const departments = ["All", "Leadership", "Primary", "Middle", "Senior", "IB PYP"];

const facultyList = [
  { name: "Mrs. Priyanshi Chandra", role: "Principal, CCIS Group", dept: "Leadership", qual: "M.Sc, B.Ed, 18+ Yrs Exp", img: "/images/director-priyanshi.jpg" },
  { name: "Mr. Rajiv Varma", role: "Vice Principal", dept: "Leadership", qual: "M.A, M.Ed, 15+ Yrs Exp", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250" },
  { name: "Mrs. Sneha Mathur", role: "IB PYP Coordinator", dept: "IB PYP", qual: "IB Certified Educator, B.Ed", img: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=250" },
  { name: "Mr. Amit Sharma", role: "Head of Science Dept", dept: "Senior", qual: "M.Sc (Physics), B.Ed", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250" },
  { name: "Ms. Anjali Sen", role: "Mathematics Head (Grades VI-VIII)", dept: "Middle", qual: "M.Sc (Maths), B.Ed", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250" },
  { name: "Mrs. Kavita Roy", role: "Primary Years Tutor", dept: "Primary", qual: "B.A, B.Ed, Montessori Trained", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250" },
  { name: "Mr. Nitin Joshi", role: "AI &amp; Robotics Instructor", dept: "Middle", qual: "B.Tech (Computer Science)", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250" },
  { name: "Ms. Priya Das", role: "IB Language Specialist", dept: "IB PYP", qual: "M.A (English), IB trained", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250" },
];

export default function Faculty() {
  const [selectedDept, setSelectedDept] = useState("All");

  const filteredFaculty = selectedDept === "All"
    ? facultyList
    : facultyList.filter(f => f.dept === selectedDept);

  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/faculty_hero.png')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            Our Educators
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            Academic Mentors &amp; Leaders
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Meet the experienced educators and specialists shaping minds at Cambridge Court.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-cream/10 border-b border-cream-line">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-3 justify-center">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-5 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-wider border transition-all ${selectedDept === dept ? "bg-navy text-white border-navy shadow-card" : "bg-white text-navy border-cream-line hover:border-gold hover:text-gold"}`}
            >
              {dept}
            </button>
          ))}
        </div>
      </section>

      {/* Faculty Profiles Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Faculty Directory" subtitle="Inspiring Mentors" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredFaculty.map((item, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${(idx % 4) + 1}`}
                className="bg-cream/10 border border-cream-line p-6 rounded-lg shadow-card flex flex-col items-center text-center gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gold shadow-card shrink-0">
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-serif font-bold text-navy text-base leading-snug">{item.name}</h4>
                  <p className="text-xs text-gold-dark font-sans font-semibold uppercase tracking-wider">{item.role}</p>
                  <span className="text-[10px] text-ink-muted bg-cream px-2.5 py-1 rounded w-fit mx-auto mt-1 font-semibold uppercase tracking-wider">
                    {item.dept}
                  </span>
                  <p className="text-[11px] text-ink-muted italic mt-2 leading-relaxed">{item.qual}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
