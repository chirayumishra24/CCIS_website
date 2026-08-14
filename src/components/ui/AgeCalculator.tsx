"use client";
import React, { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { Calculator, Sparkles, CheckCircle2, ArrowRight, HelpCircle, Calendar } from "lucide-react";

interface GradeEligibility {
  grade: string;
  curriculum: string;
  recommendedAge: string;
  status: "Eligible" | "Boundary / Review Needed" | "Too Young" | "Too Old";
  notes: string;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<GradeEligibility[] | null>(null);

  const calculateEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    const dob = new Date(birthDate);
    // Calculation benchmark date as of 31st March 2026 for academic session 2026-27
    const cutoffDate = new Date("2026-03-31");

    let ageInYears = cutoffDate.getFullYear() - dob.getFullYear();
    const m = cutoffDate.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && cutoffDate.getDate() < dob.getDate())) {
      ageInYears--;
    }

    const calculatedGrades: GradeEligibility[] = [];

    if (ageInYears < 3) {
      calculatedGrades.push({
        grade: "Toddler / Playgroup",
        curriculum: "Early Years Pre-School",
        recommendedAge: "Under 3 Years",
        status: "Boundary / Review Needed",
        notes: "Child is currently below standard CBSE Nursery cutoff. We invite you for an early informal developmental interaction.",
      });
    } else if (ageInYears === 3) {
      calculatedGrades.push(
        {
          grade: "Nursery / EY-1",
          curriculum: "CBSE & IB PYP",
          recommendedAge: "3 to 4 Years",
          status: "Eligible",
          notes: "Perfect age alignment for Nursery / IB Primary Early Years 1. Admissions open.",
        },
        {
          grade: "KG / EY-2",
          curriculum: "CBSE Foundation",
          recommendedAge: "4+ Years",
          status: "Boundary / Review Needed",
          notes: "Eligible with preschool transition assessment.",
        }
      );
    } else if (ageInYears === 4) {
      calculatedGrades.push(
        {
          grade: "KG / Prep / EY-2",
          curriculum: "CBSE & IB PYP",
          recommendedAge: "4 to 5 Years",
          status: "Eligible",
          notes: "Ideal age for Kindergarten & IB PYP Early Years 2.",
        },
        {
          grade: "Grade 1",
          curriculum: "CBSE & IB PYP",
          recommendedAge: "5 to 6 Years",
          status: "Boundary / Review Needed",
          notes: "Subject to NEP 2020 6-year completion rule review.",
        }
      );
    } else if (ageInYears >= 5 && ageInYears <= 6) {
      calculatedGrades.push(
        {
          grade: "Grade 1",
          curriculum: "CBSE & IB PYP Candidate",
          recommendedAge: "6 Years (as per NEP 2020)",
          status: "Eligible",
          notes: "Direct admission into Grade 1 under both CBSE and IB PYP frameworks.",
        },
        {
          grade: "Grade 2",
          curriculum: "CBSE & IB PYP",
          recommendedAge: "7 Years",
          status: "Boundary / Review Needed",
          notes: "Eligible with Grade 1 transfer certificate.",
        }
      );
    } else if (ageInYears >= 7 && ageInYears <= 11) {
      const standardGrade = ageInYears - 5;
      calculatedGrades.push({
        grade: `Grade ${standardGrade}`,
        curriculum: "CBSE & IB PYP",
        recommendedAge: `${ageInYears} to ${ageInYears + 1} Years`,
        status: "Eligible",
        notes: `Ideal placement for Grade ${standardGrade}. Assessment round focuses on language, mathematics, and inquiry readiness.`,
      });
    } else if (ageInYears >= 12 && ageInYears <= 15) {
      const secondaryGrade = Math.min(ageInYears - 5, 10);
      calculatedGrades.push({
        grade: `Grade ${secondaryGrade}`,
        curriculum: "CBSE Secondary Board",
        recommendedAge: `${ageInYears} Years`,
        status: "Eligible",
        notes: `Eligible for CBSE Middle/Secondary Grade ${secondaryGrade} with previous school academic records.`,
      });
    } else if (ageInYears >= 16) {
      calculatedGrades.push({
        grade: "Grade 11 (Senior Secondary)",
        curriculum: "CBSE (Science, Commerce, Humanities)",
        recommendedAge: "15 to 17 Years",
        status: "Eligible",
        notes: "Stream selection based on Class X Board percentage and scholarship aptitude test.",
      });
    }

    setResult(calculatedGrades);
  };

  return (
    <div id="calculator" className="bg-white border border-cream-line rounded-2xl p-6 sm:p-8 md:p-10 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-navy text-gold rounded-xl shadow-glow-navy">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-sans font-bold uppercase tracking-wider text-gold-dark">
            Interactive Eligibility Tool
          </span>
          <h3 className="font-serif font-bold text-navy text-2xl md:text-3xl">
            Age & Grade Calculator
          </h3>
        </div>
      </div>

      <p className="text-ink-muted text-sm leading-relaxed mb-6">
        Select your child&apos;s Date of Birth to calculate recommended grade placements for the <strong>2026-27 Academic Session</strong> in accordance with National Education Policy (NEP) and IB age guidelines.
      </p>

      <form onSubmit={calculateEligibility} className="flex flex-col sm:flex-row gap-4 items-end mb-8">
        <div className="flex-1 w-full flex flex-col gap-1.5">
          <label htmlFor="dob-input" className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold-dark" />
            Child&apos;s Date of Birth *
          </label>
          <input
            id="dob-input"
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 border border-cream-line rounded-xl text-sm font-sans text-navy focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-cream/10"
          />
        </div>
        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="rounded-xl font-bold uppercase tracking-wider whitespace-nowrap w-full sm:w-auto"
        >
          Check Eligibility <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </form>

      {result && (
        <div className="flex flex-col gap-4 animate-fadeIn border-t border-cream-line pt-6">
          <h4 className="font-serif font-bold text-navy text-lg">Recommended Academic Placements:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.map((item, idx) => (
              <div
                key={idx}
                className="bg-cream/15 border border-cream-line/80 rounded-xl p-5 flex flex-col justify-between gap-3 shadow-sm hover:border-gold/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-serif font-bold text-navy text-lg">{item.grade}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${
                        item.status === "Eligible"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gold-dark font-semibold uppercase tracking-wider">{item.curriculum}</p>
                  <p className="text-xs text-ink-muted leading-relaxed mt-2">{item.notes}</p>
                </div>
                <Link
                  href={`/admissions?grade=${encodeURIComponent(item.grade)}`}
                  className="text-xs font-bold text-navy hover:text-gold uppercase tracking-wider flex items-center gap-1 mt-2 pt-2 border-t border-cream-line/50 transition-colors"
                >
                  Apply For {item.grade} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 flex items-start gap-3 mt-2">
            <HelpCircle className="w-5 h-5 text-navy shrink-0 mt-0.5" />
            <p className="text-xs text-ink-muted leading-relaxed">
              <strong>Need personal counseling?</strong> Our admissions team considers previous learning records, foundational skills, and parental preferences during the interaction round. Call our counseling helpline at <a href="tel:+919660551977" className="text-navy font-bold underline">+91 9660551977</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
