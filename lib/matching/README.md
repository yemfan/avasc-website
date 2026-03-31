# Indicator matching engine

## Purpose

Links `Case` records through normalized `CaseIndicator` rows using **exact** `(type, value)` equality, weighted by indicator class. Outputs are **ranked**, **explainable**, and safe to filter for **internal staff** vs **public/victim** views.

## Data contract

- Prisma stores the normalized fingerprint in `CaseIndicator.value` (see `normalizeIndicatorValue` at ingest).
- `rawValue` is optional human/source text; matching does not read `rawValue`.
- Indexes: composite `(type, value)` for candidate lookup; `caseId` for loading a case’s indicators.

## Pipeline

1. **Load** indicators for the source case (`loadCaseIndicatorsForMatching`).
2. **Filter** by mode:
   - `internal`: all indicators (respect confidence cutoff when `includeLowConfidence` is false).
   - `public`: only `isPublic` source indicators; candidate query requires `isPublic` on the **target** row too so private victim data never joins.
3. **Collapse** duplicate `(type, value)` on the source so score is not double-counted (`buildSourcePairMap`).
4. **Query** other cases’ indicators in OR-chunks (`queryCandidateIndicators`) — avoids huge single OR clauses.
5. **Aggregate** per target case with deduped pair keys (`aggregateCaseMatches`).
6. **Explain** with `buildModeratorReasons` (internal staff) or anonymized lines via `explainForMode` (public).
7. **Rank** with `sortCaseMatchResults` (`match-ranking.ts` + `PRIORITY_SIGNAL_TYPES` in `match-config.ts`).
8. **Filter** by minimum score, noisy platform-only rows, and limit.

## Ranking

Results are sorted so matches containing any **`PRIORITY_SIGNAL_TYPES`** signal (tx hash, wallet, domain, email, phone) always appear **before** matches that only use weaker types — even if the weak match has a higher numeric score from stacking aliases/social/platform. Within each tier, sort by `totalScore`, then `latestCaseDate`.

## Scoring

Weights live in `match-config.ts` (`EXACT_MATCH_WEIGHTS`). Strength bands map total score to `LOW | MEDIUM | HIGH | CRITICAL`.

## Extending

- **Fuzzy / Levenshtein**: implement in `fuzzySimilarityContribution` and add a second pass over candidate sets (keep exact path for auditability).
- **Caching**: see `match-cache.ts` sketch for `CaseMatchCache` invalidation rules.

## Callsites

- Admin: `getSimilarCases({ mode: "internal", minimumScore: 1 })`, `suggestScamClusters`.
- Victim/public: `getSimilarCases({ mode: "public" })` (score floor enforced in `filterMatchesForView`) + `projectToPublicSummaries`.

## Verification

Run `npm run test:matcher` for deterministic normalizer + aggregation checks (no DB).
