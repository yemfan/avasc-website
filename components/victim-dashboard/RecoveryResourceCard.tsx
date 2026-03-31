import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const RESOURCES = [
  {
    href: "/recovery",
    title: "Recovery center",
    body: "Guides for crypto, romance, bank fraud, and recovery scam warnings.",
  },
  {
    href: "/database",
    title: "Scam pattern database",
    body: "See anonymized patterns that may resemble what you experienced.",
  },
];

export function RecoveryResourceCard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {RESOURCES.map((r) => (
        <Card key={r.href} className="border-slate-200 p-5 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="font-semibold text-slate-900">{r.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{r.body}</p>
          <Link
            href={r.href}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-900 hover:underline"
          >
            Open
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      ))}
    </div>
  );
}
