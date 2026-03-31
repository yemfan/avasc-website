# Scam clustering engine (MVP)

## Role

Turns **case ↔ case** outputs from `lib/matching` into **cluster assignment**, **new cluster**, and **merge** recommendations. All logic is **deterministic**, **weighted**, and **explainable** — no LLM dependency.

## Layers

1. **Matcher** (`scoreCaseMatches`, `CaseMatchResult`) — exact normalized indicators, weighted scores, reasons.
2. **Graph** (`buildClusterGraph`) — cases = nodes, edges = matcher scores ≥ `STRONG_EDGE_THRESHOLD`.
3. **Components** (`computeConnectedComponents`) — unclustered communities for “new cluster” drafts.
4. **Fit** (`scoreCaseAgainstCluster`, `computeClusterFitFromMatches`) — how well one case fits an existing cluster’s members.
5. **Merge** (`findClusterMergeSuggestions`) — sums cross-cluster pair scores between member case sets.

## Configuration

All thresholds live in `cluster-config.ts` (tune without rewriting algorithms).

## Public safety

Engine outputs are **`internal_only`** or **`review_suggested`** by default. Publishing uses existing `ScamCluster.publicStatus` + staff review — see `cluster-filters.ts`.

## Future AI/ML

Keep matchers/clustering separated: a future model could propose extra edges or re-rank suggestions; swap implementations behind the same service functions.
