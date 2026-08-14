"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { BarChart3, Plus, Trash2, Check, Sparkles } from "lucide-react";

export interface StatItem {
  id: string;
  end: number;
  suffix: string;
  label: string;
  order?: number;
}

interface StatsManagerProps {
  stats: StatItem[];
  onSaveStats: (stats: StatItem[]) => Promise<void>;
}

export default function StatsManager({ stats, onSaveStats }: StatsManagerProps) {
  const [items, setItems] = useState<StatItem[]>(stats);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdateItem = (index: number, field: keyof StatItem, value: any) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const handleAddItem = () => {
    const newItem: StatItem = {
      id: `stat_${Date.now()}`,
      end: 100,
      suffix: "+",
      label: "New Achievement Highlight",
      order: items.length + 1,
    };
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await onSaveStats(items);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif font-bold text-navy text-2xl">
            Homepage Key Stats &amp; Metrics
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Update institutional numbers, pass rates, and alumni counters shown across the public portal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddItem}
          className="px-3.5 py-2 bg-navy text-white hover:bg-navy-dark text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Metric
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((stat, idx) => (
            <div
              key={stat.id || idx}
              className="bg-white border border-cream-line p-5 rounded-2xl shadow-card flex flex-col gap-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-dark bg-cream px-2 py-0.5 rounded">
                  Counter #{idx + 1}
                </span>
                {items.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="Remove Counter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-navy">
                    Target Number *
                  </label>
                  <input
                    type="number"
                    required
                    value={stat.end}
                    onChange={(e) => handleUpdateItem(idx, "end", Number(e.target.value))}
                    className="p-2.5 border border-cream-line rounded-xl text-sm font-sans focus:border-gold outline-none font-bold text-navy"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-navy">
                    Suffix *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+ or %"
                    value={stat.suffix}
                    onChange={(e) => handleUpdateItem(idx, "suffix", e.target.value)}
                    className="p-2.5 border border-cream-line rounded-xl text-sm font-sans focus:border-gold outline-none text-center font-bold text-gold-dark"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-navy">
                  Metric Description Label *
                </label>
                <input
                  type="text"
                  required
                  value={stat.label}
                  onChange={(e) => handleUpdateItem(idx, "label", e.target.value)}
                  className="p-2.5 border border-cream-line rounded-xl text-xs font-sans focus:border-gold outline-none"
                  placeholder="e.g. Years of Excellence"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-cream-line rounded-2xl shadow-sm mt-2">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 font-mono">
              <Check className="w-4 h-4" /> Metrics Saved Successfully
            </span>
          ) : (
            <span className="text-[11px] text-ink-muted">
              Live counters update instantly on the homepage.
            </span>
          )}

          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={saving}
            className="rounded-xl font-bold uppercase tracking-wider text-xs"
          >
            Save All Metrics
          </Button>
        </div>
      </form>
    </div>
  );
}
