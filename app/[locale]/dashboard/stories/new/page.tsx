import Link from "next/link";
import { requireAuthUser, getUserCases } from "@/lib/victim-dashboard";
import { StoryEditorForm } from "../StoryEditorForm";

export const dynamic = "force-dynamic";

export default async function NewStoryPage() {
  const user = await requireAuthUser();
  const caseList = await getUserCases(user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/dashboard/stories" className="text-sm text-slate-600 hover:underline">
        ← Stories
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">New story</h1>
        <p className="mt-2 text-sm text-slate-600">
          Avoid bank account numbers, full card numbers, or street addresses. Focus on what happened and how it felt.
        </p>
      </div>
      <StoryEditorForm cases={caseList.map((c) => ({ id: c.id, title: c.title }))} />
    </div>
  );
}
