import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export function DatabaseEmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <SearchX className="h-10 w-10 text-slate-400" aria-hidden />
      <h2 className="mt-4 text-lg font-semibold text-slate-900">No published patterns match this search</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        {query
          ? `Try a shorter keyword, a different indicator type, or remove filters. Searched for “${query}”.`
          : "Try adjusting filters or search terms."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild variant="default">
          <Link href="/database">Clear search</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/report">Report a scam</Link>
        </Button>
      </div>
    </div>
  );
}
