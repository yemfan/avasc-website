import type { ReactNode } from "react";
import { DashboardAlertsNav } from "@/components/alerts/DashboardAlertsNav";

export default function DashboardAlertsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <DashboardAlertsNav />
      {children}
    </div>
  );
}
