import type { PublicScamSearchResult } from "@/lib/public-database/public-search-types";
import { ScamProfileCard } from "@/components/avasc/ScamProfileCard";

type PublicScamProfileCardProps = {
  result: PublicScamSearchResult;
};

/** Public database search row — renders the shared AVASC `ScamProfileCard`. */
export function PublicScamProfileCard({ result }: PublicScamProfileCardProps) {
  return <ScamProfileCard result={result} />;
}
