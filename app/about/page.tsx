import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { brand, brandImages } from "@/lib/brand-images";

export const metadata: Metadata = {
  title: "About AVASC",
  description:
    "Association of Victims Against Cyber-Scams (AVASC): mission, privacy-first design, and anti-scam support.",
  openGraph: {
    title: "About AVASC",
    description:
      "Association of Victims Against Cyber-Scams (AVASC): mission, privacy-first design, and anti-scam support.",
    type: "website",
    url: "https://avasc.org/about",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Image
            src={brandImages.mark180}
            alt={brand.logoAltAbout}
            width={120}
            height={120}
            className="h-24 w-24 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-2 shadow-sm"
          />
          <div className="space-y-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                About {brand.shortName}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">{brand.legalName}</p>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
              AVASC is a nonprofit anti-scam platform built to support victims with dignity. We combine structured
              incident reporting, privacy-safe pattern intelligence, and practical recovery guidance.
            </p>
          </div>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">What we do</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Help victims submit secure, structured scam reports.</li>
            <li>Analyze scam indicators and cluster recurring patterns.</li>
            <li>Publish anonymized public scam profiles for prevention.</li>
            <li>Provide support-request workflows and recovery checklists.</li>
          </ul>
        </Card>
        <Card className="border-slate-200 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">What we are not</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Not a law firm.</li>
            <li>Not a government agency.</li>
            <li>Not a guaranteed recovery service.</li>
            <li>Not a place to publish private victim information.</li>
          </ul>
        </Card>
      </div>

      <Card className="border-slate-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Privacy and safety commitments</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700">
          Reports are private by default. Public database pages use anonymized, victim-safe summaries only. We do not
          expose private narratives, internal admin notes, or other victims&apos; identifiable information in public
          views.
        </p>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/report" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
          Report a scam
        </Link>
        <Link
          href="/database"
          className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Search scam database
        </Link>
      </div>
    </div>
  );
}
