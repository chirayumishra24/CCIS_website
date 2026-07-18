"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import AnimatedSection from '@/components/ui/AnimatedSection';
import SectionHeading from '@/components/ui/SectionHeading';
import StatsCounter from '@/components/ui/StatsCounter';
import VideoModal from '@/components/ui/VideoModal';
import Skeleton from '@/components/ui/Skeleton';
import AccreditationBadges from '@/components/ui/AccreditationBadges';
import { ArrowRight, Play, BookOpen, Calendar, MapPin, Compass, ShieldCheck, Award, MessageSquare } from 'lucide-react';

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
    title: 'Dual Advantage: CBSE &amp; IB curriculum',
    desc: 'Empowering future global leaders through world-class academic pathways and deep-rooted Indian values.'
  },
  {
    img: '/images/home_hero2.png',
    title: 'Holistic Development &amp; Modern Labs',
    desc: 'State-of-the-art sports complexes, advanced technology arenas, and active learning studios.'
  },
  {
    img: '/images/home_hero3.png',
    title: 'Cultivating Critical Thinkers',
    desc: 'Inspiring creative query, research focus, and innovative reasoning in every child.'
  }
];

const bentoItems = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-gold" />,
    title: 'Indian Values',
    desc: 'Rooting students in traditional ethics, respect, and community duty.'
  },
  {
    icon: <Compass className="w-8 h-8 text-gold" />,
    title: 'Real-World Skills',
    desc: 'Developing critical reasoning, problem-solving, and communication proficiencies.'
  },
  {
    icon: <Award className="w-8 h-8 text-gold" />,
    title: 'Passion-Driven Sports',
    desc: 'Professional turf facilities, professional basketball arenas, and track excellence.'
  },
  {
    icon: <BookOpen className="w-8 h-8 text-gold" />,
    title: 'AI &amp; Tech Readiness',
    desc: 'Robotics studios, AI-assisted learning spaces, and advanced digital research hubs.'
  }
];



export default function Home() {
  const [currentBg, setCurrentBg] = useState(0);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=wJ8RPJgO_Rs");
  const [activeTestimonialTab, setActiveTestimonialTab] = useState<"parent" | "student">("parent");
  const testimonialsRef = React.useRef<HTMLDivElement>(null);

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
        // Get top 3 news
        if (data && data.news) {
          setNewsList(data.news.filter((item: any) => item.type === 'news').slice(0, 3));
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
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] bg-navy overflow-hidden flex items-center">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentBg ? "opacity-45" : "opacity-0 pointer-events-none"}`}
          >
            <Image
              src={slide.img}
              alt="CCIS Campus slide"
              fill
              priority={idx === 0}
              className={`object-cover ${idx === currentBg ? "animate-ken-burns" : ""}`}
            />
          </div>
        ))}
        {/* Dark Navy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 z-10 w-full text-white">
          <div className="max-w-2xl flex flex-col gap-6">
            <span className="inline-block px-3 py-1 bg-gold text-white font-mono text-xs uppercase tracking-widest rounded-sm font-bold shadow-glow-gold animate-fadeIn">
              Admissions Open 2026-27
            </span>
            <h1
              className="text-4xl md:text-6xl font-serif font-extrabold leading-tight"
              dangerouslySetInnerHTML={{ __html: heroSlides[currentBg]?.title || "" }}
            />
            <p className="text-lg text-cream-dark/90 leading-relaxed font-sans font-medium">
              {heroSlides[currentBg]?.desc}
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/admissions">
                <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider rounded-sm">
                  Apply Online
                </Button>
              </Link>
              <button
                onClick={() => {
                  setVideoUrl("https://www.youtube.com/watch?v=wJ8RPJgO_Rs");
                  setIsVideoModalOpen(true);
                }}
                className="flex items-center gap-3 px-6 py-3 border border-white/30 hover:border-white bg-white/5 hover:bg-white/10 text-white rounded transition-all duration-300 font-semibold"
              >
                <Play className="w-5 h-5 fill-current text-gold" />
                Virtual Tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Accreditation Bar */}
      <AccreditationBadges />

      {/* 3. About Snapshot */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="fade-in-left" className="w-full">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-cream-line shadow-card bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/wJ8RPJgO_Rs"
                title="CCIS Infrastructure Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in-right" className="flex flex-col gap-6">
            <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm">Where Learning Meets Life!</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy">
              Inspiring Leaders, Innovators &amp; Global Citizens
            </h2>
            <div className="gold-rule" />
            <p className="text-ink-muted leading-relaxed">
              Cambridge Court International School (CCIS) combines the global inquiry standards of the International Baccalaureate (IB) framework with the robust national testing standards of the CBSE. Set in Sector-3 Mansarovar, Jaipur, our beautiful cream-toned campus is an arena for educational, athletic, and personal transformation.
            </p>
            <div className="flex gap-4 mt-2">
              <Link href="/about">
                <Button variant="primary" className="rounded-sm">Read Our Story <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. Key Statistics */}
      <section className="py-16 bg-cream/30 border-y border-cream-line">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCounter end={25} suffix="+" label="Years of Excellence" />
            <StatsCounter end={13500} suffix="+" label="Alumni Network" />
            <StatsCounter end={8} suffix="+" label="Group Institutions" />
            <StatsCounter end={100} suffix="%" label="Board Pass Rate" />
          </div>
        </div>
      </section>

      {/* 5. Why Choose CCIS Bento */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Four Pillars of a CCIS Education" subtitle="Why Choose Us" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bentoItems.map((item, idx) => (
              <AnimatedSection
                key={idx}
                animation="scale-in"
                delayClass={`stagger-${idx + 1}`}
                className="bg-cream/25 border border-cream-line/50 p-8 rounded-lg flex flex-col gap-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-3 bg-navy rounded-lg w-fit text-white shadow-glow-navy">
                  {item.icon}
                </div>
                <h3 className="font-serif font-bold text-navy text-xl">{item.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{item.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* AI & Futuristic Education Section */}
      <section className="py-20 bg-navy text-white relative overflow-hidden border-y-2 border-gold/30">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/images/future.jpg')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection animation="fade-in-left" className="flex flex-col gap-6">
            <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm bg-white/5 px-3 py-1 rounded w-fit border border-gold/20">
              Futuristic Learning
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">
              Preparing Students for the AI-Driven World
            </h2>
            <div className="gold-rule" />
            <p className="text-cream-dark/90 leading-relaxed">
              At CCIS, we don't just teach technology—we build AI readiness. Through dedicated robotics labs, coding clubs, and real-world AI applications, our students learn to leverage technology ethically and creatively, preparing them to lead in the automated future.
            </p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => {
                  setVideoUrl("https://www.youtube.com/watch?v=H8u5p8QiYGQ");
                  setIsVideoModalOpen(true);
                }}
                className="flex items-center gap-3 px-6 py-3 bg-gold hover:bg-gold-light text-navy font-bold rounded shadow-glow-gold transition-all duration-300"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch AI Impact Video
              </button>
            </div>
          </AnimatedSection>
          <AnimatedSection
            animation="fade-in-right"
            className="relative aspect-video rounded-lg overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
          >
            <div
              className="w-full h-full relative"
              onClick={() => {
                setVideoUrl("https://www.youtube.com/watch?v=H8u5p8QiYGQ");
                setIsVideoModalOpen(true);
              }}
            >
              <Image
                src="/images/future.jpg"
                alt="AI and Robotics Lab at CCIS"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-navy-dark/40 group-hover:bg-navy-dark/20 transition-colors">
                <div className="w-16 h-16 bg-gold text-navy rounded-full flex items-center justify-center shadow-glow-gold group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="py-20 bg-cream/10 border-t border-cream-line">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading title="Dual Curriculum Pathways" subtitle="Flexible Learning" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
            {/* CBSE */}
            <AnimatedSection animation="fade-in-left" className="bg-white border border-cream-line p-8 md:p-12 rounded-lg shadow-card flex flex-col gap-6">
              <span className="inline-block px-3 py-1 bg-navy/5 text-navy font-mono text-xs uppercase tracking-widest rounded-full w-fit font-bold">
                National Standard
              </span>
              <h3 className="font-serif font-bold text-3xl text-navy">CBSE Curriculum</h3>
              <p className="text-ink-muted leading-relaxed">
                Our Central Board of Secondary Education (CBSE) stream delivers rigorous academic instruction from Nursery up to Grade XII. Featuring comprehensive preparations for national engineering (JEE), medical (NEET), and commerce entrance courses alongside mandatory athletic training.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-navy">
                <li className="flex items-center gap-2">✓ Nursery to Class XII</li>
                <li className="flex items-center gap-2">✓ Rigorous Science &amp; Commerce</li>
                <li className="flex items-center gap-2">✓ Advanced Elective Options</li>
                <li className="flex items-center gap-2">✓ Integrated Entrance coaching</li>
              </ul>
              <Link href="/academics" className="mt-4">
                <Button variant="secondary" className="w-full sm:w-auto rounded-sm">Explore CBSE Pathway</Button>
              </Link>
            </AnimatedSection>

            {/* IB */}
            <AnimatedSection animation="fade-in-right" className="bg-navy text-white p-8 md:p-12 rounded-lg shadow-glow-navy flex flex-col gap-6 border-2 border-gold">
              <span className="inline-block px-3 py-1 bg-gold text-white font-mono text-xs uppercase tracking-widest rounded-full w-fit font-bold shadow-glow-gold animate-pulse-gold">
                International Baccalaureate
              </span>
              <h3 className="font-serif font-bold text-3xl text-gold-light">IB Programme</h3>
              <p className="text-cream-dark/95 leading-relaxed">
                As a candidate school for the prestigious International Baccalaureate, CCIS introduces young minds to inquiry-based teaching methodology. Emphasizing international-mindedness, self-directed project studies, and global credit qualifications.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-gold-light">
                <li className="flex items-center gap-2">✓ PYP Candidate Framework</li>
                <li className="flex items-center gap-2">✓ Student-Led Research Studies</li>
                <li className="flex items-center gap-2">✓ Interdisciplinary Focus</li>
                <li className="flex items-center gap-2">✓ Global University Credits</li>
              </ul>
              <Link href="/academics" className="mt-4">
                <Button variant="gold" className="w-full sm:w-auto rounded-sm">Explore IB Pathway</Button>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 7. Leadership Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm">Vision & Direction</span>
            <h2 className="text-3xl md:text-5xl font-serif font-extrabold text-navy mt-2">
              Our <span className="text-gold">Leaders</span>
            </h2>
            <p className="text-ink-muted text-sm md:text-base mt-4 leading-relaxed font-sans">
              Guided by distinguished educationists and visionaries, our leadership team is dedicated to pioneering dual-curriculum excellence and shaping global citizens with deep Indian roots.
            </p>
          </div>
          
          {/* Top Row: Mentor & Awards */}
          <div className="bg-cream/20 border border-cream-line/60 rounded-3xl p-8 lg:p-12 mb-20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              {/* Mentor Image Showcase */}
              <AnimatedSection animation="fade-in-left" className="lg:col-span-5 flex justify-center">
                <div className="relative group max-w-sm w-full">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-gold to-gold-light rounded-2xl opacity-20 blur-sm group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-white p-4 rounded-2xl border border-cream-line shadow-card flex flex-col items-center">
                    <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden shadow-inner bg-cream/30">
                      <Image
                        src="/images/lata-rawat.webp"
                        alt="Ms. Lata Rawat"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif font-bold text-navy text-2xl mt-5">Ms. Lata Rawat</h3>
                    <p className="text-gold font-sans font-semibold text-xs tracking-wider uppercase mt-1">Founding Mentor</p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Achievements & Bio */}
              <AnimatedSection animation="fade-in-right" className="lg:col-span-7 flex flex-col justify-center">
                <span className="text-gold font-mono text-xs font-bold uppercase tracking-widest mb-2">Lifetime Achievement</span>
                <h3 className="font-serif font-bold text-navy text-3xl md:text-4xl mb-6">Pioneering Educational Excellence</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { bold: "Rajiv Gandhi Education Excellence Award", normal: "for outstanding achievement in the field of education." },
                    { bold: "Woman of Excellence Award", normal: "from the Indian Achievers' Forum (IAF India)." },
                    { bold: "The Economic Times Business Leader of Rajasthan Award", normal: "conferred by the honourable C.M. Shri Ashok Gehlot Ji." },
                    { bold: "Edu Icon Award", normal: "awarded by the Global School Leaders Consortium (GSLC)." },
                    { bold: "Golden Educationist of India Award", normal: "prestigious recognition from the IIEM, New Delhi." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3.5 bg-white/60 hover:bg-white rounded-xl border border-transparent hover:border-cream-line/50 shadow-sm transition-all duration-300 items-start">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.2L15.09 8.46L22 9.47L17 14.34L18.18 21.22L12 17.97L5.82 21.22L7 14.34L2 9.47L8.91 8.46L12 2.2Z" />
                        </svg>
                      </div>
                      <p className="text-sm text-ink-muted leading-relaxed font-sans">
                        <strong className="text-navy font-bold">{item.bold}</strong> &mdash; {item.normal}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Bottom Row: Directors Cards */}
          <div className="text-center mb-12">
            <h3 className="font-serif font-bold text-navy text-2xl md:text-3xl">Board of Directors</h3>
            <div className="w-12 h-[2px] bg-gold mx-auto mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mr. Aayush Card */}
            <AnimatedSection animation="scale-in" delayClass="stagger-1" className="group bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-gold/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream/20">
                  <Image
                    src="/images/director-aayush.jpg"
                    alt="Mr. Aayush Singh Rawat"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white/95 text-xs md:text-sm font-sans italic leading-relaxed">
                      "Bridging technology, modern management, and global standards to prepare future leaders."
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif font-bold text-navy text-lg group-hover:text-gold transition-colors duration-300">Mr. Aayush Singh Rawat</h4>
                  <p className="text-xs text-gold font-sans font-bold mt-1 uppercase tracking-wider">Director of CCGS</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-cream-line/50 bg-cream/5 flex items-center justify-between">
                <span className="text-xs text-ink-muted font-sans font-semibold">Alumnus of:</span>
                <div className="flex gap-4 items-center">
                  <img src="/images/vit-logo.png" alt="VIT Logo" className="h-6 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" title="VIT" />
                  <img src="/images/isb-logo.png" alt="ISB Logo" className="h-6 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" title="ISB" />
                </div>
              </div>
            </AnimatedSection>

            {/* Ms. Aarna Card */}
            <AnimatedSection animation="scale-in" delayClass="stagger-2" className="group bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-gold/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream/20">
                  <Image
                    src="/images/director-aarna.jpg"
                    alt="Ms. Aarna Singh Rawat"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white/95 text-xs md:text-sm font-sans italic leading-relaxed">
                      "Pioneering active, skill-focused learning ecosystems to foster innovation and self-reliance."
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif font-bold text-navy text-lg group-hover:text-gold transition-colors duration-300">Ms. Aarna Singh Rawat</h4>
                  <p className="text-xs text-gold font-sans font-bold mt-1 uppercase tracking-wider">Director of CCGS &amp; Founder of Skillizee</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-cream-line/50 bg-cream/5 flex items-center justify-between">
                <span className="text-xs text-ink-muted font-sans font-semibold">Alumna of:</span>
                <div className="flex gap-4 items-center">
                  <img src="/images/kellogg.png" alt="Kellogg Logo" className="h-6 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" title="Kellogg" />
                  <img src="/images/isb-logo.png" alt="ISB Logo" className="h-6 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" title="ISB" />
                </div>
              </div>
            </AnimatedSection>

            {/* Mrs. Priyanshi Card */}
            <AnimatedSection animation="scale-in" delayClass="stagger-3" className="group bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-gold/30 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream/20">
                  <Image
                    src="/images/director-priyanshi.jpg"
                    alt="Mrs. Priyanshi Rawat"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white/95 text-xs md:text-sm font-sans italic leading-relaxed">
                      "Strategizing financial discipline, operations, and growth metrics to maintain quality standards."
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-serif font-bold text-navy text-lg group-hover:text-gold transition-colors duration-300">Mrs. Priyanshi Rawat</h4>
                  <p className="text-xs text-gold font-sans font-bold mt-1 uppercase tracking-wider">Director of CCGS &amp; CEO of Playbox School</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-cream-line/50 bg-cream/5 flex items-center justify-between">
                <span className="text-xs text-ink-muted font-sans font-semibold">Alumna of:</span>
                <div className="flex gap-4 items-center">
                  <img src="/images/CA.png" alt="CA India Logo" className="h-6 object-contain grayscale opacity-90 transition-all duration-300" title="Chartered Accountant" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 8. Latest News & Events */}
      <section className="py-20 bg-cream/10 border-y border-cream-line">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="text-gold font-mono font-bold uppercase tracking-wider text-sm">Updates &amp; Highlights</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">Latest News &amp; Events</h2>
            </div>
            <Link href="/news-events" className="mt-4 sm:mt-0">
              <Button variant="secondary" size="sm" className="rounded-sm">View All News</Button>
            </Link>
          </div>

          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col gap-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsList.map((item: any) => (
                <AnimatedSection key={item.id} animation="scale-in" className="bg-white border border-cream-line rounded-lg overflow-hidden shadow-card flex flex-col hover:shadow-card-hover transition-all duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.img || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-navy text-white text-xs px-2 py-1 uppercase font-semibold font-mono rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs text-ink-muted flex items-center gap-1.5 font-semibold font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <h3 className="font-serif font-bold text-navy text-lg line-clamp-2 hover:text-gold transition-colors">
                        <Link href="/news-events">{item.title}</Link>
                      </h3>
                      <p className="text-sm text-ink-muted line-clamp-3">{item.desc}</p>
                    </div>
                    <Link href="/news-events" className="text-gold-dark hover:text-gold font-sans font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mt-2">
                      Read Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 9. Notice Board Ticker */}
      <div className="bg-navy-dark text-white py-3 px-4 overflow-hidden border-b border-gold/30">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <span className="bg-gold text-navy text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 tracking-widest rounded-sm shrink-0 shadow-glow-gold">
            NOTICES
          </span>
          <div className="flex-1 relative overflow-hidden h-5">
            <p className="absolute whitespace-nowrap animate-ticker text-sm text-cream font-medium">
              ★ CBSE Board Registrations for Grade X &amp; XII start on August 1st, 2026. Submit documents by the deadline. | ★ Admissions Walkthrough slot bookings for CBSE &amp; IB pathways are active now. | ★ Annual Sports coaching registrations are open in portal.
            </p>
          </div>
        </div>
      </div>

      {/* 10. Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionHeading title="Testimonials" subtitle="What Our Community Says" />

          {/* Parent/Student Tabs */}
          <div className="flex justify-center gap-4 mt-8 mb-12">
            <button
              onClick={() => setActiveTestimonialTab("parent")}
              className={`px-8 py-3 rounded font-sans font-bold text-sm uppercase tracking-wider transition-all duration-300 border ${
                activeTestimonialTab === "parent"
                  ? "bg-navy text-white border-navy shadow-card"
                  : "bg-cream/40 text-navy/70 border-cream-line hover:border-gold hover:text-gold"
              }`}
            >
              Parent
            </button>
            <button
              onClick={() => setActiveTestimonialTab("student")}
              className={`px-8 py-3 rounded font-sans font-bold text-sm uppercase tracking-wider transition-all duration-300 border ${
                activeTestimonialTab === "student"
                  ? "bg-navy text-white border-navy shadow-card"
                  : "bg-cream/40 text-navy/70 border-cream-line hover:border-gold hover:text-gold"
              }`}
            >
              Student
            </button>
          </div>

          {/* Carousel Slider */}
          <div className="relative max-w-6xl mx-auto px-4 md:px-12">
            {/* Left Arrow */}
            <button
              onClick={() => scrollTestimonials("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy/5 hover:bg-gold text-navy hover:text-navy rounded-full flex items-center justify-center transition-all duration-300 z-10 border border-cream-line/50 hover:border-gold shadow-sm hidden md:flex"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div
              ref={testimonialsRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none py-4"
              style={{ scrollbarWidth: "none" }}
            >
              {(activeTestimonialTab === "parent" ? parentReviews : studentReviews).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setVideoUrl(`https://www.youtube.com/watch?v=${item.videoId}`);
                    setIsVideoModalOpen(true);
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-card border border-cream-line p-2 flex items-center justify-center shrink-0 snap-center cursor-pointer hover:border-gold hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300 w-[280px] md:w-[320px] h-[380px] md:h-[500px]"
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden group/item">
                    <img
                      src={`/images/${item.img}`}
                      alt={`CCIS Testimonial ${idx + 1}`}
                      className="w-full h-full object-contain rounded-xl"
                      loading="lazy"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover/item:bg-black/25 flex items-center justify-center transition-colors duration-300 rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-gold/90 text-navy flex items-center justify-center shadow-lg group-hover/item:scale-110 group-hover/item:bg-gold transition-all duration-300">
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollTestimonials("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy/5 hover:bg-gold text-navy hover:text-navy rounded-full flex items-center justify-center transition-all duration-300 z-10 border border-cream-line/50 hover:border-gold shadow-sm hidden md:flex"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 11. Achievements Showcase */}
      <section className="py-16 bg-cream/25 border-y border-cream-line">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <SectionHeading title="Recognized for Excellence" subtitle="Our Accolades" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            <div className="flex flex-col items-center gap-2 opacity-85 hover:opacity-100 transition-opacity">
              <div className="text-3xl font-bold font-serif text-navy">#1 Ranked</div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Co-Ed Day School in Jaipur</p>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-85 hover:opacity-100 transition-opacity">
              <div className="text-3xl font-bold font-serif text-navy">Top Academic</div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">CBSE Board Performance</p>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-85 hover:opacity-100 transition-opacity">
              <div className="text-3xl font-bold font-serif text-navy">Best-in-Class</div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">AI &amp; Coding Infrastructure</p>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-85 hover:opacity-100 transition-opacity">
              <div className="text-3xl font-bold font-serif text-navy">Global Edge</div>
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Certified IB PYP Curriculum</p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Call to Action */}
      <section className="py-20 bg-navy text-white text-center relative overflow-hidden border-b-4 border-gold">
        {/* Decorative Background Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

        <div className="relative max-w-3xl mx-auto px-4 flex flex-col items-center gap-6 z-10">
          <span className="text-gold font-mono font-bold uppercase tracking-wider text-xs bg-white/5 px-3 py-1 rounded-sm border border-gold/25">
            Admissions Walkthrough
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-extrabold leading-tight">
            Begin Your Child's Academic Journey Today
          </h2>
          <p className="text-cream-dark/80 max-w-xl mx-auto leading-relaxed">
            Schedule a personal walk-through of our Sector-3 Mansarovar campus, explore our labs, and meet our academic counseling heads.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/admissions">
              <Button variant="gold" size="lg" className="font-bold uppercase tracking-wider rounded-sm w-full sm:w-auto">
                Schedule Tour
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="lg" className="text-white hover:text-gold border border-white/20 hover:border-gold rounded-sm w-full sm:w-auto">
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
