"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import Skeleton from "@/components/ui/Skeleton";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import OverviewDashboard from "@/components/admin/OverviewDashboard";
import AdmissionsPipeline from "@/components/admin/AdmissionsPipeline";
import FacultyManager, { FacultyMember } from "@/components/admin/FacultyManager";
import AlumniManager, { AlumniProfile } from "@/components/admin/AlumniManager";
import AnnouncementManager, { AnnouncementSettings } from "@/components/admin/AnnouncementManager";
import StatsManager, { StatItem } from "@/components/admin/StatsManager";
import ContactMessagesManager, { ContactMessage } from "@/components/admin/ContactMessagesManager";
import { Lock, Loader2, Plus, Trash2, Video, FileText, Calendar, Bell } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  img: string;
  desc: string;
  featured: boolean;
  type: "news" | "notice";
  attachmentUrl?: string | null;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [submittingAuth, setSubmittingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Data states
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [announcement, setAnnouncement] = useState<AnnouncementSettings>({
    active: true,
    message: "CBSE & IB Admissions Open for Academic Session 2026-27. Book a campus tour today.",
    linkText: "Apply Now",
    linkUrl: "/admissions",
    type: "admissions",
  });
  const [stats, setStats] = useState<StatItem[]>([
    { id: "stat_1", end: 25, suffix: "+", label: "Years of Excellence" },
    { id: "stat_2", end: 13500, suffix: "+", label: "Alumni Network" },
    { id: "stat_3", end: 8, suffix: "+", label: "Group Institutions" },
    { id: "stat_4", end: 100, suffix: "%", label: "Board Pass Rate" },
  ]);
  const [testimonials, setTestimonials] = useState<{ parent: any[]; student: any[] }>({ parent: [], student: [] });

  // Loaders
  const [loadingData, setLoadingData] = useState(true);

  // Forms
  const [newsForm, setNewsForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    category: "Academic",
    img: "",
    desc: "",
    featured: false,
    attachmentUrl: "",
    type: "news" as "news" | "notice",
  });
  const [submittingNews, setSubmittingNews] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ type: "student", videoId: "", img: "" });
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);

  useEffect(() => {
    const savedPass = localStorage.getItem("ccis_admin_passcode");
    if (savedPass) {
      verifyPasscode(savedPass, true);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  const verifyPasscode = async (pass: string, isAuto = false) => {
    if (!isAuto) setSubmittingAuth(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: pass }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("ccis_admin_passcode", pass);
        fetchAllData(pass);
      } else {
        if (!isAuto) setAuthError("Incorrect passcode. Access Denied.");
        localStorage.removeItem("ccis_admin_passcode");
      }
    } catch (err) {
      console.error(err);
      if (!isAuto) setAuthError("Server connection error.");
    } finally {
      setSubmittingAuth(false);
      setCheckingAuth(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    verifyPasscode(passcode);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("ccis_admin_passcode");
    setPasscode("");
  };

  const fetchAllData = async (pass: string) => {
    setLoadingData(true);
    try {
      // 1. News & Circulars
      fetch("/api/news")
        .then((res) => res.json())
        .then((data) => {
          if (data?.news) setNewsItems(data.news);
        })
        .catch(console.error);

      // 2. Admissions
      fetch(`/api/admin/admissions?passcode=${pass}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setEnquiries(data);
        })
        .catch(console.error);

      // 3. Faculty
      fetch("/api/admin/faculty")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setFaculty(data);
        })
        .catch(console.error);

      // 4. Alumni
      fetch(`/api/admin/alumni-manage?passcode=${pass}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setAlumni(data);
        })
        .catch(console.error);

      // 5. Global Announcement
      fetch("/api/admin/announcement")
        .then((res) => res.json())
        .then((data) => {
          if (data) setAnnouncement(data);
        })
        .catch(console.error);

      // 6. Stats
      fetch("/api/admin/stats")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setStats(data);
        })
        .catch(console.error);

      // 7. Contact Messages
      fetch(`/api/admin/contact-messages?passcode=${pass}`)
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setContactMessages(data);
        })
        .catch(console.error);

      // 8. Testimonials
      fetch("/api/admin/testimonials")
        .then((res) => (res.ok ? res.json() : { parent: [], student: [] }))
        .then((data) => {
          if (data) setTestimonials(data);
        })
        .catch(console.error);
    } finally {
      setLoadingData(false);
    }
  };

  const getPasscode = () => localStorage.getItem("ccis_admin_passcode") || "";

  // Handlers for Admissions
  const handleUpdateAdmissionStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: getPasscode(), id, status }),
      });
      if (res.ok) {
        setToast({ message: `Status updated to ${status}`, type: "success" });
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
      }
    } catch {
      setToast({ message: "Failed to update status", type: "error" });
    }
  };

  const handleAddAdmissionNote = async (id: string, note: string) => {
    try {
      const res = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: getPasscode(), id, note }),
      });
      if (res.ok) {
        setToast({ message: "Staff note saved!", type: "success" });
        fetchAllData(getPasscode());
      }
    } catch {
      setToast({ message: "Failed to save note", type: "error" });
    }
  };

  const handleDeleteAdmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry lead?")) return;
    try {
      const res = await fetch(`/api/admin/admissions?id=${id}&passcode=${getPasscode()}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToast({ message: "Enquiry deleted", type: "success" });
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
      }
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  // Handlers for Faculty
  const handleSaveFaculty = async (data: Partial<FacultyMember>) => {
    const isEdit = !!data.id;
    try {
      const res = await fetch("/api/admin/faculty", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: getPasscode(), ...data }),
      });
      if (res.ok) {
        setToast({ message: isEdit ? "Faculty updated!" : "Faculty added!", type: "success" });
        fetchAllData(getPasscode());
      }
    } catch {
      setToast({ message: "Failed to save faculty member", type: "error" });
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!confirm("Are you sure you want to delete this faculty member?")) return;
    try {
      const res = await fetch(`/api/admin/faculty?id=${id}&passcode=${getPasscode()}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToast({ message: "Faculty member deleted", type: "success" });
        setFaculty((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  // Handlers for Alumni
  const handleUpdateAlumni = async (id: string, updates: Partial<AlumniProfile>) => {
    try {
      const res = await fetch("/api/admin/alumni-manage", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: getPasscode(), id, ...updates }),
      });
      if (res.ok) {
        setToast({ message: "Alumni profile updated!", type: "success" });
        fetchAllData(getPasscode());
      }
    } catch {
      setToast({ message: "Failed to update alumni profile", type: "error" });
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni profile?")) return;
    try {
      const res = await fetch(`/api/admin/alumni-manage?id=${id}&passcode=${getPasscode()}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToast({ message: "Alumni profile deleted", type: "success" });
        setAlumni((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  // Handlers for Announcement & Stats
  const handleSaveAnnouncement = async (data: AnnouncementSettings) => {
    try {
      const res = await fetch("/api/admin/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: getPasscode(), ...data }),
      });
      if (res.ok) {
        setToast({ message: "Global Notice Ticker settings updated!", type: "success" });
        setAnnouncement(data);
      }
    } catch {
      setToast({ message: "Failed to update announcement", type: "error" });
    }
  };

  const handleSaveStats = async (newStats: StatItem[]) => {
    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: getPasscode(), stats: newStats }),
      });
      if (res.ok) {
        setToast({ message: "Homepage stats updated!", type: "success" });
        setStats(newStats);
      }
    } catch {
      setToast({ message: "Failed to update stats", type: "error" });
    }
  };

  // Handlers for Contact Messages
  const handleUpdateContactStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/contact-messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: getPasscode(), id, status }),
      });
      if (res.ok) {
        setToast({ message: "Message status updated", type: "success" });
        setContactMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: status as any } : m))
        );
      }
    } catch {
      setToast({ message: "Failed to update message", type: "error" });
    }
  };

  const handleDeleteContactMessage = async (id: string) => {
    if (!confirm("Delete this contact message?")) return;
    try {
      const res = await fetch(`/api/admin/contact-messages?id=${id}&passcode=${getPasscode()}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToast({ message: "Message deleted", type: "success" });
        setContactMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  // Handlers for News CRUD
  const handleCreateNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.desc || !newsForm.date) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setSubmittingNews(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newsForm,
          attachmentType: newsForm.type === "notice" ? "pdf" : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: "Published successfully!", type: "success" });
        setNewsForm({
          title: "",
          date: new Date().toISOString().split("T")[0],
          category: "Academic",
          img: "",
          desc: "",
          featured: false,
          attachmentUrl: "",
          type: "news",
        });
        fetchAllData(getPasscode());
      } else {
        setToast({ message: data.error || "Failed to publish.", type: "error" });
      }
    } catch {
      setToast({ message: "Something went wrong.", type: "error" });
    } finally {
      setSubmittingNews(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setToast({ message: "Deleted successfully!", type: "success" });
        setNewsItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      setToast({ message: "Failed to delete item", type: "error" });
    }
  };

  // Handlers for Testimonials
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.videoId) {
      setToast({ message: "YouTube Video ID is required.", type: "error" });
      return;
    }

    setSubmittingTestimonial(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialForm),
      });
      if (res.ok) {
        setToast({ message: "Testimonial added successfully!", type: "success" });
        setTestimonialForm({ type: "student", videoId: "", img: "" });
        fetchAllData(getPasscode());
      }
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setToast({ message: "Testimonial deleted!", type: "success" });
        fetchAllData(getPasscode());
      }
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream/10">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
        <p className="text-xs text-ink-muted mt-2 font-semibold uppercase tracking-wider">
          Verifying administrator credentials...
        </p>
      </div>
    );
  }

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-cream/10 px-4">
        <div className="bg-white border border-cream-line p-8 md:p-12 rounded-2xl shadow-card w-full max-w-md flex flex-col gap-6 animate-fadeIn">
          <div className="text-center flex flex-col items-center gap-3">
            <div className="p-3.5 bg-navy text-gold rounded-2xl shadow-glow-navy">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-navy">
              CCIS Administration Hub
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              Enter authorized administrative passcode to access admissions, faculty, and site controls.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="passcode"
                className="text-[10px] font-bold text-navy uppercase tracking-wider text-center"
              >
                Passcode Credentials
              </label>
              <input
                type="password"
                id="passcode"
                placeholder="••••••••••••"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="p-3 border border-cream-line rounded-xl font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white text-center tracking-widest font-bold"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-500 font-semibold text-center mt-1">
                {authError}
              </p>
            )}

            <Button
              type="submit"
              isLoading={submittingAuth}
              variant="gold"
              className="uppercase font-bold tracking-wider py-3.5 mt-2 rounded-xl text-xs shadow-glow-gold"
            >
              Verify &amp; Enter Dashboard
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Unread counts for sidebar
  const newAdmissionsCount = enquiries.filter((e) => (e.status || "New") === "New").length;
  const pendingAlumniCount = alumni.filter((a) => !a.isVerified).length;
  const unreadMessagesCount = contactMessages.filter((m) => m.status === "unread" || !m.status).length;

  return (
    <div className="min-h-screen bg-cream/10 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        counts={{
          newAdmissions: newAdmissionsCount,
          pendingAlumni: pendingAlumniCount,
          unreadMessages: unreadMessagesCount,
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && (
            <OverviewDashboard
              onNavigate={setActiveTab}
              stats={{
                totalEnquiries: enquiries.length,
                newEnquiries: newAdmissionsCount,
                totalFaculty: faculty.length,
                pendingAlumni: pendingAlumniCount,
                totalNews: newsItems.length,
                unreadMessages: unreadMessagesCount,
                tickerActive: announcement.active,
              }}
              recentEnquiries={enquiries}
              recentNews={newsItems}
            />
          )}

          {activeTab === "admissions" && (
            <AdmissionsPipeline
              enquiries={enquiries}
              loading={loadingData}
              onUpdateStatus={handleUpdateAdmissionStatus}
              onAddNote={handleAddAdmissionNote}
              onDeleteEnquiry={handleDeleteAdmission}
            />
          )}

          {activeTab === "faculty" && (
            <FacultyManager
              facultyList={faculty}
              loading={loadingData}
              onSaveFaculty={handleSaveFaculty}
              onDeleteFaculty={handleDeleteFaculty}
            />
          )}

          {activeTab === "alumni" && (
            <AlumniManager
              alumniList={alumni}
              loading={loadingData}
              onUpdateAlumni={handleUpdateAlumni}
              onDeleteAlumni={handleDeleteAlumni}
            />
          )}

          {activeTab === "announcement" && (
            <AnnouncementManager
              announcement={announcement}
              onSaveAnnouncement={handleSaveAnnouncement}
            />
          )}

          {activeTab === "stats" && (
            <StatsManager stats={stats} onSaveStats={handleSaveStats} />
          )}

          {activeTab === "contact" && (
            <ContactMessagesManager
              messages={contactMessages}
              loading={loadingData}
              onUpdateStatus={handleUpdateContactStatus}
              onDeleteMessage={handleDeleteContactMessage}
            />
          )}

          {activeTab === "news" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              {/* Form */}
              <div className="bg-white border border-cream-line p-6 rounded-2xl shadow-card h-fit flex flex-col gap-4">
                <h3 className="font-serif font-bold text-navy text-xl">
                  Publish Circular or News
                </h3>

                <form onSubmit={handleCreateNewsSubmit} className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Type *</label>
                    <div className="flex bg-cream p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setNewsForm({ ...newsForm, type: "news" })}
                        className={`flex-1 py-1.5 text-center font-bold text-xs uppercase rounded-lg transition-all ${
                          newsForm.type === "news" ? "bg-navy text-white shadow-sm" : "text-ink-muted"
                        }`}
                      >
                        School News
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewsForm({ ...newsForm, type: "notice" })}
                        className={`flex-1 py-1.5 text-center font-bold text-xs uppercase rounded-lg transition-all ${
                          newsForm.type === "notice" ? "bg-navy text-white shadow-sm" : "text-ink-muted"
                        }`}
                      >
                        PDF Notice / Circular
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CBSE Term-1 Datesheet"
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Publish Date *</label>
                      <input
                        type="date"
                        required
                        value={newsForm.date}
                        onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                        className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Category *</label>
                      <select
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                        className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-white font-semibold"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Sports">Sports</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Administrative">Administrative</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  {newsForm.type === "news" ? (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Cover Image URL</label>
                      <input
                        type="text"
                        placeholder="https://... or /images/..."
                        value={newsForm.img}
                        onChange={(e) => setNewsForm({ ...newsForm, img: e.target.value })}
                        className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Circular PDF Attachment URL</label>
                      <input
                        type="text"
                        placeholder="https://example.com/circular.pdf"
                        value={newsForm.attachmentUrl}
                        onChange={(e) => setNewsForm({ ...newsForm, attachmentUrl: e.target.value })}
                        className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Description / Summary *</label>
                    <textarea
                      rows={3}
                      required
                      value={newsForm.desc}
                      onChange={(e) => setNewsForm({ ...newsForm, desc: e.target.value })}
                      className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="md"
                    isLoading={submittingNews}
                    className="w-full font-bold uppercase tracking-wider text-xs rounded-xl mt-2"
                  >
                    Publish Post
                  </Button>
                </form>
              </div>

              {/* Items List */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h3 className="font-serif font-bold text-navy text-xl">
                  Published Posts &amp; Circulars ({newsItems.length})
                </h3>

                <div className="flex flex-col gap-3">
                  {newsItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white border border-cream-line rounded-2xl shadow-card flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.type === "notice" ? (
                          <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        ) : (
                          <img
                            src={item.img || "/images/news_science.jpg"}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover border border-cream-line shrink-0"
                          />
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-mono text-gold-dark uppercase font-bold flex items-center gap-1">
                            {item.date} &bull; {item.category} &bull; {item.type.toUpperCase()}
                          </span>
                          <h4 className="font-serif font-bold text-navy text-sm truncate mt-0.5">
                            {item.title}
                          </h4>
                          <p className="text-xs text-ink-muted truncate">{item.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              <div className="bg-white border border-cream-line p-6 rounded-2xl shadow-card h-fit flex flex-col gap-4">
                <h3 className="font-serif font-bold text-navy text-xl">
                  Add Video Testimonial
                </h3>
                <form onSubmit={handleAddTestimonial} className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-1">
                      Audience Category
                    </label>
                    <select
                      value={testimonialForm.type}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, type: e.target.value })}
                      className="w-full border border-cream-line rounded-xl p-2.5 text-xs font-sans focus:border-gold outline-none bg-white font-semibold"
                    >
                      <option value="student">Student Review</option>
                      <option value="parent">Parent Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-1">
                      YouTube Video ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3adNiVmDkws"
                      value={testimonialForm.videoId}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, videoId: e.target.value })}
                      className="w-full border border-cream-line rounded-xl p-2.5 text-xs font-sans focus:border-gold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-1">
                      Thumbnail Image Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. parent1.png"
                      value={testimonialForm.img}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, img: e.target.value })}
                      className="w-full border border-cream-line rounded-xl p-2.5 text-xs font-sans focus:border-gold outline-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gold"
                    size="md"
                    isLoading={submittingTestimonial}
                    className="w-full font-bold uppercase tracking-wider text-xs rounded-xl mt-2"
                  >
                    Save Testimonial
                  </Button>
                </form>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-4">
                <h3 className="font-serif font-bold text-navy text-xl">
                  Active Video Testimonials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...testimonials.student, ...testimonials.parent].map((t: any) => (
                    <div
                      key={t.id || t.videoId}
                      className="p-4 bg-white border border-cream-line rounded-2xl shadow-card flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/20 text-navy rounded-xl flex items-center justify-center font-bold text-xs uppercase font-mono">
                          {t.type ? t.type[0] : "V"}
                        </div>
                        <div>
                          <p className="font-bold text-navy text-xs">Video ID: {t.videoId}</p>
                          <p className="text-[11px] text-ink-muted capitalize">
                            {t.type || "Review"} &bull; {t.img}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTestimonial(t.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

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
