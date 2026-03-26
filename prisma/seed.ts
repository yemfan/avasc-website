/**
 * Example seed — run after migrations: `npm run db:seed`
 * Requires DATABASE_URL. Does not create Supabase auth users.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.scamEntity.createMany({
    data: [
      {
        type: "domain",
        normalizedValue: "example-scam.net",
        reportCount: 3,
        riskScore: 29,
      },
      {
        type: "wallet",
        normalizedValue: "0xdeadbeef000000000000000000000000000000",
        reportCount: 12,
        riskScore: 96,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete (sample scam_entities).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
