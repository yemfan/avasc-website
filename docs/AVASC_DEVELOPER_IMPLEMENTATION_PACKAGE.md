# AVASC Developer Implementation Package

This document is the handoff package for implementing the AVASC platform end to end.

**AVASC** = Association of Victims Against Cyber-Scams  
**Domain:** [avasc.org](https://avasc.org)

---

## 1. Objective

Build AVASC as a production-ready scam intelligence platform with:

- public scam database
- public scam profile pages
- victim report intake
- indicator extraction and clustering
- admin moderation for cases and clusters
- realtime and daily alert surfaces
- subscription and alert center system

---

## 2. Tech stack

Use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Resend
- Twilio

---

## 3. Brand tokens

Use these global design tokens:

```css
--avasc-gold: #C58B2B;
--avasc-gold-light: #F5C96A;
--avasc-gold-dark: #8B5E1A;
--avasc-blue: #0B1F3A;
--avasc-bg: #050A14;
--avasc-bg-soft: #0F172A;
--avasc-bg-card: #111827;
--avasc-border: #1E293B;
--avasc-divider: #263041;
--avasc-text-secondary: #9CA3AF;
--avasc-text-muted: #6B7280;
```

UI should feel:

- serious
- trustworthy
- premium
- dark intelligence aesthetic
- restrained, not flashy

---

## 4. Required routes

### Public

- `/`
- `/database`
- `/database/[slug]`
- `/report`
- `/alerts/subscribe`
- `/api/public-alerts` (see `app/api/public-alerts/route.ts`)
- `/api/alerts/public-subscribe`

### Dashboard

- `/dashboard/alerts`
- `/dashboard/alerts/following`
- `/dashboard/alerts/preferences`

### Admin

- `/admin/cases`
- `/admin/cases/[id]`
- `/admin/clusters`
- `/admin/clusters/[id]`
- `/admin/alerts` (site / ScamAlert announcements)
- `/admin/alerts/visibility` (outbound `Alert` visibility — public surfaces)

---

## 5. Generated implementation artifacts already defined

Use these as the source implementation set. Names are conceptual; **see [Appendix A](#appendix-a-repository-path-mapping)** for paths in this repo.

### Public + product

- `avasc-homepage-production-skeleton.tsx`
- `avasc-public-database-page.tsx`
- `avasc-public-scam-profile-page.tsx`
- `avasc-report-flow.tsx`

### Matching engine

- `avasc-indicator-parser-and-clustering-engine.ts`
- `avasc-prisma-service-layer-for-matching.ts`

### Admin moderation

- `avasc-admin-review-workflow.tsx`
- `avasc-admin-review-server-actions.ts`
- `avasc-admin-case-review-page-production.tsx`
- `avasc-admin-cases-list-page-production.tsx`
- `avasc-admin-cases-list-actions.ts`

### Cluster management

- `avasc-admin-cluster-page-production.tsx`
- `avasc-admin-cluster-server-actions.ts`
- `avasc-admin-clusters-list-page-production.tsx`
- `avasc-admin-clusters-list-actions.ts`

### Alerts

- `avasc-alert-section-components.tsx`
- `avasc-alert-section-api-and-loader.ts`
- `avasc-alert-route-and-homepage-integration.md` (this package supersedes a standalone alert-only doc; alert wiring is summarized in §12 and Appendix A)
- `avasc-admin-alert-visibility-controls.tsx`
- `avasc-admin-alert-visibility-actions.ts`

### Master spec

- `avasc-cursor-master-implementation-prompt.md`

---

## 6. Build order

### Phase 1 — foundation

- app shell
- layouts
- theme tokens
- prisma setup
- auth setup

### Phase 2 — schema + seed

- prisma schema
- migrations
- seed data

### Phase 3 — public funnel

- homepage
- database
- scam profile
- report flow

### Phase 4 — report persistence

- report save
- evidence storage
- case creation

### Phase 5 — matching engine

- indicator extraction
- matching
- persistence
- cluster suggestions

### Phase 6 — admin case workflow

- cases list
- case review
- moderation actions

### Phase 7 — admin cluster workflow

- clusters list
- cluster detail
- publish and merge

### Phase 8 — alert system

- public alerts section
- realtime ticker
- daily feed
- subscriptions
- digests

### Phase 9 — dashboard alert center

- following
- preferences
- unread count

### Phase 10 — hardening

- permissions
- validation
- rate limiting
- cron checks
- QA

---

## 7. Prisma migration checklist

Confirm these models exist and are wired correctly:

- User
- Case
- CaseIndicator
- EvidenceFile
- ScamCluster
- ScamClusterCase
- ClusterIndicatorAggregate
- ClusterSuggestion
- CaseMatchCache
- Subscription
- ClusterSubscription
- Alert
- AlertDeliveryLog
- UserAlertFeedItem
- DigestRun
- SubscriptionDigestLog
- Donation

**Alert model must include visibility fields:**

```prisma
isPublicVisible    Boolean  @default(true)
isRealtimeVisible  Boolean  @default(false)
isHomepageVisible  Boolean  @default(false)
isDailyFeedVisible Boolean  @default(false)
```

---

## 8. Public safety rules

These are required:

1. Victim details are private by default.
2. Only moderator-approved public-safe indicators appear on public pages.
3. Publishing a cluster requires:
   - title
   - summary
   - at least one public indicator
4. Realtime public ticker should show only high-confidence alerts.
5. Public alert surfaces should obey alert visibility flags.

---

## 9. Matching engine rules

On report submission:

1. create case
2. extract indicators
3. normalize indicators
4. persist CaseIndicator rows
5. load cluster candidates
6. score matches
7. persist CaseMatchCache
8. persist ClusterSuggestion
9. assign to cluster if confidence is high
10. rebuild aggregates if linked
11. update case status

---

## 10. Admin workflow rules

### Case review

Moderators must be able to:

- edit indicators
- toggle verified/public
- recompute matching
- approve/reject suggestion
- force assign to cluster
- create new cluster from suggestion

### Cluster review

Moderators must be able to:

- edit title, summary, risk
- edit public indicators
- publish / internal / draft
- merge clusters
- refresh public search

### Alert review

Moderators must be able to choose whether an alert is visible in:

- public surfaces
- realtime ticker
- homepage section
- daily feed

---

## 11. Search / public database requirements

`/database` must support:

- text search
- scam type filter
- risk filter
- indicator type filter
- result cards
- realtime compact strip

`/database/[slug]` must support:

- summary
- red flags
- common script
- safety warning
- recommended next step
- report matching case CTA
- follow this scam form
- grouped public indicators
- related scam profiles

---

## 12. Alert surface requirements

### Homepage

- full alert section
- realtime rolling ticker
- daily alert cards

### Database page

- compact realtime strip

### Alert center

- unread badge
- mark read
- mark all read
- following page
- preferences page

---

## 13. Suggested file structure

```
app/
  page.tsx
  database/
    page.tsx
    [slug]/page.tsx
  report/page.tsx
  alerts/
    subscribe/page.tsx
  dashboard/
    alerts/page.tsx
    alerts/following/page.tsx
    alerts/preferences/page.tsx
  admin/
    alerts/page.tsx
    alerts/visibility/page.tsx
    cases/page.tsx
    cases/[id]/page.tsx
    clusters/page.tsx
    clusters/[id]/page.tsx
  api/
    public-alerts/route.ts
    alerts/public-subscribe/route.ts
    alerts/unsubscribe/route.ts
    alerts/evaluate-cluster/route.ts
    cron/...

components/
  alerts/
  admin/
  dashboard/
  marketing/
  public/

lib/
  prisma.ts
  alerts/
  admin/
  matching/
  auth/
```

---

## 14. Environment checklist

Set these before deployment:

```
DATABASE_URL=   # Supabase Session pooler URI (single URL for app + Prisma migrate; no DIRECT_URL)
NEXT_PUBLIC_APP_URL=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RESEND_API_KEY=
AVASC_FROM_EMAIL=
CRON_SECRET=
INTERNAL_API_SECRET=
```

---

## 15. QA checklist

Before launch, verify:

### Public

- homepage loads
- alert section loads
- database search works
- scam profile page works
- report form submits

### Matching

- indicators are extracted
- suggestions are created
- high-confidence case can link to cluster

### Admin

- cases list loads
- case review mutations work
- clusters list loads
- cluster page edits save
- publish validation works
- merge works safely

### Alerts

- public alert API works
- homepage ticker renders
- admin visibility controls affect public surfaces
- realtime and daily feed honor visibility flags
- alert center unread badge updates

---

## 16. Final instruction to developer

Do not implement these pieces as isolated demos.  
Build them as one integrated AVASC application.

Start with schema + layout + public funnel, then wire report persistence, then matching, then admin moderation, then alerts.

Refactor repeated UI into shared components where helpful, but prioritize working product flow over premature abstraction.

---

## Appendix A: Repository path mapping

| Conceptual artifact | Location in this repo (when present) |
|---------------------|--------------------------------------|
| Alert section UI barrel | `components/alerts/avasc-alert-section-components.tsx` |
| Alert data loader / API barrel | `lib/alerts/avasc-alert-section-api-and-loader.ts` |
| Public alert query helpers | `lib/alerts/public-alerts.ts`, `lib/alerts/build-public-alert-where.ts` |
| Public alerts HTTP API | `app/api/public-alerts/route.ts` |
| Admin alert visibility | `lib/admin/avasc-admin-alert-visibility-actions.ts`, `app/admin/alerts/visibility/page.tsx` |
| Homepage | `app/page.tsx` |
| Public database | `app/database/page.tsx`, `components/avasc/public-database/` |
| Marketing homepage skeleton (legacy / optional) | `components/marketing/AvascHomepageProductionSkeleton.tsx` |

---

## Related docs

- `docs/ARCHITECTURE.md` — architecture notes  
- `docs/PLATFORM_STRUCTURE.md` — platform structure  
- `README.md` — project README  
