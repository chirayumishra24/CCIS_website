"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Eye, Info, Sparkles, MapPin, Layers, Maximize2, Shield, Compass } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface CampusFacility {
  id: string;
  name: string;
  category: "Tech & STEM" | "Academics" | "Sports" | "Early Years";
  image: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  hotspots: { x: number; y: number; title: string; desc: string }[];
}

const facilities: CampusFacility[] = [
  {
    id: "robotics",
    name: "AI, Drone & Robotics Studio",
    category: "Tech & STEM",
    image: "/generated/wide_club_activities.jpg",
    tagline: "Where Young Minds Engineer Autonomous Tech",
    description:
      "Equipped with programmable microcontrollers, 3D printers, laser cutters, modular drone assembly kits, and AI vision sensors for hands-on student experimentation.",
    specs: [
      { label: "Lab Capacity", value: "45 Student Workstations" },
      { label: "Hardware Stack", value: "Arduino, Raspberry Pi 5, ESP32" },
      { label: "Rapid Prototyping", value: "Dual Creality 3D Print Farm" },
      { label: "Competitions", value: "WRO, FIRST LEGO League, IRIS" },
    ],
    hotspots: [
      { x: 30, y: 40, title: "3D Rapid Prototyping Farm", desc: "Dual extrusion printers producing functional mechanical components designed by students." },
      { x: 65, y: 55, title: "Robotics Arena & Testing Turf", desc: "Obstacle course for testing line-following, LiDAR mapping, and autonomous rovers." },
      { x: 80, y: 35, title: "Component Inventory Wall", desc: "Over 200+ sensor types, servo motors, relays, and optical vision modules." },
    ],
  },
  {
    id: "science",
    name: "Advanced Chemistry & Physics Labs",
    category: "Tech & STEM",
    image: "/generated/Chemistry-lab.png",
    tagline: "Precision Instruments for Experimental Rigor",
    description:
      "Modern chemical safety fume hoods, optical spectrometer benches, digital Vernier sensors, and atomic models built to CBSE Class XII and IB DP criteria.",
    specs: [
      { label: "Safety Standard", value: "NFPA Certified Fume Hoods" },
      { label: "Measurement", value: "Digital Vernier Caliper & pH Terminals" },
      { label: "Capacity", value: "60 Workstations with Gas Outlets" },
      { label: "Disaster Safety", value: "Automated Emergency Eye Wash" },
    ],
    hotspots: [
      { x: 45, y: 50, title: "Precision Reagents Bench", desc: "Individual gas, water, and vacuum connections with safety shields." },
      { x: 75, y: 45, title: "Spectrophotometer Terminal", desc: "Digital light absorption analyzer for advanced chemical kinetics experiments." },
    ],
  },
  {
    id: "library",
    name: "Central Research & Digital Library",
    category: "Academics",
    image: "/generated/library.png",
    tagline: "Over 15,000 Prints & Global Scientific Archives",
    description:
      "A quiet sanctuary for intellectual inquiry featuring individual study carrels, Kindle e-readers, JSTOR terminals, and international literature archives.",
    specs: [
      { label: "Print Holdings", value: "15,000+ Verified Volumes" },
      { label: "Digital Access", value: "JSTOR, EBSCO, National Digital Library" },
      { label: "Seating", value: "120 Individual & Collaborative Pods" },
      { label: "Audio-Visual", value: "Acoustic Quiet Reading Benches" },
    ],
    hotspots: [
      { x: 25, y: 60, title: "Individual Research Carrels", desc: "Ergonomic study cubicles equipped with USB power and ambient warm LED task lighting." },
      { x: 70, y: 40, title: "International Literature Section", desc: "Curated collection spanning world history, philosophy, Nobel laureate fiction, and encyclopedias." },
    ],
  },
  {
    id: "sports",
    name: "Synthetic Athletics & Sports Arena",
    category: "Sports",
    image: "/images/students/student-club-orange.jpg",
    tagline: "Olympic Standard Synthetic Turfs & Courts",
    description:
      "Multi-discipline arena featuring FIBA-certified synthetic basketball arenas, floodlit football turfs, cricket training nets, and martial arts dojos.",
    specs: [
      { label: "Turf Surface", value: "All-Weather Synthetic Polymer" },
      { label: "Lighting", value: "Philips Arena Floodlights" },
      { label: "Coaching", value: "NIS Certified National Coaches" },
      { label: "Disciplines", value: "Football, Cricket, Basketball, Skating, Karate" },
    ],
    hotspots: [
      { x: 35, y: 50, title: "Athletics & Synthetic Track", desc: "Shock-absorbing all-weather synthetic track designed to prevent strain and maximize performance." },
      { x: 75, y: 60, title: "Outdoor Sports Arena", desc: "Multi-purpose floodlit sports arena for inter-school tournaments, basketball, and cricket practice." },
    ],
  },
];

export default function VirtualCampusTour() {
  const [activeTab, setActiveTab] = useState<string>("robotics");
  const [activeHotspot, setActiveHotspot] = useState<{ title: string; desc: string } | null>(null);

  const currentFacility = facilities.find((f) => f.id === activeTab) || facilities[0];

  return (
    <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-navy text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-widest font-bold">
            <Eye className="w-4 h-4" /> Interactive Facility Walkthrough
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 text-white">
            Virtual Campus &amp; Laboratory Explorer
          </h3>
          <p className="text-white/60 text-xs md:text-sm mt-1 max-w-xl">
            Explore high-resolution interactive facility showcases with clickable hotspots, equipment specifications, and safety benchmarks.
          </p>
        </div>

        {/* Facility selector tabs */}
        <div className="flex flex-wrap gap-2">
          {facilities.map((fac) => (
            <button
              key={fac.id}
              type="button"
              onClick={() => {
                setActiveTab(fac.id);
                setActiveHotspot(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition-all ${
                activeTab === fac.id
                  ? "bg-gold text-navy shadow-md font-extrabold"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {fac.name.split("&")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tour Showcase */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Image with Hotspots (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-cream-line shadow-card group">
            <Image
              src={currentFacility.image}
              alt={currentFacility.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-black/30 pointer-events-none" />

            {/* Hotspot Markers */}
            {currentFacility.hotspots.map((hs, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveHotspot(hs)}
                style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/btn focus:outline-none"
                aria-label={hs.title}
              >
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-7 w-7 bg-navy border-2 border-gold text-gold font-bold text-xs items-center justify-center shadow-lg hover:scale-125 transition-transform">
                    {idx + 1}
                  </span>
                </span>
              </button>
            ))}

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
              <div>
                <span className="text-[11px] font-mono text-gold-light bg-navy/80 backdrop-blur-sm px-2.5 py-1 rounded-md uppercase font-bold">
                  {currentFacility.category}
                </span>
                <h4 className="font-serif font-bold text-white text-xl md:text-2xl mt-1.5 drop-shadow-md">
                  {currentFacility.name}
                </h4>
              </div>
              <span className="text-[10px] text-white/80 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                Click numbered hotspots
              </span>
            </div>
          </div>

          {/* Active Hotspot Callout Box */}
          {activeHotspot ? (
            <div className="p-4 bg-gold/10 border border-gold/40 rounded-xl animate-fadeIn flex items-start justify-between gap-3">
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-lg bg-gold text-navy flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-serif font-bold text-navy text-sm">{activeHotspot.title}</h5>
                  <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{activeHotspot.desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveHotspot(null)}
                className="text-xs text-ink-muted hover:text-navy font-bold shrink-0 p-1"
              >
                &times; Close
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-cream/15 border border-cream-line rounded-xl text-xs text-ink-muted flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-dark shrink-0" />
              <span>Tap any glowing circle marker on the photo above to inspect laboratory apparatus and feature specs.</span>
            </div>
          )}
        </div>

        {/* Right: Technical Specs & Curriculum Integration (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6 bg-cream/15 border border-cream-line rounded-2xl p-6">
          <div>
            <div className="pb-3 border-b border-cream-line">
              <span className="text-xs font-mono font-bold text-gold-dark uppercase tracking-wider block">
                Facility Overview
              </span>
              <h4 className="text-xl font-serif font-bold text-navy mt-0.5">
                {currentFacility.tagline}
              </h4>
            </div>

            <p className="text-xs text-ink-muted leading-relaxed mt-4">
              {currentFacility.description}
            </p>

            {/* Specs Grid */}
            <div className="mt-5">
              <span className="text-[11px] font-bold text-navy uppercase tracking-wider block mb-3">
                Laboratory Specifications &amp; Standards
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentFacility.specs.map((spec, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-cream-line shadow-sm flex flex-col">
                    <span className="text-[10px] text-ink-muted uppercase font-semibold">{spec.label}</span>
                    <span className="text-xs font-bold text-navy font-serif mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Safety & Compliance Badge */}
          <div className="p-4 bg-white rounded-xl border border-cream-line flex items-center gap-3 shadow-sm">
            <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <strong className="text-navy block">Certified Safety Protocols</strong>
              <span className="text-ink-muted text-[11px]">Strict supervisor presence, periodic fire audits &amp; first aid ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
