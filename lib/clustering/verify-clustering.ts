/**
 * Pure checks for graph + utils (no DB). Run: npx tsx lib/clustering/verify-clustering.ts
 */
import assert from "node:assert/strict";
import { IndicatorType } from "@prisma/client";
import type { CaseMatchResult } from "@/lib/matching";
import { mergeUndirectedEdges, computeConnectedComponents } from "./cluster-graph";
import { isStructuralClusterEdge, modeString } from "./cluster-utils";

function stubMatch(partial: Partial<CaseMatchResult> & Pick<CaseMatchResult, "totalScore" | "sharedIndicatorTypes">): CaseMatchResult {
  return {
    matchedCaseId: "other",
    strengthLabel: "LOW",
    matchedIndicators: [],
    reasons: [],
    latestCaseDate: new Date(0),
    scamType: "other",
    title: "t",
    suppressedAsNoise: false,
    ...partial,
  };
}

function testStructuralEdges() {
  assert.equal(
    isStructuralClusterEdge(stubMatch({ totalScore: 20, sharedIndicatorTypes: [IndicatorType.PLATFORM] })),
    false
  );
  assert.equal(
    isStructuralClusterEdge(stubMatch({ totalScore: 40, sharedIndicatorTypes: [IndicatorType.ALIAS] })),
    false
  );
  assert.equal(
    isStructuralClusterEdge(
      stubMatch({ totalScore: 100, sharedIndicatorTypes: [IndicatorType.ALIAS, IndicatorType.SOCIAL_HANDLE] })
    ),
    true
  );
  assert.equal(
    isStructuralClusterEdge(stubMatch({ totalScore: 50, sharedIndicatorTypes: [IndicatorType.WALLET] })),
    true
  );
  assert.equal(
    isStructuralClusterEdge(stubMatch({ totalScore: 125, sharedIndicatorTypes: [IndicatorType.ALIAS] })),
    true
  );
}

function testMergeEdges() {
  const merged = mergeUndirectedEdges([
    { a: "1", b: "2", weight: 10 },
    { a: "2", b: "1", weight: 30 },
  ]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0]!.weight, 30);
}

function testComponents() {
  const graph = {
    nodeIds: ["a", "b", "c"],
    edges: [
      { a: "a", b: "b", weight: 80 },
      { a: "b", b: "c", weight: 70 },
    ],
  };
  const comps = computeConnectedComponents(graph);
  assert.equal(comps.length, 1);
  assert.deepEqual(comps[0], ["a", "b", "c"]);
}

function testMode() {
  assert.equal(modeString(["x", "x", "y"]), "x");
}

function main() {
  testMergeEdges();
  testComponents();
  testMode();
  testStructuralEdges();
  console.log("clustering verify-clustering: OK");
}

main();
