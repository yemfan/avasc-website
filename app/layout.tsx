import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { ConditionalAppShell } from "@/components/layout/ConditionalAppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Editorial display for marketing & public page titles (body stays Geist). */
const frauncesDisplay = Fraunces({
  variable: "--font-avasc-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "AVASC — Anti-scam support & reporting",
    template: "%s | AVASC",
  },
  description:
    "Association of Victims Against Cyber-Scams (AVASC): report scams, search indicators, compare patterns, and find recovery guidance — privacy-first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${frauncesDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ConditionalAppShell>{children}</ConditionalAppShell>
      </body>
    </html>
  );
}
