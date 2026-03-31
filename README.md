# AVASC — Anti-scam reporting platform

Production-oriented Next.js (App Router) app for reporting scams, searching normalized indicators, viewing scam profiles, sharing moderated survivor stories, and basic admin review.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Supabase Auth** (email/password; PKCE callback at `/auth/callback`)
- **Prisma ORM** + **PostgreSQL** (staff console reads/writes via Prisma; `DATABASE_URL` required for `/admin`)
- **Radix + CVA + shadcn-style UI primitives** under `components/ui/` (Tailwind-aligned with the public site)
- **Recharts** on the admin overview
- **AWS S3** presigned uploads for evidence (`/api/evidence/presign` + client `PUT`; staff GET uses `presignEvidenceGet` for review)

## Prerequisites

- Node.js 20+
- A Supabase project (Auth + Database)
- AWS credentials + S3 bucket for evidence (optional for local dev without uploads)

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in:

   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL` (Supabase Postgres — direct `5432` URL for Prisma migrate, or pooler `6543` with `?pgbouncer=true` for serverless query patterns)
   - `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_AVASC` (for evidence uploads)
   - `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)

3. In Supabase **Auth → URL configuration**, add:

   - Site URL: `http://localhost:3000` (or production URL)
   - Redirect URLs: `http://localhost:3000/auth/callback`

4. Install and generate Prisma client:

   ```bash
   npm install
   npm run db:generate
   ```

5. Apply SQL migrations in Supabase (**SQL editor** or CLI), in order:

   - `supabase/migrations/20260325120000_init.sql`
   - `supabase/migrations/20260325140000_platform_extensions.sql`
   - `supabase/migrations/20260326120000_admin_staff_fields.sql` (viewer role, `User.name`, case notes, indicator flags, story `publishedAt`, cluster editorial fields, etc.)

   Alternatively, after aligning `DATABASE_URL`, use `npx prisma db push` or `npm run db:migrate` once Prisma migration history is initialized from `prisma/schema.prisma`.

6. (Optional) Load deterministic demo rows for the staff UI:

   ```bash
   npm run db:seed
   ```

7. Run the dev server:

   ```bash
   npm run dev
   ```

## Staff console (`/admin`)

- **Auth**: Supabase session + `User` row. Layout calls `requireStaff()`; only `admin`, `moderator`, and `viewer` may enter. Everyone else is redirected to `/dashboard`.
- **Data**: Server Components and **server actions** use **Prisma** (`lib/prisma.ts`). Configure **`DATABASE_URL`** to your Supabase Postgres connection or the console will throw at runtime.
- **RBAC** (`lib/admin/permissions.ts`):
  - **admin** — full access, including cluster merge and **Users** page.
  - **moderator** — case/story/comment/support/alert workflows; cannot merge clusters or edit roles.
  - **viewer** — read-only UI (forms hidden/disabled where enforced server-side).
- **Routes**: `/admin` (KPIs + charts), `/admin/cases`, `/admin/cases/[id]`, `/admin/stories`, `/admin/stories/[id]`, `/admin/comments`, `/admin/clusters`, `/admin/clusters/[id]`, `/admin/support`, `/admin/alerts`, `/admin/users` (admin-only), `/admin/audit`.
- **Audit**: `writeAuditLog` records key mutations (cases, indicators, stories, comments, clusters, support, alerts, user roles).

### Promote staff accounts

Roles live in the `User` table (`victim` | `admin` | `moderator` | `viewer`). After your first Supabase login, promote yourself in SQL (Supabase SQL editor), e.g.:

```sql
update "User" set role = 'admin' where email = 'you@example.com';
```

Or use **Admin → Users** once you already have an admin account.

## Legacy static site

The previous static export is preserved under `_legacy_static/` (original `index.html`, `Images/`, etc.).

## Security notes

- Case narratives default to **private**; public endpoints never return `narrativePrivate`.
- Comments reject URL-like patterns (MVP).
- Evidence uploads require authenticated reporter and matching `caseId` in the storage key prefix.
