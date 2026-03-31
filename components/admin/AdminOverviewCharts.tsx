"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { name: string; count: number };

export function CasesTrendLine({ data }: { data: Row[] }) {
  if (!data.length) {
    return <p className="text-sm text-slate-500">Not enough data yet.</p>;
  }
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
          <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={2} dot={false} name="Cases" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScamTypeBarChart({ data }: { data: Row[] }) {
  if (!data.length) {
    return <p className="text-sm text-slate-500">Not enough data yet.</p>;
  }
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-28} textAnchor="end" height={60} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="count" fill="#0f172a" radius={[4, 4, 0, 0]} name="Cases" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IndicatorTypeBarChart({ data }: { data: Row[] }) {
  if (!data.length) {
    return <p className="text-sm text-slate-500">No indicators indexed yet.</p>;
  }
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
          <Bar dataKey="count" fill="#334155" radius={[0, 4, 4, 0]} name="Indicators" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
