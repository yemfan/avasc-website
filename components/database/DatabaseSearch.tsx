"use client";

import Link from "next/link";
import { useState } from "react";

type Entity = {
  id: string;
  type: string;
  normalizedValue: string;
  riskScore: number;
  reportCount: number;
  lastSeenAt: string;
};

export function DatabaseSearch() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [scamType, setScamType] = useState("");
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (type) params.set("type", type);
      if (scamType.trim()) params.set("scamType", scamType.trim());
      const res = await fetch(`/api/database/search?${params.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as { success?: boolean; entities?: Entity[]; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "Search failed");
      setEntities(json.entities ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={search} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Search</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Phone, email fragment, domain, wallet…"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Indicator type</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Any</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="domain">Domain</option>
              <option value="wallet">Wallet</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Filter public cases by scam type (optional)</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={scamType}
            onChange={(e) => setScamType(e.target.value)}
            placeholder="e.g. phishing"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </form>

      <div className="space-y-3">
        {entities.map((ent) => (
          <div
            key={ent.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{ent.type}</p>
                <p className="mt-1 font-mono text-sm text-slate-900">{ent.normalizedValue}</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-semibold text-slate-900">Risk {ent.riskScore}/100</p>
                <p className="text-slate-600">{ent.reportCount} linked reports</p>
              </div>
            </div>
            <Link
              href={`/database/entity/${ent.id}`}
              className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
            >
              View scam profile
            </Link>
          </div>
        ))}
        {entities.length === 0 && !loading ? (
          <p className="text-sm text-slate-600">Run a search to see aggregated indicators.</p>
        ) : null}
      </div>
    </div>
  );
}
