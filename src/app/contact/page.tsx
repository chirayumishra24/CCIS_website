"use client";
import React, { useState } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { Mail, Phone, MapPin, Clock, ChevronDown, Send, MessageSquare } from "lucide-react";

const contactInfo = [
  { icon: <Phone className="w-5 h-5" />, label: "Phone", value: "+91-9660551977", href: "tel:+919660551977" },
  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "info@ccischool.org", href: "mailto:info@ccischool.org" },
  { icon: <MapPin className="w-5 h-5" />, label: "Address", value: "Sector-3, Mansarovar, Jaipur, Rajasthan 302020", href: "https://maps.google.com/?q=Cambridge+Court+International+School+Jaipur" },
  { icon: <Clock className="w-5 h-5" />, label: "Office Hours", value: "Mon – Sat, 8:00 AM – 3:00 PM", href: null },
];

const faqs = [
  { q: "What age groups do you admit?", a: "We admit students from Nursery (age 3+) through Grade XI under both CBSE and IB pathways. Transfer admissions are available subject to seat availability." },
  { q: "What curriculum does CCIS follow?", a: "CCIS offers a dual-curriculum model — the CBSE national board from Nursery to Class XII, and the IB Primary Years Programme (PYP) as a candidate school for Ages 3-12." },
  { q: "Is transportation available?", a: "Yes, we operate GPS-tracked school buses covering most residential areas across Jaipur including Mansarovar, Vaishali Nagar, Malviya Nagar, Jagatpura, and Tonk Road." },
  { q: "What extracurricular activities are offered?", a: "We offer 20+ clubs and societies including Robotics & AI, MUN, Theatre, Basketball Academy, Chess Club, School Band, Swimming, and Visual Arts programs." },
  { q: "How can I schedule a campus visit?", a: "You can fill out the enquiry form below, call our admissions office at +91-9660551977, or message us on WhatsApp. We arrange guided tours Monday through Saturday." },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", message: "" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setToast({ message: "Please fill all required fields.", type: "error" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      if (res.ok) {
        setToast({ message: "Your message has been sent. We will reply within 24 hours.", type: "success" });
        setFormState({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("Failed");
      }
    } catch {
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white">
      {/* ━━━ Full-width Map ━━━ */}
      <section className="relative h-64 md:h-80 w-full bg-cream/20">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.5!2d75.7684!3d26.852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCambridge+Court+International+School!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="CCIS Location Map"
        />
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ━━━ Contact Info Bar ━━━ */}
      <section className="py-10 bg-white border-b border-cream-line">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, idx) => (
            <AnimatedSection key={idx} animation="scale-in" delayClass={`stagger-${idx + 1}`}>
              {item.href ? (
                <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-start gap-3 p-4 border border-cream-line rounded-lg hover:border-gold transition-colors group">
                  <div className="p-2 bg-navy/5 group-hover:bg-gold/10 rounded-lg text-navy group-hover:text-gold transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-ink-muted uppercase tracking-wider">{item.label}</span>
                    <p className="text-sm font-semibold text-navy mt-0.5 leading-snug">{item.value}</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-start gap-3 p-4 border border-cream-line rounded-lg">
                  <div className="p-2 bg-navy/5 rounded-lg text-navy shrink-0">{item.icon}</div>
                  <div>
                    <span className="text-[10px] font-sans font-bold text-ink-muted uppercase tracking-wider">{item.label}</span>
                    <p className="text-sm font-semibold text-navy mt-0.5 leading-snug">{item.value}</p>
                  </div>
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ━━━ Contact Form + FAQ ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <AnimatedSection animation="fade-in-left">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs mb-2 block">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">Send Us a Message</h2>
            <div className="gold-rule mb-6" />
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-sans font-bold text-navy uppercase tracking-wider">Name *</label>
                  <input id="name" type="text" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="px-4 py-3 border border-cream-line rounded-lg text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all" placeholder="Your full name" required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-sans font-bold text-navy uppercase tracking-wider">Email *</label>
                  <input id="email" type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="px-4 py-3 border border-cream-line rounded-lg text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-sans font-bold text-navy uppercase tracking-wider">Phone (Optional)</label>
                <input id="phone" type="tel" value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} className="px-4 py-3 border border-cream-line rounded-lg text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all" placeholder="+91 98765 43210" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-sans font-bold text-navy uppercase tracking-wider">Message *</label>
                <textarea id="message" rows={4} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="px-4 py-3 border border-cream-line rounded-lg text-sm font-sans focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none transition-all resize-none" placeholder="Tell us about your enquiry..." required />
              </div>
              <Button type="submit" variant="gold" size="lg" isLoading={sending} className="rounded w-full sm:w-auto font-bold uppercase tracking-wider">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </AnimatedSection>

          {/* FAQ */}
          <AnimatedSection animation="fade-in-right">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs mb-2 block">Quick Answers</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">Frequently Asked</h2>
            <div className="gold-rule mb-6" />
            
            <div className="flex flex-col gap-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`border rounded-lg transition-all duration-300 ${
                    openFaq === idx ? "border-gold bg-white shadow-card" : "border-cream-line bg-white/50 hover:border-cream-line/80"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left"
                  >
                    <span className="font-serif font-bold text-navy text-sm leading-snug">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-ink-muted shrink-0 transition-transform duration-300 ${openFaq === idx ? "rotate-180 text-gold" : ""}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-40 pb-4 px-5" : "max-h-0"}`}>
                    <p className="text-sm text-ink-muted leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
