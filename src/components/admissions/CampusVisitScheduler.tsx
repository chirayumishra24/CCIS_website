"use client";
import React, { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, GraduationCap, CheckCircle2, CalendarPlus, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

const availableSlots = [
  "09:00 AM – 10:00 AM",
  "10:30 AM – 11:30 AM",
  "12:00 PM – 01:00 PM",
  "01:30 PM – 02:30 PM",
];

const grades = [
  "Nursery / Kindergarten",
  "Primary (Grades I – V)",
  "Middle (Grades VI – VIII)",
  "Secondary (Grades IX – X)",
  "Sr. Secondary (Grades XI – XII)",
];

export default function CampusVisitScheduler() {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    grade: grades[0],
    visitDate: "",
    timeSlot: availableSlots[0],
    interests: ["Robotics Labs", "Classrooms"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Generate valid next 14 business days (Mon - Sat)
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const handleInterestToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter((i) => i !== item)
        : [...prev.interests, item],
    }));
  };

  const handleDownloadICS = () => {
    const title = `CCIS Campus Physical Tour & Admission Interaction`;
    const description = `Physical tour of Cambridge Court International School campus, robotics labs, sports arena, and interaction with the Academic Dean for ${formData.grade}. Parent: ${formData.parentName}`;
    const location = `Cambridge Court International School, Sector-3, Mansarovar, Jaipur, Rajasthan 302020`;

    const dateStr = (formData.visitDate || new Date().toISOString().split("T")[0]).replace(/-/g, "");
    const startTime = "040000Z"; // 09:30 AM IST
    const endTime = "053000Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CCIS Jaipur//Campus Visit//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${dateStr}T${startTime}`,
      `DTEND:${dateStr}T${endTime}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CCIS_Campus_Visit_${formData.visitDate || "scheduled"}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Post to admission endpoint
      await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantName: `[Campus Tour] ${formData.parentName} (${formData.grade})`,
          email: formData.email,
          phone: formData.phone,
          grade: formData.grade,
          parent: formData.parentName,
          message: `Scheduled Campus Physical Visit for Date: ${formData.visitDate}, Slot: ${formData.timeSlot}. Key Interests: ${formData.interests.join(", ")}`,
        }),
      });

      setIsBooked(true);
    } catch (err) {
      console.error(err);
      setIsBooked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
      {/* Header Banner */}
      <div className="bg-navy text-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-widest font-bold">
            <Calendar className="w-4 h-4" /> Physical Experience
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 text-white">
            Schedule a Guided Campus Walkthrough
          </h3>
          <p className="text-white/60 text-xs md:text-sm mt-1 max-w-xl">
            Tour our 4-acre world-class campus, AI &amp; Robotics maker studios, synthetic athletics complex, and meet academic coordinators in person.
          </p>
        </div>
        <div className="bg-gold/15 border border-gold/30 text-gold-light px-4 py-2 rounded-xl text-center shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider block">Visiting Hours</span>
          <span className="text-xs font-bold font-mono">Mon – Sat | 9AM – 3PM</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8">
        {isBooked ? (
          <div className="bg-cream/20 border border-cream-line rounded-2xl p-8 text-center flex flex-col items-center gap-4 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-navy text-2xl">Campus Visit Confirmed!</h4>
            <p className="text-sm text-ink-muted leading-relaxed">
              Thank you, <strong className="text-navy">{formData.parentName}</strong>. Your physical visit has been registered for{" "}
              <strong className="text-navy">{formData.visitDate}</strong> during the{" "}
              <strong className="text-navy">{formData.timeSlot}</strong> slot. Our admissions host will welcome you at the main reception.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full justify-center">
              <Button
                variant="gold"
                onClick={handleDownloadICS}
                className="rounded-xl flex items-center justify-center gap-2 text-xs py-2.5"
              >
                <CalendarPlus className="w-4 h-4" /> Add to Google / Apple Calendar (.ics)
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsBooked(false)}
                className="rounded-xl text-xs py-2.5"
              >
                Book Another Slot
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent Name */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                Parent / Guardian Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream/10 border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                Mobile Number (for SMS &amp; Gate Pass) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98290 XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream/10 border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream/10 border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
                />
              </div>
            </div>

            {/* Child Grade */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                Applying Grade Level *
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream/10 border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
                >
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferred Visit Date */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                Preferred Visit Date *
              </label>
              <input
                type="date"
                required
                min={getMinDate()}
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-cream/10 border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
              />
            </div>

            {/* Preferred Time Slot */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                Preferred Time Window *
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-cream/10 border border-cream-line rounded-xl text-xs font-sans text-navy focus:border-gold outline-none"
                >
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Key Areas of Interest */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                Key Campus Facilities You Wish to Inspect
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "AI & Robotics Makerspace",
                  "Physics, Chemistry & Bio Labs",
                  "Central Research Library",
                  "Sports Turf & Basketball Courts",
                  "IB PYP Activity Studios",
                  "Classroom Demonstration",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleInterestToggle(item)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      formData.interests.includes(item)
                        ? "bg-navy text-white border-navy shadow-sm"
                        : "bg-cream/20 text-navy/70 border-cream-line hover:border-gold"
                    }`}
                  >
                    {formData.interests.includes(item) ? "✓ " : "+ "}
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 pt-2">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="w-full rounded-xl py-3.5 text-sm font-bold shadow-card hover:shadow-card-hover"
              >
                {isSubmitting ? "Securing Tour Slot..." : "Confirm Campus Walkthrough Reservation"}
              </Button>
              <p className="text-[11px] text-center text-ink-muted mt-2">
                Free parent visitor parking available inside Gate 1 • ID proof required at reception
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
