"use client";

import type { DailyProgressReport } from "../types";
import { formatDate } from "@/lib/format";

interface DprSeriesPoint {
  date: string;
  cumulativeQty: number;
}

export function DprProgressChart({
  dprs,
  workPackageId,
}: {
  dprs: DailyProgressReport[];
  workPackageId: string;
}) {
  const relevant = dprs
    .filter((d) => d.work_package_id === workPackageId)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (relevant.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No DPR data for this work package yet.
      </div>
    );
  }

  const points: DprSeriesPoint[] = relevant.reduce((acc, dpr) => {
    const last = acc[acc.length - 1];
    return [...acc, { date: dpr.date, cumulativeQty: (last?.cumulativeQty ?? 0) + dpr.quantity_achieved }];
  }, [] as DprSeriesPoint[]);

  const maxQty = Math.max(...points.map((p) => p.cumulativeQty));
  const minDate = points[0].date;
  const maxDate = points[points.length - 1].date;

  const width = 400;
  const height = 200;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const xScale = (dateStr: string) => {
    const start = new Date(minDate).getTime();
    const end = new Date(maxDate).getTime();
    const t = (new Date(dateStr).getTime() - start) / (end - start || 1);
    return padding + t * chartWidth;
  };

  const yScale = (qty: number) => {
    return padding + chartHeight - (qty / (maxQty || 1)) * chartHeight;
  };

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.date)} ${yScale(p.cumulativeQty)}`)
    .join(" ");

  const dots = points.map((p) => (
    <circle key={p.date} cx={xScale(p.date)} cy={yScale(p.cumulativeQty)} r={4} fill="var(--color-primary)" />
  ));

  const xTicks = [minDate, maxDate];
  const yTicks = [0, maxQty];

  return (
    <div className="w-full max-w-md mx-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Cumulative quantity progress">
        <defs>
          <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={padding} y={padding} width={chartWidth} height={chartHeight} fill="var(--color-surface)" stroke="var(--color-border)" />
        <path d={path} stroke="var(--color-primary)" strokeWidth={2} fill="none" />
        <path
          d={`${path} L ${xScale(points[points.length - 1].date)} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
          fill="url(#progressGradient)"
        />
        {dots}
        {xTicks.map((d) => (
          <text key={d} x={xScale(d)} y={height - 8} textAnchor="middle" className="text-xs fill-text-muted">
            {formatDate(d)}
          </text>
        ))}
        {yTicks.map((q) => (
          <text key={q} x={8} y={yScale(q)} textAnchor="end" dominantBaseline="middle" className="text-xs fill-text-muted">
            {q}
          </text>
        ))}
      </svg>
      <p className="mt-2 text-xs text-center text-text-muted">
        Cumulative quantity achieved over time
      </p>
    </div>
  );
}