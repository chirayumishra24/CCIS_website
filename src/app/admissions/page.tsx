"use client";
import React, { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

const steps = [
  { step: "01", title: "Submit Online Enquiry", desc: "Fill out our online walkthrough form with your contact details and child's academic grade preference." },
  { step: "02", title: "Personal Campus Tour", desc: "Our counseling head will schedule a walk-through of the Sector-3 campus, labs, and sports arenas." },
  { step: "03", title: "Student Interaction", desc: "An informal interaction to understand your child's capabilities, interests, and curricular path compatibility." },
  { step: "04", title: "Seat Confirmation", desc: "Review documents, finalize CBSE or IB pathway choices, and submit the enrollment fee portfolio." },
];

export default function Admissions() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    grade: "Nursery",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.grade) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: "Enquiry submitted successfully! We will contact you shortly.", type: "success" });
        setFormData({ name: "", email: "", phone: "", grade: "Nursery", message: "" });
      } else {
        setToast({ message: data.error || "Failed to submit enquiry.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/hero1.webp')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            Enrollment 2026-27
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            Admissions Process
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Join the Cambridge Court family. Learn about our simple 4-step admission process and submit an online request.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Admission Roadmap" subtitle="Four Simple Steps" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((st, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${idx + 1}`}
                className="bg-white border border-cream-line p-6 rounded-lg shadow-card flex flex-col gap-3 relative"
              >
                <div className="text-3xl font-mono font-bold text-gold">{st.step}</div>
                <h4 className="font-serif font-bold text-navy text-lg">{st.title}</h4>
                <p className="text-xs text-ink-muted leading-relaxed">{st.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Online Enquiry Form */}
      <section className="py-20 bg-white border-t border-cream-line">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-cream/10 border border-cream-line p-8 md:p-12 rounded-lg shadow-card">
            <h3 className="font-serif font-bold text-2xl text-navy text-center mb-2">Book a Campus Walkthrough</h3>
            <p className="text-xs text-ink-muted text-center mb-8">Fields marked with * are required.</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-semibold text-navy uppercase tracking-wider">Parent Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-semibold text-navy uppercase tracking-wider">Parent Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-semibold text-navy uppercase tracking-wider">Mobile Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="grade" className="text-xs font-semibold text-navy uppercase tracking-wider">Grade Requested *</label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  >
                    <option value="Nursery">Nursery / KG</option>
                    <option value="Grades I-V">Grade I - V</option>
                    <option value="Grades VI-VIII">Grade VI - VIII</option>
                    <option value="Grades IX-X">Grade IX - X</option>
                    <option value="Grades XI-XII">Grade XI - XII (CBSE/IB)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs font-semibold text-navy uppercase tracking-wider">Additional Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white resize-none"
                />
              </div>

              <Button type="submit" isLoading={submitting} variant="primary" className="w-full uppercase font-bold tracking-wider py-4 mt-2 rounded-sm">
                Submit Enquiry
              </Button>
            </form>
          </div>
        </div>
      </section>

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
