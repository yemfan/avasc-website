import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrisma(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Admin console uses Prisma against Postgres; add your Supabase direct connection string."
    );
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Lazy init so `next build` can run without DATABASE_URL (e.g. Vercel preview env). */
function getOrCreatePrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrisma();
  }
  return globalForPrisma.prisma;
}

/**
 * Same singleton as `prisma`; proxies to a lazily created client so importing this module
 * does not throw during build when DATABASE_URL is unset.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getOrCreatePrisma();
    const value = Reflect.get(client, prop, client);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

/** Same singleton as `prisma`; use either import style across the app. */
export function getPrisma(): PrismaClient {
  return getOrCreatePrisma();
}
