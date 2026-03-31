import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuthUser, getUserStoryForEdit, getUserCases } from "@/lib/victim-dashboard";
import { getPrisma } from "@/lib/prisma";
import { StoryEditorForm } from "../../StoryEditorForm";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditStoryPage({ params }: PageProps) {
  const user = await requireAuthUser();
  const { id } = await params;
  const prisma = getPrisma();
  const initial = await getUserStoryForEdit(prisma, user.id, id);
  if (!initial) notFound();

  const caseList = await getUserCases(user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/dashboard/stories" className="text-sm text-slate-600 hover:underline">
        ← Stories
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Edit story</h1>
        <p className="mt-2 text-sm text-slate-600">Saving will send your story back for review.</p>
      </div>
      <StoryEditorForm
        cases={caseList.map((c) => ({ id: c.id, title: c.title }))}
        initial={{
          id: initial.id,
          title: initial.title,
          body: initial.body,
          videoUrl: initial.videoUrl,
          linkedCaseId: initial.linkedCaseId,
          isAnonymous: initial.isAnonymous,
        }}
      />
    </div>
  );
}
