"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
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
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-5 bg-navy-dark/85 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#172853] hover:bg-gray-100 rounded-full transition-all cursor-pointer z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          <AdmissionEnquiryForm isModal onSuccess={onClose} />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
