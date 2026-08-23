import { ReactNode } from "react";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import ToastProvider from "@/components/ToastProvider";

export const metadata = {
  title: "kdmv — Admin",
  description: "Store administration for kdmv",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
