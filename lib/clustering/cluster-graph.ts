import type { ClusterGraph } from "./cluster-types";

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}\0${b}` : `${b}\0${a}`;
}

/**
 * Build an undirected graph: for each ordered pair in `caseIds`, keep the maximum matcher score
 * seen (caller should pass edges derived from matcher output).
 */
export function mergeUndirectedEdges(
  raw: { a: string; b: string; weight: number }[]
): { a: string; b: string; weight: number }[] {
  const best = new Map<string, { a: string; b: string; weight: number }>();
  for (const e of raw) {
    if (e.a === e.b) continue;
    const k = edgeKey(e.a, e.b);
    const cur = best.get(k);
    if (!cur || e.weight > cur.weight) {
      best.set(k, { a: e.a < e.b ? e.a : e.b, b: e.a < e.b ? e.b : e.a, weight: e.weight });
    }
  }
  return [...best.values()];
}

export function computeConnectedComponents(graph: ClusterGraph): string[][] {
  const nodes = [...new Set(graph.nodeIds)];
  const adj = new Map<string, { to: string; w: number }[]>();
  for (const n of nodes) adj.set(n, []);
  for (const e of graph.edges) {
    adj.get(e.a)?.push({ to: e.b, w: e.weight });
    adj.get(e.b)?.push({ to: e.a, w: e.weight });
  }

  const visited = new Set<string>();
  const comps: string[][] = [];

  for (const start of nodes) {
    if (visited.has(start)) continue;
    const stack = [start];
    const comp: string[] = [];
    visited.add(start);
    while (stack.length) {
      const v = stack.pop()!;
      comp.push(v);
      for (const { to } of adj.get(v) ?? []) {
        if (!visited.has(to)) {
          visited.add(to);
          stack.push(to);
        }
      }
    }
    comps.push(comp.sort());
  }
  return comps;
}

/** Find the component containing `seed` (or empty if seed missing). */
export function componentContainingSeed(
  components: string[][],
  seed: string
): string[] {
  for (const c of components) {
    if (c.includes(seed)) return c;
  }
  return [];
}
