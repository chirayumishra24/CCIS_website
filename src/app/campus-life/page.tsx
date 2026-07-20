import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Campus Life — Clubs, Sports & World-Class Facilities",
  description: "Explore CCIS campus life — AI & Robotics studios, Olympic-standard courts, creative arts ateliers, and 20+ student clubs and societies.",
};

const facilities = [
  { title: "AI & Robotics Studio", img: "/images/future.jpg", desc: "Equipped with drone kits, programmable microcontrollers, 3D printers, and coding setups." },
  { title: "Olympic-Standard Courts", img: "/images/passion.jpg", desc: "Synthetic basketball arenas, indoor badminton nets, tennis turfs, and athletic training tracks." },
  { title: "Central Library & Archives", img: "/images/personalised.jpg", desc: "Home to over 15,000 prints, digital journals, quiet study spaces, and research systems." },
  { title: "Visual Arts Atelier", img: "/images/global.jpg", desc: "Studio workspaces for pottery, oil painting, sculptures, and student gallery exhibitions." },
];

export default function CampusLife() {
  return (
    <div className="bg-white">
      {/* ━━━ Compact Hero with breadcrumb styling ━━━ */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/campus_life_hero.png" alt="" fill className="object-cover opacity-20" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/70 via-navy/60 to-navy" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20 z-10">
          <div className="flex items-center gap-2 text-white/40 text-xs font-sans mb-4">
            <span>Home</span>
            <span>/</span>
            <span className="text-gold">Campus Life</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight">
            Beyond the Classroom
          </h1>
          <p className="text-white/55 max-w-lg mt-3 leading-relaxed text-sm">
            Our campus is built for discovery — from cutting-edge labs to expansive sports facilities.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gold" />
      </section>

      {/* ━━━ Facilities — Masonry-style layout ━━━ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="World-Class Amenities" subtitle="Our Infrastructure" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facilities.map((item, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${(idx % 4) + 1}`}
                className={`bg-cream/10 border border-cream-line rounded-xl overflow-hidden shadow-card flex flex-col hover:shadow-card-hover transition-all duration-300 group ${
                  idx === 0 ? "md:row-span-2" : ""
                }`}
              >
                <div className={`relative w-full overflow-hidden ${idx === 0 ? "h-64 md:h-full md:min-h-[400px]" : "h-52"}`}>
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h4 className="font-serif font-bold text-white text-xl mb-1">{item.title}</h4>
                    <p className="text-white/70 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ Extra-Curriculars ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10 border-t border-cream-line">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection animation="fade-in-left" className="flex flex-col gap-5">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Passions & Talents</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">Sports Academies & Creative Clubs</h2>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed text-sm">
              At CCIS, we ensure that every student identifies and nurtures a lifelong talent. Our students choose from various societies, including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-navy">
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Robotics & Coding Society</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Model United Nations (MUN)</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Theatre, Drama & Fine Arts</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Basketball & Athletics Academies</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ Chess Club & Logical Games</li>
              <li className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cream/30 transition-colors">✓ School Band & Music Choir</li>
            </ul>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-cream-line shadow-card bg-navy-dark">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/Video/ccis_football_drone.mp4" type="video/mp4" />
              </video>
              <div className="absolute bottom-3 left-3 bg-navy-dark/80 text-white font-sans text-xs px-3 py-1 rounded backdrop-blur-sm border border-white/10 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Drone Footage &bull; Sports & Athletics Turf
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
