# AVASC alert route + homepage integration

This note is folded into the main handoff: **[AVASC Developer Implementation Package](./AVASC_DEVELOPER_IMPLEMENTATION_PACKAGE.md)** (see §4 routes, §12 alert surfaces, §15 QA alerts, and Appendix A).

## Quick reference

| Piece | Location |
|-------|----------|
| `GET /api/public-alerts` | `app/api/public-alerts/route.ts` |
| Loader + `getPublicAlerts` / homepage data | `lib/alerts/avasc-alert-section-api-and-loader.ts` → `lib/alerts/public-alerts.ts` |
| Where-clause helpers (visibility flags) | `lib/alerts/build-public-alert-where.ts` |
| UI barrel (`AvascAlertSection`, `AlertStripCompact`, …) | `components/alerts/avasc-alert-section-components.tsx` |
| Homepage (server-loaded alerts) | `app/page.tsx` |
| Database compact strip | `app/database/page.tsx` + `AvascPublicDatabaseView` |
| Optional client polling | `components/alerts/PublicAlertsLive.tsx` |
| Admin visibility | `app/admin/alerts/visibility/page.tsx`, `lib/admin/avasc-admin-alert-visibility-actions.ts` |

## Behavior

- **Homepage** uses `getHomepageAlertSectionData()` and passes realtime + daily lists into `AvascAlertSection` (homepage visibility flags apply via `buildPublicAlertWhere` + `forHomepage`).
- **Database** loads realtime alerts (compact strip) with the same public loader, stricter visibility for ticker-only surfaces.
- **API** returns `{ success, items }` from `getPublicAlerts` (no homepage-only filter unless you add a query param later).

For the full platform spec, build order, Prisma checklist, and safety rules, use **`docs/AVASC_DEVELOPER_IMPLEMENTATION_PACKAGE.md`**.
