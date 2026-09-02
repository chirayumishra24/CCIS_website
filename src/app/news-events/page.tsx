"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Calendar, FileText, Download, Tag, Search, ArrowRight, X, ExternalLink } from "lucide-react";

interface NewsOrNotice {
  id: string;
  title: string;
  date: string;
  category: string;
  img?: string;
  desc: string;
  featured?: boolean;
  type: "news" | "notice";
  attachmentUrl?: string | null;
  attachmentType?: string | null;
}

export default function NewsEvents() {
  const [activeTab, setActiveTab] = useState<"news" | "notice">("news");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<NewsOrNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<NewsOrNotice | null>(null);

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
    const q = searchQuery.toLowerCase();
    const searchMatch =
      q === "" ||
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    return typeMatch && catMatch && searchMatch;
  });

  const categories = [
    "All",
    ...Array.from(new Set(items.filter((item) => item.type === activeTab).map((item) => item.category))),
  ];

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ━━━ Banner ━━━ */}
      <section className="relative min-h-[56vh] sm:min-h-[62vh] md:min-h-[70vh] lg:min-h-[76vh] bg-navy overflow-hidden flex items-center pt-8 pb-16 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src="/generated/Chemistry-lab.png"
            alt="CCIS Campus Events"
            fill
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy/60 to-navy-dark/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-black/20 z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 w-full text-center flex flex-col items-center gap-4 text-white">
          <span className="inline-block px-3.5 py-1.5 bg-gold/95 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full font-extrabold shadow-glow-gold w-fit">
            Media, Press &amp; Circulars
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold leading-[1.1] tracking-tight max-w-3xl">
            News &amp; Official Notices
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-sans max-w-2xl">
            Stay informed with the latest campus achievements, academic milestones, CBSE circulars, and event datesheets.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent z-20" />
      </section>

      {/* ━━━ Tabs & Filter Controls ━━━ */}
      <section className="py-8 bg-cream/10 border-b border-cream-line sticky top-[68px] sm:top-[72px] z-30 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Main Switcher */}
          <div className="flex bg-cream p-1 rounded-xl border border-cream-line w-full md:w-auto shadow-inner">
            <button
              onClick={() => {
                setActiveTab("news");
                setSelectedCategory("All");
              }}
              className={`px-6 py-2.5 text-center font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "news" ? "bg-navy text-white shadow-card" : "text-navy-light hover:text-navy"
              }`}
            >
              School News &amp; Events
            </button>
            <button
              onClick={() => {
                setActiveTab("notice");
                setSelectedCategory("All");
              }}
              className={`px-6 py-2.5 text-center font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
                activeTab === "notice" ? "bg-navy text-white shadow-card" : "text-navy-light hover:text-navy"
              }`}
            >
              Official Circulars &amp; Notices
            </button>
          </div>

          {/* Search input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab === "news" ? "news & events" : "notices & datesheets"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-white"
            />
          </div>
        </div>

        {/* Category Pills */}
        {!loading && categories.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-2 justify-center md:justify-start mt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider border transition-all ${
                  selectedCategory === cat
                    ? "bg-gold text-white border-gold shadow-sm"
                    : "bg-white text-navy/70 border-cream-line hover:border-gold hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ━━━ Grid Content ━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col gap-4 p-4 border border-cream-line rounded-2xl">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-cream/10 border border-cream-line rounded-2xl max-w-xl mx-auto">
              <p className="font-serif font-bold text-navy text-lg mb-1">No announcements found</p>
              <p className="text-xs text-ink-muted leading-relaxed">
                Please check back later or try clearing your search keyword.
              </p>
            </div>
          ) : activeTab === "news" ? (
            /* School News Grid */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <AnimatedSection
                  key={item.id}
                  animation="scale-in"
                  className="bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    <div className="relative h-52 w-full overflow-hidden bg-cream/20">
                      <img
                        src={
                          item.img ||
                          "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
                        }
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-navy/90 text-white text-[10px] px-2.5 py-1 uppercase font-bold font-mono rounded-full border border-gold/30">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col gap-3">
                      <span className="text-xs text-ink-muted flex items-center gap-1.5 font-semibold font-mono">
                        <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <h3 className="font-serif font-bold text-navy text-lg leading-snug line-clamp-2 group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="text-xs font-bold text-navy hover:text-gold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            /* Notice Board / Circulars List */
            <div className="flex flex-col gap-4 max-w-4xl mx-auto">
              {filteredItems.map((notice) => (
                <AnimatedSection
                  key={notice.id}
                  animation="fade-in"
                  className="bg-white border border-cream-line hover:border-gold p-6 rounded-2xl shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0 border border-red-100">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-gold-dark uppercase tracking-wider">
                          {notice.category}
                        </span>
                        <span className="text-[10px] font-mono text-ink-muted">
                          &bull; {new Date(notice.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-navy text-base mt-1 leading-snug">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-ink-muted leading-relaxed mt-1 line-clamp-2">
                        {notice.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                    {notice.attachmentUrl ? (
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => handleDownload(notice.attachmentUrl!)}
                        className="rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" /> Download PDF
                      </Button>
                    ) : (
                      <button
                        onClick={() => setActiveModalItem(notice)}
                        className="px-4 py-2 bg-cream text-navy rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-gold hover:text-navy transition-colors"
                      >
                        View Notice
                      </button>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ━━━ Detail Read Modal ━━━ */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-cream-line rounded-2xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-cream-line">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-gold-dark uppercase tracking-wider">
                  {activeModalItem.category} &bull; {activeModalItem.type.toUpperCase()}
                </span>
                <h3 className="font-serif font-bold text-navy text-xl sm:text-2xl mt-1">
                  {activeModalItem.title}
                </h3>
                <span className="text-xs text-ink-muted font-mono mt-1">
                  Published: {new Date(activeModalItem.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-ink-muted hover:text-navy p-1 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeModalItem.img && (
              <div className="relative h-64 w-full rounded-xl overflow-hidden bg-cream/20">
                <img
                  src={activeModalItem.img}
                  alt={activeModalItem.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="text-sm text-ink leading-relaxed whitespace-pre-line">
              {activeModalItem.desc}
            </div>

            {activeModalItem.attachmentUrl && (
              <div className="pt-4 border-t border-cream-line flex justify-end">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => handleDownload(activeModalItem.attachmentUrl!)}
                  className="rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Official Document
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
