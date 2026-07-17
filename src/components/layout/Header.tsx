"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, Clock } from "lucide-react";
import Button from "../ui/Button";

interface SubLink {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href?: string;
  dropdown?: SubLink[];
}

const navStructure: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Our School",
    dropdown: [
      { name: "About CCIS", href: "/about" },
      { name: "Faculty & Team", href: "/faculty" },
      { name: "Alumni Network", href: "/alumni" },
    ],
  },
  {
    name: "Academics & Life",
    dropdown: [
      { name: "Academic Programs", href: "/academics" },
      { name: "Campus Life & Facilities", href: "/campus-life" },
      { name: "Latest News & Events", href: "/news-events" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
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
      {/* Top Bar - Hidden on mobile, shown on sm and up */}
      <div className={`hidden sm:block bg-navy-dark text-white/90 text-xs px-4 transition-all duration-300 ease-in-out ${isScrolled ? "max-h-0 py-0 overflow-hidden opacity-0" : "max-h-12 py-2 opacity-100"}`}>
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

      {/* Main Navigation - White theme with Gold bottom border */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md py-3" 
          : "bg-white py-5"
      } border-b-2 border-gold`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center group focus:outline-none py-1">
            <img src="/images/logo.webp" alt="CCIS Logo" className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navStructure.map((item) => {
              if (item.dropdown) {
                const isItemActive = item.dropdown.some(sub => sub.href === pathname);
                return (
                  <div
                    key={item.name}
                    className="relative group py-2"
                  >
                    <button
                      className={`font-sans text-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 focus:outline-none ${isItemActive ? "text-gold" : "text-navy hover:text-gold"}`}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180 text-navy-light group-hover:text-gold" />
                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-cream-line rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 backdrop-blur-md">
                      {item.dropdown.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`block px-4 py-2 text-sm font-sans font-semibold hover:bg-cream/15 transition-colors ${isSubActive ? "text-gold" : "text-navy hover:text-gold"}`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href || "/"}
                    className={`font-sans text-sm font-semibold uppercase tracking-wider transition-colors relative py-1.5 focus:outline-none ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                    )}
                  </Link>
                );
              }
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
            className="lg:hidden text-navy hover:text-gold p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Backdrop */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[990] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`} 
      />

      {/* Mobile Slide-out Drawer */}
      <div 
        className={`lg:hidden fixed top-0 right-0 w-[300px] sm:w-[320px] h-full bg-white border-l border-cream-line shadow-2xl z-[995] flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-cream-line bg-cream/10">
          <div className="py-1 px-3">
            <img src="/images/logo.webp" alt="CCIS Logo" className="h-7 w-auto object-contain" />
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-navy hover:text-gold p-1 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-4">
          {navStructure.map((item) => {
            if (item.dropdown) {
              const isExpanded = mobileExpanded[item.name];
              return (
                <div key={item.name} className="flex flex-col border-b border-cream-line pb-2">
                  <button
                    onClick={() => setMobileExpanded(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                    className="font-sans text-base font-bold uppercase tracking-wide py-2 flex items-center justify-between text-navy hover:text-gold focus:outline-none w-full"
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180 text-gold" : "text-navy/40"}`} />
                  </button>
                  {/* Accordion content with smooth transition */}
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <div className="flex flex-col gap-3 pl-4 pb-2 border-l-2 border-gold/30">
                      {item.dropdown.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`font-sans text-sm font-semibold transition-colors ${isSubActive ? "text-gold" : "text-navy-light hover:text-gold"}`}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            } else {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href || "/"}
                  className={`font-sans text-base font-bold uppercase tracking-wide py-3 border-b border-cream-line transition-colors ${isActive ? "text-gold" : "text-navy hover:text-gold"}`}
                >
                  {item.name}
                </Link>
              );
            }
          })}
          <Link href="/admissions" className="mt-6">
            <Button variant="gold" className="w-full font-bold uppercase tracking-wider py-3.5 rounded-sm">
              Apply Now
            </Button>
          </Link>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-cream-line bg-cream/20 flex flex-col gap-3">
          <span className="text-navy-light text-xs font-sans">For Inquiries:</span>
          <a href="tel:+919660551977" className="text-navy hover:text-gold text-sm font-semibold transition-colors">+91 9660551977</a>
          <a href="mailto:info@ccischool.org" className="text-navy hover:text-gold text-sm font-semibold transition-colors">info@ccischool.org</a>
        </div>
      </div>
    </header>
  );
}
