"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, ArrowRight, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  desc: string;
  img?: string;
  category: string;
  date: string;
}

interface NewsSwipeCarouselProps {
  items: NewsItem[];
  onItemClick: (item: NewsItem) => void;
}

export default function NewsSwipeCarousel({ items, onItemClick }: NewsSwipeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items.length;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const cardWidth = clientWidth * 0.82 + 16; // approximate card width + gap
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(0, index), count - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    const cardWidth = clientWidth * 0.82 + 16;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + count) % count;
    scrollToIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % count;
    scrollToIndex(nextIdx);
  };

  return (
    <div className="relative w-full select-none py-2">
      {/* Swipeable Scroll Container with Snap */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1 px-4 -mx-4 scroll-smooth"
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="w-[84vw] max-w-[320px] shrink-0 snap-center bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card flex flex-col transition-all duration-300"
          >
            {/* Card Image Header */}
            <div
              onClick={() => onItemClick(item)}
              className="relative h-56 w-full overflow-hidden bg-slate-50 border-b border-cream-line p-2 cursor-pointer flex items-center justify-center group/img"
            >
              <div className="relative w-full h-full border-x-2 border-gold/40 rounded-xl overflow-hidden bg-white shadow-xs flex items-center justify-center p-1.5">
                <Image
                  src={item.img || "/images/news/news_music_talent.jpg"}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 85vw, 320px"
                />
              </div>
              <span className="absolute top-3 left-3 bg-navy text-white text-[10px] px-2.5 py-1 uppercase font-bold font-sans rounded-full shadow-xs">
                {item.category}
              </span>
              <span className="absolute bottom-3 right-3 bg-navy/85 hover:bg-gold text-white hover:text-navy text-[10px] font-bold font-sans uppercase px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-md transition-all">
                <ZoomIn className="w-3 h-3 text-gold" /> Tap to Zoom
              </span>
            </div>

            {/* Card Content Body */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-3">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-ink-muted flex items-center gap-1.5 font-semibold font-mono">
                  <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <h3
                  onClick={() => onItemClick(item)}
                  className="font-serif font-bold text-navy text-base line-clamp-2 hover:text-gold transition-colors leading-snug cursor-pointer"
                >
                  {item.title}
                </h3>
                <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => onItemClick(item)}
                className="text-gold-dark hover:text-gold font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1 mt-1 text-left cursor-pointer"
              >
                Read Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Swipe Controls & Pagination Dots */}
      <div className="flex items-center justify-between mt-3 px-2">
        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-full bg-white border border-cream-line shadow-sm hover:border-gold hover:text-gold flex items-center justify-center text-navy transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Previous News"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dot Indicators */}
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-7 bg-gold"
                  : "w-2 bg-navy/20 hover:bg-navy/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-full bg-white border border-cream-line shadow-sm hover:border-gold hover:text-gold flex items-center justify-center text-navy transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Next News"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
