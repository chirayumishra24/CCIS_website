"use client";
import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, Phone, Mail, CheckCircle, Sparkles, Building2 } from "lucide-react";
import Button from "./Button";

interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookVisitModal({ isOpen, onClose }: BookVisitModalProps) {
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    grade: "Grade 1",
    curriculum: "CBSE & IB PYP",
    visitDate: "",
    visitTime: "10:00 AM - 11:30 AM",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.parentName || !formData.phone || !formData.email || !formData.visitDate) {
      setErrorMsg("Please fill in all mandatory fields (Parent Name, Phone, Email, Preferred Date).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: formData.studentName || formData.parentName,
          notes: ["Requested via Campus Visit Form"],
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit booking. Please try again.");
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
      curriculum: "CBSE & IB PYP",
      visitDate: "",
      visitTime: "10:00 AM - 11:30 AM",
      message: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-dark/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-cream-line overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-navy-dark via-navy to-navy-dark p-6 sm:p-8 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-widest font-bold">
            <Sparkles className="w-4 h-4" /> Official Campus Experience
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Book a Campus Visit &amp; Tour
          </h3>
          <p className="text-white/70 text-xs sm:text-sm mt-1 max-w-lg">
            Experience Cambridge Court International School in person. Tour our world-class smart labs, sports complex, and meet our academic mentors.
          </p>

          {/* Quick CCIS verified Info from ccischool.org */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-4 text-xs text-cream-dark/80 font-sans">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>Sector-3, Mansarovar, Jaipur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>+91 9660551977</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold" />
              <span>Mon-Sat: 9:00 AM – 3:00 PM</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-navy">
                Visit Scheduled Successfully!
              </h4>
              <p className="text-ink-muted text-sm max-w-md leading-relaxed">
                Thank you, <strong className="text-navy">{formData.parentName}</strong>. Your campus tour request for <strong className="text-navy">{formData.visitDate} ({formData.visitTime})</strong> has been registered. Our admissions counselor will contact you shortly to confirm your pass.
              </p>
              <div className="bg-cream/40 border border-cream-line rounded-xl p-4 w-full max-w-md text-left text-xs text-ink-muted space-y-1.5 mt-2">
                <p><strong className="text-navy">Campus Location:</strong> Sector-3, Mansarovar, Jaipur, Rajasthan - 302020</p>
                <p><strong className="text-navy">Helpline:</strong> +91 9660551977</p>
                <p><strong className="text-navy">Email:</strong> info@ccischool.org</p>
              </div>
              <Button variant="gold" onClick={handleReset} className="mt-4 rounded-xl px-8 font-bold uppercase tracking-wider text-xs">
                Close &amp; Continue Browsing
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Student&apos;s Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aarav Sharma"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Mobile / WhatsApp No. *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Applying Grade / Class
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
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
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Curriculum Interest
                  </label>
                  <select
                    value={formData.curriculum}
                    onChange={(e) => setFormData({ ...formData, curriculum: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
                  >
                    <option value="Dual (CBSE & IB PYP)">Dual (CBSE &amp; IB PYP)</option>
                    <option value="IB Primary Years Programme">IB Primary Years Programme</option>
                    <option value="CBSE National Board">CBSE National Board</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Preferred Visit Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={formData.visitDate}
                    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    value={formData.visitTime}
                    onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none"
                  >
                    <option value="09:30 AM - 11:00 AM">09:30 AM – 11:00 AM</option>
                    <option value="11:30 AM - 01:00 PM">11:30 AM – 01:00 PM</option>
                    <option value="02:00 PM - 03:30 PM">02:00 PM – 03:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1.5">
                  Special Inquiries or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific facilities you'd like to inspect or questions about our programs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream/20 border border-cream-line rounded-xl text-sm focus:border-gold outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  disabled={loading}
                  className="w-full rounded-xl font-bold uppercase tracking-wider py-3 shadow-glow-gold flex items-center justify-center gap-2"
                >
                  {loading ? "Registering Visit..." : "Confirm & Book Campus Visit"}
                </Button>
                <p className="text-[11px] text-ink-muted text-center mt-2">
                  🔒 Data securely transmitted &amp; stored directly in CCIS Admissions Database.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
