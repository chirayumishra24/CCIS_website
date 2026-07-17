import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream/10 px-4 text-center">
      <span className="text-gold font-mono font-bold text-6xl md:text-8xl animate-float">404</span>
      <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy mt-6">Page Not Found</h2>
      <div className="gold-rule mt-4 mx-auto" />
      <p className="text-sm text-ink-muted leading-relaxed max-w-sm mt-4">
        The page you are looking for does not exist or has been moved to a new address.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary" className="uppercase font-bold tracking-wider rounded-sm text-xs">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
}
