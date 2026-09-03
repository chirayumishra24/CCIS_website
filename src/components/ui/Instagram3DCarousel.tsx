"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";

interface InstagramPost {
  url: string;
  id: string;
  title: string;
  tag: string;
}

interface Instagram3DCarouselProps {
  posts: InstagramPost[];
}

export default function Instagram3DCarousel({ posts }: Instagram3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const count = posts.length;
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

  // Re-process Instagram embeds when active slide changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [activeIndex]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  return (
    <div
      className="relative w-full max-w-sm mx-auto my-4 px-2 select-none overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Stage Container */}
      <div className="relative h-[560px] w-full flex items-center justify-center [perspective:1000px] overflow-hidden">
        {posts.map((post, idx) => {
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
              key={post.id}
              onClick={() => setActiveIndex(idx)}
              className={`absolute top-0 w-[86%] bg-white border border-cream-line rounded-3xl overflow-hidden flex flex-col transition-all duration-500 ease-out cursor-pointer ${transformClass}`}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Card Header Tag */}
              <div className="px-4 py-3 border-b border-cream-line/60 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ee2a7b] animate-pulse" />
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-navy/80">
                    {post.tag}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-ink-muted/80 uppercase">
                  {idx + 1} / {count}
                </span>
              </div>

              {/* Instagram Embed Container */}
              <div className="p-2 flex-1 flex flex-col items-center justify-start bg-white overflow-hidden min-h-[440px]">
                <blockquote
                  className="instagram-media w-full !my-0 !min-w-[200px] !max-w-full !rounded-2xl"
                  data-instgrm-permalink={`${post.url}?utm_source=ig_embed&utm_campaign=loading`}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: "0",
                    borderRadius: "16px",
                    boxShadow: "none",
                    margin: "0",
                    padding: "0",
                    width: "100%",
                  }}
                >
                  <div style={{ padding: "16px" }}>
                    <a
                      href={`${post.url}?utm_source=ig_embed&utm_campaign=loading`}
                      style={{
                        background: "#FFFFFF",
                        lineHeight: 0,
                        padding: "0 0",
                        textAlign: "center",
                        textDecoration: "none",
                        width: "100%",
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <div
                          style={{
                            backgroundColor: "#F4F4F4",
                            borderRadius: "50%",
                            height: "36px",
                            marginRight: "12px",
                            width: "36px",
                          }}
                        />
                        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" }}>
                          <div
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: "4px",
                              height: "12px",
                              marginBottom: "6px",
                              width: "100px",
                            }}
                          />
                          <div
                            style={{
                              backgroundColor: "#F4F4F4",
                              borderRadius: "4px",
                              height: "12px",
                              width: "60px",
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ padding: "19% 0" }} />
                      <div style={{ display: "block", height: "40px", margin: "0 auto 10px", width: "40px" }}>
                        <svg width="40px" height="40px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg">
                          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                              <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886" />
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div style={{ paddingTop: "6px" }}>
                        <div
                          style={{
                            color: "#3897f0",
                            fontFamily: "Arial,sans-serif",
                            fontSize: "13px",
                            fontWeight: 550,
                            lineHeight: "16px",
                          }}
                        >
                          View on Instagram
                        </div>
                      </div>
                    </a>
                  </div>
                </blockquote>
              </div>

              {/* Card Footer */}
              <div className="p-3.5 bg-slate-50/70 border-t border-cream-line/60 flex items-center justify-between text-xs text-navy/80">
                <span className="font-medium truncate max-w-[170px]">{post.title}</span>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-bold flex items-center gap-1 hover:underline shrink-0"
                >
                  Watch <ArrowUpRight className="w-3 h-3" />
                </a>
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
          aria-label="Previous Post"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {posts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-7 bg-gold"
                  : "w-2 bg-navy/20 hover:bg-navy/40"
              }`}
              aria-label={`Post ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-full bg-white border border-cream-line shadow-sm hover:border-gold hover:text-gold flex items-center justify-center text-navy transition-all duration-300 active:scale-90 cursor-pointer"
          aria-label="Next Post"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
