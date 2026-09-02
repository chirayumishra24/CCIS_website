"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WhyChooseItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  img: string;
  badge: string;
}

interface WhyChoose3DCarouselProps {
  items: WhyChooseItem[];
}

export default function WhyChoose3DCarousel({ items }: WhyChoose3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const count = items.length;

  const minSwipeDistance = 45;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % count);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsPaused(false);
      return;
    }
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setIsPaused(false);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  return (
    <div
      className="relative w-full max-w-sm mx-auto my-6 px-2 py-4 select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Stage Container */}
      <div className="relative h-[430px] w-full flex items-center justify-center [perspective:1000px] overflow-hidden">
        {items.map((item, idx) => {
          let position = idx - activeIndex;
          if (position < -1) position += count;
          if (position > 1) position -= count;

          let transformClass = "scale-75 opacity-0 pointer-events-none z-0";
          if (position === 0) {
            transformClass =
              "scale-100 opacity-100 z-30 translate-x-0 translate-z-0 rotate-y-0 shadow-2xl pointer-events-auto border-gold/40";
          } else if (position === -1 || (idx === count - 1 && activeIndex === 0)) {
            transformClass =
              "scale-[0.84] opacity-40 z-10 -translate-x-[42%] -rotate-y-[22deg] shadow-md pointer-events-none";
          } else if (position === 1 || (idx === 0 && activeIndex === count - 1)) {
            transformClass =
              "scale-[0.84] opacity-40 z-10 translate-x-[42%] rotate-y-[22deg] shadow-md pointer-events-none";
          }

          return (
            <div
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`absolute top-0 w-[84%] bg-white border border-cream-line rounded-2xl overflow-hidden flex flex-col transition-all duration-500 ease-out cursor-pointer ${transformClass}`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Card Image */}
              <div className="relative h-52 w-full overflow-hidden bg-navy-dark">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 320px"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/85 via-navy/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-navy/95 text-gold text-[10px] font-bold font-sans uppercase tracking-wider px-2.5 py-1 rounded-full border border-gold/30 shadow-sm backdrop-blur-sm">
                  {item.badge}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white font-mono text-[10px] px-2 py-0.5 rounded-md font-bold">
                  {idx + 1} / {count}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-3 bg-white">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-navy/5 text-navy shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="font-serif font-bold text-navy text-base leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls: Navigation Buttons & Pagination Dots */}
      <div className="flex items-center justify-between mt-2 px-6">
        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-full bg-white border border-cream-line shadow-sm hover:border-gold hover:text-gold flex items-center justify-center text-navy transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-7 bg-gold"
                  : "w-2 bg-navy/20 hover:bg-navy/40"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-full bg-white border border-cream-line shadow-sm hover:border-gold hover:text-gold flex items-center justify-center text-navy transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
