import Link from "next/link";
import { ModerationStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/victim-dashboard/EmptyState";
import { StoryStatusBadge } from "@/components/victim-dashboard/StoryStatusBadge";
import { requireAuthUser, getUserStories } from "@/lib/victim-dashboard";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardStoriesPage() {
  const user = await requireAuthUser();
  const prisma = getPrisma();
  const stories = await getUserStories(prisma, user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Survivor stories</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Share when you’re ready. Stories are reviewed for safety and privacy before publication — to protect you
            and other survivors.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/stories/new">Create story</Link>
        </Button>
      </div>

      {stories.length === 0 ? (
        <EmptyState
          title="You can share your experience when you’re ready"
          description="There’s no pressure — many people find it healing to tell their story after they’ve had time to feel safe."
          actionLabel="Create a story"
          actionHref="/dashboard/stories/new"
        />
      ) : (
        <ul className="space-y-4">
          {stories.map((s) => (
            <li key={s.id}>
              <Card className="border-slate-200 p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <StoryStatusBadge status={s.status} publishedAt={s.publishedAt} />
                  {s.isAnonymous ? (
                    <span className="text-xs font-medium text-slate-500">Anonymous</span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">{s.title}</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Updated {s.updatedAt.toLocaleString()}
                  {s.linkedCaseTitle ? ` · Linked case: ${s.linkedCaseTitle}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.status !== ModerationStatus.APPROVED ? (
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/dashboard/stories/${s.id}/edit`}>Edit</Link>
                    </Button>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
