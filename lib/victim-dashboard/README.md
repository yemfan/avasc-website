# Victim dashboard (AVASC)

Server-first data access for `/dashboard/**`. UI lives under `app/dashboard/` and `components/victim-dashboard/`.

## Auth and ownership

- `requireAuthUser()` (`session.ts`) resolves the Supabase session and ensures a `User` row exists (`ensureAppUser` pattern elsewhere in the app).
- **Cases**: `getUserCaseDetail`, `getUserCases`, and `assertCaseOwnedByUser` filter by `Case.reporterUserId === userId`. Never pass `userId` from the client.
- **Stories**: `authorUserId` must match; `getUserStoryForEdit` and `saveUserStory` verify on read/update/create (linked case uses `assertCaseOwnedByUser`).
- **Support**: `SupportRequest.userId` must match; create path validates optional `caseId` ownership.

## Privacy

- Case detail queries **omit** `internalNotes` and other staff-only fields.
- **Support requests**: victim UI reads **`submittedNote` only** (immutable message from submit). Staff may edit **`notes`** for internal triage — that field must never appear on victim-facing pages.
- **Similar patterns**: only `getVictimSafePublishedClustersForCase` / `countPublishedPatternsLinkedToUserCases` — published cluster metadata, no other victims’ indicators or match internals.
- **Evidence**: filenames/URLs come from stored keys; downloads should use presigned URLs where applicable.

## Validation

- Mutations: `createSupportRequestSchema`, `saveStorySchema` (Zod). Server actions parse with `safeParse` before calling services.

## Seed data for manual testing

`prisma/seed.ts` creates `victim.seed@avasc.local` (`VICTIM_ID`) with linked cases, stories, and support requests. Sign in with a dev account mapped to that user (or equivalent auth wiring) to exercise the dashboard end-to-end.
