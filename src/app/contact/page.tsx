"use client";
import React, { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({ message: "Name, email, and message are required.", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: "Message sent successfully!", type: "success" });
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setToast({ message: data.error || "Failed to send message.", type: "error" });
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
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            Contact CCIS School
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Reach out to our administrative, support, or alumni coordination teams today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <AnimatedSection animation="fade-in-left" className="flex flex-col gap-8">
            <div>
              <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm">Administrative Desk</span>
              <h2 className="text-3xl font-serif font-bold text-navy mt-2">Campus Information</h2>
              <div className="gold-rule mt-4" />
            </div>

            <p className="text-ink-muted leading-relaxed">
              We look forward to welcoming you at our Mansarovar campus in Sector-3. Please reach out to us for admission guidance, partnership requests, or news questions.
            </p>

            <div className="flex flex-col gap-6 mt-4">
              <div className="flex gap-4 p-4 border border-cream-line bg-cream/15 rounded-lg">
                <MapPin className="w-6 h-6 text-gold shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-navy text-lg">School Address</h4>
                  <p className="text-sm text-ink-muted leading-relaxed mt-1">
                    Sector-3, Mansarovar, Jaipur, Rajasthan - 302020
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-cream-line bg-cream/15 rounded-lg">
                <Phone className="w-6 h-6 text-gold shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-navy text-lg">Contact Number</h4>
                  <p className="text-sm text-ink-muted leading-relaxed mt-1">
                    <a href="tel:+919660551977" className="hover:text-gold transition-colors font-bold">+91 9660551977</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-cream-line bg-cream/15 rounded-lg">
                <Mail className="w-6 h-6 text-gold shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-navy text-lg">Email Address</h4>
                  <p className="text-sm text-ink-muted leading-relaxed mt-1">
                    <a href="mailto:info@ccischool.org" className="hover:text-gold transition-colors font-bold">info@ccischool.org</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 border border-cream-line bg-cream/15 rounded-lg">
                <Clock className="w-6 h-6 text-gold shrink-0 mt-1" />
                <div>
                  <h4 className="font-serif font-bold text-navy text-lg">Working Hours</h4>
                  <p className="text-sm text-ink-muted leading-relaxed mt-1">
                    Monday - Saturday: 8:00 AM - 2:30 PM (Closed on Sundays)
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection animation="fade-in-right" className="bg-cream/15 border border-cream-line p-8 md:p-12 rounded-lg shadow-card">
            <h3 className="font-serif font-bold text-2xl text-navy mb-6 pb-2 border-b border-cream-line">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-navy uppercase tracking-wider">Your Full Name *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-navy uppercase tracking-wider">Email Address *</label>
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
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-navy uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-navy uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-navy uppercase tracking-wider">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white resize-none"
                />
              </div>

              <Button type="submit" isLoading={submitting} variant="primary" className="uppercase font-bold tracking-wider py-4 mt-2 rounded-sm">
                Send Message
              </Button>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* Map Embed Section */}
      <section className="w-full h-[400px] relative border-t border-cream-line">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.8872658936663!2d75.7661556752763!3d26.843534576689816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db5dc35555555%3A0xe9f79ca41e127ee7!2sCambridge%20Court%20International%20School!5e0!3m2!1sen!2sin!4v1721200000000!5m2!1sen!2sin"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          title="CCIS Jaipur Campus Map Detail"
        />
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
