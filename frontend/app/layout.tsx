import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
