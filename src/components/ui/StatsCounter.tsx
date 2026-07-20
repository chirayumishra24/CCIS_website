"use client";
import React, { useEffect, useRef, useState } from "react";

interface StatsCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  variant?: "card" | "inline";
}

export default function StatsCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  label,
  variant = "inline",
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic for natural feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  if (variant === "card") {
    return (
      <div ref={elementRef} className="flex flex-col items-center justify-center p-6 text-center bg-cream/30 border border-cream-line rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
        <div className="text-4xl md:text-5xl font-serif font-bold text-navy mb-2">
          {prefix}
          {count.toLocaleString()}
          {suffix}
        </div>
        <p className="text-sm md:text-base font-sans font-semibold text-ink-muted uppercase tracking-wider">
          {label}
        </p>
      </div>
    );
  }

  // Inline variant — no card, works on dark backgrounds
  return (
    <div ref={elementRef} className="flex flex-col items-center text-center">
      <div className="text-3xl md:text-4xl font-serif font-bold text-white mb-1">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="text-[11px] font-sans font-semibold text-white/50 uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}
