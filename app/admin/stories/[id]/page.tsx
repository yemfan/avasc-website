import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentModerationStatus, ModerationStatus } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { StoryStatusBadge } from "@/components/admin/AdminStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/admin/format";
import { submitStoryModeration } from "../story-form-actions";
import { requireStaff } from "@/lib/admin/session";
import { canMutate } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminStoryDetailPage({ params }: Props) {
  const { id } = await params;
  const prisma = getPrisma();
  const staff = await requireStaff();
  const edit = canMutate(staff.role);

  const story = await prisma.story.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, displayName: true, id: true } },
      case: { select: { id: true, title: true } },
      comments: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });

  if (!story) notFound();

  const pendingComments = story.comments.filter(
    (c) => c.moderationStatus === CommentModerationStatus.PENDING
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <AdminBreadcrumbs
          items={[
            { label: "Overview", href: "/admin" },
            { label: "Stories", href: "/admin/stories" },
            { label: story.title },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{story.title}</h1>
          <StoryStatusBadge status={story.moderationStatus} />
        </div>
        <p className="mt-1 font-mono text-xs text-slate-500">{story.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="whitespace-pre-wrap text-slate-800">{story.body}</p>
            {story.videoUrl ? (
              <p>
                <span className="font-semibold text-slate-700">Video: </span>
                <a href={story.videoUrl} className="text-sky-700 underline" target="_blank" rel="noopener noreferrer">
                  {story.videoUrl}
                </a>
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>
              <span className="text-slate-500">Author: </span>
              {story.anonymityMode ? (
                "Anonymous"
              ) : (
                story.user?.email ?? story.user?.displayName ?? story.user?.id ?? "—"
              )}
            </p>
            <p>
              <span className="text-slate-500">Linked case: </span>
              {story.case ? (
                <Link href={`/admin/cases/${story.case.id}`} className="font-medium hover:underline">
                  {story.case.title}
                </Link>
              ) : (
                "—"
              )}
            </p>
            <p>
              <span className="text-slate-500">Created: </span>
              {formatDate(story.createdAt)}
            </p>
            <p>
              <span className="text-slate-500">Published: </span>
              {formatDate(story.publishedAt)}
            </p>
            <p className="text-slate-500">Pending comments in view: {pendingComments}</p>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/stories">Public stories index</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {edit ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitStoryModeration} className="flex flex-wrap items-end gap-4">
              <input type="hidden" name="storyId" value={story.id} />
              <div>
                <label htmlFor="status" className="text-sm font-medium text-slate-800">
                  Decision
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={
                    story.moderationStatus === ModerationStatus.APPROVED
                      ? "approved"
                      : story.moderationStatus === ModerationStatus.REJECTED
                        ? "rejected"
                        : "pending"
                  }
                  className="mt-1 flex h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <Button type="submit">Apply</Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-slate-600">Read-only for your role.</p>
      )}
    </div>
  );
}
