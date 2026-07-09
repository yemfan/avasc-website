import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getScamEntityPublicById } from "@/lib/db/entity-detail";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("database");
  const raw = (await getScamEntityPublicById(id)) as Record<string, unknown> | null;
  if (!raw) return { title: "Scam profile not found" };

  const value = typeof raw.normalizedValue === "string" ? raw.normalizedValue : "";
  const title = value ? t("entityMetaTitleWith", { value }) : t("entityMetaTitle");
  const description = t("entityMetaDescription");
  const canonical = `/database/entity/${id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | AVASC`,
      description,
      type: "website",
      url: `https://www.avasc.org${canonical}`,
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  };
}

export default async function ScamEntityPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("database");

  const raw = await getScamEntityPublicById(id);

  if (!raw) notFound();

  const entity = raw as Record<string, unknown> & {
    caseLinks: { caseId: string; case: Record<string, unknown> }[];
  };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/database" className="text-sm font-medium text-muted-foreground hover:text-[var(--avasc-gold-light)]">
          ← {t("entityDbSearch")}
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">{t("entityTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("entityIntro")}</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{entity.type as string}</p>
        <p className="mt-2 font-mono text-lg text-slate-900">{entity.normalizedValue as string}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">{t("riskScore")}</dt>
            <dd className="text-2xl font-semibold text-slate-900">{entity.riskScore as number}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{t("linkedReports")}</dt>
            <dd className="text-2xl font-semibold text-slate-900">{entity.reportCount as number}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">{t("lastSeen")}</dt>
            <dd className="text-sm text-slate-800">
              {new Date(entity.lastSeenAt as string).toLocaleString()}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("relatedCases")}</h2>
        <ul className="mt-4 space-y-4">
          {entity.caseLinks.map((link) => {
            const c = link.case;
            const visibility = c.visibility as string;
            const showSummary =
              visibility === "public" || visibility === "anonymized" ? c.narrativePublic : null;
            return (
              <li key={link.caseId} className="border-b border-slate-100 pb-4 last:border-b-0">
                <p className="font-medium text-slate-900">{c.title as string}</p>
                <p className="text-xs text-slate-500">
                  {c.scamType as string} · {new Date(c.createdAt as string).toLocaleDateString()}
                </p>
                {showSummary ? (
                  <p className="mt-2 text-sm text-slate-700">{showSummary as string}</p>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">{t("detailsRestricted")}</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
