"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { User, Phone, BookOpen, Calendar, CheckCircle2, ArrowRight, ArrowLeft, Loader2, Sparkles, MessageCircle, ShieldCheck } from "lucide-react";

const gradesList = [
  "Nursery (Age 3+)",
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

export default function MultiStepAdmissionsForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const [formData, setFormData] = useState({
    studentName: "",
    dob: "",
    gender: "Male",
    grade: "Nursery (Age 3+)",
    currentSchool: "",
    parentName: "",
    email: "",
    phone: "",
    city: "Jaipur",
    curriculum: "CBSE",
    needTransport: "Yes",
    visitDate: "",
    visitTime: "10:00 AM - 11:30 AM",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.studentName || !formData.grade) {
        setToast({ message: "Please fill in the student's name and grade.", type: "error" });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.parentName || !formData.email || !formData.phone) {
        setToast({ message: "Please fill in all parent contact details.", type: "error" });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: formData.studentName,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
        setSubmissionId(data.enquiry?.id || `CCIS-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        setToast({ message: data.error || "Failed to submit enquiry. Please try again.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Network connection error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white border-2 border-gold/40 rounded-2xl p-8 md:p-12 shadow-xl text-center flex flex-col items-center gap-5 animate-fadeIn">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-dark bg-gold/10 px-3 py-1 rounded-full">
          Application Received
        </span>

        <h3 className="font-serif font-bold text-navy text-2xl md:text-3xl">
          Thank You, {formData.parentName}!
        </h3>

        <p className="text-sm text-ink-muted leading-relaxed max-w-md">
          Your admission enquiry for <strong>{formData.studentName}</strong> (Applying for <strong>{formData.grade}</strong>) has been registered under Application Reference:
        </p>

        <div className="bg-cream/40 border border-cream-line px-5 py-3 rounded-xl font-mono font-bold text-navy text-base">
          Ref ID: #{submissionId.slice(-8).toUpperCase()}
        </div>

        <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 text-xs text-ink-muted text-left flex flex-col gap-2 w-full max-w-md">
          <p className="font-bold text-navy flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-dark" /> What happens next?
          </p>
          <p>1. Our Admissions Counselor will contact you via WhatsApp/Phone on <strong>{formData.phone}</strong> within 24 hours.</p>
          <p>2. A confirmation email has been dispatched to <strong>{formData.email}</strong>.</p>
          {formData.visitDate && (
            <p>3. Your campus walkthrough has been tentatively recorded for <strong>{formData.visitDate} ({formData.visitTime})</strong>.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <a
            href={`https://wa.me/919660551977?text=Hello%20CCIS%20Admissions,%20I%20have%20submitted%20an%20application%20for%20${encodeURIComponent(formData.studentName)}%20(Ref:%20${submissionId.slice(-8).toUpperCase()}).`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="gold" size="md" className="rounded-xl font-bold uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Message Counselor on WhatsApp
            </Button>
          </a>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setStep(1);
              setFormData({
                studentName: "",
                dob: "",
                gender: "Male",
                grade: "Nursery (Age 3+)",
                currentSchool: "",
                parentName: "",
                email: "",
                phone: "",
                city: "Jaipur",
                curriculum: "CBSE",
                needTransport: "Yes",
                visitDate: "",
                visitTime: "10:00 AM - 11:30 AM",
                message: "",
              });
            }}
            className="px-5 py-2.5 text-xs font-bold text-navy hover:text-gold uppercase tracking-wider transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-cream-line rounded-2xl p-6 sm:p-8 md:p-10 shadow-card flex flex-col gap-6">
      {/* Stepper Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs font-sans font-bold uppercase tracking-wider text-navy">
          <span className="text-gold-dark flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Step {step} of 4: {
              step === 1 ? "Student Details" :
              step === 2 ? "Parent Information" :
              step === 3 ? "Curriculum & Preferences" : "Campus Visit & Notes"
            }
          </span>
          <span className="text-ink-muted font-mono">{step * 25}% Complete</span>
        </div>
        <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold via-gold-light to-gold transition-all duration-500 rounded-full"
            style={{ width: `${step * 25}%` }}
          />
        </div>
      </div>

      {/* Step Forms */}
      {step === 1 && (
        <form onSubmit={handleNext} className="flex flex-col gap-4 animate-fadeIn">
          <h3 className="font-serif font-bold text-navy text-xl flex items-center gap-2">
            <User className="w-5 h-5 text-gold" /> Step 1: Student Information
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Student Full Name *</label>
            <input
              type="text"
              name="studentName"
              required
              placeholder="e.g. Aarav Sharma"
              value={formData.studentName}
              onChange={handleChange}
              className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Applying For Grade *</label>
              <select
                name="grade"
                required
                value={formData.grade}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white font-semibold"
              >
                {gradesList.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Current / Previous School</label>
              <input
                type="text"
                name="currentSchool"
                placeholder="Current school or playgroup"
                value={formData.currentSchool}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" variant="gold" size="lg" className="rounded-xl font-bold uppercase tracking-wider">
              Continue to Step 2 <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNext} className="flex flex-col gap-4 animate-fadeIn">
          <h3 className="font-serif font-bold text-navy text-xl flex items-center gap-2">
            <Phone className="w-5 h-5 text-gold" /> Step 2: Parent / Guardian Information
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Parent / Guardian Full Name *</label>
            <input
              type="text"
              name="parentName"
              required
              placeholder="e.g. Dr. Rajesh Sharma"
              value={formData.parentName}
              onChange={handleChange}
              className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Primary Phone / WhatsApp *</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="parent@example.com"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Residential Area / City</label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Mansarovar, Jaipur"
              value={formData.city}
              onChange={handleChange}
              className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-navy"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <Button type="submit" variant="gold" size="lg" className="rounded-xl font-bold uppercase tracking-wider">
              Continue to Step 3 <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleNext} className="flex flex-col gap-4 animate-fadeIn">
          <h3 className="font-serif font-bold text-navy text-xl flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" /> Step 3: Curriculum & Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Preferred Curriculum Board</label>
              <select
                name="curriculum"
                value={formData.curriculum}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white font-semibold"
              >
                <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                <option value="IB Candidate (PYP)">IB PYP (International Baccalaureate Candidate)</option>
                <option value="Undecided">Undecided (Recommend Best Fit During Counseling)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">School Bus Transportation Needed?</label>
              <select
                name="needTransport"
                value={formData.needTransport}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white"
              >
                <option value="Yes">Yes, GPS-tracked bus facility required</option>
                <option value="No">No, self drop & pick</option>
                <option value="Maybe">Require route info</option>
              </select>
            </div>
          </div>

          <div className="bg-cream/20 border border-cream-line p-4 rounded-xl text-xs text-ink-muted leading-relaxed">
            <p className="font-bold text-navy mb-1">Curriculum Flexibility:</p>
            You can transition between CBSE and IB PYP early years with counseling from our academic dean during the orientation phase.
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-navy"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <Button type="submit" variant="gold" size="lg" className="rounded-xl font-bold uppercase tracking-wider">
              Continue to Step 4 <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
          <h3 className="font-serif font-bold text-navy text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" /> Step 4: Schedule Campus Tour & Finish
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Preferred Walkthrough Date (Optional)</label>
              <input
                type="date"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider">Preferred Time Slot</label>
              <select
                name="visitTime"
                value={formData.visitTime}
                onChange={handleChange}
                className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all bg-white"
              >
                <option value="9:00 AM - 10:30 AM">Morning Slot (9:00 AM - 10:30 AM)</option>
                <option value="10:30 AM - 12:00 PM">Midday Slot (10:30 AM - 12:00 PM)</option>
                <option value="1:00 PM - 2:30 PM">Afternoon Slot (1:00 PM - 2:30 PM)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-navy uppercase tracking-wider">Specific Queries or Notes for Admissions Team</label>
            <textarea
              name="message"
              rows={3}
              placeholder="Any specific questions about curriculum, scholarships, sports facilities, or hostel..."
              value={formData.message}
              onChange={handleChange}
              className="p-3 border border-cream-line rounded-xl text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-muted hover:text-navy"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={loading}
              className="rounded-xl font-bold uppercase tracking-wider shadow-glow-gold"
            >
              {loading ? "Submitting Application..." : "Submit Admission Enquiry"}
            </Button>
          </div>
        </form>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
