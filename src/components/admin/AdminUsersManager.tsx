"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { KeyRound, Trash2, UserPlus } from "lucide-react";
import { fetchAdmins, addAdmin, removeAdmin, currentAdminUid } from "@/lib/firebaseDb";

interface AdminEntry {
  uid: string;
  email: string;
  addedBy: string;
}

interface AdminUsersManagerProps {
  onNotify: (message: string, type: "success" | "error") => void;
}

export default function AdminUsersManager({ onNotify }: AdminUsersManagerProps) {
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adding, setAdding] = useState(false);
  const myUid = currentAdminUid();

  const load = async () => {
    setLoading(true);
    try {
      setAdmins(await fetchAdmins());
    } catch {
      onNotify("Failed to load admins", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setAdding(true);
    try {
      await addAdmin(email.trim().toLowerCase(), password);
      onNotify(`${email.trim()} is now an admin`, "success");
      setEmail("");
      setPassword("");
      load();
    } catch (err: any) {
      const code = err?.code || "";
      const message =
        code === "auth/weak-password" ? "Password must be at least 6 characters."
        : code === "auth/invalid-email" ? "Please enter a valid email address."
        : err?.message || "Failed to add admin";
      onNotify(message, "error");
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (admin: AdminEntry) => {
    if (!confirm(`Remove admin access for ${admin.email || admin.uid}?`)) return;
    try {
      await removeAdmin(admin.uid);
      onNotify("Admin access removed", "success");
      setAdmins((prev) => prev.filter((a) => a.uid !== admin.uid));
    } catch (err: any) {
      onNotify(err?.message || "Failed to remove admin", "error");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn max-w-4xl">
      <div>
        <h2 className="font-serif font-bold text-navy text-2xl">Admin Access</h2>
        <p className="text-xs text-ink-muted mt-0.5">
          People listed here can sign in to this dashboard and see all admission leads and messages.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-white border border-cream-line rounded-2xl p-6 shadow-card flex flex-col gap-4"
      >
        <h3 className="font-bold text-navy text-sm flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-gold-dark" /> Add an admin
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-admin-email" className="text-[10px] font-bold text-navy uppercase tracking-wider">
              Email
            </label>
            <input
              id="new-admin-email"
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-cream-line rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-admin-password" className="text-[10px] font-bold text-navy uppercase tracking-wider">
              Password
            </label>
            <input
              id="new-admin-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-cream-line rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold bg-white"
            />
          </div>
        </div>
        <p className="text-[11px] text-ink-muted">
          New email: an account is created with this password. Email that already has an account: enter its current password.
        </p>
        <div>
          <Button type="submit" isLoading={adding} variant="gold" className="uppercase font-bold tracking-wider text-xs rounded-xl">
            Add Admin
          </Button>
        </div>
      </form>

      <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-cream-line flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-gold-dark" />
          <h3 className="font-bold text-navy text-sm">Current admins ({admins.length})</h3>
        </div>
        {loading ? (
          <p className="px-6 py-4 text-xs text-ink-muted">Loading…</p>
        ) : admins.length === 0 ? (
          <p className="px-6 py-4 text-xs text-ink-muted">No admins found.</p>
        ) : (
          <ul className="divide-y divide-cream-line">
            {admins.map((admin) => (
              <li key={admin.uid} className="px-6 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">
                    {admin.email || admin.uid}
                    {admin.uid === myUid && <span className="ml-2 text-[10px] text-gold-dark uppercase">(you)</span>}
                  </p>
                  {admin.addedBy && <p className="text-[11px] text-ink-muted">Added by {admin.addedBy}</p>}
                </div>
                {admin.uid !== myUid && (
                  <button
                    type="button"
                    onClick={() => handleRemove(admin)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    aria-label={`Remove ${admin.email || admin.uid}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
