import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/lib/contexts/ToastContext";

export const metadata: Metadata = {
  title: "GearGuard - Equipment Management System",
  description: "Secure authentication portal for GearGuard equipment management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
