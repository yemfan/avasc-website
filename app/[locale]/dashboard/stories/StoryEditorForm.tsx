"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveStorySchema, type SaveStoryInput } from "@/lib/victim-dashboard/schemas";
import { saveStoryAction } from "@/app/dashboard/_actions/stories";

type Props = {
  cases: { id: string; title: string }[];
  initial?: {
    id: string;
    title: string;
    body: string;
    videoUrl: string | null;
    linkedCaseId: string | null;
    isAnonymous: boolean;
  };
};

export function StoryEditorForm({ cases, initial }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(saveStorySchema),
    defaultValues: initial
      ? {
          id: initial.id,
          title: initial.title,
          body: initial.body,
          videoUrl: initial.videoUrl ?? "",
          linkedCaseId: initial.linkedCaseId ?? "",
          isAnonymous: initial.isAnonymous,
        }
      : {
          isAnonymous: false,
          linkedCaseId: "",
          videoUrl: "",
        },
  });

  async function onSubmit(data: SaveStoryInput) {
    const res = await saveStoryAction(data);
    if (res.ok) {
      router.push("/dashboard/stories");
      router.refresh();
    } else {
      if (typeof res.error === "string") {
        alert(res.error);
      } else if (res.error && typeof res.error === "object") {
        alert("Please fix the highlighted fields.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {initial ? <input type="hidden" {...register("id")} /> : null}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Your story</Label>
        <Textarea id="body" rows={12} className="resize-y" {...register("body")} />
        {errors.body ? <p className="text-sm text-red-600">{errors.body.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL (optional)</Label>
        <Input id="videoUrl" type="url" placeholder="https://..." {...register("videoUrl")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedCaseId">Link to a case (optional)</Label>
        <select
          id="linkedCaseId"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          {...register("linkedCaseId")}
        >
          <option value="">None</option>
          {cases.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register("isAnonymous")} />
        Publish anonymously
      </label>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : initial ? "Save changes" : "Submit for review"}
      </Button>
    </form>
  );
}
