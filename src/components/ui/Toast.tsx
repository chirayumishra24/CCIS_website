"use client";
import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    info: <AlertCircle className="w-5 h-5 text-amber-500" />,
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-100",
    error: "bg-rose-50 border-rose-100",
    info: "bg-amber-50 border-amber-100",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 border rounded-lg shadow-lg max-w-sm animate-scaleIn ${bgColors[type]}`}>
      {icons[type]}
      <p className="text-sm font-sans font-medium text-ink flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-ink-muted hover:text-ink transition-colors p-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
