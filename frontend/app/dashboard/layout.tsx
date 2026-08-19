import Sidebar from "@/components/dashboard/Sidebar";

export const metadata = {
  title: "Admin Dashboard | Marlo Marketplace",
  description: "Comprehensive store operations, orders, shipment, product management dashboard.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-61px)] bg-surface/50">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">{children}</div>
      </div>
    </div>
  );
}
