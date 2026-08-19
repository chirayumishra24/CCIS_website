"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Compass,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Microscope,
  Globe2,
  Cpu,
  Calculator,
  HelpCircle,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface StageDetail {
  id: string;
  stageName: string;
  grades: string;
  ageGroup: string;
  cbseFocus: {
    title: string;
    highlights: string[];
    outcomes: string;
  };
  ibFocus: {
    title: string;
    highlights: string[];
    outcomes: string;
  };
}

const academicStages: StageDetail[] = [
  {
    id: "foundational",
    stageName: "Foundational Early Years",
    grades: "Nursery, LKG & UKG",
    ageGroup: "Ages 3 – 6",
    cbseFocus: {
      title: "Playway & Phonetic Literacy",
      highlights: [
        "Jolly Phonics, vocabulary drills & number sense",
        "Sensory motor development & Montessori activity stations",
        "Introduction to Hindi, English & bilingual rhyme recitations",
      ],
      outcomes: "Builds spontaneous curiosity, foundational reading fluency, and cooperative social behavior.",
    },
    ibFocus: {
      title: "Inquiry-Led Discovery (PYP Early Years)",
      highlights: [
        "Play-based inquiry into self, nature, and community",
        "Child-led wonder walls, open questions & daily reflections",
        "Expressive arts, music rhythms, and fine-motor tactile exploration",
      ],
      outcomes: "Nurtures self-regulation, conceptual questioning, and joyful multilingual expression.",
    },
  },
  {
    id: "primary",
    stageName: "Primary School",
    grades: "Grades I – V",
    ageGroup: "Ages 6 – 11",
    cbseFocus: {
      title: "Core Mathematics, EVS & Language Rigor",
      highlights: [
        "Structured NCERT-aligned mathematics & science experiments",
        "Grammar mastery, cursive penmanship & reading comprehension",
        "Weekly sports coaching, arts atelier & computer literacy",
      ],
      outcomes: "Solid mathematical computation skills and academic discipline for competitive foundations.",
    },
    ibFocus: {
      title: "6 Transdisciplinary Inquiry Units (PYP)",
      highlights: [
        "Units of Inquiry: Sharing the planet, How the world works, Who we are",
        "Student-driven research portfolios & real-world experiments",
        "Collaborative presentations, peer critiques & global context studies",
      ],
      outcomes: "Develops critical reasoning, self-directed research habits, and public presentation confidence.",
    },
  },
  {
    id: "middle",
    stageName: "Middle School",
    grades: "Grades VI – VIII",
    ageGroup: "Ages 11 – 14",
    cbseFocus: {
      title: "Advanced STEM, Languages & Social Sciences",
      highlights: [
        "Specialized Physics, Chemistry, Biology & Advanced Math",
        "Third language options (French / Sanskrit / German)",
        "Olympiad coaching (Science, Math, Cyber) & robotics workshops",
      ],
      outcomes: "Mastery of abstract scientific principles, mathematical problem-solving, and analytical writing.",
    },
    ibFocus: {
      title: "Interdisciplinary Research & Innovation",
      highlights: [
        "Cross-subject design thinking and STEM community service projects",
        "Digital coding, AI ethics, and sensor-based maker prototypes",
        "Model United Nations (MUN) and youth leadership forums",
      ],
      outcomes: "Empowers students to apply scientific theories to solve local and global community challenges.",
    },
  },
  {
    id: "senior",
    stageName: "Secondary & Senior Secondary",
    grades: "Grades IX – XII",
    ageGroup: "Ages 14 – 18",
    cbseFocus: {
      title: "Board Examination & Integrated Competitive Prep",
      highlights: [
        "Specialized streams: Science (PCM/PCB), Commerce, and Humanities",
        "Integrated coaching for JEE (Main/Adv), NEET, CLAT & CUET",
        "Rigorous mock series, previous 10-year question deep dives",
      ],
      outcomes: "Consistent 95%+ board results and direct admissions into top engineering, medical & law colleges.",
    },
    ibFocus: {
      title: "Global Credits & International Portfolios",
      highlights: [
        "Extended capstone essays and international research projects",
        "SAT / AP / IELTS orientation and portfolio curation",
        "Global university counseling for US, UK, Canada & Singapore admissions",
      ],
      outcomes: "Direct admission eligibility into Ivy League, Russell Group, and prestigious world universities.",
    },
  },
];

export default function Curriculum3DViewer() {
  const [activeStageId, setActiveStageId] = useState<string>("primary");
  const [selectedTrack, setSelectedTrack] = useState<"both" | "cbse" | "ib">("both");

  // Interactive 30-Second Pathway Advisor
  const [advisorState, setAdvisorState] = useState<{
    collegeGoal: "india" | "abroad" | "flexible" | null;
    learningStyle: "structured" | "inquiry" | null;
    result: string | null;
  }>({
    collegeGoal: null,
    learningStyle: null,
    result: null,
  });

  const activeStage = academicStages.find((s) => s.id === activeStageId) || academicStages[1];

  const calculateAdvisorResult = (goal: "india" | "abroad" | "flexible", style: "structured" | "inquiry") => {
    if (goal === "india" && style === "structured") {
      return "Recommended: CBSE National Pathway with Integrated JEE/NEET coaching.";
    } else if (goal === "abroad" || style === "inquiry") {
      return "Recommended: IB PYP Framework for Early/Primary Years with International Portfolio Transition.";
    } else {
      return "Recommended: Dual Pathway — Start in IB PYP for inquiry habits, transition to CBSE Senior Board for competitive entrance mastery.";
    }
  };

  return (
    <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
      {/* Header Banner */}
      <div className="bg-navy text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-widest font-bold">
            <Compass className="w-4 h-4" /> Academic Architecture
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 text-white">
            Dual Curriculum Pathway Explorer
          </h3>
          <p className="text-white/60 text-xs md:text-sm mt-1 max-w-xl">
            Compare grade-by-grade learning progression between CBSE National Rigor and the IB PYP International Inquiry framework.
          </p>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/15 text-xs">
          <button
            type="button"
            onClick={() => setSelectedTrack("both")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedTrack === "both" ? "bg-gold text-navy shadow" : "text-white/80 hover:text-white"
            }`}
          >
            Side-by-Side View
          </button>
          <button
            type="button"
            onClick={() => setSelectedTrack("cbse")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedTrack === "cbse" ? "bg-gold text-navy shadow" : "text-white/80 hover:text-white"
            }`}
          >
            CBSE Focus
          </button>
          <button
            type="button"
            onClick={() => setSelectedTrack("ib")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedTrack === "ib" ? "bg-gold text-navy shadow" : "text-white/80 hover:text-white"
            }`}
          >
            IB Focus
          </button>
        </div>
      </div>

      {/* Stage Selector Tabs */}
      <div className="bg-cream/15 border-b border-cream-line p-4 md:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {academicStages.map((stage) => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStageId(stage.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeStageId === stage.id
                  ? "bg-navy text-white border-navy shadow-sm"
                  : "bg-white border-cream-line text-navy hover:border-gold hover:bg-cream/30"
              }`}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider block text-gold-dark font-bold">
                {stage.ageGroup}
              </span>
              <h4 className="font-serif font-bold text-xs md:text-sm mt-0.5">{stage.stageName}</h4>
              <span className={`text-[10px] block mt-0.5 ${activeStageId === stage.id ? "text-white/70" : "text-ink-muted"}`}>
                {stage.grades}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Stage Matrix */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CBSE Pathway Card */}
          {(selectedTrack === "both" || selectedTrack === "cbse") && (
            <div className="bg-white border-2 border-gold/30 rounded-2xl p-6 md:p-8 shadow-card flex flex-col justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-cream-line">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-navy text-gold flex items-center justify-center font-bold text-sm shadow-sm">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gold-dark font-bold uppercase tracking-wider block">
                        National Board Framework
                      </span>
                      <h4 className="font-serif font-bold text-navy text-xl">CBSE Pathway</h4>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-navy/5 text-navy px-3 py-1 rounded-full">
                    {activeStage.grades}
                  </span>
                </div>

                <div className="mt-5">
                  <h5 className="font-serif font-bold text-navy text-base">
                    {activeStage.cbseFocus.title}
                  </h5>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {activeStage.cbseFocus.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-navy/85 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-cream/20 rounded-xl border border-cream-line">
                <span className="text-[10px] font-mono text-gold-dark font-bold uppercase tracking-wider block">
                  Core Student Outcome
                </span>
                <p className="text-xs text-ink-muted leading-relaxed mt-1">
                  {activeStage.cbseFocus.outcomes}
                </p>
              </div>
            </div>
          )}

          {/* IB PYP Pathway Card */}
          {(selectedTrack === "both" || selectedTrack === "ib") && (
            <div className="bg-navy text-white rounded-2xl p-6 md:p-8 shadow-glow-navy flex flex-col justify-between gap-6 border border-gold/40 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gold text-navy flex items-center justify-center font-bold text-sm shadow-sm">
                      <Globe2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gold-light font-bold uppercase tracking-wider block">
                        International Baccalaureate
                      </span>
                      <h4 className="font-serif font-bold text-white text-xl">IB PYP Pathway</h4>
                    </div>
                  </div>
                  <div className="relative w-8 h-8 shrink-0 bg-white/10 p-1 rounded-lg">
                    <Image src="/images/ib-logo-img.png" alt="IB Logo" fill className="object-contain p-0.5" />
                  </div>
                </div>

                <div className="mt-5">
                  <h5 className="font-serif font-bold text-gold-light text-base">
                    {activeStage.ibFocus.title}
                  </h5>
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {activeStage.ibFocus.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-white/90 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider block">
                  Core Student Outcome
                </span>
                <p className="text-xs text-white/70 leading-relaxed mt-1">
                  {activeStage.ibFocus.outcomes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Interactive 30-Second Pathway Advisor Widget */}
        <div className="mt-10 bg-cream/20 border border-cream-line rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-cream-line">
            <div>
              <div className="flex items-center gap-2 text-gold-dark text-xs font-mono uppercase tracking-widest font-bold">
                <HelpCircle className="w-4 h-4" /> 30-Second Decision Tool
              </div>
              <h4 className="text-xl md:text-2xl font-serif font-bold text-navy mt-1">
                Which Curriculum Pathway Is Best for Your Child?
              </h4>
              <p className="text-xs text-ink-muted mt-0.5">
                Select your preferences below to receive an instant counseling recommendation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Question 1 */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                1. Where do you envision your child attending higher education?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "india", label: "Indian Universities (IIT / AIIMS / DU / NLUs)" },
                  { id: "abroad", label: "Global Universities (US / UK / Europe / Canada)" },
                  { id: "flexible", label: "Open to Both Pathways" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      const newGoal = opt.id as any;
                      setAdvisorState((prev) => ({
                        ...prev,
                        collegeGoal: newGoal,
                        result: prev.learningStyle ? calculateAdvisorResult(newGoal, prev.learningStyle) : null,
                      }));
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      advisorState.collegeGoal === opt.id
                        ? "bg-navy text-white border-navy font-bold shadow-sm"
                        : "bg-white border-cream-line text-navy hover:border-gold"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-2">
                2. What learning style resonates most with your child?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "structured", label: "Structured textbooks, competitive problem solving & exams" },
                  { id: "inquiry", label: "Hands-on projects, research inquiry & open questioning" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      const newStyle = opt.id as any;
                      setAdvisorState((prev) => ({
                        ...prev,
                        learningStyle: newStyle,
                        result: prev.collegeGoal ? calculateAdvisorResult(prev.collegeGoal, newStyle) : null,
                      }));
                    }}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      advisorState.learningStyle === opt.id
                        ? "bg-navy text-white border-navy font-bold shadow-sm"
                        : "bg-white border-cream-line text-navy hover:border-gold"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Result Alert */}
          {advisorState.result && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start justify-between gap-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-serif font-bold text-emerald-950 text-sm">Admissions Dean Recommendation:</h5>
                  <p className="text-xs text-emerald-900 mt-0.5 leading-relaxed font-medium">
                    {advisorState.result}
                  </p>
                </div>
              </div>
              <a href="/admissions#application-form" className="shrink-0">
                <Button variant="gold" size="sm" className="rounded-lg text-xs font-bold">
                  Apply Now &rarr;
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
