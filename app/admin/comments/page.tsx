import Link from "next/link";
import { CommentModerationStatus, type Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { CommentStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/admin/format";
import { submitCommentModeration } from "./comment-form-actions";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

const STATUSES: CommentModerationStatus[] = [
  CommentModerationStatus.PENDING,
  CommentModerationStatus.APPROVED,
  CommentModerationStatus.REJECTED,
];

type SP = Record<string, string | string[] | undefined>;
function pick(sp: SP, k: string): string | undefined {
  const v = sp[k];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined;
}

export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const statusFilter = pick(sp, "status") as CommentModerationStatus | undefined;
  const prisma = getPrisma();
  const staff = await requireStaff();
  const edit = canMutate(staff.role);

  const where: Prisma.CommentWhereInput = {};
  if (statusFilter && STATUSES.includes(statusFilter)) {
    where.moderationStatus = statusFilter;
  }

  const comments = await prisma.comment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 120,
    include: {
      user: { select: { email: true, displayName: true, id: true } },
      story: { select: { id: true, title: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <AdminBreadcrumbs items={[{ label: "Overview", href: "/admin" }, { label: "Comments" }]} />
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Comments</h1>
        <p className="mt-1 text-sm text-slate-600">Queue for story replies. URL-like content is blocked at submission time.</p>
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

      {comments.length === 0 ? (
        <AdminEmptyState title="No comments" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>Story</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Flag / note</TableHead>
              <TableHead>Created</TableHead>
              {edit ? <TableHead>Action</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="max-w-[280px]">
                  <p className="line-clamp-3 text-sm text-slate-800">{c.body}</p>
                  <p className="font-mono text-[11px] text-slate-400">{c.id}</p>
                </TableCell>
                <TableCell>
                  <Link href={`/admin/stories/${c.story.id}`} className="text-sm font-medium hover:underline">
                    {c.story.title}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[140px] truncate text-sm">
                  {c.user.email ?? c.user.displayName ?? c.user.id}
                </TableCell>
                <TableCell>
                  <CommentStatusBadge status={c.moderationStatus} />
                </TableCell>
                <TableCell className="text-xs text-slate-600">{c.flagReason ?? "—"}</TableCell>
                <TableCell className="whitespace-nowrap text-sm">{formatDate(c.createdAt)}</TableCell>
                {edit ? (
                  <TableCell>
                    <form action={submitCommentModeration} className="flex flex-col gap-2">
                      <input type="hidden" name="commentId" value={c.id} />
                      <select
                        name="status"
                        defaultValue={
                          c.moderationStatus === CommentModerationStatus.APPROVED
                            ? "approved"
                            : c.moderationStatus === CommentModerationStatus.REJECTED
                              ? "rejected"
                              : "pending"
                        }
                        className="h-9 rounded-lg border border-slate-200 px-2 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <Input name="flagReason" placeholder="Reason (rejected)" className="h-9 text-xs" />
                      <Button type="submit" size="sm" variant="secondary">
                        Save
                      </Button>
                    </form>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
