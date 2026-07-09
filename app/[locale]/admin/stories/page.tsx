import Link from "next/link";
import { ModerationStatus, type Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { StoryStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";

export const dynamic = "force-dynamic";

const STATUSES: ModerationStatus[] = [
  ModerationStatus.DRAFT,
  ModerationStatus.PENDING,
  ModerationStatus.APPROVED,
  ModerationStatus.REJECTED,
  ModerationStatus.FLAGGED,
];

type SP = Record<string, string | string[] | undefined>;
function pick(sp: SP, k: string): string | undefined {
  const v = sp[k];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function AdminStoriesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const statusFilter = pick(sp, "status") as ModerationStatus | undefined;

  const prisma = getPrisma();
  const where: Prisma.StoryWhereInput = {};
  if (statusFilter && STATUSES.includes(statusFilter)) {
    where.moderationStatus = statusFilter;
  }

  const stories = await prisma.story.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { email: true, displayName: true, id: true } },
      case: { select: { id: true, title: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Stories" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Survivor stories</h1>
        <p className="mt-1 text-sm text-slate-600">Moderate submissions before they appear on the public stories feed.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-4" method="get">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={statusFilter ?? ""}
                className="mt-1 flex h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm"
              >
                <option value="">Any</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll("_", " ").toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Apply</Button>
          </form>
        </CardContent>
      </Card>

      {stories.length === 0 ? (
        <AdminEmptyState title="No stories" description="Nothing matches this filter." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Linked case</TableHead>
              <TableHead>Anonymity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="max-w-[220px]">
                  <p className="font-medium text-slate-900">{s.title}</p>
                  <p className="font-mono text-[11px] text-slate-400">{s.id}</p>
                </TableCell>
                <TableCell className="max-w-[160px] truncate text-sm">
                  {s.anonymityMode ? (
                    <span className="text-slate-500">Anonymous</span>
                  ) : (
                    s.user?.email ?? s.user?.displayName ?? s.user?.id ?? "—"
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {s.case ? (
                    <Link href={`/admin/cases/${s.case.id}`} className="hover:underline">
                      {s.case.title}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{s.anonymityMode ? "yes" : "no"}</TableCell>
                <TableCell>
                  <StoryStatusBadge status={s.moderationStatus} />
                </TableCell>
                <TableCell className="text-sm">{formatDate(s.publishedAt)}</TableCell>
                <TableCell className="text-sm">{formatDate(s.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/admin/stories/${s.id}`}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
