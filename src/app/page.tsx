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
import { ArrowRight, Play, BookOpen, Calendar, MapPin, Compass, ShieldCheck, Award, X, Bell } from 'lucide-react';

/* ─── Data ─── */
const parentReviews = [
  { img: 'parent1.png', videoId: '3adNiVmDkws' },
  { img: 'parent2.png', videoId: '57c5x8jQINM' },
  { img: 'parent3.png', videoId: 'NgG6gWQETqU' },
  { img: 'parent4.png', videoId: 'Kw_p90p20Ns' }
];

const studentReviews = [
  { img: 'student1.webp', videoId: 'd66JSRy8GwE' },
  { img: 'student2.webp', videoId: 'XWpU8A4BoHE' }
];

const heroSlides = [
  {
    img: '/images/home_hero1.png',
    title: 'Dual Advantage: CBSE & IB curriculum',
    desc: 'Empowering future global leaders through world-class academic pathways and deep-rooted Indian values.'
  },
  {
    img: '/images/home_hero2.png',
    title: 'Holistic Development & Modern Labs',
    desc: 'State-of-the-art sports complexes, advanced technology arenas, and active learning studios.'
  },
  {
    img: '/images/home_hero3.png',
    title: 'Cultivating Critical Thinkers',
    desc: 'Inspiring creative query, research focus, and innovative reasoning in every child.'
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
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=wJ8RPJgO_Rs");
  const [activeTestimonialTab, setActiveTestimonialTab] = useState<"parent" | "student">("parent");
  const [showNotice, setShowNotice] = useState(true);
  const [youtubeLoaded, setYoutubeLoaded] = useState(false);
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[85vh] md:h-[92vh] bg-navy overflow-hidden flex items-end pb-24 md:pb-32">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${idx === currentBg ? "opacity-85" : "opacity-0 pointer-events-none"}`}
          >
            <Image
              src={slide.img}
              alt="CCIS Campus"
              fill
              priority={idx === 0}
              className={`object-cover ${idx === currentBg ? "animate-ken-burns" : ""}`}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy/50 to-navy/20" />

        <div className="relative max-w-7xl mx-auto px-4 z-10 w-full text-white">
          <div className="max-w-2xl flex flex-col gap-5">
            <span className="inline-block px-3 py-1.5 bg-gold/90 text-white font-sans text-[11px] uppercase tracking-widest rounded font-bold shadow-glow-gold w-fit">
              Admissions Open 2026-27
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold leading-[1.08] tracking-tight">
              {heroSlides[currentBg]?.title}
            </h1>
            <p className="text-base md:text-lg text-white/75 leading-relaxed font-sans max-w-lg">
              {heroSlides[currentBg]?.desc}
            </p>
            <div className="flex flex-wrap gap-3 mt-1">
              <Link href="/admissions">
                <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider rounded">
                  Apply Online
                </Button>
              </Link>
              <button
                onClick={() => openVideo("https://www.youtube.com/watch?v=wJ8RPJgO_Rs")}
                className="flex items-center gap-2.5 px-5 py-3 border border-white/25 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white rounded transition-all duration-300 font-semibold text-sm"
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
                className={`h-1 rounded-full transition-all duration-500 ${idx === currentBg ? "w-10 bg-gold" : "w-4 bg-white/30 hover:bg-white/50"}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Subtle gold line at hero bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </section>

      {/* ━━━ 2. ACCREDITATION BAR — Floating Overlay ━━━ */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-12 md:-mt-16">
        <AccreditationBadges />
      </div>

      {/* ━━━ 3. ABOUT SNAPSHOT ━━━ */}
      <section className="pt-20 md:pt-28 pb-20 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection animation="fade-in-left" className="w-full">
            <div
              className="relative w-full aspect-video rounded-xl overflow-hidden border border-cream-line shadow-card bg-navy-dark cursor-pointer group"
              onClick={() => { if (!youtubeLoaded) setYoutubeLoaded(true); else openVideo("https://www.youtube.com/watch?v=wJ8RPJgO_Rs"); }}
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
                    src="/images/home_hero1.png"
                    alt="CCIS Campus Tour Preview"
                    fill
                    className="object-cover object-bottom opacity-70 group-hover:opacity-85 transition-opacity duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gold text-navy rounded-full flex items-center justify-center shadow-glow-gold group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 md:w-8 md:h-8 fill-current ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-4 left-4 text-white/80 text-xs font-sans font-semibold bg-navy-dark/70 px-3 py-1 rounded backdrop-blur-sm">
                    Watch Campus Tour
                  </span>
                </>
              )}
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right" className="flex flex-col gap-5">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Where Learning Meets Life!</span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-navy leading-tight">
              Inspiring Leaders, Innovators & Global Citizens
            </h2>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed text-[15px]">
              Cambridge Court International School (CCIS) combines the global inquiry standards of the International Baccalaureate (IB) framework with the robust national testing standards of the CBSE. Set in Sector-3 Mansarovar, Jaipur, our beautiful campus is an arena for educational, athletic, and personal transformation.
            </p>
            <Link href="/about" className="mt-1">
              <Button variant="primary" className="rounded group/btn">
                Read Our Story <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ 4. KEY STATISTICS — Inline with Dividers ━━━ */}
      <section className="py-14 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
            <StatInline end={25} suffix="+" label="Years of Excellence" />
            <div className="hidden md:block w-px h-12 bg-white/15" />
            <StatInline end={13500} suffix="+" label="Alumni Network" />
            <div className="hidden md:block w-px h-12 bg-white/15" />
            <StatInline end={8} suffix="+" label="Group Institutions" />
            <div className="hidden md:block w-px h-12 bg-white/15" />
            <StatInline end={100} suffix="%" label="Board Pass Rate" />
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
                className="bg-cream/20 border border-cream-line/50 p-6 rounded-xl flex flex-col gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-3 bg-navy rounded-lg w-fit text-white">
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
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs bg-white/5 px-3 py-1.5 rounded w-fit border border-gold/20">
              Futuristic Learning
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-white leading-tight">
              Preparing Students for the AI-Driven World
            </h2>
            <div className="gold-rule" />
            <p className="text-white/65 leading-relaxed text-[15px]">
              At CCIS, we don't just teach technology—we build AI readiness. Through dedicated robotics labs, coding clubs, and real-world AI applications, our students learn to leverage technology ethically and creatively, preparing them to lead in the automated future.
            </p>
            <button
              onClick={() => openVideo("https://www.youtube.com/watch?v=H8u5p8QiYGQ")}
              className="flex items-center gap-2.5 px-5 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded shadow-glow-gold transition-all duration-300 w-fit text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch AI Impact Video
            </button>
          </AnimatedSection>
          <AnimatedSection
            animation="fade-in-right"
            className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
          >
            <div
              className="w-full h-full relative"
              onClick={() => openVideo("https://www.youtube.com/watch?v=H8u5p8QiYGQ")}
            >
              <Image
                src="/images/ai_robotics_thumbnail.png"
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
          </AnimatedSection>
        </div>
      </section>

      {/* ━━━ 7. DUAL CURRICULUM PATHWAYS ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10 border-t border-cream-line relative">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Dual Curriculum Pathways" subtitle="Flexible Learning" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mt-4">
            {/* CBSE */}
            <AnimatedSection animation="fade-in-left" className="bg-white border border-cream-line p-8 md:p-10 rounded-xl shadow-card flex flex-col gap-5">
              <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-sans text-[11px] uppercase tracking-widest rounded-full w-fit font-bold">
                National Standard
              </span>
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-navy">CBSE Curriculum</h3>
              <p className="text-ink-muted leading-relaxed text-sm">
                Our Central Board of Secondary Education (CBSE) stream delivers rigorous academic instruction from Nursery up to Grade XII. Featuring comprehensive preparations for national engineering (JEE), medical (NEET), and commerce entrance courses alongside mandatory athletic training.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm font-semibold text-navy">
                <li className="flex items-center gap-2">✓ Nursery to Class XII</li>
                <li className="flex items-center gap-2">✓ Rigorous Science & Commerce</li>
                <li className="flex items-center gap-2">✓ Advanced Elective Options</li>
                <li className="flex items-center gap-2">✓ Integrated Entrance coaching</li>
              </ul>
              <Link href="/academics" className="mt-2">
                <Button variant="secondary" className="w-full sm:w-auto rounded">Explore CBSE Pathway</Button>
              </Link>
            </AnimatedSection>

            {/* IB */}
            <AnimatedSection animation="fade-in-right" className="bg-navy text-white p-8 md:p-10 rounded-xl shadow-glow-navy flex flex-col gap-5 border-2 border-gold/40 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
              <span className="relative inline-block px-3 py-1 bg-gold text-white font-sans text-[11px] uppercase tracking-widest rounded-full w-fit font-bold shadow-glow-gold animate-pulse-gold">
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
                <Button variant="gold" className="w-full sm:w-auto rounded">Explore IB Pathway</Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ━━━ 8. LEADERSHIP ━━━ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Vision & Direction</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-navy mt-3">
              Our <span className="text-gold">Leaders</span>
            </h2>
            <p className="text-ink-muted text-sm mt-4 leading-relaxed max-w-xl mx-auto">
              Guided by distinguished educationists and visionaries, our leadership team is dedicated to pioneering dual-curriculum excellence.
            </p>
          </div>
          
          {/* Mentor + Awards */}
          <div className="bg-cream/15 border border-cream-line/60 rounded-2xl p-8 lg:p-12 mb-20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              <AnimatedSection animation="fade-in-left" className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-gold to-gold-light rounded-2xl opacity-20 blur-sm group-hover:opacity-40 transition duration-500" />
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
                    <h3 className="font-serif font-bold text-navy text-2xl mt-5">Ms. Lata Rawat</h3>
                    <p className="text-gold font-sans font-semibold text-xs tracking-wider uppercase mt-1">Founding Mentor</p>
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
                    <div key={idx} className="flex gap-3 p-3 bg-white/60 hover:bg-white rounded-lg border border-transparent hover:border-cream-line/50 shadow-sm transition-all duration-300 items-start">
                      <div className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.2L15.09 8.46L22 9.47L17 14.34L18.18 21.22L12 17.97L5.82 21.22L7 14.34L2 9.47L8.91 8.46L12 2.2Z" />
                        </svg>
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

          {/* Directors */}
          <div className="text-center mb-10">
            <h3 className="font-serif font-bold text-navy text-xl md:text-2xl">Board of Directors</h3>
            <div className="w-12 h-[2px] bg-gold mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Mr. Aayush Singh Rawat", role: "Director of CCGS", img: "/images/director-aayush.jpg", quote: "Bridging technology, modern management, and global standards to prepare future leaders.", alumniLabel: "Alumnus of:", logos: [{ src: "/images/vit-logo.png", alt: "VIT" }, { src: "/images/isb-logo.png", alt: "ISB" }] },
              { name: "Ms. Aarna Singh Rawat", role: "Director of CCGS & Founder of Skillizee", img: "/images/director-aarna.jpg", quote: "Pioneering active, skill-focused learning ecosystems to foster innovation and self-reliance.", alumniLabel: "Alumna of:", logos: [{ src: "/images/kellogg.png", alt: "Kellogg" }, { src: "/images/isb-logo.png", alt: "ISB" }] },
              { name: "Mrs. Priyanshi Rawat", role: "Director of CCGS & CEO of Playbox School", img: "/images/director-priyanshi.jpg", quote: "Strategizing financial discipline, operations, and growth metrics to maintain quality standards.", alumniLabel: "Alumna of:", logos: [{ src: "/images/CA.png", alt: "CA" }] },
            ].map((dir, idx) => (
              <AnimatedSection key={idx} animation="scale-in" delayClass={`stagger-${idx + 1}`} className="group bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-gold/30 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream/20">
                    <Image src={dir.img} alt={dir.name} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <p className="text-white/95 text-xs font-sans italic leading-relaxed">&ldquo;{dir.quote}&rdquo;</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-serif font-bold text-navy text-lg group-hover:text-gold transition-colors duration-300">{dir.name}</h4>
                    <p className="text-xs text-gold font-sans font-bold mt-1 uppercase tracking-wider">{dir.role}</p>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-3 border-t border-cream-line/50 bg-cream/5 flex items-center justify-between">
                  <span className="text-xs text-ink-muted font-sans font-semibold">{dir.alumniLabel}</span>
                  <div className="flex gap-3 items-center">
                    {dir.logos.map((logo, li) => (
                      <Image key={li} src={logo.src} alt={logo.alt} width={60} height={24} className="h-5 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 9. LATEST NEWS ━━━ */}
      <section className="py-20 md:py-24 bg-cream/10 border-y border-cream-line">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10">
            <div>
              <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs">Updates & Highlights</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">Latest News & Events</h2>
            </div>
            <Link href="/news-events" className="mt-3 sm:mt-0">
              <Button variant="secondary" size="sm" className="rounded">View All News</Button>
            </Link>
          </div>

          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col gap-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : newsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsList.map((item) => (
                <AnimatedSection key={item.id} animation="scale-in" className="bg-white border border-cream-line rounded-xl overflow-hidden shadow-card flex flex-col hover:shadow-card-hover transition-all duration-300 group">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={item.img || '/images/news_science.svg'}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-navy text-white text-[10px] px-2 py-0.5 uppercase font-semibold font-sans rounded tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] text-ink-muted flex items-center gap-1.5 font-semibold">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <h3 className="font-serif font-bold text-navy text-base line-clamp-2 hover:text-gold transition-colors leading-snug">
                        <Link href="/news-events">{item.title}</Link>
                      </h3>
                      <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed">{item.desc}</p>
                    </div>
                    <Link href="/news-events" className="text-gold-dark hover:text-gold font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1 mt-1">
                      Read Details <ArrowRight className="w-3 h-3" />
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

      {/* ━━━ 10. NOTICE BAR — Static Dismissible ━━━ */}
      {showNotice && (
        <div className="bg-navy-dark text-white py-3 px-4 border-b border-gold/30 relative">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="bg-gold text-navy text-[10px] font-sans font-extrabold uppercase px-2 py-0.5 tracking-widest rounded shrink-0 shadow-glow-gold flex items-center gap-1">
              <Bell className="w-3 h-3" /> NOTICE
            </span>
            <p className="text-sm text-cream/90 font-medium flex-1 line-clamp-1">
              CBSE Board Registrations for Grade X & XII start on August 1st, 2026. Submit documents by the deadline.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/news-events" className="text-gold text-xs font-bold hover:underline hidden sm:inline">
                View All Notices
              </Link>
              <button
                onClick={() => setShowNotice(false)}
                className="text-white/50 hover:text-white transition-colors p-0.5"
                aria-label="Dismiss notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━ 11. TESTIMONIALS ━━━ */}
      <section className="py-20 md:py-24 bg-white">
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
                    : "bg-cream/30 text-navy/60 border-cream-line hover:border-gold hover:text-gold"
                }`}
              >
                {tab === "parent" ? "Parents" : "Students"}
              </button>
            ))}
          </div>

          <div className="relative max-w-6xl mx-auto px-4 md:px-12">
            <button
              onClick={() => scrollTestimonials("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white hover:bg-gold text-navy hover:text-navy rounded-full flex items-center justify-center transition-all duration-300 z-10 border border-cream-line hover:border-gold shadow-sm hidden md:flex"
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
              {(activeTestimonialTab === "parent" ? parentReviews : studentReviews).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => openVideo(`https://www.youtube.com/watch?v=${item.videoId}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-card border border-cream-line p-2 flex items-center justify-center shrink-0 snap-center cursor-pointer hover:border-gold hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 w-[260px] md:w-[300px] h-[360px] md:h-[480px]"
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden group/item">
                    <Image
                      src={`/images/${item.img}`}
                      alt={`CCIS Testimonial ${idx + 1}`}
                      fill
                      className="object-contain rounded-xl"
                      sizes="300px"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover/item:bg-black/20 flex items-center justify-center transition-colors duration-300 rounded-xl">
                      <div className="w-14 h-14 rounded-full bg-gold/90 text-navy flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:bg-gold transition-all duration-300">
                        <Play className="w-7 h-7 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => scrollTestimonials("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-white hover:bg-gold text-navy hover:text-navy rounded-full flex items-center justify-center transition-all duration-300 z-10 border border-cream-line hover:border-gold shadow-sm hidden md:flex"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Pagination dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              {(activeTestimonialTab === "parent" ? parentReviews : studentReviews).map((_, idx) => (
                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-cream-line" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 12. ACHIEVEMENTS ━━━ */}
      <section className="py-14 bg-cream/20 border-y border-cream-line">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 text-center">
            {[
              { label: "#1 Ranked", sub: "Co-Ed Day School in Jaipur" },
              { label: "Top Academic", sub: "CBSE Board Performance" },
              { label: "Best-in-Class", sub: "AI & Coding Infrastructure" },
              { label: "Global Edge", sub: "Certified IB PYP Curriculum" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="text-2xl md:text-3xl font-bold font-serif text-navy">{item.label}</div>
                <p className="text-[11px] font-semibold text-ink-muted uppercase tracking-wider">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 13. CTA ━━━ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/home_hero3.png" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-navy-dark/88" />

        <div className="relative max-w-3xl mx-auto px-4 flex flex-col items-center gap-5 z-10 text-center text-white">
          <span className="text-gold font-sans font-bold uppercase tracking-wider text-xs bg-white/5 px-3 py-1.5 rounded border border-gold/25">
            Admissions Walkthrough
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight">
            Begin Your Child&apos;s Academic Journey Today
          </h2>
          <p className="text-white/60 max-w-xl mx-auto leading-relaxed text-[15px]">
            Schedule a personal walk-through of our Sector-3 Mansarovar campus, explore our labs, and meet our academic counseling heads.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/admissions">
              <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider rounded w-full sm:w-auto">
                Schedule Tour
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="lg" className="text-white hover:text-gold border border-white/20 hover:border-gold rounded w-full sm:w-auto">
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
    </div>
  );
}

/* ─── Inline Stat for the dark stats bar ─── */
function StatInline({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center px-6 md:px-8 py-2">
      <StatsCounter end={end} suffix={suffix} label={label} />
    </div>
  );
}
