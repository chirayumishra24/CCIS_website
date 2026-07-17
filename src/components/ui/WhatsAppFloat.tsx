"use client";
import React from "react";
import { MessageSquare } from "lucide-react";

export default function WhatsAppFloat() {
  const whatsappUrl = "https://wa.me/919660551977?text=Hello%20CCIS,%20I%20would%20like%20to%20enquire%20about%20admissions.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center p-3 bg-[#25D366] hover:bg-[#20BA56] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 animate-float"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 fill-current" />
    </a>
  );
}
