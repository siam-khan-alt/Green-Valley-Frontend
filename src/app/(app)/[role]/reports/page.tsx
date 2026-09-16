"use client";

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui";
import {
  usePortfolioReport,
} from "@/features/reports";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";

function PctBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function ReportsPage() {
  const reportQuery = usePortfolioReport();

  if (reportQuery.isPending) {
    return <LoadingState label="Loading portfolio report…" />;
  }

  if (reportQuery.isError) {
    return (
      <ErrorState
        title="Could not load portfolio report"
        description={reportQuery.error?.message}
        retry={<Button variant="outline" onClick={() => void reportQuery.refetch()}>Retry</Button>}
      />
    );
  }

  const report = reportQuery.data;
  if (!report) return null;

  const totalMargin =
    report.total_budget > 0 ? (report.total_expected_profit / report.total_budget) * 100 : 0;

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Portfolio Report</h1>
        <p className="mt-1 text-sm text-text-muted">
          Aggregate budget vs actual and profitability across all projects
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Total budget</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(report.total_budget)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Total actual cost</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(report.total_actual_cost)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Forecast final cost</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(report.total_forecast_final_cost)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Expected profit</p>
          <p className={`text-2xl font-bold ${report.total_expected_profit < 0 ? "text-danger" : "text-primary"}`}>
            {formatCurrency(report.total_expected_profit)}
          </p>
          <p className="mt-1 text-xs text-text-muted">{formatPercent(totalMargin)} net margin</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-text">Budget vs actual by project</h2>
          <div className="mt-3 space-y-4">
            {report.projects.length === 0 ? (
              <EmptyState title="No projects" description="Create a project to see portfolio reporting." />
            ) : (
              report.projects.map((p) => {
                const spentPct = p.budget > 0 ? (p.actual_cost / p.budget) * 100 : 0;
                return (
                  <div key={p.id}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium text-text">{p.name}</span>
                      <span className="shrink-0 text-xs text-text-muted">
                        {formatCurrency(p.actual_cost)} / {formatCurrency(p.budget)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <PctBar value={spentPct} />
                      </div>
                      <span className="w-12 text-right text-xs tabular-nums text-text-muted">
                        {formatNumber(spentPct)}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text">Profitability comparison</h2>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/40 text-left text-xs text-text-muted">
                  <th className="px-4 py-2 font-medium">Project</th>
                  <th className="px-4 py-2 text-right font-medium">Progress</th>
                  <th className="px-4 py-2 text-right font-medium">Profit</th>
                  <th className="px-4 py-2 text-right font-medium">Margin</th>
                </tr>
              </thead>
              <tbody>
                {report.projects.map((p) => {
                  const margin = p.budget > 0 ? (p.expected_profit / p.budget) * 100 : 0;
                  return (
                    <tr key={p.id} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text">{p.name}</span>
                          <Badge variant={p.status === "completed" ? "success" : p.status === "delayed" ? "warning" : "primary"}>
                            {p.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatNumber(p.progress_pct)}%</td>
                      <td className={`px-4 py-2 text-right font-medium tabular-nums ${p.expected_profit < 0 ? "text-danger" : "text-primary"}`}>
                        {formatCurrency(p.expected_profit)}
                      </td>
                      <td className={`px-4 py-2 text-right tabular-nums ${margin < 0 ? "text-danger" : "text-text"}`}>
                        {formatPercent(margin)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}