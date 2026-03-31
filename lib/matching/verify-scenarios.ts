/**
 * Deterministic checks for normalizers + pure aggregation (no database).
 * Run: npm run test:matcher
 */
import assert from "node:assert/strict";
import {
  normalizeWallet,
  normalizeDomain,
  normalizeEmail,
  normalizePhone,
  normalizeTxHash,
  normalizeSocialHandle,
  normalizeAlias,
  normalizePlatform,
} from "./indicator-normalizers";
import { aggregateCaseMatches, buildSourcePairMap, pairKey, type SourceIndicatorInput } from "./aggregate-matches";
import { sortCaseMatchResults } from "./match-ranking";
import type { CaseMatchResult } from "./match-types";
import { IndicatorType } from "@prisma/client";

function testNormalizers() {
  assert.equal(normalizeEmail("  Foo@BAR.COM "), "foo@bar.com");
  assert.equal(normalizeDomain("HTTPS://WWW.Example.com/path?q=1"), "example.com");
  assert.equal(normalizePhone("+1 (555) 123-4567"), "+15551234567");
  assert.equal(normalizeWallet("0xAbCdEf"), "0xabcdef");
  assert.equal(normalizeTxHash("0xABC"), "0xabc");
  assert.equal(normalizeSocialHandle("@SomeUser/"), "someuser");
  assert.equal(normalizeAlias("  A   B  "), "a b");
  assert.equal(normalizePlatform("Whats App"), "whatsapp");
}

function testAggregationWalletAndDomain() {
  const sourceCaseId = "source-1";
  const now = new Date();
  const source: SourceIndicatorInput[] = [
    {
      id: "s1",
      caseId: sourceCaseId,
      type: IndicatorType.WALLET,
      value: "0xaaa",
      confidenceScore: 90,
      isPublic: true,
    },
    {
      id: "s2",
      caseId: sourceCaseId,
      type: IndicatorType.DOMAIN,
      value: "evil.com",
      confidenceScore: 80,
      isPublic: true,
    },
  ];
  const pairMap = buildSourcePairMap(source, { includeLowConfidence: true });
  assert.equal(pairMap.size, 2);

  const candidates = [
    { id: "t1", caseId: "target-1", type: IndicatorType.WALLET, value: "0xaaa" },
    { id: "t2", caseId: "target-1", type: IndicatorType.DOMAIN, value: "evil.com" },
  ];

  const meta = new Map([
    [
      "target-1",
      { id: "target-1", title: "T", scamType: "crypto", createdAt: now, updatedAt: now },
    ],
  ]);

  const results = aggregateCaseMatches(sourceCaseId, pairMap, candidates, meta);
  assert.equal(results.length, 1);
  assert.equal(results[0]!.matchedCaseId, "target-1");
  assert.equal(results[0]!.totalScore, 95 + 80);
  assert.equal(results[0]!.strengthLabel, "CRITICAL");
}

function testDuplicateSourceIndicatorsSingleScore() {
  const sourceCaseId = "source-1";
  const now = new Date();
  const source: SourceIndicatorInput[] = [
    { id: "s1", caseId: sourceCaseId, type: IndicatorType.WALLET, value: "0xdup", confidenceScore: null, isPublic: true },
    { id: "s2", caseId: sourceCaseId, type: IndicatorType.WALLET, value: "0xdup", confidenceScore: null, isPublic: true },
  ];
  const pairMap = buildSourcePairMap(source, { includeLowConfidence: true });
  assert.equal(pairMap.size, 1);
  assert.equal(pairMap.get(pairKey(IndicatorType.WALLET, "0xdup"))!.sourceIds.length, 2);

  const candidates = [{ id: "t1", caseId: "target-x", type: IndicatorType.WALLET, value: "0xdup" }];
  const meta = new Map([
    ["target-x", { id: "target-x", title: "X", scamType: "crypto", createdAt: now, updatedAt: now }],
  ]);
  const results = aggregateCaseMatches(sourceCaseId, pairMap, candidates, meta);
  assert.equal(results[0]!.totalScore, 95);
}

function testTxHashCritical() {
  const sourceCaseId = "source-1";
  const now = new Date();
  const source: SourceIndicatorInput[] = [
    { id: "s1", caseId: sourceCaseId, type: IndicatorType.TX_HASH, value: "0xtt", confidenceScore: 100, isPublic: true },
    { id: "s2", caseId: sourceCaseId, type: IndicatorType.WALLET, value: "0xww", confidenceScore: 100, isPublic: true },
  ];
  const pairMap = buildSourcePairMap(source, { includeLowConfidence: true });
  const candidates = [
    { id: "t1", caseId: "target-z", type: IndicatorType.TX_HASH, value: "0xtt" },
    { id: "t2", caseId: "target-z", type: IndicatorType.WALLET, value: "0xww" },
  ];
  const meta = new Map([
    ["target-z", { id: "target-z", title: "Z", scamType: "crypto", createdAt: now, updatedAt: now }],
  ]);
  const results = aggregateCaseMatches(sourceCaseId, pairMap, candidates, meta);
  assert.equal(results[0]!.totalScore, 195);
  assert.equal(results[0]!.strengthLabel, "CRITICAL");
}

function testSelfExcluded() {
  const sourceCaseId = "same";
  const now = new Date();
  const source: SourceIndicatorInput[] = [
    {
      id: "s1",
      caseId: sourceCaseId,
      type: IndicatorType.EMAIL,
      value: "a@b.c",
      confidenceScore: 100,
      isPublic: true,
    },
  ];
  const pairMap = buildSourcePairMap(source, { includeLowConfidence: true });
  const candidates = [{ id: "t1", caseId: "same", type: IndicatorType.EMAIL, value: "a@b.c" }];
  const meta = new Map([["same", { id: "same", title: "S", scamType: "x", createdAt: now, updatedAt: now }]]);
  const results = aggregateCaseMatches(sourceCaseId, pairMap, candidates, meta);
  assert.equal(results.length, 0);
}

function testLowConfidenceExcluded() {
  const sourceCaseId = "source-1";
  const source: SourceIndicatorInput[] = [
    { id: "s1", caseId: sourceCaseId, type: IndicatorType.PHONE, value: "+1999", confidenceScore: 10, isPublic: true },
  ];
  const pairMap = buildSourcePairMap(source, { includeLowConfidence: false });
  assert.equal(pairMap.size, 0);
}

function testPriorityRankingOverWeakScore() {
  const now = new Date();
  const weakHighScore: CaseMatchResult = {
    matchedCaseId: "weak-only",
    totalScore: 200,
    strengthLabel: "CRITICAL",
    matchedIndicators: [],
    reasons: [],
    sharedIndicatorTypes: [IndicatorType.PLATFORM, IndicatorType.SOCIAL_HANDLE, IndicatorType.ALIAS],
    latestCaseDate: now,
    scamType: "other",
    title: "Weak stack",
    suppressedAsNoise: false,
  };
  const strongLowerScore: CaseMatchResult = {
    matchedCaseId: "has-wallet",
    totalScore: 95,
    strengthLabel: "HIGH",
    matchedIndicators: [],
    reasons: [],
    sharedIndicatorTypes: [IndicatorType.WALLET],
    latestCaseDate: now,
    scamType: "crypto",
    title: "Wallet link",
    suppressedAsNoise: false,
  };
  const sorted = sortCaseMatchResults([weakHighScore, strongLowerScore]);
  assert.equal(sorted[0]!.matchedCaseId, "has-wallet");
}

function main() {
  testNormalizers();
  testAggregationWalletAndDomain();
  testDuplicateSourceIndicatorsSingleScore();
  testTxHashCritical();
  testSelfExcluded();
  testLowConfidenceExcluded();
  testPriorityRankingOverWeakScore();
  console.log("matcher verify-scenarios: OK");
}

main();
