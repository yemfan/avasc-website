"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSocialAction } from "@/lib/social/actions";
import { platformLabel, type SocialPost } from "@/lib/social/types";

type BriefingOption = { slug: string; title: string; periodLabel: string | null };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

function fullText(post: SocialPost): string {
  const tags = post.hashtags.join(" ");
  // Only append hashtags if they aren't already present in the body.
  return tags && !post.hashtags.every((h) => post.body.includes(h))
    ? `${post.body}\n\n${tags}`
    : post.body;
}

export function SocialGenerator({ briefings }: { briefings: BriefingOption[] }) {
  const [slug, setSlug] = useState(briefings[0]?.slug ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<SocialPost[] | null>(null);
  const [sourceTitle, setSourceTitle] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setPosts(null);
    setSourceTitle(null);
    try {
      const res = await generateSocialAction(slug || undefined);
      if (res.ok) {
        setPosts(res.posts);
        setSourceTitle(res.briefingTitle);
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong generating posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Generate social posts</CardTitle>
          <p className="mt-1 text-sm text-slate-500">
            Turns a published briefing into ready-to-post copy for X, LinkedIn, Facebook, and
            Instagram. Posts are generated on demand and not saved — copy the ones you want and post
            them.
          </p>
        </CardHeader>
        <CardContent>
          {briefings.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">
              No published briefings yet. Publish a briefing first, then generate social posts from
              it.
            </p>
          ) : (
            <div className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-slate-600">Source briefing</span>
                <select
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={loading}
                  className="min-w-[20rem] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  {briefings.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.periodLabel ? `${b.periodLabel} — ` : ""}
                      {b.title}
                    </option>
                  ))}
                </select>
              </label>
              <Button type="button" onClick={onGenerate} disabled={loading}>
                {loading ? "Generating…" : "Generate posts"}
              </Button>
            </div>
          )}
          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {sourceTitle ? (
            <p className="text-sm text-slate-500">
              From briefing: <span className="font-medium text-slate-700">{sourceTitle}</span>
            </p>
          ) : null}
          {posts.map((post) => (
            <Card key={post.platform}>
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <CardTitle className="text-slate-900">{platformLabel(post.platform)}</CardTitle>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{fullText(post).length} chars</span>
                  <CopyButton text={fullText(post)} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-800">
                  {post.body}
                </pre>
                {post.hashtags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {post.hashtags.map((h) => (
                      <Badge key={h} variant="secondary">
                        {h}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}
