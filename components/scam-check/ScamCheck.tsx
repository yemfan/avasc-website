"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Upload, X, ArrowRight, AlertTriangle, Eye } from "lucide-react";

import {
  MAX_DESC_CHARS,
  MAX_IMAGES,
  RISK_META,
  type ScamCheckResult,
} from "@/lib/scam-check/types";

type Attachment = { id: string; dataUrl: string; name: string };

const TONE_CLASS: Record<string, string> = {
  red: "border-red-500/30 bg-red-500/10 text-red-300",
  amber: "border-[var(--avasc-gold)]/40 bg-[var(--avasc-gold)]/10 text-[var(--avasc-gold-light)]",
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  slate: "border-[var(--avasc-border)] bg-[var(--avasc-bg-soft)] text-muted-foreground",
};

/** Downscale to <=1568px longest edge and re-encode as JPEG to keep the upload small. */
async function fileToDataUrl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read image"));
      el.src = url;
    });
    const maxDim = 1568;
    let { width, height } = img;
    if (Math.max(width, height) > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return url;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ScamCheck() {
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit = (description.trim().length >= 10 || attachments.length > 0) && !loading;

  async function onFiles(files: FileList | null) {
    if (!files) return;
    const room = MAX_IMAGES - attachments.length;
    const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
    const next: Attachment[] = [];
    for (const f of picked) {
      try {
        const dataUrl = await fileToDataUrl(f);
        next.push({ id: `${f.name}-${f.size}-${next.length}`, dataUrl, name: f.name });
      } catch {
        /* skip unreadable file */
      }
    }
    setAttachments((prev) => [...prev, ...next].slice(0, MAX_IMAGES));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onCheck() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/scam-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          images: attachments.map((a) => a.dataUrl),
        }),
      });
      const data = (await res.json()) as { ok: true; result: ScamCheckResult } | { ok: false; error: string };
      if (data.ok) setResult(data.result);
      else setError(data.error);
    } catch {
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-[var(--avasc-gold)]/30 bg-[var(--avasc-bg-card)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] sm:p-8">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-[var(--avasc-gold-light)]" aria-hidden />
        <h2 className="text-2xl font-semibold text-foreground">Scam Check</h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Tell us anything about your suspected scam case and we&apos;ll check it for you. You can describe
        what happened or upload screenshots of the message, profile, or conversation.
      </p>

      <div className="mt-5">
        <label htmlFor="scam-check-input" className="sr-only">
          Describe your suspected scam
        </label>
        <textarea
          id="scam-check-input"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_CHARS))}
          disabled={loading}
          rows={4}
          placeholder="e.g. I got a text saying my package couldn't be delivered and to pay a small fee at this link… is this real?"
          className="w-full rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg)] px-4 py-3 text-sm text-foreground placeholder:text-[var(--avasc-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--avasc-gold)]"
        />

        {attachments.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {attachments.map((a) => (
              <div key={a.id} className="relative h-20 w-20 overflow-hidden rounded-lg border border-[var(--avasc-border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.dataUrl} alt={a.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== a.id))}
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                  aria-label={`Remove ${a.name}`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading || attachments.length >= MAX_IMAGES}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--avasc-border)] px-4 py-2 text-sm font-medium text-foreground transition hover:border-[var(--avasc-gold)]/50 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" aria-hidden />
            Add screenshots
          </button>
          <span className="text-xs text-[var(--avasc-text-muted)]">
            {attachments.length}/{MAX_IMAGES} images · don&apos;t include passwords or full card numbers
          </span>
          <button
            type="button"
            onClick={onCheck}
            disabled={!canSubmit}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--avasc-gold)] px-6 py-2.5 text-sm font-semibold text-[var(--avasc-bg)] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Check it"}
            {!loading ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      ) : null}

      {result ? <ScamCheckResultView result={result} /> : null}
    </section>
  );
}

function ScamCheckResultView({ result }: { result: ScamCheckResult }) {
  const meta = RISK_META[result.risk];
  return (
    <div className="mt-6 space-y-5 border-t border-[var(--avasc-border)] pt-5">
      <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${TONE_CLASS[meta.tone] ?? TONE_CLASS.slate}`}>
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide">{meta.label}</p>
          <p className="mt-1 text-sm font-medium text-foreground">{result.verdict}</p>
          {result.scamType ? (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Looks like:</span> {result.scamType}
            </p>
          ) : null}
        </div>
      </div>

      {result.signals.length > 0 ? (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Eye className="h-4 w-4 text-[var(--avasc-gold-light)]" aria-hidden />
            What we noticed
          </h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-[var(--avasc-gold-light)]">
            {result.signals.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.whatToDo.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-foreground">What to do now</h3>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground marker:text-[var(--avasc-gold-light)]">
            {result.whatToDo.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      ) : null}

      {result.reporting.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-foreground">Where to report</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {result.reporting.map((r, i) => (
              <li key={i}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--avasc-gold-light)] underline hover:text-[var(--avasc-gold)]"
                >
                  {r.label}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.caution ? (
        <p className="rounded-lg bg-[var(--avasc-bg)] px-4 py-3 text-sm italic leading-relaxed text-muted-foreground">
          {result.caution}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3 pt-1">
        <Link
          href="/report"
          className="rounded-full bg-[var(--avasc-gold)] px-5 py-2.5 text-sm font-semibold text-[var(--avasc-bg)] hover:brightness-110"
        >
          Report this to AVASC
        </Link>
        <Link
          href="/recovery"
          className="rounded-full border border-[var(--avasc-border)] px-5 py-2.5 text-sm font-semibold text-foreground hover:border-[var(--avasc-gold)]/50"
        >
          Recovery help
        </Link>
        <Link
          href="/resources"
          className="rounded-full border border-[var(--avasc-border)] px-5 py-2.5 text-sm font-semibold text-foreground hover:border-[var(--avasc-gold)]/50"
        >
          More resources
        </Link>
      </div>
    </div>
  );
}
