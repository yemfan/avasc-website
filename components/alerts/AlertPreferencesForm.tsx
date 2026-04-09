import {
  saveAlertPreferencesAction,
  unsubscribeAllAlertsAction,
} from "@/app/dashboard/alerts/actions";

export type PreferencesSnapshot = {
  id: string;
  email: string | null;
  phone: string | null;
  smsEnabled: boolean;
  emailDaily: boolean;
  emailWeekly: boolean;
  isActive: boolean;
} | null;

export function AlertPreferencesForm({ subscription }: { subscription: PreferencesSnapshot }) {
  return (
    <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <form action={saveAlertPreferencesAction} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="pref-phone">
              Phone
            </label>
            <input
              id="pref-phone"
              name="phone"
              type="tel"
              defaultValue={subscription?.phone ?? ""}
              className="w-full rounded-lg border border-border px-4 py-3 text-sm"
              placeholder="+16265551234"
              autoComplete="tel"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="pref-email">
              Email
            </label>
            <input
              id="pref-email"
              name="email"
              type="email"
              defaultValue={subscription?.email ?? ""}
              className="w-full rounded-lg border border-border px-4 py-3 text-sm"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-border p-4">
          <input
            name="smsEnabled"
            type="checkbox"
            defaultChecked={subscription?.smsEnabled ?? false}
            className="mt-1"
          />
          <div>
            <div className="font-medium">Realtime SMS alerts</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Receive critical realtime alerts by text message.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-border p-4">
          <input
            name="emailDaily"
            type="checkbox"
            defaultChecked={subscription?.emailDaily ?? false}
            className="mt-1"
          />
          <div>
            <div className="font-medium">Daily email digest</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Receive daily updates and newly detected scam patterns.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 rounded-xl border border-border p-4">
          <input
            name="emailWeekly"
            type="checkbox"
            defaultChecked={subscription?.emailWeekly ?? false}
            className="mt-1"
          />
          <div>
            <div className="font-medium">Weekly intelligence report</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Receive weekly summaries and trend analysis.
            </div>
          </div>
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Save Preferences
          </button>
        </div>
      </form>

      <form action={unsubscribeAllAlertsAction} className="mt-4">
        <button
          type="submit"
          className="rounded-lg border border-border px-5 py-3 text-sm font-medium text-red-400"
        >
          Unsubscribe All
        </button>
      </form>
    </section>
  );
}
