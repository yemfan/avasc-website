# AVASC — Anti-scam reporting platform

Production-oriented Next.js (App Router) app for reporting scams, searching normalized indicators, viewing scam profiles, sharing moderated survivor stories, and basic admin review.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS 4**
- **Supabase Auth** (email/password; PKCE callback at `/auth/callback`)
- **Prisma ORM** + **PostgreSQL** (use Supabase Postgres connection strings)
- **AWS S3** presigned uploads for evidence (`/api/evidence/presign` + client `PUT`)

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
   - `DATABASE_URL` (Supabase **connection pooling** URL, port `6543`, `?pgbouncer=true`)
   - `DIRECT_URL` (Supabase **direct** URL, port `5432`) — used by Prisma migrations
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

5. Create schema in Postgres:

   ```bash
   npm run db:migrate
   ```

   (Uses `prisma/migrations` — first migration should be created from `prisma/schema.prisma`.)

6. (Optional) Seed sample indicator rows:

   ```bash
   npm run db:seed
   ```

7. Run the dev server:

   ```bash
   npm run dev
   ```

## Admin users

Roles live in the `User` table (`victim` | `admin` | `moderator`). After your first Supabase login, promote yourself in SQL (Supabase SQL editor), e.g.:

```sql
update "User" set role = 'admin' where email = 'you@example.com';
```

## Legacy static site

The previous static export is preserved under `_legacy_static/` (original `index.html`, `Images/`, etc.).

## Security notes

- Case narratives default to **private**; public endpoints never return `narrativePrivate`.
- Comments reject URL-like patterns (MVP).
- Evidence uploads require authenticated reporter and matching `caseId` in the storage key prefix.
