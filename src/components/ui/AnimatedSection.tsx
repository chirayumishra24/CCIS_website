"use client";
import React, { useEffect, useRef, useState } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "fade-in-left" | "fade-in-right" | "scale-in";
  delayClass?: string;
}

export default function AnimatedSection({
  children,
  className = "",
  animation = "fade-in",
  delayClass = "",
}: AnimatedSectionProps) {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const animationClasses = {
    "fade-in": "animate-in",
    "fade-in-left": "animate-in-left",
    "fade-in-right": "animate-in-right",
    "scale-in": "animate-in-scale",
  };

  return (
    <div
      ref={sectionRef}
      className={`${animationClasses[animation]} ${isInView ? "in-view" : ""} ${delayClass} ${className}`}
    >
      {children}
    </div>
  );
}
