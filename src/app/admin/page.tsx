"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import Skeleton from "@/components/ui/Skeleton";
import { Lock, LogOut, FileText, Plus, Trash2, Loader2, Inbox, Calendar, User, Phone, Mail, Award, CheckCircle } from "lucide-react";

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

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  message: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [submittingAuth, setSubmittingAuth] = useState(false);

  const [activeTab, setActiveTab] = useState<"news" | "notice" | "admissions">("news");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);

  // Form states
  const [newsForm, setNewsForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    category: "Academic",
    img: "",
    desc: "",
    featured: false,
    attachmentUrl: "",
  });

  const [submittingItem, setSubmittingItem] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

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
        fetchData(pass);
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

  const fetchData = async (pass: string) => {
    // Fetch News & Notices
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data && data.news) {
        setItems(data.news);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNews(false);
    }

    // Fetch Admissions
    try {
      const res = await fetch(`/api/admin/admissions?passcode=${pass}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setEnquiries(data);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  const handleCreateItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.desc || !newsForm.date) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setSubmittingItem(true);
    const pass = localStorage.getItem("ccis_admin_passcode") || "";
    
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newsForm,
          type: activeTab === "notice" ? "notice" : "news",
          attachmentType: activeTab === "notice" ? "pdf" : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: "Created successfully!", type: "success" });
        setNewsForm({
          title: "",
          date: new Date().toISOString().split("T")[0],
          category: "Academic",
          img: "",
          desc: "",
          featured: false,
          attachmentUrl: "",
        });
        fetchData(pass);
      } else {
        setToast({ message: data.error || "Failed to create item.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Something went wrong.", type: "error" });
    } finally {
      setSubmittingItem(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const pass = localStorage.getItem("ccis_admin_passcode") || "";

    try {
      const res = await fetch(`/api/news?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: "Deleted successfully!", type: "success" });
        fetchData(pass);
      } else {
        setToast({ message: data.error || "Failed to delete.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Something went wrong.", type: "error" });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream/10">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
        <p className="text-xs text-ink-muted mt-2 font-semibold uppercase tracking-wider">Verifying secure credentials...</p>
      </div>
    );
  }

  // Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-cream/10 px-4">
        <div className="bg-white border border-cream-line p-8 md:p-12 rounded-lg shadow-card w-full max-w-md flex flex-col gap-6">
          <div className="text-center flex flex-col items-center gap-3">
            <div className="p-3 bg-navy text-gold rounded-full w-fit shadow-glow-navy">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-navy">CCIS Administration Portal</h2>
            <p className="text-xs text-ink-muted leading-relaxed">Enter secure passcode to access updates and enquiries.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="passcode" className="text-[10px] font-bold text-navy uppercase tracking-wider">Admin Passcode</label>
              <input
                type="password"
                id="passcode"
                placeholder="••••••••••••"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="p-3 border border-cream-line rounded font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white text-center tracking-widest font-bold"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-500 font-semibold text-center mt-1">
                {authError}
              </p>
            )}

            <Button type="submit" isLoading={submittingAuth} variant="primary" className="uppercase font-bold tracking-wider py-3.5 mt-2 rounded-sm text-xs">
              Verify Credentials
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="bg-white min-h-screen">
      {/* Top bar with stats */}
      <section className="bg-navy-dark text-white py-6 border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-serif font-bold text-navy text-lg border-2 border-gold shadow-glow-gold">
              CC
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg leading-tight">CCIS School Portal</h2>
              <p className="text-[10px] text-cream-dark uppercase tracking-widest font-semibold">Secure Administrator Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-white/20 hover:border-gold hover:text-gold px-4 py-2 rounded transition-colors"
          >
            Logout <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Tabs list */}
      <section className="bg-cream/10 border-b border-cream-line py-4">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === "news" ? "border-gold text-navy" : "border-transparent text-ink-muted hover:text-navy"}`}
          >
            News Management
          </button>
          <button
            onClick={() => setActiveTab("notice")}
            className={`px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === "notice" ? "border-gold text-navy" : "border-transparent text-ink-muted hover:text-navy"}`}
          >
            Notices &amp; Circulars
          </button>
          <button
            onClick={() => setActiveTab("admissions")}
            className={`px-4 py-2 font-sans font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${activeTab === "admissions" ? "border-gold text-navy" : "border-transparent text-ink-muted hover:text-navy"}`}
          >
            Admission Enquiries ({enquiries.length})
          </button>
        </div>
      </section>

      {/* Panel Body */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {activeTab === "admissions" ? (
            /* Enquiries List */
            <div className="flex flex-col gap-6">
              <h3 className="font-serif font-bold text-navy text-xl">Parent Admissions Requests</h3>
              {loadingEnquiries ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : enquiries.length === 0 ? (
                <div className="text-center py-12 bg-cream/10 border border-cream-line rounded-lg">
                  <Inbox className="w-12 h-12 text-cream-line mx-auto mb-4" />
                  <p className="font-serif font-bold text-navy text-base">No enquiries received yet</p>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">Admission requests will populate here as parents submit them.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-cream-line rounded-lg shadow-card">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-cream/40 border-b border-cream-line text-navy font-bold">
                        <th className="p-4">Date</th>
                        <th className="p-4">Parent Name</th>
                        <th className="p-4">Contact Info</th>
                        <th className="p-4">Grade</th>
                        <th className="p-4">Comments</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-line/50">
                      {enquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-cream/10 transition-colors">
                          <td className="p-4 font-semibold text-xs text-ink-muted shrink-0">
                            {new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 font-serif font-bold text-navy">{e.name}</td>
                          <td className="p-4 flex flex-col gap-0.5">
                            <a href={`mailto:${e.email}`} className="text-navy hover:underline flex items-center gap-1.5 text-xs"><Mail className="w-3.5 h-3.5 text-gold-dark" />{e.email}</a>
                            <a href={`tel:${e.phone}`} className="text-navy hover:underline flex items-center gap-1.5 text-xs"><Phone className="w-3.5 h-3.5 text-gold-dark" />{e.phone}</a>
                          </td>
                          <td className="p-4 font-bold"><span className="px-2 py-0.5 bg-gold/10 text-gold-dark rounded text-xs">{e.grade}</span></td>
                          <td className="p-4 text-xs text-ink-muted max-w-xs truncate" title={e.message}>{e.message || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* News & Notice CRUD Area */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Creation Form */}
              <div className="bg-cream/15 border border-cream-line p-6 rounded-lg shadow-card h-fit flex flex-col gap-6">
                <h3 className="font-serif font-bold text-navy text-xl">Create {activeTab === "news" ? "News Item" : "Notice Circular"}</h3>
                
                <form onSubmit={handleCreateItemSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="item-title" className="text-[10px] font-bold text-navy uppercase tracking-wider">Item Title *</label>
                    <input
                      type="text"
                      id="item-title"
                      required
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="item-date" className="text-[10px] font-bold text-navy uppercase tracking-wider">Publish Date *</label>
                      <input
                        type="date"
                        id="item-date"
                        required
                        value={newsForm.date}
                        onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                        className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="item-category" className="text-[10px] font-bold text-navy uppercase tracking-wider">Category *</label>
                      <select
                        id="item-category"
                        value={newsForm.category}
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                        className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Sports">Sports</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Administrative">Administrative</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  {activeTab === "news" ? (
                    <div className="flex flex-col gap-1">
                      <label htmlFor="item-img" className="text-[10px] font-bold text-navy uppercase tracking-wider">Cover Image URL</label>
                      <input
                        type="text"
                        id="item-img"
                        placeholder="https://example.com/image.jpg"
                        value={newsForm.img}
                        onChange={(e) => setNewsForm({ ...newsForm, img: e.target.value })}
                        className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <label htmlFor="item-attachment" className="text-[10px] font-bold text-navy uppercase tracking-wider">Circular PDF Attachment URL</label>
                      <input
                        type="text"
                        id="item-attachment"
                        placeholder="https://example.com/circular.pdf"
                        value={newsForm.attachmentUrl}
                        onChange={(e) => setNewsForm({ ...newsForm, attachmentUrl: e.target.value })}
                        className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label htmlFor="item-desc" className="text-[10px] font-bold text-navy uppercase tracking-wider">Description *</label>
                    <textarea
                      id="item-desc"
                      required
                      rows={4}
                      value={newsForm.desc}
                      onChange={(e) => setNewsForm({ ...newsForm, desc: e.target.value })}
                      className="p-2.5 border border-cream-line rounded font-sans text-xs focus:outline-none focus:ring-1 focus:ring-gold bg-white resize-none"
                    />
                  </div>

                  {activeTab === "news" && (
                    <div className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        id="item-featured"
                        checked={newsForm.featured}
                        onChange={(e) => setNewsForm({ ...newsForm, featured: e.target.checked })}
                        className="w-4 h-4 border border-cream-line rounded focus:ring-gold accent-gold"
                      />
                      <label htmlFor="item-featured" className="text-xs text-navy font-bold cursor-pointer">Featured news (Show at top)</label>
                    </div>
                  )}

                  <Button type="submit" isLoading={submittingItem} variant="gold" className="w-full font-bold uppercase tracking-wider py-3 mt-2 rounded-sm text-xs">
                    Create Item
                  </Button>
                </form>
              </div>

              {/* Items List */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <h3 className="font-serif font-bold text-navy text-xl">Existing CCIS {activeTab === "news" ? "News Items" : "Notice circulars"}</h3>
                
                {loadingNews ? (
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : items.filter((item) => item.type === activeTab).length === 0 ? (
                  <div className="text-center py-12 bg-cream/10 border border-cream-line rounded-lg">
                    <p className="font-serif font-bold text-navy text-base">No items published</p>
                    <p className="text-xs text-ink-muted mt-1">Publish an item using the form on the left.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {items.filter((item) => item.type === activeTab).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border border-cream-line rounded-lg shadow-card hover:bg-cream/5 transition-colors gap-6">
                        <div className="flex gap-4 items-center">
                          {activeTab === "news" && item.img && (
                            <img
                              src={item.img}
                              alt=""
                              className="w-12 h-12 rounded object-cover shrink-0 border border-cream-line"
                            />
                          )}
                          <div>
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gold-dark flex items-center gap-1.5">
                              {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              <span>•</span>
                              {item.category}
                              {item.featured && (
                                <span className="px-1.5 py-0.5 bg-gold text-white rounded text-[8px] font-bold font-sans">FEATURED</span>
                              )}
                            </span>
                            <h4 className="font-serif font-bold text-navy text-sm leading-snug mt-1">{item.title}</h4>
                            <p className="text-xs text-ink-muted leading-relaxed line-clamp-1 mt-0.5">{item.desc}</p>
                          </div>
                        </div>

                        {/* Prevent deleting defaults */}
                        {item.id.startsWith("ccis_default") ? (
                          <span className="text-[10px] text-ink-muted uppercase font-bold italic shrink-0">System Default</span>
                        ) : (
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-ink-muted hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors shrink-0"
                            aria-label="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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
