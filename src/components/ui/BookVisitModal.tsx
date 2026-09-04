"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";
import AdmissionEnquiryForm from "@/components/admissions/AdmissionEnquiryForm";

interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookVisitModal({ isOpen, onClose }: BookVisitModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-navy-dark/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-gold/30 overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header Banner */}
        <div className="bg-gradient-to-r from-navy-dark via-navy to-navy-dark px-5 py-4 sm:px-8 sm:py-5 text-white relative shrink-0 border-b border-gold/20 pr-14">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-white bg-white/20 hover:bg-gold hover:text-navy rounded-full transition-all duration-200 cursor-pointer shadow-lg hover:scale-110 border border-white/20 z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2 text-gold text-[11px] font-mono uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Admissions 2026-27 • CCIS Jaipur
          </div>
          <h3 className="text-lg sm:text-2xl font-serif font-bold text-white mt-0.5">
            Admission Enquiry &amp; Campus Tour
          </h3>
          <p className="text-white/70 text-xs mt-0.5 max-w-md leading-relaxed hidden sm:block">
            Fill out the details below. Our admissions director will get in touch with you within 24 hours.
          </p>
        </div>

        {/* Modal Body with Single Unified Form */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-gradient-to-b from-white to-slate-50/50">
          <AdmissionEnquiryForm isModal onSuccess={onClose} />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
