"use client";
import React from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";

const facilities = [
  { title: "AI &amp; Robotics Studio", img: "/images/future.jpg", desc: "Equipped with drone kits, programmable microcontrollers, 3D printers, and coding setups." },
  { title: "Olympic-Standard Courts", img: "/images/passion.jpg", desc: "Synthetic basketball arenas, indoor badminton nets, tennis turfs, and athletic training tracks." },
  { title: "Central Library &amp; Archives", img: "/images/personalised.jpg", desc: "Home to over 15,000 prints, digital journals, quiet study spaces, and research systems." },
  { title: "Visual Arts Atelier", img: "/images/global.jpg", desc: "Studio workspaces for pottery, oil painting, sculptures, and student gallery exhibitions." },
];

export default function CampusLife() {
  return (
    <div className="bg-white">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/campus_life_hero.png')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            Beyond Academics
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            Vibrant Campus Life
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Explore our state-of-the-art facilities, clubs, sports academies, and visual arts studios.
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="World-Class Amenities" subtitle="Our Infrastructure" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((item, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${(idx % 4) + 1}`}
                className="bg-cream/20 border border-cream-line rounded-lg overflow-hidden shadow-card flex flex-col hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col gap-2">
                  <h4 className="font-serif font-bold text-navy text-lg" dangerouslySetInnerHTML={{ __html: item.title }} />
                  <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Curriculars */}
      <section className="py-20 bg-cream/10 border-t border-cream-line">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="fade-in-left" className="flex flex-col gap-6">
            <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm">Passion &amp; Talents</span>
            <h2 className="text-3xl font-serif font-bold text-navy">Sports Academies &amp; Creative Clubs</h2>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed">
              At CCIS, we ensure that every student identifies and nurtures a lifelong talent. Our students choose from various societies, including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm font-semibold text-navy">
              <li className="flex items-center gap-2">✓ Robotics &amp; Coding Society</li>
              <li className="flex items-center gap-2">✓ Model United Nations (MUN)</li>
              <li className="flex items-center gap-2">✓ Theatre, Drama &amp; Fine Arts</li>
              <li className="flex items-center gap-2">✓ Basketball &amp; Athletics Academies</li>
              <li className="flex items-center gap-2">✓ Chess Club &amp; Logical Games</li>
              <li className="flex items-center gap-2">✓ School Band &amp; Music Choir</li>
            </ul>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-cream-line shadow-card">
              <Image
                src="/images/transform-1.jpg"
                alt="Music studio room"
                fill
                className="object-cover"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
