"use client";

import { useAppSelector } from "@/store/store";
import PageHeader from "@/components/PageHeader";
import PrimaryButton from "@/components/PrimaryButton";
import Avatar from "@/components/Avatar";

export default function UsersPage() {
  const users = useAppSelector((state) => state.users.items);

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage users in the store"
        action={<PrimaryButton>Create Admin</PrimaryButton>}
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-4 pl-5 font-semibold text-ink">Name</th>
              <th className="py-4 pr-4 font-semibold text-ink">Email</th>
              <th className="py-4 pr-4 font-semibold text-ink">Phone</th>
              <th className="py-4 pr-5 font-semibold text-ink">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0 text-sm">
                <td className="py-4 pl-5">
                  <div className="flex items-center gap-3">
                    <Avatar name={u.name} hasPhoto={!!u.avatar} size={34} />
                    <span className="font-medium text-ink">{u.name}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-ink">{u.email}</td>
                <td className="py-4 pr-4 text-ink">{u.phone}</td>
                <td className="py-4 pr-5 text-ink font-medium">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
