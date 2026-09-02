"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialItem {
  img: string;
  videoId: string;
}

interface TestimonialsCarouselProps {
  items: TestimonialItem[];
  category: "parent" | "student";
}

export default function TestimonialsCarousel({ items, category }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const [itemsPerView, setItemsPerView] = useState(1);
  const total = items.length;

  // Track responsive screen width for items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 640) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, total - itemsPerView);

  // Reset index when category or layout changes
  useEffect(() => {
    setCurrentIndex(0);
    setPlayingVideoId(null);
  }, [category, itemsPerView]);

  // Next and Previous navigation
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play timer (slides automatically every 3.5 seconds)
  useEffect(() => {
    if (isPaused || playingVideoId !== null || maxIndex <= 0) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 3500);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, playingVideoId, maxIndex, handleNext]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-gold text-navy hover:text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 border border-cream-line shadow-lg active:scale-90"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white hover:bg-gold text-navy hover:text-white rounded-full flex items-center justify-center transition-all duration-300 z-20 border border-cream-line shadow-lg active:scale-90"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Carousel Track Container */}
      <div className="overflow-hidden px-4 sm:px-12">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {items.map((item, idx) => {
            const isPlaying = playingVideoId === item.videoId;

            return (
              <div
                key={`${category}-${idx}-${item.videoId}`}
                className="w-full sm:w-1/2 lg:w-1/3 shrink-0 flex justify-center px-2 sm:px-3"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-cream-line p-2 sm:p-2.5 flex items-center justify-center hover:border-gold hover:shadow-card-hover transition-all duration-300 w-full max-w-[300px] h-[380px] sm:h-[440px] md:h-[480px]">
                  {isPlaying ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                      <iframe
                        src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`}
                        title={`CCIS Testimonial ${idx + 1}`}
                        className="w-full h-full rounded-xl border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        onClick={() => setPlayingVideoId(null)}
                        className="absolute top-2 right-2 p-1.5 bg-navy/80 hover:bg-navy text-white text-xs rounded-full border border-white/20 z-10 transition-colors"
                        title="Close video"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setPlayingVideoId(item.videoId)}
                      className="relative w-full h-full rounded-xl overflow-hidden group/item cursor-pointer bg-navy-dark"
                    >
                      <Image
                        src={`/images/${item.img || "parent1.png"}`}
                        alt={`CCIS Community Voice ${idx + 1}`}
                        fill
                        className="object-contain rounded-xl group-hover/item:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/15 group-hover/item:bg-black/30 flex items-center justify-center transition-colors duration-300 rounded-xl">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gold text-navy flex items-center justify-center shadow-glow-gold group-hover/item:scale-110 transition-all duration-300">
                          <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-0.5 text-navy" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => {
              setCurrentIndex(dotIdx);
              setPlayingVideoId(null);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              dotIdx === currentIndex
                ? "w-8 bg-gold"
                : "w-2 bg-navy/20 hover:bg-navy/40"
            }`}
            aria-label={`Go to slide ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
