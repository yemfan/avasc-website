# AVASC Architecture (Phase 1 Foundation)

This structure keeps public, victim, and admin concerns separated while centralizing security, ownership, and privacy-safe data shaping.

## App Routes

- `app/(public)/` marketing and public education pages (`/`, `/about`, `/donate`, `/recovery`)
- `app/report/` scam reporting flow and APIs
- `app/database/` public scam profile search + detail pages
- `app/stories/` public approved survivor stories
- `app/dashboard/` authenticated victim portal
- `app/admin/` staff/admin console and moderation workflows
- `app/api/` route handlers for server-only operations (uploads, search endpoints, callbacks)

## Shared Components

- `components/ui/` shadcn-style primitives (buttons, inputs, cards, etc.)
- `components/public-*` public-facing cards, hero blocks, filters
- `components/victim-dashboard/` supportive dashboard cards/checklists/status components
- `components/admin/` operational admin panels and dense workflow components
- `components/report/` multi-step report wizard blocks

## Services and Domain Logic

- `lib/auth/`
  - `session.ts` central server auth context loading
  - `roles.ts` RBAC role predicates/capabilities
  - `ownership.ts` ownership assertions for case/story/support entities
- `lib/report/` report intake schemas, transforms, persistence
- `lib/victim-dashboard/` victim-safe services and view shaping
- `lib/admin/` staff queries, workflows, audit logging
- `lib/public-database/` privacy-safe public profile and search shaping
- `lib/matching/` indicator normalization, matching, score/reason building
- `lib/clustering/` explainable cluster suggestion and merge logic
- `lib/recovery/` recovery content registry and helpers

## Data + Schema

- `prisma/schema.prisma` canonical model definitions and enums
- `prisma/seed.ts` realistic deterministic seed scenarios
- `supabase/migrations/` SQL migrations applied in order

## Types and Contracts

- `types/` route-level DTOs and view model types (recommended for next phase)
- prefer narrow response types from services over passing Prisma models to UI

## Security Baseline

- Route protection at layout/page level for `dashboard` and `admin`
- Server-side ownership checks for all victim mutations and detail reads
- Admin-only notes and internal fields excluded from victim/public services
- Public pages only consume privacy-safe shaping services
