# AVASC platform — proposed structure

This repo ships a **Next.js App Router** app with **Supabase Auth + Postgres** (service role for server mutations) and **S3-compatible** evidence uploads. **Prisma** is the **canonical relational model** for migrations, `prisma generate`, and future consolidation (you can point `DATABASE_URL` at Supabase’s Postgres connection string).

## Top-level layout

```
app/
  (public marketing & flows)
  page.tsx                    # Homepage
  report/                     # Multi-step report wizard
  database/                   # Public indicator search + entity detail
  stories/                    # Survivor stories (moderated)
  recovery/                   # Recovery center (resources)
  about/ | donate/            # Trust & fundraising
  login/ | signup/           # Auth (Supabase)
  auth/callback/              # OAuth / magic link
  dashboard/                  # Victim app shell (cases, support, stories)
  admin/                      # Moderator / admin console
  api/                        # Route handlers (JSON, uploads, rate limits)

components/
  layout/                     # AppShell, marketing header/footer, dashboard shell
  report/                     # Wizard steps, stepper, evidence dropzone
  database/                   # Search, filters, result cards
  stories/                    # Story list, composer, comments
  recovery/                   # Category modules, checklists
  admin/                      # Tables, review drawers, cluster tools
  ui/                         # shadcn primitives (when initialized)

lib/
  supabase/                   # Browser + server + service clients
  report/                     # Zod schemas, normalization helpers
  db/                         # Typed query helpers (optional Prisma client)
  indicators.ts               # Normalize indicators for matching
  entity-linking.ts           # Case → ScamEntity links
  comment-policy.ts           # Public comment safety
  risk.ts                     # Risk scoring
  s3.ts                       # Presigned uploads

prisma/
  schema.prisma               # Source of truth for tables & relations
  migrations/                 # prisma migrate (or mirror supabase/migrations)

supabase/migrations/          # SQL applied in Supabase (or generated from Prisma)

public/                       # Static assets

docs/
  PLATFORM_STRUCTURE.md       # This file
```

## Route map (target)

| Area    | Routes |
|---------|--------|
| Public  | `/`, `/report`, `/database`, `/database/entity/[id]`, `/stories`, `/recovery`, `/about`, `/donate`, `/login`, `/signup` |
| App     | `/dashboard`, `/dashboard/cases`, `/dashboard/cases/[id]`, `/dashboard/stories`, `/dashboard/support` |
| Admin   | `/admin`, `/admin/cases`, `/admin/cases/[id]`, `/admin/stories`, `/admin/clusters`, `/admin/alerts` |

## Stack notes (tradeoffs)

- **Auth:** Supabase Auth is wired today; **Auth.js / Clerk** can replace it with the same `User` profile row (`id` = auth user id).
- **ORM:** **Prisma** models match Postgres; runtime queries may still use Supabase until you switch imports to `prisma.*`.
- **Uploads:** S3 presign is implemented; **UploadThing** can replace `lib/s3.ts` + `/api/evidence/*` with minimal UI changes.
- **UI:** Tailwind v4 is in use; run `npx shadcn@latest init` when you want **shadcn/ui** primitives under `components/ui/`.

## Security & privacy (non-negotiables)

- Default case visibility **private**; public content is **anonymized** and moderated.
- Admin routes gated by `User.role` (`admin` | `moderator`).
- Validate uploads (type + size); never expose `narrativePrivate` on public routes.
- Rate-limit report POST and auth-sensitive APIs (middleware or edge config).
