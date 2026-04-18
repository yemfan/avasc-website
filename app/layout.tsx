import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { ConditionalAppShell } from "@/components/layout/ConditionalAppShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Editorial display for marketing & public page titles (body stays Geist). */
const frauncesDisplay = Fraunces({
  variable: "--font-avasc-display",
  subsets: ["latin"],
  /** Required with `axes` for variable Fraunces; avoids next/font misconfiguration in production. */
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://avasc.org"),
  title: {
    default: "AVASC — Anti-scam support & reporting",
    template: "%s | AVASC",
  },
  description:
    "Association of Victims Against Cyber-Scams (AVASC): report scams, search indicators, compare patterns, and find recovery guidance — privacy-first.",
  openGraph: {
    type: "website",
    siteName: "AVASC",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AVASC — Association of Victims Against Cyber-Scams" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TOM CR-004 + P2 recommendation: enrich the NonprofitOrganization schema
  // with location, legal name, and nonprofit-status metadata so Google's
  // Knowledge Panel surfaces real legitimacy signals. The 501(c)(3) Pending
  // state is explicit — flip `"Nonprofit501c3"` to `true` once the IRS
  // determination letter arrives.
  const jsonLdOrganization = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "AVASC",
    "alternateName": "Association of Victims Against Cyber-Scams",
    "legalName": "Association of Victims Against Cyber-Scams",
    "url": "https://avasc.org",
    "logo": "https://avasc.org/icon.png",
    "description":
      "AVASC helps victims of cyber-scams report fraud, search scam indicators, compare patterns, and find recovery guidance.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Los Angeles",
      "addressRegion": "CA",
      "addressCountry": "US",
    },
    "foundingLocation": {
      "@type": "Place",
      "name": "Los Angeles, California",
    },
    "nonprofitStatus": "Nonprofit501c3Pending",
    "email": "hello@avasc.org",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "support@avasc.org",
      },
      {
        "@type": "ContactPoint",
        "contactType": "Donations",
        "email": "give@avasc.org",
      },
      {
        "@type": "ContactPoint",
        "contactType": "Privacy",
        "email": "privacy@avasc.org",
      },
    ],
    "sameAs": [] as string[],
  };

  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AVASC",
    "url": "https://avasc.org",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://avasc.org/database?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${frauncesDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ConditionalAppShell>{children}</ConditionalAppShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
      </body>
    </html>
  );
}
