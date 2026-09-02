"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Clock, MapPin, Phone, Mail, CheckCircle2, Sparkles, Building2, User, Send, GraduationCap } from "lucide-react";
import Button from "./Button";

interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookVisitModal({ isOpen, onClose }: BookVisitModalProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    grade: "Grade 1",
    curriculum: "Dual (CBSE & IB PYP)",
    visitDate: "",
    visitTime: "10:00 AM - 11:30 AM",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.parentName || !formData.phone || !formData.email) {
      setErrorMsg("Please fill in all required fields (Parent Name, Phone, and Email).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.studentName || formData.parentName,
          studentName: formData.studentName || formData.parentName,
          parentName: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          grade: formData.grade,
          curriculum: formData.curriculum,
          visitDate: formData.visitDate || "Not Specified",
          visitTime: formData.visitTime || "Flexible",
          message: formData.message,
          source: "Admissions Counselling Popup",
          notes: [
            formData.visitDate ? `Preferred Visit Date: ${formData.visitDate} (${formData.visitTime})` : "Personalised Counselling Requested",
            "Submitted via Homepage Modal"
          ],
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit request. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please try again or call us at +91 9660551977.");
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
      grade: "Grade 1",
      curriculum: "Dual (CBSE & IB PYP)",
      visitDate: "",
      visitTime: "10:00 AM - 11:30 AM",
      message: "",
    });
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-navy-dark/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-gold/30 overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header Banner */}
        <div className="bg-gradient-to-r from-navy-dark via-navy to-navy-dark px-5 py-4 sm:px-8 sm:py-5 text-white relative shrink-0 border-b border-gold/20 pr-14">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white bg-white/20 hover:bg-gold hover:text-navy rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:scale-110 border border-white/20 z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2 text-gold text-[11px] font-mono uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Admissions 2026-27 • CCIS Jaipur
          </div>
          <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mt-0.5">
            Book Personalised Counselling &amp; Campus Tour
          </h3>
          <p className="text-white/70 text-xs mt-0.5 max-w-md leading-relaxed hidden sm:block">
            Fill out the details below. Our admissions director will get in touch with you within 24 hours.
          </p>
        </div>

        {/* Modal Body with Custom Scrollbar */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-gradient-to-b from-white to-slate-50/50">
          {submitted ? (
            <div className="text-center py-6 flex flex-col items-center gap-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-200">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-navy">
                Enquiry Submitted Successfully!
              </h4>
              <p className="text-ink-muted text-sm max-w-md leading-relaxed">
                Thank you, <strong className="text-navy">{formData.parentName}</strong>. Your enquiry for <strong className="text-navy">{formData.studentName || "your child"}</strong> has been registered in our admissions system.
              </p>
              <div className="bg-cream/40 border border-cream-line rounded-xl p-4 w-full max-w-md text-left text-xs text-ink-muted space-y-1 mt-1">
                <p><strong className="text-navy">Campus:</strong> Sector-3, Mansarovar, Jaipur, Rajasthan</p>
                <p><strong className="text-navy">Direct Helpline:</strong> +91 9660551977</p>
                <p><strong className="text-navy">Email:</strong> info@ccischool.org</p>
              </div>
              <Button variant="gold" onClick={handleReset} className="mt-2 rounded-xl px-8 font-bold uppercase tracking-wider text-xs shadow-glow-gold">
                Close &amp; Continue
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Row 1: Parent Name & Student Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Parent / Guardian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Student&apos;s Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Mobile / WhatsApp No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Grade & Curriculum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Applying Grade / Class
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  >
                    <option value="Playgroup / Nursery">Playgroup / Nursery</option>
                    <option value="Kindergarten (KG / Prep)">Kindergarten (KG / Prep)</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Curriculum Preference
                  </label>
                  <select
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  >
                    <option value="Dual (CBSE & IB PYP)">Dual (CBSE &amp; IB PYP)</option>
                    <option value="IB Primary Years Programme">IB Primary Years Programme</option>
                    <option value="CBSE National Board">CBSE National Board</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Preferred Visit Date (Optional)
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={formData.visitTime}
                    onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                  >
                    <option value="09:30 AM - 11:00 AM">09:30 AM – 11:00 AM</option>
                    <option value="11:30 AM - 01:00 PM">11:30 AM – 01:00 PM</option>
                    <option value="02:00 PM - 03:30 PM">02:00 PM – 03:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Notes */}
              <div>
                <label className="block text-[11px] font-bold text-navy uppercase tracking-wider mb-1">
                  Questions or Special Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific questions or curriculum guidance needed..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-ink focus:border-gold focus:ring-1 focus:ring-gold outline-none resize-none transition-all"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3 border border-slate-300 hover:bg-slate-100 text-ink-muted hover:text-navy rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    disabled={loading}
                    className="flex-1 rounded-xl font-bold uppercase tracking-wider py-3 shadow-glow-gold flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    {loading ? "Submitting Request..." : "Confirm & Submit Request"}
                  </Button>
                </div>
                <p className="text-[11px] text-ink-muted text-center mt-2 flex items-center justify-center gap-1.5">
                  <span>🔒</span> Data securely saved in CCIS Admissions Database.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
