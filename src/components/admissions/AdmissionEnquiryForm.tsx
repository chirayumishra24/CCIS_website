"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Loader2, Calendar, Clock, User, Phone, Mail, GraduationCap } from "lucide-react";

export const gradesList = [
  "Playgroup / Nursery (Age 3+)",
  "KG / Prep (Age 4+)",
  "Grade 1 (Age 5-6)",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11 (Science - PCM/PCB)",
  "Grade 11 (Commerce)",
  "Grade 11 (Humanities / Arts)",
];

interface AdmissionEnquiryFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
  initialGrade?: string;
}

export default function AdmissionEnquiryForm({ isModal = false, onSuccess, initialGrade }: AdmissionEnquiryFormProps) {
  const searchParams = useSearchParams();
  const paramGrade = searchParams?.get("grade") || "";

  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    grade: initialGrade || paramGrade || "Grade 1 (Age 5-6)",
    curriculum: "Dual (CBSE & IB PYP)",
    visitDate: "",
    visitTime: "10:00 AM - 11:30 AM",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (paramGrade) {
      const match = gradesList.find((g) => g.toLowerCase().includes(paramGrade.toLowerCase()));
      if (match) {
        setFormData((prev) => ({ ...prev, grade: match }));
      }
    }
  }, [paramGrade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.parentName.trim() || !formData.studentName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setErrorMsg("Please fill in all mandatory fields (Parent Name, Student Name, Phone, and Email).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.studentName.trim(),
          studentName: formData.studentName.trim(),
          parentName: formData.parentName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          grade: formData.grade,
          curriculum: formData.curriculum,
          visitDate: formData.visitDate || "Not Specified",
          visitTime: formData.visitDate ? formData.visitTime : "Flexible",
          message: formData.message.trim(),
          source: isModal ? "Popup Modal" : "Admissions Page",
          notes: [
            formData.visitDate ? `Preferred Visit Date: ${formData.visitDate} (${formData.visitTime})` : "General Enquiry / Counselling",
            isModal ? "Submitted via Modal Popup" : "Submitted via Admissions Page",
          ],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const refId = data.enquiry?.id || `CCIS-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmissionId(refId);
        setSubmitted(true);
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or reach out directly at +91 9660551977.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      parentName: "",
      studentName: "",
      email: "",
      phone: "",
      grade: "Grade 1 (Age 5-6)",
      curriculum: "Dual (CBSE & IB PYP)",
      visitDate: "",
      visitTime: "10:00 AM - 11:30 AM",
      message: "",
    });
  };

  if (submitted) {
    return (
      <div className={`text-center flex flex-col items-center gap-4 animate-fadeIn ${isModal ? "py-4" : "p-8 md:p-12 bg-white rounded-3xl border-2 border-gold/40 shadow-card"}`}>
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-dark bg-gold/10 px-3 py-1 rounded-full">
          Application Received
        </span>

        <h3 className="font-serif font-bold text-navy text-2xl md:text-3xl">
          Thank You, {formData.parentName}!
        </h3>

        <p className="text-sm text-ink-muted leading-relaxed max-w-md">
          Your admission enquiry for <strong className="text-navy">{formData.studentName}</strong> (Applying for <strong className="text-navy">{formData.grade}</strong>) has been registered.
        </p>

        <div className="bg-cream/50 border border-cream-line px-5 py-2.5 rounded-xl font-mono font-bold text-navy text-sm">
          Reference ID: #{submissionId.slice(-8).toUpperCase()}
        </div>

        <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 text-xs text-ink-muted text-left flex flex-col gap-1.5 w-full max-w-md">
          <p className="font-bold text-navy flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-dark" /> What happens next?
          </p>
          <p>1. Our Admissions Officer will contact you on <strong>{formData.phone}</strong> within 24 hours.</p>
          <p>2. A confirmation alert has been logged in our system.</p>
          {formData.visitDate && (
            <p>3. Your campus tour has been tentatively noted for <strong>{formData.visitDate} ({formData.visitTime})</strong>.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <a
            href={`https://wa.me/919660551977?text=Hello%20CCIS%20Admissions,%20I%20have%20submitted%20an%20enquiry%20for%20${encodeURIComponent(formData.studentName)}%20(Ref:%20${submissionId.slice(-8).toUpperCase()}).`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="gold" size="md" className="rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 text-xs shadow-glow-gold">
              <MessageCircle className="w-4 h-4" /> Message Counselor on WhatsApp
            </Button>
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${isModal ? "space-y-1" : "bg-white border border-cream-line rounded-3xl p-6 sm:p-8 md:p-10 shadow-card"}`}
    >
      {!isModal && (
        <div className="border-b border-cream-line pb-4 mb-2">
          <div className="flex items-center gap-2 text-gold-dark text-xs font-mono uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4 text-gold" /> Admissions 2026-27 • Official Enquiry Form
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-navy mt-1">
            Apply for Admission or Book a Campus Tour
          </h3>
          <p className="text-ink-muted text-xs sm:text-sm mt-1">
            Fill out the single unified form below. Our admissions team will review your application and respond promptly.
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      {/* Row 1: Student Name & Parent Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Student&apos;s Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Parent / Guardian Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              placeholder="e.g. Dr. Rajesh Sharma"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Mobile / WhatsApp No. <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              required
              placeholder="parent@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Row 3: Grade & Curriculum */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Grade / Class Applying For <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all"
            >
              {gradesList.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Preferred Curriculum
          </label>
          <select
            value={formData.curriculum}
            onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all"
          >
            <option value="Dual (CBSE & IB PYP)">Dual (CBSE &amp; IB PYP Primary Years)</option>
            <option value="CBSE Board">CBSE Board (Affiliated to Grade XII)</option>
            <option value="Cambridge Foundation">Cambridge Foundation / Global</option>
          </select>
        </div>
      </div>

      {/* Row 4: Campus Visit Date & Time (Optional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Preferred Visit Date <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="date"
              value={formData.visitDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
            Preferred Time Slot
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={formData.visitTime}
              onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
              disabled={!formData.visitDate}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all disabled:opacity-50"
            >
              <option value="09:00 AM - 10:30 AM">Morning (09:00 AM - 10:30 AM)</option>
              <option value="10:30 AM - 12:00 PM">Mid-Morning (10:30 AM - 12:00 PM)</option>
              <option value="12:00 PM - 01:30 PM">Afternoon (12:00 PM - 01:30 PM)</option>
              <option value="02:30 PM - 04:00 PM">Late Afternoon (02:30 PM - 04:00 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row 5: Questions / Message */}
      <div>
        <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
          Questions or Specific Requirements <span className="text-slate-400 font-normal lowercase">(optional)</span>
        </label>
        <textarea
          rows={isModal ? 2 : 3}
          placeholder="e.g. Transport route needed from Vaishali Nagar, sibling discount query, scholarship..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3.5 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-ink focus:border-gold focus:bg-white focus:ring-1 focus:ring-gold outline-none transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          variant="gold"
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting Application...
            </>
          ) : (
            <>
              Submit Admission Enquiry &amp; Schedule Visit
            </>
          )}
        </Button>
      </div>

      <p className="text-[11px] text-center text-slate-500 mt-1">
        🔒 Confidential &bull; CCIS Admissions Office: +91 9660551977 &bull; info@ccischool.org
      </p>
    </form>
  );
}
