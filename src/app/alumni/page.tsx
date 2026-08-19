"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { Search, Mail, MapPin, Briefcase, GraduationCap, X, Award, CheckCircle, Sparkles } from "lucide-react";

export default function Alumni() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [onlyMentors, setOnlyMentors] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Registration Form State
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    batch: "",
    program: "CBSE",
    company: "",
    role: "",
    skills: "",
    linkedin: "",
    phone: "",
    city: "Jaipur",
    bio: "",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Toggle body scroll lock when modal open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  useEffect(() => {
    async function fetchAlumni() {
      try {
        const res = await fetch("/api/alumni");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAlumni(data);
        }
      } catch (err) {
        console.error("Failed to fetch alumni:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlumni();
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.batch || !formData.skills) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setRegistering(true);
    try {
      const res = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: "Registration submitted! Check your email for verification.", type: "success" });
        setIsModalOpen(false);
        setFormData({
          name: "",
          email: "",
          batch: "",
          program: "CBSE",
          company: "",
          role: "",
          skills: "",
          linkedin: "",
          phone: "",
          city: "Jaipur",
          bio: "",
        });
      } else {
        setToast({ message: data.error || "Failed to register profile.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setRegistering(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredAlumni = alumni.filter((a) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (a.user?.name || a.name || "").toLowerCase().includes(searchLower);
    const companyMatch = (a.company || "").toLowerCase().includes(searchLower);
    const roleMatch = (a.role || "").toLowerCase().includes(searchLower);
    const industryMatch = (a.industry || "").toLowerCase().includes(searchLower);
    const skillsMatch = (a.skills || "").toLowerCase().includes(searchLower);
    const matchSearch = nameMatch || companyMatch || roleMatch || industryMatch || skillsMatch;

    const matchBatch = selectedBatch === "All" || String(a.batch) === selectedBatch;
    const matchMentor = !onlyMentors || !!a.isMentor;

    return matchSearch && matchBatch && matchMentor;
  });

  const uniqueBatches = Array.from(new Set(alumni.map((a) => String(a.batch)))).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="bg-white min-h-screen">
      {/* ━━━ Hero Banner ━━━ */}
      <section className="relative bg-navy text-white py-24 md:py-32 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0">
          <Image
            src="/images/alumni_hero.png"
            alt="CCIS Alumni Global Graduates"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            quality={95}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/65 via-navy/50 to-navy-dark/75 backdrop-blur-[0.5px]" />

        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col items-center gap-5">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-navy/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold/40 flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> 13,500+ Global Graduates
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold leading-tight drop-shadow-lg">
            CCIS Alumni Network &amp; Mentorship Hub
          </h1>
          <p className="text-white/90 max-w-2xl text-sm md:text-base leading-relaxed drop-shadow">
            Connect with our global network of leaders, scholars, and entrepreneurs. Search verified profiles or register to mentor current students.
          </p>
          <div className="mt-2 flex flex-wrap gap-3 justify-center">
            <Button
              variant="gold"
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="font-bold uppercase tracking-wider rounded-xl text-xs py-3 px-8 shadow-glow-gold transition-transform hover:scale-105"
            >
              Register Alumni Profile
            </Button>
          </div>
        </div>
      </section>

      {/* ━━━ Directory Section ━━━ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-cream-line pb-6">
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-gold-dark">
                Verified Directory
              </span>
              <h3 className="font-serif font-bold text-3xl text-navy">
                Alumni Network Directory ({filteredAlumni.length})
              </h3>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Mentor Toggle */}
              <button
                onClick={() => setOnlyMentors(!onlyMentors)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                  onlyMentors
                    ? "bg-gold text-navy border-gold shadow-sm font-extrabold"
                    : "bg-white text-ink-muted border-cream-line hover:border-gold hover:text-navy"
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Mentors Only
              </button>

              {/* Batch Select */}
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="p-2 border border-cream-line rounded-xl font-sans text-xs focus:border-gold outline-none bg-white font-semibold"
              >
                <option value="All">All Batches</option>
                {uniqueBatches.map((b) => (
                  <option key={b} value={b}>Batch of {b}</option>
                ))}
              </select>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search name, company, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-cream-line rounded-xl font-sans text-xs focus:border-gold outline-none bg-cream/10"
                />
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex flex-col gap-4 p-5 border border-cream-line rounded-2xl items-center text-center bg-cream/5">
                  <Skeleton className="w-20 h-20 rounded-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : filteredAlumni.length === 0 ? (
            <div className="text-center py-20 bg-cream/10 border border-cream-line rounded-2xl">
              <p className="font-serif font-bold text-navy text-lg mb-1">No alumni profiles matched</p>
              <p className="text-xs text-ink-muted leading-relaxed">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((a) => {
                const name = a.user?.name || a.name || "Alumni Graduate";
                const avatar =
                  a.avatar ||
                  a.avatarUrl ||
                  a.user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120";

                return (
                  <AnimatedSection
                    key={a.id}
                    animation="scale-in"
                    className="group bg-white border border-cream-line p-6 rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between items-center text-center"
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gold shadow-md">
                        <img
                          src={avatar}
                          alt={name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {a.isMentor && (
                          <div
                            className="absolute bottom-0 right-0 p-1 bg-gold text-navy rounded-full shadow-md"
                            title="Alumni Mentor"
                          >
                            <Award className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <h4 className="font-serif font-bold text-navy text-base mt-4 leading-snug truncate w-full" title={name}>
                        {name}
                      </h4>

                      <div className="flex items-center justify-center gap-1 text-[10px] text-gold-dark font-sans font-bold uppercase tracking-wider mt-1 w-full">
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        Batch of {a.batch} &bull; {a.program || "CBSE"}
                      </div>

                      {a.role && (
                        <div className="text-xs text-ink-muted font-sans leading-snug mt-2.5 text-center w-full line-clamp-2 px-1 border-t border-cream-line/40 pt-2">
                          <span>{a.role} <strong className="text-navy font-semibold">at {a.company || "Self"}</strong></span>
                        </div>
                      )}

                      {a.skills && (
                        <div className="flex flex-wrap gap-1 justify-center mt-2">
                          {a.skills.split(",").slice(0, 2).map((s: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[9px] font-sans font-semibold bg-cream/60 px-2 py-0.5 rounded text-ink-muted"
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {a.bio && (
                        <p className="text-[11px] text-ink-muted leading-relaxed mt-3 italic line-clamp-2 border-t border-cream-line/40 pt-2.5 w-full px-1">
                          &ldquo;{a.bio}&rdquo;
                        </p>
                      )}
                    </div>

                    {a.linkedin && (
                      <a
                        href={a.linkedin.startsWith("http") ? a.linkedin : `https://${a.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full py-2 border border-cream-line hover:border-gold rounded-xl text-navy hover:text-gold flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-widest bg-cream/15 shadow-sm transition-all duration-300"
                      >
                        <svg className="w-3.5 h-3.5 text-[#0A66C2] fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        LinkedIn Profile
                      </a>
                    )}
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ━━━ Registration Modal ━━━ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-cream-line rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-ink-muted hover:text-navy p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="font-serif font-bold text-navy text-2xl">
                Register Alumni Profile
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed mt-1">
                Your profile will be verified by our alumni relations coordinator and published to the global directory.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3.5 mt-5">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Mehra"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@alumni.com"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Graduation Batch *</label>
                  <input
                    type="number"
                    placeholder="e.g. 2023"
                    required
                    name="batch"
                    value={formData.batch}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Curriculum Stream *</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-white font-semibold"
                  >
                    <option value="CBSE">CBSE Board</option>
                    <option value="IB">IB Board</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Company / University</label>
                  <input
                    type="text"
                    placeholder="e.g. Microsoft / IIT"
                    name="company"
                    value={formData.company}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Industry &amp; Skills *</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence, Cloud, Product Management"
                  required
                  name="skills"
                  value={formData.skills}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider">LinkedIn URL</label>
                  <input
                    type="text"
                    placeholder="linkedin.com/in/..."
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Brief Message to Current Students</label>
                <textarea
                  rows={2}
                  name="bio"
                  placeholder="Any advice or guidance for CCIS juniors..."
                  value={formData.bio}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none resize-none"
                />
              </div>

              <Button
                type="submit"
                isLoading={registering}
                variant="gold"
                size="md"
                className="w-full font-bold uppercase tracking-wider rounded-xl text-xs mt-2 shadow-glow-gold"
              >
                Submit Registration
              </Button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
