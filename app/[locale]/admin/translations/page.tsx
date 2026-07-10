import { Link } from "@/i18n/navigation";
import type { Prisma } from "@prisma/client";

import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

/**
 * Native-translation editorial surface.
 *
 * Lists the DB-content translations that exist in the `ContentTranslation`
 * cache (populated as pages are viewed in Spanish / Chinese) so a bilingual
 * writer can upgrade machine drafts into pinned, human-authored native
 * versions. Human rows are always served over machine output and are never
 * auto-overwritten (see lib/i18n/translate-content.ts).
 */

type SP = Record<string, string | string[] | undefined>;
function pick(sp: SP, k: string): string | undefined {
  const v = sp[k];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

const LOCALES = [
  { value: "", label: "All languages" },
  { value: "es", label: "Spanish" },
  { value: "zh", label: "Chinese" },
];
const SOURCES = [
  { value: "", label: "All" },
  { value: "human", label: "Human" },
  { value: "machine", label: "Machine" },
  { value: "stale", label: "Needs review" },
];

function localeLabel(code: string): string {
  return code === "es" ? "Spanish" : code === "zh" ? "Chinese" : code;
}

export default async function AdminTranslationsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  await requireStaff();
  const prisma = getPrisma();

  const localeFilter = pick(sp, "locale");
  const source = pick(sp, "source");

  const where: Prisma.ContentTranslationWhereInput = {};
  if (localeFilter === "es" || localeFilter === "zh") where.locale = localeFilter;
  if (source === "human") where.isHuman = true;
  else if (source === "machine") where.isHuman = false;
  else if (source === "stale") where.stale = true;

  const [rows, counts] = await Promise.all([
    prisma.contentTranslation.findMany({
      where,
      orderBy: [{ stale: "desc" }, { updatedAt: "desc" }],
      take: 250,
    }),
    prisma.contentTranslation.groupBy({ by: ["isHuman"], _count: true }).catch(() => []),
  ]);

  const staleCount = await prisma.contentTranslation.count({ where: { stale: true } }).catch(() => 0);
  const humanCount = counts.find((c) => c.isHuman)?._count ?? 0;
  const machineCount = counts.find((c) => !c.isHuman)?._count ?? 0;

  function filterHref(next: Partial<{ locale: string; source: string }>) {
    const params = new URLSearchParams();
    const loc = next.locale ?? localeFilter ?? "";
    const src = next.source ?? source ?? "";
    if (loc) params.set("locale", loc);
    if (src) params.set("source", src);
    const q = params.toString();
    return `/admin/translations${q ? `?${q}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Translations" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Translations</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upgrade machine drafts into pinned, human-authored native translations. Human versions are always served
          and are never overwritten by the automatic translator. Only public, already-anonymized content is cached here.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs font-medium text-slate-500">Human-authored</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{humanCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs font-medium text-slate-500">Machine</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{machineCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs font-medium text-slate-500">Needs review</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{staleCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Language:</span>
          {LOCALES.map((l) => (
            <Link
              key={l.value || "all"}
              href={filterHref({ locale: l.value })}
              className={`rounded-md px-2 py-1 ${
                (localeFilter ?? "") === l.value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Source:</span>
          {SOURCES.map((s) => (
            <Link
              key={s.value || "all"}
              href={filterHref({ source: s.value })}
              className={`rounded-md px-2 py-1 ${
                (source ?? "") === s.value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <AdminEmptyState
          title="No translations match"
          description="Translations are cached here as public pages are viewed in Spanish or Chinese. Visit a page in another language to seed a draft, then refine it into a native version."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="max-w-[280px]">
                      <div className="font-medium text-slate-900">{r.entityType}</div>
                      <div className="truncate text-xs text-slate-500">{r.entityId}</div>
                    </TableCell>
                    <TableCell className="text-slate-700">{localeLabel(r.locale)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {r.isHuman ? (
                          <Badge variant="success">Human</Badge>
                        ) : (
                          <Badge variant="secondary">Machine</Badge>
                        )}
                        {r.stale ? <Badge variant="warning">Needs review</Badge> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">{formatDate(r.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/translations/${r.id}`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
