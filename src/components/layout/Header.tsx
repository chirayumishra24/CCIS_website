"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, Clock } from "lucide-react";
import Button from "../ui/Button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Academics", href: "/academics" },
  { name: "Campus Life", href: "/campus-life" },
  { name: "Faculty", href: "/faculty" },
  { name: "News & Events", href: "/news-events" },
  { name: "Alumni", href: "/alumni" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-[990] transition-all duration-300">
      {/* Top Bar */}
      <div className={`bg-navy-dark text-white/90 text-xs px-4 transition-all duration-300 ease-in-out ${isScrolled ? "max-h-0 py-0 overflow-hidden opacity-0" : "max-h-12 py-2 opacity-100"}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-light" />
              <a href="tel:+919660551977" className="hover:text-gold transition-colors">+91 9660551977</a>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gold-light" />
              <a href="mailto:info@ccischool.org" className="hover:text-gold transition-colors">info@ccischool.org</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-light" />
              <span>Office Hrs: 8:00 AM - 2:30 PM</span>
            </span>
            <Link href="/policies" className="hover:text-gold transition-colors font-medium">School Policies</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`transition-all duration-300 ${isScrolled ? "bg-navy/95 backdrop-blur-md shadow-nav py-3" : "bg-navy py-5"} border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group focus:outline-none bg-white py-1.5 px-3 rounded-lg shadow-sm">
            <img src="/images/logo.webp" alt="CCIS Logo" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-sm font-semibold uppercase tracking-wider transition-colors relative py-1.5 focus:outline-none ${isActive ? "text-gold" : "text-white/80 hover:text-white"}`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full animate-fadeIn" />
                  )}
                </Link>
              );
            })}
            <Link href="/admissions">
              <Button variant="gold" size="sm" className="font-bold text-xs uppercase tracking-wider rounded-sm">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white/95 hover:text-white p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[108px] bg-navy z-[900] flex flex-col border-t border-white/10 animate-fadeIn">
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-sans text-lg font-bold uppercase tracking-wide py-2.5 border-b border-white/5 transition-colors ${isActive ? "text-gold" : "text-white/70 hover:text-white"}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link href="/admissions" className="mt-4">
              <Button variant="gold" className="w-full font-bold uppercase tracking-wider">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
