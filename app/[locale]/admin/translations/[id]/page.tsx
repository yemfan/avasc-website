import { notFound } from "next/navigation";

import { getPrisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { Badge } from "@/components/ui/badge";
import { TranslationEditor } from "./TranslationEditor";

export const dynamic = "force-dynamic";

function localeLabel(code: string): string {
  return code === "es" ? "Spanish" : code === "zh" ? "Chinese" : code;
}

export default async function AdminTranslationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await requireStaff();
  const prisma = getPrisma();

  const row = await prisma.contentTranslation.findUnique({ where: { id } }).catch(() => null);
  if (!row) notFound();

  const fields = (row.fields ?? {}) as Record<string, string>;
  const editable = canMutate(ctx.role);

  return (
    <div className="space-y-6">
      <div>
        <AdminBreadcrumbs
          items={[
            { label: "Overview", href: "/admin" },
            { label: "Translations", href: "/admin/translations" },
            { label: "Edit" },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{row.entityType}</h1>
          <Badge variant="outline">{localeLabel(row.locale)}</Badge>
          {row.isHuman ? <Badge variant="success">Human</Badge> : <Badge variant="secondary">Machine draft</Badge>}
          {row.stale ? <Badge variant="warning">Needs review</Badge> : null}
        </div>
        <p className="mt-1 break-all text-xs text-slate-500">{row.entityId}</p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        You&rsquo;re editing the <strong>{localeLabel(row.locale)}</strong> version. The fields below start from the
        current draft — refine them into natural, native {localeLabel(row.locale)}. Saving pins this as the
        human-authored version: it will always be shown and the automatic translator will never overwrite it.
      </div>

      <TranslationEditor id={row.id} fields={fields} editable={editable} />
    </div>
  );
}
