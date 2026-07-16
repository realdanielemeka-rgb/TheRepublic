/**
 * Turns fractional "half/quarter/full width" intents into integer
 * `grid-column: span N` values that always sum exactly to `cols` — so a
 * row like [0.5, 0.25, 0.25] never leaves a gap or overflows onto an
 * implicit extra row just because `cols` (6-16, per the grid engine's
 * live `--grid-cols`, see src/lib/useGridCols.ts) doesn't divide evenly.
 *
 * Largest-remainder rounding: floor every fraction's raw share first,
 * then hand the leftover columns (cols - sum of floors) one at a time to
 * the entries with the largest fractional remainder — the standard
 * apportionment method for exactly this "integers that must sum to a
 * fixed total" problem. Every span is clamped to at least 1 (a fraction
 * can never disappear entirely, even at the narrowest mobile band).
 */
export function computeSpans(cols: number, fractions: number[]): number[] {
  if (fractions.length === 0) return [];
  const safeCols = Math.max(cols, fractions.length);
  const raw = fractions.map((f) => Math.max(f, 0) * safeCols);
  const floors = raw.map((r) => Math.max(1, Math.floor(r)));
  const used = floors.reduce((a, b) => a + b, 0);
  let leftover = safeCols - used;

  if (leftover > 0) {
    const remainders = raw
      .map((r, i) => ({ i, rem: r - Math.floor(r) }))
      .sort((a, b) => b.rem - a.rem);
    for (let k = 0; k < remainders.length && leftover > 0; k++) {
      floors[remainders[k].i] += 1;
      leftover--;
    }
  } else if (leftover < 0) {
    // Only possible when fractions.length > cols (more items than
    // columns) — shrink from the largest spans down to 1 until it fits.
    const order = floors.map((v, i) => i).sort((a, b) => floors[b] - floors[a]);
    for (let k = 0; k < order.length && leftover < 0; k++) {
      const i = order[k];
      const room = floors[i] - 1;
      const take = Math.min(room, -leftover);
      floors[i] -= take;
      leftover += take;
    }
  }

  return floors;
}
