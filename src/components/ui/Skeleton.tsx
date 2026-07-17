import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
}

export default function Skeleton({ className = "", variant = "rectangular" }: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    rectangular: "h-32 w-full rounded-lg",
    circular: "h-12 w-12 rounded-full",
  };

  return (
    <div
      className={`animate-shimmer-cream bg-cream-dark/50 ${variantClasses[variant]} ${className}`}
    />
  );
}
