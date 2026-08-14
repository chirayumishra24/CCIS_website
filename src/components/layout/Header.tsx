"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Phone, Mail, Clock, Search, Bell, Sparkles, AlertTriangle } from "lucide-react";
import Button from "../ui/Button";
import QuickSearchModal from "../ui/QuickSearchModal";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<{
    active: boolean;
    message: string;
    linkText?: string;
    linkUrl?: string;
    type?: "admissions" | "urgent" | "info";
  } | null>(null);
  const [showTicker, setShowTicker] = useState(true);
  const pathname = usePathname();

  // Fetch live announcement banner
  useEffect(() => {
    fetch("/api/admin/announcement")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.active) {
          setAnnouncement(data);
        }
      })
      .catch(console.error);
  }, []);

  // Global keydown listener for Cmd+K and Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    <>
      <header className="fixed top-0 left-0 w-full z-[990] transition-all duration-300">
        {/* Dynamic Global Notice Ticker (if active & enabled) */}
        {announcement?.active && showTicker && (
          <div
            className={`py-1.5 px-4 text-white text-xs transition-all duration-300 border-b flex items-center justify-between gap-3 ${
              announcement.type === "urgent"
                ? "bg-maroon-dark border-rose-500/30"
                : announcement.type === "admissions"
                ? "bg-navy-dark border-gold/30"
                : "bg-navy border-blue-400/30"
            }`}
          >
            <div className="max-w-7xl mx-auto flex-1 flex items-center justify-center gap-2 overflow-hidden">
              <span
                className={`text-[9px] font-sans font-extrabold uppercase px-2 py-0.5 tracking-wider rounded shrink-0 flex items-center gap-1 ${
                  announcement.type === "urgent"
                    ? "bg-rose-600 text-white"
                    : announcement.type === "admissions"
                    ? "bg-gold text-navy font-bold shadow-glow-gold"
                    : "bg-blue-500 text-white"
                }`}
              >
                <Bell className="w-2.5 h-2.5" />
                {announcement.type === "urgent" ? "URGENT" : announcement.type === "admissions" ? "ADMISSIONS" : "NOTICE"}
              </span>
              <p className="truncate text-white/90 text-xs font-medium">
                {announcement.message}
              </p>
              {announcement.linkText && (
                <Link
                  href={announcement.linkUrl || "/admissions"}
                  className="text-gold hover:underline font-bold text-xs shrink-0 hidden sm:inline ml-1"
                >
                  {announcement.linkText} &rarr;
                </Link>
              )}
            </div>
            <button
              onClick={() => setShowTicker(false)}
              className="text-white/50 hover:text-white transition-colors p-0.5 shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top Info Bar */}
        <div
          className={`hidden sm:block bg-navy-dark text-white/90 text-xs px-4 transition-all duration-300 ease-in-out ${
            isScrolled ? "max-h-0 py-0 overflow-hidden opacity-0" : "max-h-12 py-2 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gold-light" />
                <a href="tel:+919660551977" className="hover:text-gold transition-colors">
                  +91 9660551977
                </a>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-light" />
                <a href="mailto:info@ccischool.org" className="hover:text-gold transition-colors">
                  info@ccischool.org
                </a>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-light" />
                <span>Office Hrs: 8:00 AM - 2:30 PM</span>
              </span>
              <Link href="/policies" className="hover:text-gold transition-colors font-medium">
                Disclosures &amp; Policies
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav
          className={`w-full transition-all duration-300 ${
            isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-white py-4"
          } border-b-2 border-gold`}
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center group focus:outline-none py-1 shrink-0">
              <Image
                src="/images/logo.webp"
                alt="CCIS Logo"
                width={160}
                height={40}
                priority
                className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navStructure.map((item) => {
                if (item.dropdown) {
                  const isItemActive = item.dropdown.some((sub) => sub.href === pathname);
                  return (
                    <div key={item.name} className="relative group py-2">
                      <button
                        className={`font-sans text-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 focus:outline-none ${
                          isItemActive ? "text-gold" : "text-navy hover:text-gold"
                        }`}
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
                              className={`block px-4 py-2 text-sm font-sans font-semibold hover:bg-cream/15 transition-colors ${
                                isSubActive ? "text-gold" : "text-navy hover:text-gold"
                              }`}
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
                      className={`font-sans text-sm font-semibold uppercase tracking-wider transition-colors relative py-1.5 focus:outline-none ${
                        isActive ? "text-gold" : "text-navy hover:text-gold"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold rounded-full" />
                      )}
                    </Link>
                  );
                }
              })}

              {/* Quick Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-cream/40 hover:bg-cream border border-cream-line text-ink-muted hover:text-navy rounded-xl text-xs font-sans transition-all duration-200"
                title="Search (Cmd+K / Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-gold-dark" />
                <span>Search...</span>
                <kbd className="hidden xl:inline text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-cream-line text-ink-muted">
                  ⌘K
                </kbd>
              </button>

              <Link href="/admissions">
                <Button
                  variant="gold"
                  size="sm"
                  className="font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-gold"
                >
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Mobile Actions (Search + Hamburger) */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-navy hover:text-gold p-2 focus:outline-none"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-navy hover:text-gold p-2 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
              <Image
                src="/images/logo.webp"
                alt="CCIS Logo"
                width={120}
                height={28}
                className="h-7 w-auto object-contain"
              />
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
          <div className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-3">
            {/* Quick Search inside drawer */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 bg-cream/30 border border-cream-line rounded-xl text-xs font-sans text-navy mb-2"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gold-dark" /> Quick Search School...
              </span>
              <kbd className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border">
                ⌘K
              </kbd>
            </button>

            {navStructure.map((item) => {
              if (item.dropdown) {
                const isExpanded = mobileExpanded[item.name];
                return (
                  <div key={item.name} className="flex flex-col border-b border-cream-line pb-2">
                    <button
                      onClick={() =>
                        setMobileExpanded((prev) => ({
                          ...prev,
                          [item.name]: !prev[item.name],
                        }))
                      }
                      className="font-sans text-base font-bold uppercase tracking-wide py-2 flex items-center justify-between text-navy hover:text-gold focus:outline-none w-full"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-gold" : "text-navy/40"
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? "max-h-48 opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-col gap-3 pl-4 pb-2 border-l-2 border-gold/30">
                        {item.dropdown.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className={`font-sans text-sm font-semibold transition-colors ${
                                isSubActive ? "text-gold" : "text-navy-light hover:text-gold"
                              }`}
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
                    className={`font-sans text-base font-bold uppercase tracking-wide py-3 border-b border-cream-line transition-colors ${
                      isActive ? "text-gold" : "text-navy hover:text-gold"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}

            <Link href="/admissions" className="mt-4">
              <Button
                variant="gold"
                className="w-full font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-glow-gold"
              >
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-cream-line bg-cream/20 flex flex-col gap-3">
            <span className="text-navy-light text-xs font-sans">For Inquiries &amp; Tours:</span>
            <a
              href="tel:+919660551977"
              className="text-navy hover:text-gold text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-gold" /> +91 9660551977
            </a>
            <a
              href="mailto:info@ccischool.org"
              className="text-navy hover:text-gold text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5 text-gold" /> info@ccischool.org
            </a>
          </div>
        </div>
      </header>

      {/* Global Quick Search Modal (Cmd+K) */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
