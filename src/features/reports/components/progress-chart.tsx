"use client";

import type { ProjectReportProgressPoint } from "../types";

export function ProgressChart({
  series,
}: {
  series: ProjectReportProgressPoint[];
}) {
  const width = 560;
  const height = 220;
  const pad = { top: 14, right: 14, bottom: 28, left: 40 };

  const maxPct = Math.max(100, ...series.map((p) => p.percent_complete));
  const maxCost = Math.max(...series.map((p) => p.cost), 1);

  const x = (i: number) =>
    pad.left + (i / Math.max(1, series.length - 1)) * (width - pad.left - pad.right);
  const yPct = (p: number) =>
    pad.top + (1 - p / maxPct) * (height - pad.top - pad.bottom);
  const yCost = (c: number) =>
    pad.top + (1 - c / maxCost) * (height - pad.top - pad.bottom);

  const pctPoints = series.map((p, i) => `${x(i)},${yPct(p.percent_complete)}`).join(" ");
  const costPoints = series.map((p, i) => `${x(i)},${yCost(p.cost)}`).join(" ");

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Project progress over time"
        className="w-full"
      >
        {Array.from({ length: 5 }, (_, i) => {
          const value = (maxPct / 4) * i;
          const y = yPct(value);
          return (
            <g key={i}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" fontSize="10" className="fill-text-muted">
                {Math.round(value)}%
              </text>
            </g>
          );
        })}
        <polyline
          points={costPoints}
          fill="none"
          className="stroke-info"
          strokeWidth="2"
          strokeDasharray="5 3"
        />
        <polyline points={pctPoints} fill="none" className="stroke-success" strokeWidth="2.5" />
        {series.map((p, i) => (
          <g key={p.date}>
            <circle cx={x(i)} cy={yPct(p.percent_complete)} r="3" className="fill-success" />
            <text
              x={x(i)}
              y={height - 8}
              textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"}
              fontSize="10"
              className="fill-text-muted"
            >
              {p.date.slice(0, 7)}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex flex-wrap gap-4 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded bg-success" />
          Progress %
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 rounded bg-info" />
          Cost (৳)
        </span>
      </div>
    </div>
  );
}