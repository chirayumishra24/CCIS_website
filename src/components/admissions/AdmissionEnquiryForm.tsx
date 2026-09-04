"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle, ShieldCheck, Loader2 } from "lucide-react";

export const classesList = [
  "Playgroup / Nursery",
  "KG / Prep",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11 (Science)",
  "Grade 11 (Commerce)",
  "Grade 11 (Humanities)",
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
    studentName: "",
    guardianContact: "",
    selectedClass: initialGrade || paramGrade || "",
    guardianEmail: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (paramGrade) {
      const match = classesList.find((c) => c.toLowerCase().includes(paramGrade.toLowerCase()));
      if (match) {
        setFormData((prev) => ({ ...prev, selectedClass: match }));
      }
    }
  }, [paramGrade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.studentName.trim() || !formData.guardianContact.trim() || !formData.selectedClass || !formData.guardianEmail.trim()) {
      setErrorMsg("Please fill in all mandatory fields.");
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
          parentName: formData.studentName.trim(),
          email: formData.guardianEmail.trim(),
          phone: formData.guardianContact.trim(),
          grade: formData.selectedClass,
          curriculum: "CBSE & IB PYP",
          message: formData.message.trim(),
          source: isModal ? "Popup Modal" : "Website Form",
          notes: ["Schedule a Call enquiry", isModal ? "Submitted via Modal" : "Submitted via Page Form"],
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
      setErrorMsg("Network error. Please try again or call +91 9660551977.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      studentName: "",
      guardianContact: "",
      selectedClass: "",
      guardianEmail: "",
      message: "",
    });
  };

  if (submitted) {
    return (
      <div className={`text-center flex flex-col items-center gap-4 animate-fadeIn ${isModal ? "py-4" : "p-8 md:p-10 bg-white rounded-2xl border border-gray-200 shadow-lg max-w-lg mx-auto"}`}>
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-dark bg-gold/10 px-3 py-1 rounded-full">
          Request Received
        </span>

        <h3 className="font-serif font-bold text-navy text-2xl">
          Thank You!
        </h3>

        <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
          Your callback request for <strong className="text-navy">{formData.studentName}</strong> (Class: <strong className="text-navy">{formData.selectedClass}</strong>) has been registered.
        </p>

        <div className="bg-cream/50 border border-cream-line px-5 py-2.5 rounded-xl font-mono font-bold text-navy text-sm">
          Ref ID: #{submissionId.slice(-8).toUpperCase()}
        </div>

        <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 text-xs text-ink-muted text-left flex flex-col gap-1.5 w-full max-w-sm">
          <p className="font-bold text-navy flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-dark" /> What happens next?
          </p>
          <p>1. Our admissions counselor will call you on <strong>{formData.guardianContact}</strong> within 24 hours.</p>
          <p>2. A confirmation email has been dispatched to <strong>{formData.guardianEmail}</strong>.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <a
            href={`https://wa.me/919660551977?text=Hello%20CCIS%20Admissions,%20I%20scheduled%20a%20call%20for%20${encodeURIComponent(formData.studentName)}%20(Ref:%20${submissionId.slice(-8).toUpperCase()}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Message on WhatsApp
          </a>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3.5 ${isModal ? "w-full" : "w-full max-w-lg mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg"}`}
    >
      {/* Title */}
      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172853] text-center mb-2 leading-tight tracking-tight">
        Secure Your <span className="text-amber-500">Child&apos;s Future</span>
        <br />
        With Us!
      </h3>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium">
          {errorMsg}
        </div>
      )}

      {/* 1. Student Name* */}
      <div>
        <input
          type="text"
          required
          placeholder="Student Name*"
          value={formData.studentName}
          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-500 focus:border-[#172853] focus:ring-1 focus:ring-[#172853] outline-none transition-all"
        />
      </div>

      {/* 2. Guardian's Contact* */}
      <div>
        <input
          type="tel"
          required
          placeholder="Guardian's Contact*"
          value={formData.guardianContact}
          onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-500 focus:border-[#172853] focus:ring-1 focus:ring-[#172853] outline-none transition-all"
        />
      </div>

      {/* 3. Seeking Admission in which Class * */}
      <div>
        <select
          required
          value={formData.selectedClass}
          onChange={(e) => setFormData({ ...formData, selectedClass: e.target.value })}
          className={`w-full px-4 py-3 bg-white border border-gray-300 rounded text-sm focus:border-[#172853] focus:ring-1 focus:ring-[#172853] outline-none transition-all ${!formData.selectedClass ? "text-gray-500" : "text-gray-800"}`}
        >
          <option value="" disabled>
            Seeking Admission in which Class *
          </option>
          {classesList.map((c) => (
            <option key={c} value={c} className="text-gray-800">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Guardian's Email* */}
      <div>
        <input
          type="email"
          required
          placeholder="Guardian's Email*"
          value={formData.guardianEmail}
          onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-500 focus:border-[#172853] focus:ring-1 focus:ring-[#172853] outline-none transition-all"
        />
      </div>

      {/* 5. Your Message */}
      <div>
        <textarea
          rows={3}
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded text-sm text-gray-800 placeholder-gray-500 focus:border-[#172853] focus:ring-1 focus:ring-[#172853] outline-none transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#172853] hover:bg-[#0f1b38] text-white font-bold uppercase tracking-wider py-3.5 rounded text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
            </>
          ) : (
            "SCHEDULE A CALL"
          )}
        </button>
      </div>
    </form>
  );
}
