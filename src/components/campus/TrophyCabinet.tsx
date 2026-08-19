"use client";
import React, { useState } from "react";
import { Trophy, Award, Medal, Star, Sparkles, Filter } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface AwardItem {
  id: string;
  title: string;
  category: "Academics" | "STEM & Robotics" | "Athletics" | "National Honors";
  year: string;
  conferredBy: string;
  description: string;
  level: "International" | "National" | "State";
  badgeColor: string;
}

const awardsData: AwardItem[] = [
  {
    id: "a1",
    title: "National Science Exposition Gold Medal",
    category: "STEM & Robotics",
    year: "2025",
    conferredBy: "National Science Centre, Govt of India",
    description: "Awarded 1st place in India for autonomous IoT-based agricultural soil quality analyzer engineered by Grade XI students.",
    level: "National",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    id: "a2",
    title: "Rajiv Gandhi Education Excellence Trophy",
    category: "National Honors",
    year: "2024",
    conferredBy: "All India Education Forum",
    description: "Conferred to CCIS Leadership for exemplary integration of dual-curriculum international frameworks with national board outcomes.",
    level: "National",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
  },
  {
    id: "a3",
    title: "CBSE Inter-School Athletics Championship",
    category: "Athletics",
    year: "2025",
    conferredBy: "CBSE Regional Sports Board",
    description: "Overall Champions Trophy in track and field with 12 gold medals across 100m sprint, high jump, and relay events.",
    level: "State",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  {
    id: "a4",
    title: "International Math Olympiad (IMO) Gold Laureates",
    category: "Academics",
    year: "2025",
    conferredBy: "Global Mathematics Council, Singapore",
    description: "Three CCIS primary and middle school scholars attained global 99.8th percentile ranks in mathematical problem-solving.",
    level: "International",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
  },
  {
    id: "a5",
    title: "Economic Times Business Leader of Rajasthan",
    category: "National Honors",
    year: "2023",
    conferredBy: "The Economic Times & State Leadership",
    description: "Honored for pioneering benchmark institutional infrastructure and world-class educational opportunities in Rajasthan.",
    level: "State",
    badgeColor: "bg-rose-100 text-rose-900 border-rose-300",
  },
  {
    id: "a6",
    title: "FIRST LEGO League Robotics State Champions",
    category: "STEM & Robotics",
    year: "2025",
    conferredBy: "FIRST & LEGO Education",
    description: "1st prize in Autonomous Robot Game & Innovation Project for custom renewable energy smart microgrid simulation.",
    level: "State",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
  },
];

const categories = ["All", "STEM & Robotics", "Academics", "Athletics", "National Honors"];

export default function TrophyCabinet() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredAwards = awardsData.filter(
    (a) => selectedCategory === "All" || a.category === selectedCategory
  );

  return (
    <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-navy text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-widest font-bold">
            <Trophy className="w-4 h-4" /> Hall of Accolades
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 text-white">
            Virtual Trophy Cabinet &amp; Honors
          </h3>
          <p className="text-white/60 text-xs md:text-sm mt-1 max-w-xl">
            Celebrating decades of national laurels, olympiad medals, and institutional recognitions achieved by our scholars and leadership.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-gold text-navy shadow-md font-extrabold"
                  : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-cream/10">
        {filteredAwards.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-cream-line rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.level} • {item.year}
                </span>
                <span className="text-xs font-mono font-bold text-ink-muted">
                  {item.category}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold-dark flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-navy text-base leading-snug">
                  {item.title}
                </h4>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed mt-3">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-cream-line/50 text-[11px] text-ink-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span>Conferred by: <strong className="text-navy font-semibold">{item.conferredBy}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
