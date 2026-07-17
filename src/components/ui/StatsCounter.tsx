"use client";
import React, { useEffect, useRef, useState } from "react";

interface StatsCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
}

export default function StatsCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  label,
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
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

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
