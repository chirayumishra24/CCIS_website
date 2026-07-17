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
    input_1: "",
    input_4: "",
    input_3: "",
    input_14: "",
    input_5: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.input_1 || !formData.input_4 || !formData.input_3 || !formData.input_14) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Submit to local API (Firebase / alumni dashboard)
      const localData = {
        name: formData.input_1,
        email: formData.input_4,
        phone: formData.input_3,
        grade: formData.input_14,
        message: formData.input_5
      };
      
      await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localData),
      });

      // 2. Submit to Gravity Forms (remotely) via iframe post
      if (formRef.current) {
        formRef.current.submit();
      }

      setToast({ message: "Enquiry submitted successfully! We will contact you shortly.", type: "success" });
      setFormData({
        input_1: "",
        input_4: "",
        input_3: "",
        input_14: "",
        input_5: "",
      });
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

      {/* Hidden Gravity Forms Submitter Iframe */}
      <iframe
        style={{ display: "none", width: "0px", height: "0px" }}
        src="about:blank"
        name="gform_ajax_frame_1"
        id="gform_ajax_frame_1"
        title="Gravity Forms Lead Submitter"
      ></iframe>

      {/* Online Enquiry Form */}
      <section className="py-20 bg-white border-t border-cream-line">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-cream/10 border border-cream-line p-8 md:p-12 rounded-lg shadow-card">
            <h3 className="font-serif font-bold text-2xl text-navy text-center mb-2">Book a Campus Walkthrough</h3>
            <p className="text-xs text-ink-muted text-center mb-8">Fields marked with * are required.</p>
            
            <form
              ref={formRef}
              method="POST"
              action="https://ccischool.org/#gf_1"
              target="gform_ajax_frame_1"
              id="gform_1"
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              {/* Hidden Fields for Gravity Forms Validation */}
              <input type="hidden" name="gform_ajax" value="form_id=1&amp;title=&amp;description=1&amp;tabindex=0&amp;theme=gravity-theme&amp;styles=[]&amp;hash=a8ffb5c231eb659ad316fe73b0d3fe96" />
              <input type="hidden" name="gform_submission_method" value="iframe" />
              <input type="hidden" name="gform_theme" value="gravity-theme" />
              <input type="hidden" name="gform_style_settings" value="[]" />
              <input type="hidden" name="is_submit_1" value="1" />
              <input type="hidden" name="gform_submit" value="1" />
              <input type="hidden" name="gform_currency" value="DKNJaRyb0iUhBUi7ycnOr9D6MjFTAsGKTg/ielOASgTBOdfuQ9OM25drvhdOeGB6mCckgW80Tdj9BCJilU2sR8rbHdTVWY5tyIxpG9j7qZ+MUXY=" />
              <input type="hidden" name="gform_unique_id" value="" />
              <input type="hidden" name="state_1" value="WyJ7XCIxNFwiOltcImQxNWQ0MjU5MTNiMDEzZjEzMzUzNTgwMjJiOGQ2YjYwXCIsXCIyNGU5ZTc0OGZhODZhNjNlNjdkZTY4MzBjMGQxNGNlMFwiLFwiMjBhODhkZmM2NWEzM2UwNDEzMzlkZjBjYTEwMzFlNGNcIixcIjM2YTAyODg0ZGJlOWI3NmQ4ZWQ3OGRjOGZiODI2ZTZjXCIsXCIwNGM5ZDgzYzc3ZjUwYzIzMzc0Y2RiMDkyZGZmYTNhZFwiLFwiZjA0NWQ0MzdhMzRhZjFiMDNiNmFiYTQxMmIzZWIwMzdcIixcIjA0ZmE4NTA2NmI0NTM2N2Y3ODQ2ZDI3NmVhYTdiMzYzXCIsXCJjNDVlYTVhZmM1MDI2NmQ4YmEwNGFjMjg0MzVjNjA5YVwiLFwiNmI2MzkyMjJiMjhmMmZjNjc4YWRhMjBmYzM5ZmViY2FcIixcIjJjYTljMGE4ZGM1MzAxN2RiZGNkNDg0MzBmNmU2Y2VlXCIsXCJhZjljMTFiNDdkZDhlMWNhMWU2Njg3ODZhZGViOTEwM1wiLFwiNzRjZDdmODFjZjFhMmU1RrFhMmU1MjJhN2U4OTA2MTA2NTRmYmVcIixcImY4NGU0MzAxZmI1ZTU5MzBkNzA3ZWVkYTk1NTI2YWIyXCIsXCI0NDA4Yzg0OGRmZWNmMGQ5N2JhMjFkY2Y3Yjg4MThiMFwiXX0iLCJkNzJmZGVlM2Q5OTBiMzNkZDhiNzVmOWNkZjc5MDM4MSJd" />
              <input type="hidden" name="gform_target_page_number_1" value="0" />
              <input type="hidden" name="gform_source_page_number_1" value="1" />
              <input type="hidden" name="gform_field_values" value="" />
              <input type="hidden" name="input_6" value="" />
              <input type="hidden" name="input_7" value="https://ccischool.org/" />
              <input type="hidden" name="input_8" value="" />
              <input type="hidden" name="input_9" value="" />
              <input type="hidden" name="input_10" value="" />
              <input type="hidden" name="input_11" value="" />
              <input type="hidden" name="input_12" value="" />
              <input type="hidden" name="input_13" value="" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="input_1_1" className="text-xs font-semibold text-navy uppercase tracking-wider">Student Name *</label>
                  <input
                    type="text"
                    id="input_1_1"
                    name="input_1"
                    required
                    value={formData.input_1}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="input_1_4" className="text-xs font-semibold text-navy uppercase tracking-wider">Guardian's Email *</label>
                  <input
                    type="email"
                    id="input_1_4"
                    name="input_4"
                    required
                    value={formData.input_4}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="input_1_3" className="text-xs font-semibold text-navy uppercase tracking-wider">Guardian's Contact *</label>
                  <input
                    type="tel"
                    id="input_1_3"
                    name="input_3"
                    required
                    value={formData.input_3}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="input_1_14" className="text-xs font-semibold text-navy uppercase tracking-wider">Seeking Admission Class *</label>
                  <select
                    id="input_1_14"
                    name="input_14"
                    required
                    value={formData.input_14}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  >
                    <option value="">Seeking Admission in which Class *</option>
                    <option value="Play Group">Play Group</option>
                    <option value="NURSERY">NURSERY</option>
                    <option value="LKG">LKG</option>
                    <option value="UKG">UKG</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                    <option value="VI">VI</option>
                    <option value="VII">VII</option>
                    <option value="VIII">VIII</option>
                    <option value="IX">IX</option>
                    <option value="XI">XI</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="input_1_5" className="text-xs font-semibold text-navy uppercase tracking-wider">Your Message (Optional)</label>
                <textarea
                  id="input_1_5"
                  name="input_5"
                  rows={4}
                  value={formData.input_5}
                  onChange={handleChange}
                  className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white resize-none"
                />
              </div>

              <Button type="submit" isLoading={submitting} variant="primary" className="w-full uppercase font-bold tracking-wider py-4 mt-2 rounded-sm">
                Schedule A Call
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
