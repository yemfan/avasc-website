-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_scamClusterId_fkey" FOREIGN KEY ("scamClusterId") REFERENCES "ScamCluster"("id") ON DELETE SET NULL ON UPDATE CASCADE;
