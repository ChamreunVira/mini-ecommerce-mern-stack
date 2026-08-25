"use client";

import { useState } from "react";
import Link from "next/link";
import { User, MapPin, Package, Heart, Edit, Save } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { showToast } from "@/store/slices/uiSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((s) => s.auth);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: currentUser?.firstName || "Chamreun",
    lastName: currentUser?.lastName || "Vira",
    email: currentUser?.email || "boththann76@gmail.com",
    telephone: currentUser?.telephone || "013222123",
    gender: currentUser?.gender || "M",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    dispatch(showToast({ message: "បានផ្លាស់ប្ដូរព័ត៌មានផ្ទាល់ខ្លួនដោយជោគជ័យ!" }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-8">
        គណនីរបស់ខ្ញុំ
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-4 py-3 bg-[#0a0a0a] text-white text-sm font-semibold rounded-sm"
          >
            <User size={16} /> ព័ត៌មានផ្ទាល់ខ្លួន
          </Link>
          <Link
            href="/profile/addresses"
            className="flex items-center gap-2.5 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-sm transition-colors"
          >
            <MapPin size={16} /> អាសយដ្ឋាន
          </Link>
          <Link
            href="/orders"
            className="flex items-center gap-2.5 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-sm transition-colors"
          >
            <Package size={16} /> ការបញ្ជាទិញ
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center gap-2.5 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-sm transition-colors"
          >
            <Heart size={16} /> បញ្ជីចំណូលចិត្ត
          </Link>
        </aside>

        {/* Content Form */}
        <div className="lg:col-span-9 border border-gray-200 rounded-sm p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#0a0a0a]">ព័ត៌មានផ្ទាល់ខ្លួន</h2>
              <p className="text-xs text-gray-500 mt-0.5">គ្រប់គ្រងឈ្មោះ អ៊ីមែល និងលេខទូរស័ព្ទ</p>
            </div>
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-300 text-xs font-semibold rounded-sm hover:border-[#0a0a0a] transition-colors"
              >
                <Edit size={13} /> កែប្រែ
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0a0a0a] text-white text-xs font-semibold rounded-sm hover:bg-gray-800 transition-colors"
              >
                <Save size={13} /> រក្សាទុក
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">នាមត្រកូល</label>
              <input
                type="text"
                disabled={!editing}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">ឈ្មោះ</label>
              <input
                type="text"
                disabled={!editing}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">អ៊ីមែល</label>
              <input
                type="email"
                disabled={!editing}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">លេខទូរស័ព្ទ</label>
              <input
                type="text"
                disabled={!editing}
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">ភេទ</label>
              <select
                disabled={!editing}
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as "M" | "F" | "O" })}
                className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] disabled:bg-gray-50 disabled:text-gray-500 bg-white transition-colors"
              >
                <option value="M">ប្រុស (Male)</option>
                <option value="F">ស្រី (Female)</option>
                <option value="O">ផ្សេងៗ (Other)</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
