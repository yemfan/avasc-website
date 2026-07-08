import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSocialAutopilot } from "@/lib/social/settings";
import { listDailyPostsForAdmin } from "@/lib/social/daily-queries";
import {
  setAutopilotFormAction,
  approvePostFormAction,
  rejectPostFormAction,
} from "@/lib/social/daily-actions";

function statusMeta(status: string): { label: string; variant: "success" | "warning" | "secondary" | "danger" } {
  switch (status) {
    case "posted":
      return { label: "Posted", variant: "success" };
    case "partial":
      return { label: "Partly posted", variant: "warning" };
    case "pending":
      return { label: "Awaiting approval", variant: "warning" };
    case "generated":
      return { label: "Published (no social tokens)", variant: "secondary" };
    case "failed":
      return { label: "Failed", variant: "danger" };
    case "rejected":
      return { label: "Rejected", variant: "danger" };
    default:
      return { label: status, variant: "secondary" };
  }
}

/** Autopilot toggle + approval queue for the daily social posts. */
export async function DailyAutopilotAdmin() {
  const [autopilot, posts] = await Promise.all([getSocialAutopilot(), listDailyPostsForAdmin(20)]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-slate-900">Daily auto-posting</CardTitle>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              {autopilot
                ? "Autopilot is ON — each day's post publishes automatically to connected platforms."
                : "Approval required — each day's post is generated and held below for you to review, then approve or reject."}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Current mode:{" "}
              <span className={autopilot ? "font-semibold text-emerald-600" : "font-semibold text-amber-600"}>
                {autopilot ? "Autopilot" : "Approval required"}
              </span>
            </p>
          </div>
          <form action={setAutopilotFormAction.bind(null, !autopilot)}>
            <button
              type="submit"
              className={
                autopilot
                  ? "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  : "rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              }
            >
              {autopilot ? "Switch to approval" : "Turn on autopilot"}
            </button>
          </form>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Recent daily posts</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No daily posts yet — the daily cron generates one each day.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {posts.map((p) => {
                const preview =
                  p.posts.find((pp) => pp.platform === "x")?.body ?? p.posts[0]?.body ?? "(no content)";
                const meta = statusMeta(p.status);
                return (
                  <li key={p.id} className="space-y-2 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-900">{p.themeLabel}</span>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <span className="text-xs text-slate-500">{p.date}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-slate-600">{preview}</p>
                    {p.status === "pending" ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <form action={approvePostFormAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Approve &amp; post
                          </button>
                        </form>
                        <form action={rejectPostFormAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
