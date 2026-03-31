import type { AdminCaseDetail } from "@/lib/admin/get-admin-case-detail";

type AdminCaseSupportCardProps = {
  supportRequests: AdminCaseDetail["supportRequests"];
  clusterLinks: AdminCaseDetail["clusterLinks"];
  stories: AdminCaseDetail["stories"];
};

export function AdminCaseSupportCard({ supportRequests, clusterLinks, stories }: AdminCaseSupportCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Support & Links</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li>Support requests: {supportRequests.length}</li>
        <li>Cluster links: {clusterLinks.length}</li>
        <li>Stories: {stories.length}</li>
      </ul>
    </section>
  );
}
