"use client";

import { useCallback, useEffect, useState } from "react";

type PublicStoryComment = {
  id: string;
  body: string;
  createdAt: string;
  authorLabel: string;
};

export function StoryComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<PublicStoryComment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadComments = useCallback(async () => {
    const res = await fetch(`/api/stories/${encodeURIComponent(slug)}/comments`, { cache: "no-store" });
    const json = (await res.json()) as { success?: boolean; comments?: PublicStoryComment[] };
    if (res.ok && json.success) setComments(json.comments ?? []);
  }, [slug]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch(`/api/stories/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ body }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Failed to submit comment");
      setBody("");
      setMessage("Comment submitted for moderation.");
      await loadComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit comment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
      <p className="text-sm text-slate-600">
        Comments are moderated before appearing publicly. Please avoid sharing personal contact or banking details.
      </p>

      {comments.length === 0 ? (
        <p className="text-sm text-slate-600">No approved comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                {c.authorLabel} · {new Date(c.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onSubmit} className="space-y-3 border-t border-slate-100 pt-3">
        <label className="block text-sm font-medium text-slate-800">Add a comment</label>
        <textarea
          className="min-h-[96px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={2}
          maxLength={4000}
          placeholder="Share supportively. Links are not allowed in comments."
        />
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit comment"}
        </button>
      </form>
    </section>
  );
}
