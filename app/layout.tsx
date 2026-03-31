import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { brandImages } from "@/lib/brand-images";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AVASC — Anti-scam support & reporting",
    template: "%s | AVASC",
  },
  description:
    "Association of Victims Against Cyber-Scams (AVASC): report scams, search indicators, compare patterns, and find recovery guidance — privacy-first.",
  icons: {
    icon: [{ url: brandImages.mark64, sizes: "64x64", type: "image/png" }],
    apple: [{ url: brandImages.mark180, sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
