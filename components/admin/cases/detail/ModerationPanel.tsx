import { CaseVisibility, type CaseStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CASE_STATUS_OPTIONS } from "@/lib/admin/case-detail-schemas";
import {
  submitCaseModeration,
  submitCaseQuickAction,
  submitClusterLink,
  submitCreateClusterFromCase,
  submitSuggestCluster,
} from "@/app/admin/cases/[id]/form-actions";

const VIS: CaseVisibility[] = [
  CaseVisibility.private,
  CaseVisibility.anonymized_public,
  CaseVisibility.public_story_candidate,
];

export function ModerationPanel({
  caseId,
  status,
  visibility,
  internalNotes,
  clusters,
  canEdit,
}: {
  caseId: string;
  status: CaseStatus;
  visibility: CaseVisibility;
  internalNotes: string | null;
  clusters: { id: string; title: string; slug: string }[];
  canEdit: boolean;
}) {
  if (!canEdit) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Moderation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Read-only for your role.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-300 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Moderation actions</CardTitle>
        <p className="text-xs text-slate-500">All changes are validated server-side and written to the audit log.</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Quick decisions</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <form action={submitCaseQuickAction}>
              <input type="hidden" name="caseId" value={caseId} />
              <input type="hidden" name="intent" value="approve_anonymized" />
              <Button type="submit" className="h-auto w-full whitespace-normal py-2.5 text-left text-sm" variant="default">
                Approve anonymized publication
              </Button>
            </form>
            <form action={submitCaseQuickAction}>
              <input type="hidden" name="caseId" value={caseId} />
              <input type="hidden" name="intent" value="keep_private" />
              <Button type="submit" className="h-auto w-full whitespace-normal py-2.5 text-sm" variant="secondary">
                Keep private
              </Button>
            </form>
            <form action={submitCaseQuickAction}>
              <input type="hidden" name="caseId" value={caseId} />
              <input type="hidden" name="intent" value="flag_escalation" />
              <Button type="submit" className="h-auto w-full whitespace-normal py-2.5 text-sm" variant="outline">
                Flag for escalation
              </Button>
            </form>
            <form action={submitCaseQuickAction}>
              <input type="hidden" name="caseId" value={caseId} />
              <input type="hidden" name="intent" value="mark_reviewed" />
              <Button type="submit" className="h-auto w-full whitespace-normal py-2.5 text-sm" variant="outline">
                Mark as reviewed
              </Button>
            </form>
          </div>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cluster (this case)</h3>
          <form action={submitClusterLink} className="space-y-3">
            <input type="hidden" name="caseId" value={caseId} />
            <div>
              <Label htmlFor="clusterId-main">Assign to existing cluster</Label>
              <select
                id="clusterId-main"
                name="clusterId"
                required
                className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Select cluster…
                </option>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.slug})
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="secondary">
              Link this case
            </Button>
          </form>

          <form action={submitCreateClusterFromCase} className="space-y-3 border-t border-slate-100 pt-4">
            <input type="hidden" name="caseId" value={caseId} />
            <h4 className="text-sm font-medium text-slate-800">Create new cluster</h4>
            <p className="text-xs text-slate-500">Defaults title and slug from this case when left blank.</p>
            <div>
              <Label htmlFor="newClusterTitle">Title (optional)</Label>
              <Input id="newClusterTitle" name="newClusterTitle" placeholder="Curated cluster title" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="newClusterSlug">Slug (optional)</Label>
              <Input
                id="newClusterSlug"
                name="newClusterSlug"
                placeholder="lowercase-with-dashes"
                className="mt-1 font-mono text-sm"
              />
            </div>
            <Button type="submit" variant="outline">
              Create &amp; link
            </Button>
          </form>

          <form action={submitSuggestCluster} className="border-t border-slate-100 pt-4">
            <input type="hidden" name="caseId" value={caseId} />
            <Button type="submit" variant="ghost" className="w-full sm:w-auto">
              Log cluster suggestion (internal note)
            </Button>
          </form>
        </section>

        <section className="space-y-3 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status &amp; visibility</h3>
          <form action={submitCaseModeration} className="space-y-4">
            <input type="hidden" name="caseId" value={caseId} />
            <div>
              <Label htmlFor="status">Workflow status</Label>
              <select
                id="status"
                name="status"
                defaultValue={status}
                className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm"
              >
                {CASE_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} title={o.description}>
                    {o.label} ({o.value})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <select
                id="visibility"
                name="visibility"
                defaultValue={visibility}
                className="mt-1 flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm"
              >
                {VIS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="internalNotes">Internal notes</Label>
              <Textarea
                id="internalNotes"
                name="internalNotes"
                defaultValue={internalNotes ?? ""}
                rows={5}
                className="mt-1"
              />
            </div>
            <Button type="submit">Save case fields</Button>
          </form>
        </section>
      </CardContent>
    </Card>
  );
}
