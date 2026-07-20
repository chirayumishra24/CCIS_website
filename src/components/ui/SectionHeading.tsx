import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={`flex flex-col mb-10 ${alignmentClasses[align]} ${className}`}>
      {subtitle && (
        <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs mb-2 block">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-4 relative z-10">
        {title}
      </h2>
      <div className="gold-rule" />
    </div>
  );
}
