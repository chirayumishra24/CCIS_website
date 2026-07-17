import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-white/80 border-t-2 border-gold font-sans">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* About Section */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center border-2 border-gold shadow-glow-gold">
              <img src="/images/logo.webp" alt="CCIS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-white text-lg leading-none">CCIS</span>
              <span className="font-sans text-[9px] text-cream-dark uppercase tracking-widest leading-none mt-1">International School</span>
            </div>
          </Link>
          <p className="text-sm text-cream-dark/70 leading-relaxed mt-2">
            Where Learning Meets Life! Providing dual CBSE and IB curriculum pathways to nurture future global leaders with solid traditional Indian values.
          </p>
          {/* Social Icons (custom SVGs to avoid import barrel issues) */}
          <div className="flex items-center gap-4 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-gold hover:text-navy rounded-full transition-all duration-300" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-gold hover:text-navy rounded-full transition-all duration-300" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-gold hover:text-navy rounded-full transition-all duration-300" aria-label="YouTube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163C23.009 4.345 21.583 2.913 19.773 2.422 16.097 1.417 12 1.417 12 1.417s-4.097 0-7.773 1.005C2.417 2.913.991 4.345.502 6.163.076 9.87.076 12 .076 12s0 2.13.426 5.837c.489 1.818 1.915 3.25 3.725 3.741C7.903 22.583 12 22.583 12 22.583s4.097 0 7.773-1.005c1.81-4.91 3.236-1.923 3.725-3.741.426-3.707.426-5.837.426-5.837s0-2.13-.426-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-gold hover:text-navy rounded-full transition-all duration-300" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-white text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-gold">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li><Link href="/about" className="hover:text-gold transition-colors">About CCIS</Link></li>
            <li><Link href="/academics" className="hover:text-gold transition-colors">Academics &amp; Boards</Link></li>
            <li><Link href="/admissions" className="hover:text-gold transition-colors">Admissions 2026-27</Link></li>
            <li><Link href="/campus-life" className="hover:text-gold transition-colors">Campus Life &amp; Facilities</Link></li>
            <li><Link href="/news-events" className="hover:text-gold transition-colors">Latest News &amp; Notices</Link></li>
            <li><Link href="/alumni" className="hover:text-gold transition-colors">Alumni Network</Link></li>
          </ul>
        </div>

        {/* Academics */}
        <div>
          <h4 className="font-serif font-bold text-white text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-gold">
            Our Programs
          </h4>
          <ul className="flex flex-col gap-3.5 text-sm">
            <li><Link href="/academics" className="hover:text-gold transition-colors">IB Primary Years Programme</Link></li>
            <li><Link href="/academics" className="hover:text-gold transition-colors">IB Diploma Programme</Link></li>
            <li><Link href="/academics" className="hover:text-gold transition-colors">CBSE Primary Section</Link></li>
            <li><Link href="/academics" className="hover:text-gold transition-colors">CBSE Secondary &amp; Senior Secondary</Link></li>
            <li><Link href="/policies" className="hover:text-gold transition-colors">Curriculum Policies</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Book a Counseling Call</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-serif font-bold text-white text-lg mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-gold">
            Get In Touch
          </h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span className="leading-relaxed text-cream-dark/80">
                Cambridge Court International School,<br />
                Sector-3, Mansarovar, Jaipur, Rajasthan - 302020
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span>
                <a href="tel:+919660551977" className="hover:text-gold transition-colors font-semibold">+91 9660551977</a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span>
                <a href="mailto:info@ccischool.org" className="hover:text-gold transition-colors font-semibold">info@ccischool.org</a>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-navy/50 py-6 border-t border-white/5 text-center text-xs text-cream-dark/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {currentYear} Cambridge Court International School. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/policies" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/policies" className="hover:text-gold transition-colors">Terms of Use</Link>
            <Link href="/admin" className="hover:text-gold transition-colors font-semibold">Admin Panel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
