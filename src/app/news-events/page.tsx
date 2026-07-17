"use client";
import React, { useState, useEffect } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Calendar, FileText, Download, Tag } from "lucide-react";

export default function NewsEvents() {
  const [activeTab, setActiveTab] = useState<"news" | "notice">("news");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data && data.news) {
          setItems(data.news);
        }
      } catch (err) {
        console.error("Failed to load news page:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const filteredItems = items.filter((item) => {
    const typeMatch = item.type === activeTab;
    const catMatch = selectedCategory === "All" || item.category === selectedCategory;
    return typeMatch && catMatch;
  });

  const categories = ["All", ...Array.from(new Set(items.filter(item => item.type === activeTab).map(item => item.category)))];

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/images/hero1.webp')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            Media &amp; Announcements
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            News &amp; Notices
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Stay updated with the latest happenings, academic achievements, and circulars from CCIS.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-10 bg-cream/10 border-b border-cream-line">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex bg-cream p-1 rounded border border-cream-line w-full max-w-sm shadow-inner">
            <button
              onClick={() => { setActiveTab("news"); setSelectedCategory("All"); }}
              className={`flex-1 py-2 text-center font-sans font-bold text-xs uppercase tracking-wider rounded transition-all ${activeTab === "news" ? "bg-navy text-white shadow-card" : "text-navy-light hover:text-navy"}`}
            >
              School News &amp; Events
            </button>
            <button
              onClick={() => { setActiveTab("notice"); setSelectedCategory("All"); }}
              className={`flex-1 py-2 text-center font-sans font-bold text-xs uppercase tracking-wider rounded transition-all ${activeTab === "notice" ? "bg-navy text-white shadow-card" : "text-navy-light hover:text-navy"}`}
            >
              Official Notice Board
            </button>
          </div>

          {/* Category Filter Pills */}
          {!loading && categories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-sans font-semibold text-xs uppercase tracking-wider border transition-all ${selectedCategory === cat ? "bg-gold text-white border-gold shadow-card" : "bg-white text-navy border-cream-line hover:border-gold hover:text-gold"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grid Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col gap-4 p-4 border border-cream-line rounded-lg">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-cream/10 border border-cream-line rounded-lg max-w-xl mx-auto">
              <p className="font-serif font-bold text-navy text-lg mb-2">No updates found</p>
              <p className="text-sm text-ink-muted leading-relaxed">Please check back later or modify your search filter.</p>
            </div>
          ) : activeTab === "news" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <AnimatedSection
                  key={item.id}
                  animation="scale-in"
                  className="bg-cream/5 border border-cream-line rounded-lg overflow-hidden shadow-card hover:shadow-card-hover flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="relative h-48 w-full">
                      <img
                        src={item.img || 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?auto=format&fit=crop&q=80&w=800'}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                      <span className="absolute top-4 left-4 bg-navy text-white text-[10px] px-2 py-1 uppercase font-bold font-mono rounded border border-gold/30">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col gap-3">
                      <span className="text-xs text-ink-muted flex items-center gap-1.5 font-semibold font-mono">
                        <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <h3 className="font-serif font-bold text-navy text-lg leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-ink-muted leading-relaxed line-clamp-4">{item.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            /* Notices Layout */
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
              {filteredItems.map((item) => (
                <AnimatedSection
                  key={item.id}
                  animation="fade-in"
                  className="bg-cream/15 border border-cream-line p-6 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-navy/5 text-navy rounded-lg w-fit shrink-0">
                      <FileText className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-ink-muted font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gold-dark" />
                        Posted: {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <span className="text-cream-line">•</span>
                        <Tag className="w-3 h-3 text-gold-dark" />
                        {item.category}
                      </span>
                      <h4 className="font-serif font-bold text-navy text-base leading-snug">{item.title}</h4>
                      <p className="text-xs text-ink-muted leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>

                  {item.attachmentUrl && (
                    <Button
                      onClick={() => handleDownload(item.attachmentUrl)}
                      variant="secondary"
                      size="sm"
                      className="w-full sm:w-auto shrink-0 rounded-sm font-semibold uppercase tracking-wider"
                    >
                      View Circular <Download className="w-3.5 h-3.5 ml-2" />
                    </Button>
                  )}
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
