import type { Metadata } from "next";
import { StoriesClient } from "@/components/stories/StoriesClient";

export const metadata: Metadata = {
  title: "Scam Survivor Stories | AVASC",
  description: "Read real stories from scam survivors and share your experience to help others.",
  openGraph: {
    title: "Scam Survivor Stories | AVASC",
    description: "Read real stories from scam survivors and share your experience to help others.",
    type: "website",
    url: "https://avasc.org/stories",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/stories",
  },
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
