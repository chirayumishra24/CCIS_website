"use client";
import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { Plus, Edit2, Trash2, GraduationCap, X, Sparkles, User } from "lucide-react";

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  qual: string;
  img: string;
  order?: number;
}

interface FacultyManagerProps {
  facultyList: FacultyMember[];
  loading: boolean;
  onSaveFaculty: (data: Partial<FacultyMember>) => Promise<void>;
  onDeleteFaculty: (id: string) => Promise<void>;
}

const deptOptions = ["Leadership", "IB PYP", "Primary", "Middle", "Senior", "Sports & Arts"];

export default function FacultyManager({
  facultyList,
  loading,
  onSaveFaculty,
  onDeleteFaculty,
}: FacultyManagerProps) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<FacultyMember>>({
    name: "",
    role: "",
    dept: "Senior",
    qual: "",
    img: "/images/faculty-placeholder.jpg",
    order: 10,
  });

  const filtered = selectedDept === "All"
    ? facultyList
    : facultyList.filter((f) => f.dept === selectedDept);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      role: "",
      dept: "Senior",
      qual: "",
      img: "/images/faculty-placeholder.jpg",
      order: facultyList.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FacultyMember) => {
    setEditingId(item.id);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.dept) return;

    setSaving(true);
    try {
      await onSaveFaculty({
        ...formData,
        id: editingId || undefined,
      });
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-navy text-2xl">
            Faculty &amp; Educator Management
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Add, update qualifications, and organize leadership and academic mentors.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleOpenAdd}
          className="rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add Faculty Member
        </Button>
      </div>

      {/* Department Filter Pills */}
      <div className="flex flex-wrap gap-2 border-b border-cream-line pb-3">
        {["All", ...deptOptions].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedDept === dept
                ? "bg-navy text-white border-navy shadow-card"
                : "bg-white text-ink-muted border-cream-line hover:border-gold hover:text-navy"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-4 bg-white border border-cream-line rounded-2xl flex flex-col gap-3">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-cream-line rounded-2xl">
          <p className="font-serif font-bold text-navy text-base">No faculty members found</p>
          <p className="text-xs text-ink-muted mt-1">Click &ldquo;Add Faculty Member&rdquo; to add one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-cream-line rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full bg-cream/20 overflow-hidden">
                <Image
                  src={item.img || "/images/faculty-placeholder.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="250px"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-navy/90 text-white rounded font-mono text-[9px] font-bold uppercase tracking-wider">
                  {item.dept}
                </span>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-gold text-navy rounded font-mono text-[9px] font-bold">
                  Order: #{item.order || 99}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-1 flex-1">
                <h4 className="font-serif font-bold text-navy text-base leading-snug">{item.name}</h4>
                <p className="text-xs text-gold-dark font-semibold uppercase tracking-wider">{item.role}</p>
                <p className="text-[11px] text-ink-muted italic mt-1 line-clamp-2 border-t border-cream-line/50 pt-1.5">
                  {item.qual}
                </p>
              </div>

              <div className="p-3 bg-cream/15 border-t border-cream-line flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="text-xs font-bold text-navy hover:text-gold uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => onDeleteFaculty(item.id)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-cream-line rounded-2xl p-6 sm:p-8 shadow-2xl max-w-lg w-full flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-cream-line">
              <h3 className="font-serif font-bold text-navy text-xl">
                {editingId ? "Edit Faculty Member" : "Add New Faculty Member"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-ink-muted hover:text-navy p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-navy uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Head of Mathematics"
                    value={formData.role || ""}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Department *</label>
                  <select
                    value={formData.dept || "Senior"}
                    onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none bg-white font-semibold"
                  >
                    {deptOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Qualifications &amp; Exp</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc (Maths), B.Ed, 12+ Yrs Exp"
                    value={formData.qual || ""}
                    onChange={(e) => setFormData({ ...formData, qual: e.target.value })}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-navy uppercase tracking-wider">Sort Order</label>
                  <input
                    type="number"
                    value={formData.order || 10}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-navy uppercase tracking-wider">Profile Photo URL</label>
                <input
                  type="text"
                  placeholder="/images/faculty-placeholder.jpg or https://..."
                  value={formData.img || ""}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-cream-line">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-ink-muted hover:text-navy uppercase tracking-wider"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  isLoading={saving}
                  className="rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  Save Educator Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
