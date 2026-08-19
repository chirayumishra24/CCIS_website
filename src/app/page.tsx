"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import StatsCounter from '@/components/ui/StatsCounter';
import VideoModal from '@/components/ui/VideoModal';
import Skeleton from '@/components/ui/Skeleton';
import AccreditationBadges from '@/components/ui/AccreditationBadges';
import HeroCanvas3D from '@/components/ui/HeroCanvas3D';
import MobileQuickDock from '@/components/ui/MobileQuickDock';
import AgeCalculator from '@/components/ui/AgeCalculator';
import { ArrowRight, Play, BookOpen, Calendar, MapPin, Compass, ShieldCheck, Award, X, Bell, Calculator, Sparkles } from 'lucide-react';

/* ─── Data Fallbacks ─── */
const defaultParentReviews = [
  { img: 'parent1.png', videoId: '3adNiVmDkws' },
  { img: 'parent2.png', videoId: '57c5x8jQINM' },
  { img: 'parent3.png', videoId: 'NgG6gWQETqU' },
  { img: 'parent4.png', videoId: 'Kw_p90p20Ns' }
];

const defaultStudentReviews = [
  { img: 'student1.png', videoId: 'd66JSRy8GwE' },
  { img: 'student2.png', videoId: 'XWpU8A4BoHE' },
  { img: 'student3.png', videoId: 'G5f7788rAbg' },
  { img: 'student4.png', videoId: 'CkP3EudkpRQ' }
];

const heroSlides = [
  {
    img: '/generated/bioclass.png',
    title: 'Dual Advantage: CBSE & IB Curriculum',
    desc: 'Empowering future global leaders through world-class academic pathways and deep-rooted Indian values.'
  },
  {
    img: '/generated/robo-lab.png',
    title: 'Holistic Development & AI Robotics Labs',
    desc: 'State-of-the-art sports complexes, advanced technology arenas, and active robotics studios.'
  },
  {
    img: '/generated/art-room.png',
    title: 'Cultivating Creative & Fine Arts',
    desc: 'Inspiring artistic expression, creative query, and innovative reasoning in every child.'
  },
  {
    img: '/generated/Chemistry-lab.png',
    title: 'Advanced Science & Innovation Labs',
    desc: 'Fostering hands-on scientific research, chemistry experimentation, and analytical excellence.'
  },
  {
    img: '/generated/library.png',
    title: 'Central Research Library & Knowledge Hub',
    desc: 'Home to over 15,000 prints, digital archives, and quiet study hubs for deep learning.'
  },
  {
    img: '/generated/Music-room.png',
    title: 'Performing Arts & Music Studio',
    desc: 'Nurturing musical talents, instrumental mastery, and stage confidence.'
  }
];

const pillars = [
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: 'Indian Values',
    desc: 'Rooting students in traditional ethics, respect, and community duty.',
    accent: 'from-navy to-navy-light'
  },
  {
    icon: <Compass className="w-7 h-7" />,
    title: 'Real-World Skills',
    desc: 'Developing critical reasoning, problem-solving, and communication proficiencies.',
    accent: 'from-gold-dark to-gold'
  },
  {
    icon: <Award className="w-7 h-7" />,
    title: 'Passion-Driven Sports',
    desc: 'Professional turf facilities, basketball arenas, and track excellence.',
    accent: 'from-navy-light to-navy'
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: 'AI & Tech Readiness',
    desc: 'Robotics studios, AI-assisted learning spaces, and advanced digital research hubs.',
    accent: 'from-gold to-gold-dark'
  }
];

export default function Home() {
  const [currentBg, setCurrentBg] = useState(0);
  const [newsList, setNewsList] = useState<Array<{ id: string; title: string; desc: string; img?: string; category: string; date: string; type: string }>>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlayingAiVideo, setIsPlayingAiVideo] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=wJ8RPJgO_Rs");
  const [activeTestimonialTab, setActiveTestimonialTab] = useState<"parent" | "student">("parent");
  const [youtubeLoaded, setYoutubeLoaded] = useState(false);
  const [liveStats, setLiveStats] = useState<Array<{ id: string; end: number; suffix: string; label: string }>>([
    { id: 'stat_1', end: 25, suffix: '+', label: 'Years of Excellence' },
    { id: 'stat_2', end: 13500, suffix: '+', label: 'Alumni Network' },
    { id: 'stat_3', end: 8, suffix: '+', label: 'Group Institutions' },
    { id: 'stat_4', end: 100, suffix: '%', label: 'Board Pass Rate' },
  ]);
  const [testimonialsData, setTestimonialsData] = useState({
    parent: defaultParentReviews,
    student: defaultStudentReviews,
  });

  const testimonialsRef = React.useRef<HTMLDivElement>(null);

  const openVideo = useCallback((url: string) => {
    setVideoUrl(url);
    setIsVideoModalOpen(true);
  }, []);

  const scrollTestimonials = (direction: "left" | "right") => {
    if (testimonialsRef.current) {
      const container = testimonialsRef.current;
      const scrollAmount = container.clientWidth * 0.75;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 1. Fetch Homepage News
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (data?.news) {
          setNewsList(data.news.filter((item: { type: string }) => item.type === 'news').slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load homepage news:', err);
      } finally {
        setLoadingNews(false);
      }
    }
    fetchNews();

    // 2. Fetch Live Stats
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveStats(data);
        }
      })
      .catch(console.error);

    // 3. Fetch Testimonials
    fetch('/api/admin/testimonials')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data.parent?.length > 0 || data.student?.length > 0)) {
          setTestimonialsData({
            parent: data.parent?.length > 0 ? data.parent : defaultParentReviews,
            student: data.student?.length > 0 ? data.student : defaultStudentReviews,
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ━━━ 1. HERO SECTION ━━━ */}
      <section className="relative h-[85vh] md:h-[92vh] bg-navy overflow-hidden flex items-end pb-24 md:pb-32">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${idx === currentBg ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <Image
              src={slide.img}
              alt="CCIS Campus"
              fill
              priority={idx === 0}
              quality={95}
              className={`object-cover object-top ${idx === currentBg ? "animate-ken-burns" : ""}`}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy/40 to-black/20 z-10" />
        <HeroCanvas3D />

        <div className="relative max-w-7xl mx-auto px-4 z-10 w-full text-white">
          <div className="max-w-2xl flex flex-col gap-5">
            <span className="inline-block px-3.5 py-1.5 bg-gold/95 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full font-extrabold shadow-glow-gold w-fit">
              Admissions Open 2026-27
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold leading-[1.08] tracking-tight">
              {heroSlides[currentBg]?.title}
            </h1>
            <p className="text-base md:text-lg text-white/80 leading-relaxed font-sans max-w-lg">
              {heroSlides[currentBg]?.desc}
            </p>
            <div className="flex flex-wrap gap-3 mt-1">
              <Link href="/admissions">
                <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider rounded-xl shadow-glow-gold">
                  Apply Online
                </Button>
              </Link>
              <button
                onClick={() => {
                  setYoutubeLoaded(true);
                  const el = document.getElementById("about-video");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2.5 px-5 py-3 border border-white/25 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 font-semibold text-sm cursor-pointer backdrop-blur-sm"
              >
                <Play className="w-4 h-4 fill-current text-gold" />
                Virtual Tour
              </button>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-2 mt-8">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBg(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentBg ? "w-10 bg-gold" : "w-4 bg-white/40 hover:bg-white/60"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Subtle gold line at hero bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </section>

      {/* ━━━ 2. ACCREDITATION BAR ━━━ */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-12 md:-mt-16">
        <AccreditationBadges />
      </div>

      {/* ━━━ 3. ABOUT SNAPSHOT ━━━ */}
      <section className="pt-20 md:pt-28 pb-20 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection animation="fade-in-left" className="w-full">
            <div
              id="about-video"
              className="relative w-full aspect-video rounded-2xl overflow-hidden border border-cream-line shadow-card bg-navy-dark cursor-pointer group"
              onClick={() => setYoutubeLoaded(true)}
            >
              {youtubeLoaded ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/wJ8RPJgO_Rs?autoplay=1"
                  title="CCIS Infrastructure Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src="/images/about-snapshot.png"
                    alt="CCIS Campus Tour Preview"
                    fill
                    className="object-cover object-bottom opacity-75 group-hover:opacity-90 transition-opacity duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gold text-navy rounded-full flex items-center justify-center shadow-glow-gold group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 md:w-8 md:h-8 fill-current ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-4 left-4 text-white/90 text-xs font-sans font-semibold bg-navy-dark/80 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                    Watch Campus Tour
                  </span>
                </>
              )}
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right" className="flex flex-col gap-5">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Where Learning Meets Life!</span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-navy leading-tight">
              Inspiring Leaders, Innovators &amp; Global Citizens
            </h2>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed text-[15px]">
              Cambridge Court International School (CCIS) combines the global inquiry standards of the International Baccalaureate (IB) framework with the robust national testing standards of the CBSE. Set in Sector-3 Mansarovar, Jaipur, our state-of-the-art campus is an arena for educational, athletic, and personal transformation.
            </p>
            <Link href="/about" className="mt-1">
              <Button variant="primary" className="rounded-xl group/btn">
                Read Our Story <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ 4. DYNAMIC LIVE STATISTICS ━━━ */}
      <section className="py-14 bg-navy relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
            {liveStats.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                <div className="flex-1 flex flex-col items-center px-6 md:px-8 py-2">
                  <StatsCounter end={item.end} suffix={item.suffix} label={item.label} />
                </div>
                {idx < liveStats.length - 1 && (
                  <div className="hidden md:block w-px h-12 bg-white/15" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 5. FOUR PILLARS ━━━ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Four Pillars of a CCIS Education" subtitle="Why Choose Us" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${idx + 1}`}
                className="bg-cream/20 border border-cream-line/50 p-6 rounded-2xl flex flex-col gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-3 bg-navy rounded-xl w-fit text-white">
                  {item.icon}
                </div>
                <h3 className="font-serif font-bold text-navy text-lg leading-snug">{item.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 6. AI & FUTURISTIC EDUCATION ━━━ */}
      <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/future.jpg" alt="" fill className="object-cover opacity-10" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy/90 to-navy-dark" />
        <div className="relative max-w-7xl mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection animation="fade-in-left" className="flex flex-col gap-5">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs bg-white/5 px-3 py-1.5 rounded-full w-fit border border-gold/20">
              Futuristic Learning
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-white leading-tight">
              Preparing Students for the AI-Driven World
            </h2>
            <div className="gold-rule" />
            <p className="text-white/70 leading-relaxed text-[15px]">
              At CCIS, we don&apos;t just teach technology—we build AI readiness. Through dedicated robotics labs, coding clubs, and real-world AI applications, our students learn to leverage technology ethically and creatively, preparing them to lead in the automated future.
            </p>
            <button
              onClick={() => setIsPlayingAiVideo(true)}
              className="flex items-center gap-2.5 px-5 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded-xl shadow-glow-gold transition-all duration-300 w-fit text-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch AI Impact Video
            </button>
          </AnimatedSection>
          <AnimatedSection
            animation="fade-in-right"
            className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
          >
            {isPlayingAiVideo ? (
              <iframe
                src="https://www.youtube.com/embed/H8u5p8QiYGQ?autoplay=1&rel=0"
                title="AI & Futuristic Education Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div
                className="w-full h-full relative cursor-pointer"
                onClick={() => setIsPlayingAiVideo(true)}
              >
                <Image
                  src="/generated/robo-lab2.png"
                  alt="AI and Robotics Lab at CCIS"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-navy-dark/30 group-hover:bg-navy-dark/15 transition-colors duration-300">
                  <div className="w-16 h-16 bg-gold text-navy rounded-full flex items-center justify-center shadow-glow-gold group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ 7. DUAL CURRICULUM PATHWAYS ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10 border-t border-cream-line relative">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Dual Curriculum Pathways" subtitle="Flexible Learning" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-4">
            {/* CBSE */}
            <AnimatedSection animation="fade-in-left" className="bg-white border border-cream-line p-8 md:p-10 rounded-2xl shadow-card flex flex-col gap-5">
              <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full w-fit font-bold">
                National Standard
              </span>
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-navy">CBSE Curriculum</h3>
              <p className="text-ink-muted leading-relaxed text-sm">
                Our Central Board of Secondary Education (CBSE) stream delivers rigorous academic instruction from Nursery up to Grade XII. Featuring comprehensive preparations for national engineering (JEE), medical (NEET), and commerce entrance courses alongside mandatory athletic training.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm font-semibold text-navy">
                <li className="flex items-center gap-2">✓ Nursery to Class XII</li>
                <li className="flex items-center gap-2">✓ Rigorous Science &amp; Commerce</li>
                <li className="flex items-center gap-2">✓ Advanced Elective Options</li>
                <li className="flex items-center gap-2">✓ Integrated Entrance coaching</li>
              </ul>
              <Link href="/academics" className="mt-2">
                <Button variant="secondary" className="w-full sm:w-auto rounded-xl">Explore CBSE Pathway</Button>
              </Link>
            </AnimatedSection>

            {/* IB */}
            <AnimatedSection animation="fade-in-right" className="bg-navy text-white p-8 md:p-10 rounded-2xl shadow-glow-navy flex flex-col gap-5 border-2 border-gold/40 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
              <span className="relative inline-block px-3 py-1 bg-gold text-navy font-sans text-[11px] uppercase tracking-widest rounded-full w-fit font-bold shadow-glow-gold animate-pulse-gold">
                International Baccalaureate
              </span>
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-gold-light">IB Programme</h3>
              <p className="text-white/70 leading-relaxed text-sm">
                As a candidate school for the prestigious International Baccalaureate, CCIS introduces young minds to inquiry-based teaching methodology. Emphasizing international-mindedness, self-directed project studies, and global credit qualifications.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm font-semibold text-gold-light">
                <li className="flex items-center gap-2">✓ PYP Candidate Framework</li>
                <li className="flex items-center gap-2">✓ Student-Led Research Studies</li>
                <li className="flex items-center gap-2">✓ Interdisciplinary Focus</li>
                <li className="flex items-center gap-2">✓ Global University Credits</li>
              </ul>
              <Link href="/academics" className="mt-2">
                <Button variant="gold" className="w-full sm:w-auto rounded-xl">Explore IB Pathway</Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ━━━ 8. AGE & GRADE CALCULATOR MINI-SECTION ━━━ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <AgeCalculator />
        </div>
      </section>

      {/* ━━━ 9. LEADERSHIP ━━━ */}
      <section className="py-20 md:py-28 bg-cream/10 border-t border-cream-line">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Vision &amp; Direction</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-navy mt-3">
              Our <span className="text-gold">Leaders</span>
            </h2>
            <p className="text-ink-muted text-sm mt-4 leading-relaxed max-w-xl mx-auto">
              Guided by distinguished educationists and visionaries, our leadership team is dedicated to pioneering dual-curriculum excellence.
            </p>
          </div>
          
          <div className="bg-white border border-cream-line rounded-2xl p-8 lg:p-12 shadow-card relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              <AnimatedSection animation="fade-in-left" className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="relative bg-white p-4 rounded-2xl border border-cream-line shadow-card flex flex-col items-center">
                    <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden shadow-inner bg-cream/30">
                      <Image
                        src="/images/lata-rawat.webp"
                        alt="Ms. Lata Rawat"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 400px"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-navy text-2xl mt-5">Mrs. Lata Rawat</h3>
                    <p className="text-gold font-sans font-semibold text-xs tracking-wider uppercase mt-1">Director &amp; Founding Mentor</p>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-in-right" className="lg:col-span-7 flex flex-col justify-center">
                <span className="text-gold font-sans text-xs font-bold uppercase tracking-widest mb-2">Lifetime Achievement</span>
                <h3 className="font-serif font-bold text-navy text-2xl md:text-3xl mb-6">Pioneering Educational Excellence</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { bold: "Rajiv Gandhi Education Excellence Award", normal: "for outstanding achievement in the field of education." },
                    { bold: "Woman of Excellence Award", normal: "from the Indian Achievers' Forum (IAF India)." },
                    { bold: "The Economic Times Business Leader of Rajasthan Award", normal: "conferred by the honourable C.M. Shri Ashok Gehlot Ji." },
                    { bold: "Edu Icon Award", normal: "awarded by the Global School Leaders Consortium (GSLC)." },
                    { bold: "Golden Educationist of India Award", normal: "prestigious recognition from the IIEM, New Delhi." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-cream/15 hover:bg-cream/30 rounded-xl border border-cream-line/50 transition-all duration-300 items-start">
                      <div className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5">
                        <Award className="w-4 h-4 text-gold-dark" />
                      </div>
                      <p className="text-sm text-ink-muted leading-relaxed">
                        <strong className="text-navy font-bold">{item.bold}</strong> &mdash; {item.normal}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 10. LATEST NEWS ━━━ */}
      <section className="py-20 md:py-24 bg-white border-b border-cream-line">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
            <div>
              <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Updates &amp; Highlights</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">Latest News &amp; Events</h2>
            </div>
            <Link href="/news-events" className="mt-3 sm:mt-0">
              <Button variant="secondary" size="sm" className="rounded-xl">View All News</Button>
            </Link>
          </div>

          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col gap-4 p-4 border border-cream-line rounded-2xl">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : newsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsList.map((item) => (
                <AnimatedSection key={item.id} animation="scale-in" className="bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card flex flex-col hover:shadow-card-hover transition-all duration-300 group">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={item.img || '/images/news_science.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className="absolute top-3 left-3 bg-navy text-white text-[10px] px-2.5 py-1 uppercase font-bold font-sans rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] text-ink-muted flex items-center gap-1.5 font-semibold font-mono">
                        <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <h3 className="font-serif font-bold text-navy text-base line-clamp-2 hover:text-gold transition-colors leading-snug">
                        <Link href="/news-events">{item.title}</Link>
                      </h3>
                      <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">{item.desc}</p>
                    </div>
                    <Link href="/news-events" className="text-gold-dark hover:text-gold font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1 mt-1">
                      Read Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-muted text-sm py-8">No news items available at the moment.</p>
          )}
        </div>
      </section>

      {/* ━━━ 11. TESTIMONIALS ━━━ */}
      <section className="py-20 md:py-24 bg-cream/15">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionHeading title="What Our Community Says" subtitle="Testimonials" />

          <div className="flex justify-center gap-3 mt-6 mb-10">
            {(["parent", "student"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTestimonialTab(tab)}
                className={`px-6 py-2.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${
                  activeTestimonialTab === tab
                    ? "bg-navy text-white border-navy shadow-card"
                    : "bg-white text-navy/60 border-cream-line hover:border-gold hover:text-gold"
                }`}
              >
                {tab === "parent" ? "Parents" : "Students"}
              </button>
            ))}
          </div>

          <div className="relative max-w-6xl mx-auto px-4 md:px-12">
            <button
              onClick={() => scrollTestimonials("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-gold text-navy rounded-full flex items-center justify-center transition-all duration-300 z-10 border border-cream-line shadow-md hidden md:flex"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref={testimonialsRef}
              className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-4"
            >
              {(activeTestimonialTab === "parent" ? testimonialsData.parent : testimonialsData.student).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden shadow-card border border-cream-line p-2 flex items-center justify-center shrink-0 snap-center hover:border-gold hover:shadow-card-hover transition-all duration-300 w-[260px] md:w-[300px] h-[360px] md:h-[480px]"
                >
                  {playingVideoId === item.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0`}
                      title={`CCIS Testimonial ${idx + 1}`}
                      className="w-full h-full rounded-xl border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      onClick={() => setPlayingVideoId(item.videoId)}
                      className="relative w-full h-full rounded-xl overflow-hidden group/item cursor-pointer"
                    >
                      <Image
                        src={`/images/${item.img || 'parent1.png'}`}
                        alt={`CCIS Testimonial ${idx + 1}`}
                        fill
                        className="object-contain rounded-xl"
                        sizes="300px"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover/item:bg-black/25 flex items-center justify-center transition-colors duration-300 rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-gold text-navy flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-all duration-300">
                          <Play className="w-7 h-7 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollTestimonials("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-gold text-navy rounded-full flex items-center justify-center transition-all duration-300 z-10 border border-cream-line shadow-md hidden md:flex"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ━━━ 12. FINAL ADMISSIONS CTA ━━━ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/c.c.i.s (1).webp" alt="CCIS Campus Infrastructure" fill className="object-cover opacity-30" sizes="100vw" quality={95} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/80 to-navy-dark/90" />

        <div className="relative max-w-3xl mx-auto px-4 flex flex-col items-center gap-5 z-10 text-center text-white">
          <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs bg-white/10 px-4 py-1.5 rounded-full border border-gold/30">
            Admissions Walkthrough
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight">
            Begin Your Child&apos;s Academic Journey Today
          </h2>
          <p className="text-white/70 max-w-xl mx-auto leading-relaxed text-[15px]">
            Schedule a personal walkthrough of our Sector-3 Mansarovar campus, explore our science &amp; AI robotics labs, and meet our academic leadership team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/admissions">
              <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider rounded-xl w-full sm:w-auto shadow-glow-gold">
                Schedule Campus Tour
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="lg" className="text-white hover:text-gold border border-white/20 hover:border-gold rounded-xl w-full sm:w-auto">
                Inquire Online
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={isVideoModalOpen}
        videoUrl={videoUrl}
        onClose={() => setIsVideoModalOpen(false)}
      />
      <MobileQuickDock />
    </div>
  );
}
