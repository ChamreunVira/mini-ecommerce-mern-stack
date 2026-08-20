"use client";

import { useState, useMemo } from "react";
import { Search, Users as UsersIcon, Edit2, ToggleLeft, ToggleRight, X, Shield, User as UserIcon } from "lucide-react";
import { store, useUsers } from "@/lib/store";
import type { User } from "@/types/product";

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: "customer" | "admin" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${role === "admin" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"}`}>
      {role === "admin" ? <Shield size={10} /> : <UserIcon size={10} />}
      {role}
    </span>
  );
}

export default function UsersPage() {
  const users = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "customer" as "customer" | "admin" });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const openEdit = (u: User) => {
    setEditForm({ name: u.name, email: u.email, phone: u.phone ?? "", role: u.role });
    setEditTarget(u);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));
    store.updateUser(editTarget.id, { name: editForm.name, email: editForm.email, phone: editForm.phone, role: editForm.role });
    setSaving(false);
    setEditTarget(null);
  };

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Users</h1>
          <p className="text-xs text-ink/50">{users.length} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
          <Search size={15} className="shrink-0 text-ink/40" />
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs outline-none placeholder:text-ink/40"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-0.5 rounded-xl border border-border bg-surface p-1">
            {["all", "customer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${roleFilter === r ? "bg-white text-ink shadow-xs" : "text-ink/50 hover:text-ink"}`}
              >
                {r === "all" ? "All Roles" : r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-0.5 rounded-xl border border-border bg-surface p-1">
            {["all", "active", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${statusFilter === s ? "bg-white text-ink shadow-xs" : "text-ink/50 hover:text-ink"}`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-surface/60 text-[11px] font-bold uppercase tracking-wider text-ink/40">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <UsersIcon size={32} className="mx-auto mb-2 text-ink/20" />
                    <p className="text-sm font-semibold text-ink/40">No users found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                          {initials(u.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-ink">{u.name}</p>
                          <p className="text-[10px] text-ink/50">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><RoleBadge role={u.role} /></td>
                    <td className="py-3 px-4 text-ink/60">{u.phone ?? "—"}</td>
                    <td className="py-3 px-4"><StatusBadge status={u.status} /></td>
                    <td className="py-3 px-4 text-ink/50">{u.createdAt}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => store.toggleUserStatus(u.id)}
                          title={u.status === "active" ? "Deactivate" : "Activate"}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                        >
                          {u.status === "active" ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} className="text-slate-400" />}
                        </button>
                        <button
                          onClick={() => openEdit(u)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                        >
                          <Edit2 size={14} className="text-amber-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-ink">Edit User</h3>
              <button onClick={() => setEditTarget(null)} className="text-ink/40 hover:text-ink"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label">Role</label>
                <div className="flex gap-2">
                  {(["customer", "admin"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setEditForm((f) => ({ ...f, role: r }))}
                      className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${editForm.role === r ? "bg-slate-900 text-white" : "border border-border text-ink/60 hover:bg-surface"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditTarget(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-surface">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60">
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .label { display: block; margin-bottom: 4px; font-size: 11px; font-weight: 700; color: rgba(20,33,61,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
        .input { width: 100%; border-radius: 10px; border: 1px solid #E3E7F0; background: #F5F7FB; padding: 8px 10px; font-size: 12px; color: #14213D; outline: none; }
        .input:focus { border-color: #2F5FF6; background: white; }
      `}</style>
    </div>
  );
}
