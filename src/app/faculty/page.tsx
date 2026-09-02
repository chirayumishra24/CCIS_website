"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Skeleton from "@/components/ui/Skeleton";
import { Search, GraduationCap, Award, BookOpen, Sparkles } from "lucide-react";

interface FacultyItem {
  id: string;
  name: string;
  role: string;
  dept: string;
  qual: string;
  img: string;
  order?: number;
}

const defaultFacultyList: FacultyItem[] = [
  { id: "f0", name: "Mrs. Lata Rawat", role: "Director, CCIS Group", dept: "Leadership", qual: "Edu Icon Awardee & Distinguished Educationist", img: "/images/lata-rawat.webp", order: 1 },
  { id: "f1", name: "Mrs. Priyanshi Singh Rawat", role: "Principal, CCIS Group", dept: "Leadership", qual: "M.Sc, B.Ed, 18+ Yrs Exp", img: "/images/director-priyanshi.jpg", order: 2 },
  { id: "f2", name: "Mr. Rajiv Varma", role: "Vice Principal", dept: "Leadership", qual: "M.A, M.Ed, 15+ Yrs Exp", img: "/images/faculty-rajiv-varma.jpg", order: 3 },
  { id: "f3", name: "Mrs. Sneha Mathur", role: "IB PYP Coordinator", dept: "IB PYP", qual: "IB Certified Educator, B.Ed", img: "/images/faculty-sneha-mathur.jpg", order: 4 },
  { id: "f4", name: "Mr. Amit Sharma", role: "Head of Science Dept", dept: "Senior", qual: "M.Sc (Physics), B.Ed", img: "/images/faculty-amit-sharma.jpg", order: 5 },
  { id: "f5", name: "Ms. Anjali Sen", role: "Mathematics Head (Grades VI-VIII)", dept: "Middle", qual: "M.Sc (Maths), B.Ed", img: "/images/faculty-anjali-sen.jpg", order: 6 },
  { id: "f6", name: "Mrs. Kavita Roy", role: "Primary Years Tutor", dept: "Primary", qual: "B.A, B.Ed, Montessori Trained", img: "/images/faculty-kavita-roy.jpg", order: 7 },
  { id: "f7", name: "Mr. Nitin Joshi", role: "AI & Robotics Instructor", dept: "Middle", qual: "B.Tech (Computer Science)", img: "/images/faculty-nitin-joshi.jpg", order: 8 },
  { id: "f8", name: "Ms. Priya Das", role: "IB Language Specialist", dept: "IB PYP", qual: "M.A (English), IB trained", img: "/images/faculty-priya-das.jpg", order: 9 },
];

const departments = ["All", "Leadership", "IB PYP", "Primary", "Middle", "Senior"];

export default function Faculty() {
  const [facultyList, setFacultyList] = useState<FacultyItem[]>(defaultFacultyList);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchFaculty() {
      try {
        const res = await fetch("/api/admin/faculty");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setFacultyList(data);
          }
        }
      } catch (err) {
        console.error("Failed to load faculty:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaculty();
  }, []);

  const filteredFaculty = facultyList.filter((f) => {
    const matchesDept = selectedDept === "All" || f.dept === selectedDept;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      f.name.toLowerCase().includes(q) ||
      f.role.toLowerCase().includes(q) ||
      f.qual.toLowerCase().includes(q);

    return matchesDept && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* ━━━ Hero Banner ━━━ */}
      <section className="relative min-h-[56vh] sm:min-h-[62vh] md:min-h-[70vh] lg:min-h-[76vh] bg-navy overflow-hidden flex items-center pt-8 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="/images/students/kids-collaborative.jpg"
            alt="CCIS Faculty & Academic Mentorship"
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
            Faculty &amp; Leadership
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold leading-[1.1] tracking-tight max-w-3xl">
            Distinguished Academic Mentors &amp; Leaders
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-sans max-w-2xl">
            Meet the experienced educators, certified IB specialists, and department chairs shaping young minds at Cambridge Court.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-20" />
      </section>

      {/* ━━━ Filter & Search Bar ━━━ */}
      <section className="py-6 bg-cream/15 border-b border-cream-line sticky top-[68px] sm:top-[72px] z-30 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Department Pills */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-wider border transition-all duration-300 ${
                  selectedDept === dept
                    ? "bg-navy text-white border-navy shadow-card"
                    : "bg-white text-navy/70 border-cream-line hover:border-gold hover:text-navy"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-cream-line rounded-full text-xs font-sans focus:border-gold outline-none bg-white"
            />
          </div>
        </div>
      </section>

      {/* ━━━ Faculty Directory Grid ━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            title="Faculty Directory"
            subtitle={`${filteredFaculty.length} Qualified Educator${filteredFaculty.length !== 1 ? "s" : ""}`}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-4 border border-cream-line rounded-2xl flex flex-col gap-3">
                  <Skeleton className="h-56 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="text-center py-16 bg-cream/10 border border-cream-line rounded-2xl max-w-md mx-auto">
              <p className="font-serif font-bold text-navy text-base">No educators found</p>
              <p className="text-xs text-ink-muted mt-1">Try clearing your search query or department tab.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFaculty.map((item, idx) => (
                <AnimatedSection
                  key={`${item.id || item.name}-${selectedDept}`}
                  animation="scale-in"
                  delayClass={`stagger-${(idx % 4) + 1}`}
                  className="bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="relative h-72 sm:h-64 w-full overflow-hidden bg-cream/20">
                    <Image
                      src={item.img || "/images/faculty-placeholder.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="absolute top-3 left-3 bg-navy/90 text-white text-[9px] px-2.5 py-1 uppercase font-bold font-mono rounded-full border border-gold/30">
                      {item.dept}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-1.5 flex-1 justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-navy text-base leading-snug group-hover:text-gold transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gold-dark font-sans font-semibold uppercase tracking-wider mt-0.5">
                        {item.role}
                      </p>
                    </div>

                    <p className="text-[11px] text-ink-muted italic pt-3 border-t border-cream-line/50 leading-relaxed">
                      🎓 {item.qual}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
