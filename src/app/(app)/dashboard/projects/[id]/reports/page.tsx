"use client";

import { useParams } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/components/ui";
import { useProject } from "@/features/projects";
import {
  ACTIVITY_TYPE_META,
  ProgressChart,
  useProjectReport,
} from "@/features/reports";
import { COST_CATEGORY_LABELS } from "@/features/profitability";
import { formatCurrency, formatDate, formatPercent } from "@/lib/format";

function CostBar({ actual, budget }: { actual: number; budget: number }) {
  const pct = budget > 0 ? Math.min(100, (actual / budget) * 100) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
      <div
        className={`h-full rounded-full ${pct > 100 ? "bg-danger" : "bg-primary"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ProjectReportsPage() {
  const params = useParams();
  const id = String(params.id);

  const projectQuery = useProject(id);
  const reportQuery = useProjectReport(id);

  if (projectQuery.isPending || reportQuery.isPending) {
    return <LoadingState label="Loading project report…" />;
  }

  if (projectQuery.isError || reportQuery.isError) {
    return (
      <ErrorState
        title="Could not load project report"
        description={projectQuery.error?.message ?? reportQuery.error?.message}
        retry={<Button variant="outline" onClick={() => void reportQuery.refetch()}>Retry</Button>}
      />
    );
  }

  const project = projectQuery.data;
  const report = reportQuery.data;
  if (!project || !report) return null;

  const totalBudget = report.cost_breakdown.reduce((s, c) => s + c.budget, 0);
  const totalActual = report.cost_breakdown.reduce((s, c) => s + c.actual, 0);

  return (
    <main className="mx-auto w-full max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Project Report</h1>
        <p className="mt-1 text-sm text-text-muted">
          {project.name} — costs, progress & recent activity
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-text">Cost breakdown</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            {report.cost_breakdown.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-text-muted">
                No cost breakdown for this project yet.
              </p>
            ) : (
              <>
                {report.cost_breakdown.map((c) => {
                  const pct = c.budget > 0 ? (c.actual / c.budget) * 100 : 0;
                  return (
                    <div
                      key={c.category}
                      className="flex flex-col gap-2 border-b border-border/60 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center"
                    >
                      <div className="w-40 shrink-0 text-sm font-medium text-text">
                        {COST_CATEGORY_LABELS[c.category] ?? c.category}
                      </div>
                      <div className="flex-1">
                        <CostBar actual={c.actual} budget={c.budget} />
                      </div>
                      <div className="flex shrink-0 gap-4 text-sm">
                        <span className="text-text-muted">{formatCurrency(c.budget)}</span>
                        <span className={`font-medium ${pct > 100 ? "text-danger" : "text-primary"}`}>
                          {formatCurrency(c.actual)}
                        </span>
                        <span className="w-14 text-right text-xs text-text-muted">{formatPercent(pct)}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium text-text">Total</span>
                  <div className="flex gap-4">
                    <span className="text-text">{formatCurrency(totalBudget)}</span>
                    <span className="font-semibold text-primary">{formatCurrency(totalActual)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text">Progress over time</h2>
          <Card className="mt-3 p-4">
            {report.progress_series.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">
                No progress history for this project yet.
              </p>
            ) : (
              <ProgressChart series={report.progress_series} />
            )}
          </Card>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm text-text-muted">Current progress</p>
              <p className="text-xl font-bold text-text">
                {report.progress_series.at(-1)?.percent_complete ?? 0}%
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-text-muted">Latest cost</p>
              <p className="text-xl font-bold text-text">
                {formatCurrency(report.progress_series.at(-1)?.cost ?? 0)}
              </p>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-text">Recent activity</h2>
        {report.recent_activity.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="Procurement, RA bills, expenses, payments and variations will appear here."
          />
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/40 text-left text-xs text-text-muted">
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Type</th>
                  <th className="px-4 py-2 font-medium">Summary</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.recent_activity.map((a) => (
                  <tr key={`${a.type}-${a.id}`} className="border-b border-border/60 last:border-b-0">
                    <td className="px-4 py-2 whitespace-nowrap text-text-muted">{formatDate(a.date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge variant={ACTIVITY_TYPE_META[a.type].badge}>
                        {ACTIVITY_TYPE_META[a.type].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-text">{a.summary}</td>
                    <td className="px-4 py-2 text-right font-medium tabular-nums">
                      {formatCurrency(a.amount)}
                    </td>
                    <td className="px-4 py-2 text-xs text-text-muted">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}