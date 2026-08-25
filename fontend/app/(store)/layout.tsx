import { ReactNode } from "react";
import AnnouncementBar from "@/components/store/AnnouncementBar";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import CartDrawer from "@/components/store/CartDrawer";
import SearchOverlay from "@/components/store/SearchOverlay";
import MobileSidebar from "@/components/store/MobileSidebar";
import Toast from "@/components/store/Toast";

export const metadata = {
  title: "vSt4reKH — ហាងអនឡាញ",
  description: "ហាងទំនុញ្ចចិត្ត ជាមួយផលិតផលប្រចាំថ្ងៃ",
};

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <StoreHeader />
      <MobileSidebar />
      <CartDrawer />
      <SearchOverlay />
      <main className="min-h-screen">{children}</main>
      <StoreFooter />
      <Toast />
    </>
  );
}
