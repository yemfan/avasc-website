import type { ScamStatSeries } from "@/lib/scam-stats/queries";

/**
 * Year-over-year scam-loss trend as an inline SVG chart (no chart library).
 * Bars = the primary series (FBI IC3, all cybercrime); optional line overlay =
 * a second series (FTC consumer fraud). Dark + gold themed; latest bar highlighted.
 */
export function ScamTrendChart({
  series,
  overlay,
}: {
  series: ScamStatSeries;
  overlay?: ScamStatSeries | null;
}) {
  const { points, latest, source, sourceUrl } = series;
  if (points.length === 0) return null;

  const W = 760;
  const H = 300;
  const padL = 16;
  const padR = 16;
  const padTop = 34;
  const padBottom = 34;
  const chartW = W - padL - padR;
  const chartH = H - padTop - padBottom;

  const overlayPts = overlay?.points ?? [];
  const maxVal =
    Math.max(...points.map((p) => p.valueBillions), ...overlayPts.map((p) => p.valueBillions)) * 1.1;
  const step = chartW / points.length;
  const barW = Math.min(64, step * 0.56);

  const fmt = (v: number) => `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}B`;
  const yFor = (v: number) => padTop + chartH - Math.max(2, (v / maxVal) * chartH);
  const xCenterOf = (i: number) => padL + i * step + step / 2;

  // Map year -> bar x-center so the overlay line aligns with the matching bars.
  const yearToX = new Map(points.map((p, i) => [p.year, xCenterOf(i)]));
  const linePts = overlayPts
    .filter((p) => yearToX.has(p.year))
    .map((p) => ({ x: yearToX.get(p.year)!, y: yFor(p.valueBillions) }));
  const linePath = linePts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <figure className="rounded-2xl border border-[var(--avasc-border)] bg-[var(--avasc-bg-card)] p-6">
      <figcaption className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">U.S. cybercrime losses are climbing fast</h3>
        {latest ? (
          <span className="text-sm text-muted-foreground">
            <span className="font-semibold text-[var(--avasc-gold-light)]">{fmt(latest.valueBillions)}</span> in{" "}
            {latest.year}
            {latest.yoyPct !== null ? (
              <span className="text-emerald-300"> · +{latest.yoyPct}% vs {latest.year - 1}</span>
            ) : null}
          </span>
        ) : null}
      </figcaption>

      {/* legend */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-3 rounded-sm bg-[var(--avasc-gold)]" aria-hidden />
          {source} — all cybercrime
        </span>
        {overlay && overlayPts.length > 0 ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-[var(--avasc-blue-glow)]" aria-hidden />
            {overlay.source} — consumer fraud
          </span>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`U.S. cybercrime losses by year, ${points[0].year} to ${points[points.length - 1].year}, from ${fmt(points[0].valueBillions)} to ${fmt(points[points.length - 1].valueBillions)}.`}
          className="h-auto w-full min-w-[520px]"
        >
          <defs>
            <linearGradient id="scamBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--avasc-gold-light)" />
              <stop offset="100%" stopColor="var(--avasc-gold-dark)" />
            </linearGradient>
          </defs>

          <line
            x1={padL}
            y1={padTop + chartH}
            x2={W - padR}
            y2={padTop + chartH}
            stroke="var(--avasc-border)"
            strokeWidth="1"
          />

          {points.map((p, i) => {
            const barH = Math.max(2, (p.valueBillions / maxVal) * chartH);
            const x = padL + i * step + (step - barW) / 2;
            const y = padTop + chartH - barH;
            const isLatest = i === points.length - 1;
            return (
              <g key={p.year}>
                <rect x={x} y={y} width={barW} height={barH} rx="6" fill="url(#scamBar)" opacity={isLatest ? 1 : 0.72} />
                <text
                  x={x + barW / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-[var(--avasc-text-primary)]"
                  fontSize="15"
                  fontWeight={isLatest ? 700 : 500}
                >
                  {fmt(p.valueBillions)}
                </text>
                <text
                  x={x + barW / 2}
                  y={padTop + chartH + 22}
                  textAnchor="middle"
                  className="fill-[var(--avasc-text-secondary)]"
                  fontSize="14"
                >
                  {p.year}
                </text>
              </g>
            );
          })}

          {/* FTC overlay line */}
          {linePts.length >= 2 ? (
            <polyline
              points={linePath}
              fill="none"
              stroke="var(--avasc-blue-glow)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ) : null}
          {linePts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--avasc-blue-glow)" stroke="var(--avasc-bg-card)" strokeWidth="1.5" />
          ))}
        </svg>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[var(--avasc-text-muted)]">
        Sources:{" "}
        <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--avasc-gold-light)]">
          {source}
        </a>
        {overlay && overlayPts.length > 0 ? (
          <>
            {" "}and{" "}
            <a href={overlay.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--avasc-gold-light)]">
              {overlay.source} Consumer Sentinel
            </a>
          </>
        ) : null}
        , annual reports. Figures are reported losses only; actual totals are higher, as most scams go unreported.
      </p>
    </figure>
  );
}
