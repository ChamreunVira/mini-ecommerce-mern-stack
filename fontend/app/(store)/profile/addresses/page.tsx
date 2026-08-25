"use client";

import { useState } from "react";
import Link from "next/link";
import { User, MapPin, Package, Heart, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { showToast } from "@/store/slices/uiSlice";
import { IAddress } from "@/types";

const INITIAL_ADDRESSES: IAddress[] = [
  {
    _id: "addr1",
    fullName: "Chamreun Vira",
    phone: "013222123",
    address: "St 271, Sangkat Boeung Tumpun",
    city: "Phnom Penh",
    province: "Phnom Penh",
    country: "Cambodia",
    isDefault: true,
  },
  {
    _id: "addr2",
    fullName: "Vira (Office)",
    phone: "012345678",
    address: "Monivong Blvd, Sangkat Boeung Keng Kang 1",
    city: "Phnom Penh",
    province: "Phnom Penh",
    country: "Cambodia",
    isDefault: false,
  },
];

export default function AddressBookPage() {
  const dispatch = useAppDispatch();
  const [addresses, setAddresses] = useState<IAddress[]>(INITIAL_ADDRESSES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState<IAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "Phnom Penh",
    province: "Phnom Penh",
    country: "Cambodia",
    isDefault: false,
  });

  const handleSetDefault = (id?: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a._id === id })),
    );
    dispatch(showToast({ message: "បានកំណត់ជាអាសយដ្ឋានលំនាំដើមរួចរាល់" }));
  };

  const handleDelete = (id?: string) => {
    setAddresses((prev) => prev.filter((a) => a._id !== id));
    dispatch(showToast({ message: "បានលុបអាសយដ្ឋាន", type: "info" }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IAddress = { ...newAddr, _id: `addr-${Date.now()}` };
    if (newAddr.isDefault || addresses.length === 0) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(created));
    } else {
      setAddresses((prev) => [...prev, created]);
    }
    setShowAddForm(false);
    setNewAddr({ fullName: "", phone: "", address: "", city: "Phnom Penh", province: "Phnom Penh", country: "Cambodia", isDefault: false });
    dispatch(showToast({ message: "បានបន្ថែមអាសយដ្ឋានថ្មីដោយជោគជ័យ" }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-8">
        អាសយដ្ឋានដឹកជញ្ជូន
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1">
          <Link href="/profile" className="flex items-center gap-2.5 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-sm transition-colors">
            <User size={16} /> ព័ត៌មានផ្ទាល់ខ្លួន
          </Link>
          <Link href="/profile/addresses" className="flex items-center gap-2.5 px-4 py-3 bg-[#0a0a0a] text-white text-sm font-semibold rounded-sm">
            <MapPin size={16} /> អាសយដ្ឋាន
          </Link>
          <Link href="/orders" className="flex items-center gap-2.5 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-sm transition-colors">
            <Package size={16} /> ការបញ្ជាទិញ
          </Link>
          <Link href="/wishlist" className="flex items-center gap-2.5 px-4 py-3 text-gray-700 hover:bg-gray-100 text-sm font-medium rounded-sm transition-colors">
            <Heart size={16} /> បញ្ជីចំណូលចិត្ត
          </Link>
        </aside>

        {/* Address Cards & Add Form */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">អាសយដ្ឋានដែលបានរក្សាទុក ({addresses.length})</p>
            <button
              type="button"
              onClick={() => setShowAddForm((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a0a] text-white text-xs font-bold rounded-sm hover:bg-gray-800 transition-colors"
            >
              <Plus size={14} /> បន្ថែមអាសយដ្ឋានថ្មី
            </button>
          </div>

          {/* Add New Address Form */}
          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="border border-[#0a0a0a] rounded-sm p-6 space-y-4 bg-gray-50">
              <h3 className="font-bold text-sm text-[#0a0a0a]">បន្ថែមអាសយដ្ឋានថ្មី</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">ឈ្មោះពេញ</label>
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">លេខទូរស័ព្ទ</label>
                  <input
                    type="text"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">អាសយដ្ឋាន</label>
                  <input
                    type="text"
                    required
                    value={newAddr.address}
                    onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">ក្រុង</label>
                  <input
                    type="text"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">ខេត្ត</label>
                  <input
                    type="text"
                    value={newAddr.province || ""}
                    onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 text-sm rounded-sm bg-white"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                  className="accent-[#0a0a0a]"
                />
                <span className="text-xs text-gray-700 font-medium">កំណត់ជាអាសយដ្ឋានលំនាំដើម</span>
              </label>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-5 py-2 bg-[#0a0a0a] text-white text-xs font-bold rounded-sm">
                  រក្សាទុក
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 border border-gray-300 text-xs font-medium rounded-sm">
                  បោះបង់
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className={`border p-5 rounded-sm space-y-3 relative ${
                  addr.isDefault ? "border-[#0a0a0a] bg-gray-50/50" : "border-gray-200"
                }`}
              >
                {addr.isDefault && (
                  <span className="inline-flex items-center gap-1 bg-[#0a0a0a] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                    <CheckCircle2 size={11} /> លំនាំដើម
                  </span>
                )}
                <div>
                  <p className="font-bold text-sm text-[#0a0a0a]">{addr.fullName}</p>
                  <p className="text-xs text-gray-500">{addr.phone}</p>
                  <p className="text-xs text-gray-700 mt-1">{addr.address}, {addr.city}, {addr.province}</p>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-xs">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(addr._id)}
                      className="font-semibold text-gray-600 hover:text-[#0a0a0a]"
                    >
                      កំណត់ជាលំនាំដើម
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(addr._id)}
                    className="text-red-500 hover:text-red-700 ml-auto flex items-center gap-1"
                  >
                    <Trash2 size={12} /> លុប
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
