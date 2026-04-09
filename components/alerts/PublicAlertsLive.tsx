"use client";

import { useEffect, useState } from "react";

import {
  AvascAlertSection,
  type AlertItem,
} from "@/components/alerts/avasc-alert-section-components";

type ApiResponse = {
  success: boolean;
  items: AlertItem[];
};

export function PublicAlertsLive() {
  const [realtimeAlerts, setRealtimeAlerts] = useState<AlertItem[]>([]);
  const [dailyAlerts, setDailyAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [rtRes, dailyRes] = await Promise.all([
          fetch("/api/public-alerts?type=REALTIME&limit=8", { cache: "no-store" }),
          fetch("/api/public-alerts?type=DAILY&limit=6", { cache: "no-store" }),
        ]);

        const rtData = (await rtRes.json()) as ApiResponse;
        const dailyData = (await dailyRes.json()) as ApiResponse;

        if (!cancelled) {
          setRealtimeAlerts(rtData.success ? rtData.items : []);
          setDailyAlerts(dailyData.success ? dailyData.items : []);
        }
      } catch {
        if (!cancelled) {
          setRealtimeAlerts([]);
          setDailyAlerts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 60_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6 text-sm text-[var(--avasc-text-secondary)]">
        Loading alerts...
      </div>
    );
  }

  return (
    <AvascAlertSection realtimeAlerts={realtimeAlerts} dailyAlerts={dailyAlerts} />
  );
}
