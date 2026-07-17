"use client";
import React, { useState, useEffect } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { Search, Mail, MapPin, Briefcase, GraduationCap } from "lucide-react";

export default function Alumni() {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  
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
        setToast({ message: "Registration successful! Check email for verification link.", type: "success" });
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
    const nameMatch = a.name?.toLowerCase().includes(searchLower) || false;
    const companyMatch = a.company?.toLowerCase().includes(searchLower) || false;
    const roleMatch = a.role?.toLowerCase().includes(searchLower) || false;
    const industryMatch = a.industry?.toLowerCase().includes(searchLower) || false;
    const matchSearch = nameMatch || companyMatch || roleMatch || industryMatch;

    const matchBatch = selectedBatch === "All" || String(a.batch) === selectedBatch;
    
    return matchSearch && matchBatch;
  });

  const uniqueBatches = Array.from(new Set(alumni.map((a) => String(a.batch)))).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="bg-white min-h-screen">
      {/* Banner */}
      <section className="relative bg-navy text-white py-20 overflow-hidden border-b-4 border-gold">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200')" }} />
        <div className="relative max-w-7xl mx-auto px-4 z-10 text-center flex flex-col gap-4">
          <span className="text-gold font-mono uppercase tracking-widest text-xs font-bold bg-white/5 px-3 py-1 rounded w-fit mx-auto">
            CCIS Alumni Association
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-extrabold leading-tight">
            Alumni Directory &amp; Hub
          </h1>
          <p className="text-cream-dark max-w-2xl mx-auto leading-relaxed text-sm md:text-base font-medium">
            Connect with our outstanding alumni network, search profiles, or register your profile to help current students.
          </p>
        </div>
      </section>

      {/* Directory & Register Split */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Directory Area */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <h3 className="font-serif font-bold text-2xl text-navy">Alumni Network Directory</h3>
            
            {/* Search Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-cream/20 p-4 border border-cream-line rounded-lg">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search by name, company, role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                />
              </div>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white sm:w-44"
              >
                <option value="All">All Batches</option>
                {uniqueBatches.map((b) => (
                  <option key={b} value={b}>Batch of {b}</option>
                ))}
              </select>
            </div>

            {/* List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex gap-4 p-4 border border-cream-line rounded-lg">
                    <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                    <div className="flex-1 flex flex-col gap-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAlumni.length === 0 ? (
              <div className="text-center py-16 bg-cream/10 border border-cream-line rounded-lg">
                <p className="font-serif font-bold text-navy text-base mb-1">No verified alumni profiles listed</p>
                <p className="text-xs text-ink-muted leading-relaxed">Try adjusting filters or submit your registration profile.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredAlumni.map((a) => (
                  <AnimatedSection
                    key={a.id}
                    animation="scale-in"
                    className="bg-cream/5 border border-cream-line p-5 rounded-lg shadow-card flex gap-4 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gold">
                      <img
                        src={a.avatar || a.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}
                        alt={a.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-serif font-bold text-navy text-base leading-snug">{a.name}</h4>
                      
                      <div className="flex items-center gap-1.5 text-xs text-gold-dark font-sans font-semibold uppercase tracking-wider">
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        Batch of {a.batch} • {a.program}
                      </div>

                      {a.role && (
                        <div className="flex items-center gap-1.5 text-xs text-ink-muted font-sans leading-snug mt-1">
                          <Briefcase className="w-3.5 h-3.5 shrink-0 text-navy" />
                          <span>{a.role} at <strong>{a.company}</strong></span>
                        </div>
                      )}

                      {a.city && (
                        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted/80 font-sans mt-0.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-gold-dark" />
                          <span>{a.city}</span>
                        </div>
                      )}

                      {a.bio && (
                        <p className="text-[11px] text-ink-muted leading-relaxed mt-2 italic line-clamp-2">
                          "{a.bio}"
                        </p>
                      )}

                      {a.linkedin && (
                        <a
                          href={a.linkedin.startsWith("http") ? a.linkedin : `https://${a.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 text-navy hover:text-gold flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest"
                        >
                          LinkedIn Profile <svg className="w-3.5 h-3.5 text-[#0A66C2] fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                      )}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>

          {/* Registration Form Area */}
          <div className="bg-cream/10 border border-cream-line p-6 rounded-lg shadow-card h-fit flex flex-col gap-6">
            <div>
              <h3 className="font-serif font-bold text-navy text-xl">Register Profile</h3>
              <p className="text-xs text-ink-muted leading-relaxed mt-1">
                Your profile will go live on the directory once verified by school coordinators.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="reg-name" className="text-[10px] font-bold text-navy uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  id="reg-name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="reg-email" className="text-[10px] font-bold text-navy uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="reg-batch" className="text-[10px] font-bold text-navy uppercase tracking-wider">Grad Batch *</label>
                  <input
                    type="number"
                    id="reg-batch"
                    name="batch"
                    placeholder="e.g. 2024"
                    required
                    value={formData.batch}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="reg-program" className="text-[10px] font-bold text-navy uppercase tracking-wider">Board Path *</label>
                  <select
                    id="reg-program"
                    name="program"
                    value={formData.program}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  >
                    <option value="CBSE">CBSE Board</option>
                    <option value="IB">IB Board</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="reg-company" className="text-[10px] font-bold text-navy uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    id="reg-company"
                    name="company"
                    placeholder="e.g. Google"
                    value={formData.company}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="reg-role" className="text-[10px] font-bold text-navy uppercase tracking-wider">Designation / Role</label>
                  <input
                    type="text"
                    id="reg-role"
                    name="role"
                    placeholder="e.g. Tech Lead"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="reg-skills" className="text-[10px] font-bold text-navy uppercase tracking-wider">Key Industry / Skills *</label>
                <input
                  type="text"
                  id="reg-skills"
                  name="skills"
                  placeholder="e.g. Software, Finance, Design"
                  required
                  value={formData.skills}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="reg-linkedin" className="text-[10px] font-bold text-navy uppercase tracking-wider">LinkedIn profile link</label>
                <input
                  type="text"
                  id="reg-linkedin"
                  name="linkedin"
                  placeholder="linkedin.com/in/username"
                  value={formData.linkedin}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="reg-phone" className="text-[10px] font-bold text-navy uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  id="reg-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="reg-bio" className="text-[10px] font-bold text-navy uppercase tracking-wider">Short Bio Quote</label>
                <textarea
                  id="reg-bio"
                  name="bio"
                  rows={2}
                  value={formData.bio}
                  onChange={handleFormChange}
                  className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white resize-none"
                />
              </div>

              <Button type="submit" isLoading={registering} variant="gold" className="w-full font-bold uppercase tracking-wider py-3 mt-2 rounded-sm text-xs">
                Register Profile
              </Button>
            </form>
          </div>
        </div>
      </section>

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
