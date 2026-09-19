import React, { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const StudentPortal = dynamic(() => import("@/components/student/StudentPortal"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-navy mb-4" />
      <h2 className="text-xl font-bold text-navy font-serif">
        Loading Academic Dashboard...
      </h2>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Class IX Student Performance & Target Tracker | CCIS",
  description:
    "Official academic performance and target tracking dashboard for Class IX students at Cambridge Court International School.",
  keywords: ["CCIS Student Tracker", "Class IX Performance", "Cambridge Court International School", "Target Tracker"],
};

export default function StudentPage() {
  return <StudentPortal />;
}
