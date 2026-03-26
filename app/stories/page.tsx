import { StoriesClient } from "@/components/stories/StoriesClient";

export const metadata = {
  title: "Survivor stories | AVASC",
  description: "Share and read moderated survivor stories.",
};

export default function StoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Survivor stories</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Comments and posts are moderated. External links are blocked in comments for safety.
        </p>
      </div>
      <StoriesClient />
    </div>
  );
}
