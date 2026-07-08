-- Give unsubscribeToken a DATABASE-level default so any insert that omits it
-- (e.g. a request served by a stale generated Prisma client during a deploy, when
-- Prisma's client-side @default(uuid()) isn't yet aware of the column) still gets a
-- token instead of tripping the NOT NULL constraint. Belt-and-suspenders alongside
-- the schema default.
ALTER TABLE "Subscription" ALTER COLUMN "unsubscribeToken" SET DEFAULT gen_random_uuid()::text;
