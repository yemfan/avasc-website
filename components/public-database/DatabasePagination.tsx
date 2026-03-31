import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

function buildHref(
  base: Record<string, string | string[] | undefined>,
  page: number
): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(base)) {
    if (v === undefined || v === "") continue;
    if (k === "page") continue;
    if (Array.isArray(v)) v.forEach((x) => p.append(k, x));
    else p.set(k, v);
  }
  p.set("page", String(page));
  const qs = p.toString();
  return qs ? `/database?${qs}` : `/database?page=${page}`;
}

export function DatabasePagination({
  searchParams,
  total,
  page,
  pageSize,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  total: number;
  page: number;
  pageSize: number;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  const prev = Math.max(1, page - 1);
  const next = Math.min(pages, page + 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8"
      aria-label="Pagination"
    >
      <p className="text-sm text-slate-600">
        Page {page} of {pages} · {total} pattern{total === 1 ? "" : "s"}
      </p>
      <div className="flex gap-2">
        <Link
          href={buildHref(searchParams, prev)}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50",
            page <= 1 && "pointer-events-none opacity-40"
          )}
          aria-disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
        <Link
          href={buildHref(searchParams, next)}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50",
            page >= pages && "pointer-events-none opacity-40"
          )}
          aria-disabled={page >= pages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </nav>
  );
}
