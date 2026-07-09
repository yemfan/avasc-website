"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Story = {
  id: string;
  slug: string;
  title: string;
  body: string;
  isAnonymous: boolean;
  createdAt: string;
};

const DATE_LOCALE: Record<string, string> = { en: "en-US", es: "es-ES", zh: "zh-CN" };

export function StoriesClient() {
  const t = useTranslations("stories");
  const locale = useLocale();
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
      if (!res.ok || !json.success) throw new Error(json.error ?? t("submitFailed"));
      setMsg(t("submittedMsg"));
      setTitle("");
      setBody("");
      setIsAnonymous(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submitFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{t("communityStories")}</h2>
        {stories.length === 0 ? (
          // TOM MJ-003: previous "No approved stories yet." read as broken
          // or stalled. Reframe as active-moderation with clear next steps,
          // matching the MJ-001 pattern elsewhere on the site.
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-900">{t("emptyTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {t.rich("emptyBody", {
                report: (chunks) => (
                  <Link href="/report" className="font-medium text-slate-900 underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {stories.map((s) => (
              <li key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-slate-500">
                  {new Date(s.createdAt).toLocaleDateString(DATE_LOCALE[locale] ?? "en-US")}
                  {s.isAnonymous ? ` · ${t("anonymous")}` : ""}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{s.body}</p>
                <Link href={`/stories/${s.slug}`} className="mt-3 inline-block text-sm font-medium text-slate-700 hover:underline">
                  {t("readStoryPage")}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("shareYourStory")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("shareNote")}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">{t("labelTitle")}</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">{t("labelStory")}</label>
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
            {t("publishAnonymous")}
          </label>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {msg ? <p className="text-sm text-emerald-800">{msg}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? t("submitting") : t("submitForReview")}
          </button>
        </form>
      </div>
    </div>
  );
}
