import type { Metadata } from "next";
import { AlertSubscriptionForm } from "@/components/alerts/AlertSubscriptionForm";
import { SectionShell } from "@/components/avasc/layout/SectionShell";

type SearchProps = { searchParams: Promise<{ verify?: string }> };

export const metadata: Metadata = {
  title: "Scam Alerts | AVASC",
  description: "Subscribe to real-time scam alerts and stay informed about emerging threats.",
  openGraph: {
    title: "Scam Alerts | AVASC",
    description: "Subscribe to real-time scam alerts and stay informed about emerging threats.",
    type: "website",
    url: "https://avasc.org/alerts",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/alerts",
  },
};

export default async function AlertsPage({ searchParams }: SearchProps) {
  const { verify } = await searchParams;
  const verifyMsg =
    verify === "legacy"
      ? "Email verification tokens are no longer used — your subscription is saved directly."
      : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alerts",
        item: "https://avasc.org/alerts",
      },
    ],
  };

  return (
    <SectionShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Scam intelligence alerts</h1>
          {/* TOM CR-005: previous copy exposed the internal DB table name
              "AlertDeliveryLog" to end users. Replaced with a user-friendly
              description. Internal delivery audit logs still exist server-
              side; they just aren't advertised to subscribers. */}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Stay informed about <strong>published</strong> patterns in the AVASC database. REALTIME SMS is rare and only
            for <strong>CRITICAL</strong> high-confidence updates on patterns you follow. Every alert we send is
            auditable — if you think a message looks suspicious, email{" "}
            <a
              href="mailto:security@avasc.org"
              className="underline decoration-avasc-gold/50 underline-offset-4 hover:text-avasc-gold-light"
            >
              security@avasc.org
            </a>
            .
          </p>
          {verifyMsg ? (
            <p
              className="mt-4 rounded-lg border border-avasc-gold/40 bg-avasc-gold/5 px-4 py-3 text-sm text-avasc-gold-light"
              role="status"
            >
              {verifyMsg}
            </p>
          ) : null}
        </div>
        <AlertSubscriptionForm />
        <p className="text-xs text-muted-foreground">
          Signed in? Manage channels in{" "}
          <a href="/alerts/preferences" className="text-avasc-gold-light underline">
            alert preferences
          </a>
          .
        </p>
      </div>
    </SectionShell>
  );
}
