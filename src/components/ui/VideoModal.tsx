"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  onClose: () => void;
}

export default function VideoModal({ isOpen, videoUrl, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Convert youtube watch links to embed links if necessary
  let embedUrl = videoUrl;
  if (videoUrl.includes("youtube.com/watch")) {
    const videoId = new URL(videoUrl).searchParams.get("v");
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (videoUrl.includes("youtu.be/")) {
    const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-navy-dark/90 backdrop-blur-sm animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close video player"
      >
        <X className="w-8 h-8" />
      </button>
      <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-cream-line/20 animate-scaleIn">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="CCIS Video Player"
        />
      </div>
    </div>
  );
}
