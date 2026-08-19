"use client";
import React, { useState } from "react";
import { Calculator, Download, Sparkles, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import Button from "@/components/ui/Button";

interface FeeStructure {
  gradeName: string;
  category: "Early Years" | "Primary" | "Middle" | "Senior";
  admissionFee: number; // One-time
  compositeAnnualFee: number; // Annual
  annualActivities: number;
}

const feeData: Record<string, FeeStructure> = {
  nursery: { gradeName: "Nursery / KG (Early Years)", category: "Early Years", admissionFee: 25000, compositeAnnualFee: 85000, annualActivities: 12000 },
  prep: { gradeName: "Prep / Kindergarten", category: "Early Years", admissionFee: 25000, compositeAnnualFee: 92000, annualActivities: 12000 },
  grade1_5: { gradeName: "Grades I – V (Primary)", category: "Primary", admissionFee: 30000, compositeAnnualFee: 110000, annualActivities: 15000 },
  grade6_8: { gradeName: "Grades VI – VIII (Middle)", category: "Middle", admissionFee: 35000, compositeAnnualFee: 125000, annualActivities: 18000 },
  grade9_10: { gradeName: "Grades IX – X (Secondary)", category: "Senior", admissionFee: 40000, compositeAnnualFee: 145000, annualActivities: 20000 },
  grade11_12: { gradeName: "Grades XI – XII (Sr. Secondary)", category: "Senior", admissionFee: 45000, compositeAnnualFee: 165000, annualActivities: 22000 },
};

const transportZones: Record<string, { label: string; fee: number; desc: string }> = {
  none: { label: "Self Transport / Walker", fee: 0, desc: "Parent drop-off & pickup" },
  zone1: { label: "Zone 1 — Mansarovar / Sanganer (0-5 km)", fee: 22000, desc: "Direct AC GPS Bus" },
  zone2: { label: "Zone 2 — Vaishali / Shyam Nagar / Civil Lines (5-10 km)", fee: 28000, desc: "Express Route AC Bus" },
  zone3: { label: "Zone 3 — Malviya Nagar / Jagatpura / Tonk Rd (10-15 km)", fee: 34000, desc: "Extended Route AC Bus" },
};

export default function SmartFeeCalculator() {
  const [selectedGrade, setSelectedGrade] = useState("grade1_5");
  const [curriculum, setCurriculum] = useState<"CBSE" | "IB">("CBSE");
  const [siblings, setSiblings] = useState<0 | 1 | 2>(0);
  const [meritTier, setMeritTier] = useState<number>(0);
  const [transport, setTransport] = useState("none");
  const [isDownloading, setIsDownloading] = useState(false);

  const base = feeData[selectedGrade];
  
  // IB PYP has an international curriculum supplement of 25,000/yr for grades 1-5
  const ibSupplement = curriculum === "IB" && (selectedGrade === "nursery" || selectedGrade === "prep" || selectedGrade === "grade1_5") ? 25000 : 0;
  
  // Sibling discount: 10% on composite fee for 1 sibling, 15% for 2
  const siblingDiscountPercent = siblings === 1 ? 0.10 : siblings === 2 ? 0.15 : 0;
  const siblingDiscountAmount = Math.round(base.compositeAnnualFee * siblingDiscountPercent);

  // Merit Scholarship: 0%, 15%, 25% on composite fee
  const meritDiscountPercent = meritTier === 1 ? 0.15 : meritTier === 2 ? 0.25 : 0;
  const meritDiscountAmount = Math.round(base.compositeAnnualFee * meritDiscountPercent);

  const totalDiscounts = siblingDiscountAmount + meritDiscountAmount;
  const netCompositeFee = Math.max(0, base.compositeAnnualFee + ibSupplement - totalDiscounts);
  const transportFee = transportZones[transport].fee;

  // Grand Total for Year 1 (includes one-time admission)
  const totalYear1 = base.admissionFee + netCompositeFee + base.annualActivities + transportFee;
  
  // Subsequent years (excluding admission fee)
  const totalSubsequentYears = netCompositeFee + base.annualActivities + transportFee;

  // Quarterly installment (4 equal payments of annual composite + activities)
  const quarterlyInstallment = Math.round((netCompositeFee + base.annualActivities + transportFee) / 4);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // Header Banner
      doc.setFillColor(13, 27, 42); // Navy
      doc.rect(0, 0, 595, 110, "F");

      doc.setFillColor(196, 154, 60); // Gold line
      doc.rect(0, 108, 595, 4, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text("CAMBRIDGE COURT INTERNATIONAL SCHOOL", 40, 48);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(232, 212, 160);
      doc.text("CBSE Affiliation #1730867 | IB PYP Candidate School | Mansarovar, Jaipur", 40, 72);
      doc.text("Official Provisional Fee & Scholarship Estimate — Session 2026-27", 40, 90);

      // Metadata box
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text(`Date of Estimate: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, 40, 140);
      doc.text(`Reference ID: CCIS-EST-${Math.floor(100000 + Math.random() * 900000)}`, 400, 140);

      // Student Specs
      doc.setFillColor(248, 246, 240);
      doc.roundedRect(40, 155, 515, 65, 6, 6, "F");

      doc.setFont("helvetica", "bold");
      doc.setTextColor(13, 27, 42);
      doc.text("Selected Grade Level:", 55, 178);
      doc.text("Curriculum Board:", 55, 202);
      doc.text("Transport Route:", 300, 178);
      doc.text("Applied Concessions:", 300, 202);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.text(base.gradeName, 185, 178);
      doc.text(curriculum === "IB" ? "International Baccalaureate (IB PYP)" : "Central Board of Secondary Education (CBSE)", 165, 202);
      doc.text(transportZones[transport].label.split("—")[0], 415, 178);
      doc.text(totalDiscounts > 0 ? `Rs. ${totalDiscounts.toLocaleString("en-IN")} Subsidized` : "Standard Schedule", 425, 202);

      // Table Header
      let y = 250;
      doc.setFillColor(13, 27, 42);
      doc.rect(40, y, 515, 26, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("FEE HEAD / COMPONENT", 55, y + 17);
      doc.text("PAYMENT FREQUENCY", 320, y + 17);
      doc.text("AMOUNT (INR)", 470, y + 17);

      const items = [
        { name: "One-Time Registration & Admission Fee", freq: "One-Time (New Admission)", amount: `Rs. ${base.admissionFee.toLocaleString("en-IN")}` },
        { name: `Annual Composite Tuition Fee (${base.gradeName})`, freq: "Annual / 4 Installments", amount: `Rs. ${base.compositeAnnualFee.toLocaleString("en-IN")}` },
      ];

      if (ibSupplement > 0) {
        items.push({ name: "IB PYP International Resource & Digital Material", freq: "Annual Supplement", amount: `Rs. ${ibSupplement.toLocaleString("en-IN")}` });
      }

      if (siblingDiscountAmount > 0) {
        items.push({ name: `Sibling Concession (${siblings === 1 ? "10%" : "15%"} on Tuition)`, freq: "Deduction", amount: `- Rs. ${siblingDiscountAmount.toLocaleString("en-IN")}` });
      }

      if (meritDiscountAmount > 0) {
        items.push({ name: `Merit Academic Scholarship (${meritTier === 1 ? "15%" : "25%"})`, freq: "Deduction", amount: `- Rs. ${meritDiscountAmount.toLocaleString("en-IN")}` });
      }

      items.push(
        { name: "Annual Co-Curricular, Sports & STEM Lab Fee", freq: "Annual", amount: `Rs. ${base.annualActivities.toLocaleString("en-IN")}` },
        { name: `Transportation Facility (${transportZones[transport].label.split("—")[0]})`, freq: "Annual / Optional", amount: `Rs. ${transportFee.toLocaleString("en-IN")}` }
      );

      doc.setFont("helvetica", "normal");
      items.forEach((it, idx) => {
        y += 24;
        if (idx % 2 === 1) {
          doc.setFillColor(250, 250, 250);
          doc.rect(40, y - 14, 515, 24, "F");
        }
        doc.setTextColor(40, 40, 40);
        doc.text(it.name, 55, y + 2);
        doc.setTextColor(110, 110, 110);
        doc.text(it.freq, 320, y + 2);
        doc.setTextColor(it.amount.startsWith("-") ? 34 : 13, it.amount.startsWith("-") ? 139 : 27, it.amount.startsWith("-") ? 34 : 42);
        doc.setFont("helvetica", it.amount.startsWith("-") ? "bold" : "normal");
        doc.text(it.amount, 470, y + 2);
        doc.setFont("helvetica", "normal");
      });

      // Total Box
      y += 35;
      doc.setFillColor(240, 245, 250);
      doc.roundedRect(40, y, 515, 60, 6, 6, "F");
      doc.setDrawColor(196, 154, 60);
      doc.setLineWidth(1.5);
      doc.roundedRect(40, y, 515, 60, 6, 6, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(13, 27, 42);
      doc.text("Estimated Year 1 Total (Including Admission Fee):", 55, y + 24);
      doc.setFontSize(13);
      doc.setTextColor(112, 21, 22);
      doc.text(`Rs. ${totalYear1.toLocaleString("en-IN")}`, 440, y + 24);

      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text("Flexible Quarterly Installment (4 x Per Year):", 55, y + 46);
      doc.setTextColor(13, 27, 42);
      doc.text(`Rs. ${quarterlyInstallment.toLocaleString("en-IN")} / Quarter`, 440, y + 46);

      // Footnote
      doc.setFontSize(8);
      doc.setTextColor(130, 130, 130);
      doc.text("* Note: This is an automated estimate for informational guidance. Final fee vouchers are issued upon verification of previous academic transcripts and admission confirmation at the CCIS Accounts Office.", 40, 770, { maxWidth: 515 });

      doc.save(`CCIS_Fee_Estimate_${selectedGrade.toUpperCase()}_2026-27.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-navy text-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-widest font-bold">
            <Calculator className="w-4 h-4" /> Interactive Parent Tool
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 text-white">
            Smart Fee &amp; Scholarship Estimator
          </h3>
          <p className="text-white/60 text-xs md:text-sm mt-1 max-w-xl">
            Calculate customized quarterly installments, sibling benefits, and download an official itemized estimate PDF for Academic Year 2026-27.
          </p>
        </div>
        <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center shrink-0">
          <span className="text-[10px] text-gold uppercase font-bold tracking-wider block">Session</span>
          <span className="text-sm font-bold text-white font-mono">2026 — 2027</span>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Inputs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Grade Level */}
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
              1. Select Grade Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {Object.entries(feeData).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedGrade(key)}
                  className={`p-3 text-left rounded-xl border transition-all duration-200 text-xs font-medium ${
                    selectedGrade === key
                      ? "bg-navy text-white border-navy shadow-sm font-bold"
                      : "bg-cream/10 border-cream-line text-navy/80 hover:border-gold hover:bg-cream/30"
                  }`}
                >
                  <span className="block font-semibold">{val.gradeName.split("(")[0]}</span>
                  <span className={`text-[10px] block mt-0.5 ${selectedGrade === key ? "text-gold-light" : "text-ink-muted"}`}>
                    {val.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
              2. Curriculum Pathway
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurriculum("CBSE")}
                className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                  curriculum === "CBSE"
                    ? "bg-navy text-white border-navy shadow-sm"
                    : "bg-white border-cream-line text-navy hover:border-gold"
                }`}
              >
                <div>
                  <span className="font-bold text-sm block">CBSE Pathway</span>
                  <span className={`text-[11px] block mt-0.5 ${curriculum === "CBSE" ? "text-white/70" : "text-ink-muted"}`}>
                    National Board Curriculum
                  </span>
                </div>
                {curriculum === "CBSE" && <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setCurriculum("IB")}
                className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                  curriculum === "IB"
                    ? "bg-navy text-white border-navy shadow-sm"
                    : "bg-white border-cream-line text-navy hover:border-gold"
                }`}
              >
                <div>
                  <span className="font-bold text-sm block">IB PYP Pathway</span>
                  <span className={`text-[11px] block mt-0.5 ${curriculum === "IB" ? "text-white/70" : "text-ink-muted"}`}>
                    Candidate International Program
                  </span>
                </div>
                {curriculum === "IB" && <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />}
              </button>
            </div>
          </div>

          {/* Sibling & Merit Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Siblings */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                3. Sibling Concession
              </label>
              <select
                value={siblings}
                onChange={(e) => setSiblings(Number(e.target.value) as 0 | 1 | 2)}
                className="w-full px-3.5 py-2.5 bg-white border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
              >
                <option value={0}>No Sibling Currently Enrolled (0%)</option>
                <option value={1}>1 Elder Sibling at CCIS (10% Tuition Off)</option>
                <option value={2}>2+ Siblings at CCIS (15% Tuition Off)</option>
              </select>
            </div>

            {/* Academic Merit */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                4. Merit Scholarship
              </label>
              <select
                value={meritTier}
                onChange={(e) => setMeritTier(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
              >
                <option value={0}>Standard Admission</option>
                <option value={1}>85% – 92% in Previous Grade (15% Scholarship)</option>
                <option value={2}>93%+ / National Sports / Olympiad Rank (25% Scholarship)</option>
              </select>
            </div>
          </div>

          {/* Transport */}
          <div>
            <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
              5. School Bus Facility (Optional)
            </label>
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
            >
              {Object.entries(transportZones).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label} {val.fee > 0 ? `(+ ₹${val.fee.toLocaleString("en-IN")}/yr)` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-cream/20 border border-cream-line rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-center justify-between border-b border-cream-line pb-3">
              <span className="font-serif font-bold text-navy text-lg">Fee Summary</span>
              <span className="text-[11px] font-mono text-gold-dark font-bold bg-gold/10 px-2 py-0.5 rounded">
                Itemized Breakdown
              </span>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-navy/80 mt-4">
              <div className="flex justify-between">
                <span className="text-ink-muted">One-time Admission Fee:</span>
                <span className="font-mono font-semibold">₹{base.admissionFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Composite Annual Tuition:</span>
                <span className="font-mono font-semibold">₹{base.compositeAnnualFee.toLocaleString("en-IN")}</span>
              </div>
              {ibSupplement > 0 && (
                <div className="flex justify-between text-navy">
                  <span className="text-ink-muted">IB PYP International Supplement:</span>
                  <span className="font-mono font-semibold">₹{ibSupplement.toLocaleString("en-IN")}</span>
                </div>
              )}
              {siblingDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Sibling Discount ({siblings === 1 ? "10%" : "15%"}):</span>
                  <span className="font-mono">- ₹{siblingDiscountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              {meritDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Merit Scholarship ({meritTier === 1 ? "15%" : "25%"}):</span>
                  <span className="font-mono">- ₹{meritDiscountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink-muted">Sports &amp; Lab Activities:</span>
                <span className="font-mono font-semibold">₹{base.annualActivities.toLocaleString("en-IN")}</span>
              </div>
              {transportFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-ink-muted">School Bus Transport:</span>
                  <span className="font-mono font-semibold">₹{transportFee.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            {/* Net Total Box */}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-cream-line flex flex-col gap-3">
              <div className="bg-white p-4 rounded-xl border border-cream-line flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold text-ink-muted block">
                    Quarterly Installment (4x)
                  </span>
                  <span className="text-xs text-ink-muted">Billed every 3 months</span>
                </div>
                <span className="font-serif font-extrabold text-xl text-navy">
                  ₹{quarterlyInstallment.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="bg-navy text-white p-4 rounded-xl flex justify-between items-center shadow-md">
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold text-gold block">
                    Total First Year Payable
                  </span>
                  <span className="text-[11px] text-white/60">Includes one-time admission</span>
                </div>
                <span className="font-serif font-extrabold text-2xl text-gold-light">
                  ₹{totalYear1.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <Button
              variant="gold"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="w-full rounded-xl flex items-center justify-center gap-2 py-3"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Generating PDF..." : "Download Official Estimate PDF"}
            </Button>
            <p className="text-[11px] text-center text-ink-muted flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              No financial commitment required • Instant quote
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
