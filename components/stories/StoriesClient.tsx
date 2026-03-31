"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Story = {
  id: string;
  slug: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  createdAt: string;
};

export function StoriesClient() {
  const [stories, setStories] = useState<Story[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/stories", { cache: "no-store" });
    const json = (await res.json()) as { success?: boolean; stories?: Story[] };
    if (res.ok && json.success) setStories(json.stories ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ title, body, isAnonymous }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed to submit");
      setMsg("Story submitted for moderation.");
      setTitle("");
      setBody("");
      setIsAnonymous(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Community stories</h2>
        {stories.length === 0 ? (
          <p className="text-sm text-slate-600">No approved stories yet.</p>
        ) : (
          <ul className="space-y-4">
            {stories.map((s) => (
              <li key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-slate-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                  {s.isAnonymous ? " · Anonymous" : ""}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{s.body}</p>
                <Link href={`/stories/${s.slug}`} className="mt-3 inline-block text-sm font-medium text-slate-700 hover:underline">
                  Read story page
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Share your story</h2>
        <p className="mt-2 text-sm text-slate-600">
          Stories are moderated before publication. Sign in required.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Story</label>
            <textarea
              className="mt-1 min-h-[140px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Publish as anonymous
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {msg ? <p className="text-sm text-emerald-800">{msg}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Submitting…" : "Submit for review"}
          </button>
        </form>
      </div>
    </div>
  );
}
