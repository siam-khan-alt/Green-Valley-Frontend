"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Card,
  ErrorState,
  LoadingState,
  Modal,
} from "@/components/ui";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/features/auth";
import { useProject } from "@/features/projects";
import {
  COST_CATEGORY_LABELS,
  PROFITABILITY_SIMULATE_ROLES,
  ProfitabilitySimulator,
  useProfitability,
  useSimulateProfitability,
} from "@/features/profitability";
import type { SimulationInput, SimulationResult } from "@/features/profitability";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/format";
import { exportCsv, formatDateForFile } from "@/lib/csv";

function CostBar({
  actual,
  budget,
}: {
  actual: number;
  budget: number;
}) {
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

export default function ProfitabilityPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();

  const canSimulate = !!user && PROFITABILITY_SIMULATE_ROLES.includes(user.role);

  const projectQuery = useProject(id);
  const profitabilityQuery = useProfitability(id);
  const simulate = useSimulateProfitability(id);

  const [simulateOpen, setSimulateOpen] = useState(false);
  const [simulateResult, setSimulateResult] = useState<SimulationResult | null>(null);

  const totalBudget = useMemo(() => {
    const data = profitabilityQuery.data;
    if (!data) return 0;
    return data.cost_breakdown.reduce((sum, c) => sum + c.budget, 0);
  }, [profitabilityQuery.data]);

  if (projectQuery.isPending || profitabilityQuery.isPending) {
    return <LoadingState label="Loading profitability…" />;
  }

  if (projectQuery.isError || profitabilityQuery.isError) {
    return (
      <ErrorState
        title="Could not load profitability"
        description={projectQuery.error?.message ?? profitabilityQuery.error?.message}
        retry={<Button variant="outline" onClick={() => void profitabilityQuery.refetch()}>Retry</Button>}
      />
    );
  }

  const project = projectQuery.data;
  const data = profitabilityQuery.data;
  if (!project || !data) return null;

  const profitPct = data.budget > 0 ? (data.expected_profit / data.budget) * 100 : 0;

  function handleExport() {
    exportCsv({
      filename: `profitability-${id}-${formatDateForFile(new Date())}`,
      headers: ["Category", "Budget", "Actual", "% Used"],
      rows: data.cost_breakdown.map((c) => [
        COST_CATEGORY_LABELS[c.category] ?? c.category,
        c.budget,
        c.actual,
        `${c.budget > 0 ? Math.round((c.actual / c.budget) * 100) : 0}%`,
      ]),
    });
  }

  async function handleSimulate(input: SimulationInput) {
    const result = await simulate.mutateAsync(input);
    setSimulateResult(result);
  }

  function handleCloseSimulator() {
    setSimulateOpen(false);
    setSimulateResult(null);
  }

  return (
    <main className="mx-auto w-full max-w-6xl">
      <PageHeader
        title="Profitability"
        description={`${project.name} — budget, forecast & what-if simulation`}
        actions={
          <>
            <Button variant="outline" onClick={handleExport}>Export CSV</Button>
            {canSimulate && (
              <Button onClick={() => setSimulateOpen(true)}>Run simulation</Button>
            )}
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Budget</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(data.budget)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Actual cost</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(data.actual_cost)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Forecast final cost</p>
          <p className="text-2xl font-bold text-text">{formatCurrency(data.forecast_final_cost)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Expected profit</p>
          <p className={`text-2xl font-bold ${data.expected_profit < 0 ? "text-danger" : "text-primary"}`}>
            {formatCurrency(data.expected_profit)}
          </p>
          <p className="mt-1 text-xs text-text-muted">{formatPercent(profitPct)} of budget</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm text-text-muted">Budget variance</p>
          <p className={`text-2xl font-bold ${data.budget_variance < 0 ? "text-danger" : "text-success"}`}>
            {data.budget_variance >= 0 ? "+" : ""}{formatCurrency(data.budget_variance)}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {data.budget_variance < 0 ? "Cost is running over budget" : "Cost is under budget"}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-text-muted">Progress</p>
          <p className="text-2xl font-bold text-text">{formatNumber(project.progress_pct)}%</p>
          <p className="mt-1 text-xs text-text-muted">Overall project progress</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold text-text">Cost breakdown</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-border">
            {data.cost_breakdown.map((c) => {
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
                    <span className="text-text-muted">
                      {formatCurrency(c.budget)}
                    </span>
                    <span className={`font-medium ${pct > 100 ? "text-danger" : "text-primary"}`}>
                      {formatCurrency(c.actual)}
                    </span>
                    <span className="w-14 text-right text-xs text-text-muted">
                      {formatPercent(pct)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="font-medium text-text">Total</span>
              <div className="flex gap-4">
                <span className="text-text">{formatCurrency(totalBudget)}</span>
                <span className="font-semibold text-primary">{formatCurrency(data.actual_cost)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text">Work package costs</h2>
          <div className="mt-3 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-muted/40 text-left text-xs text-text-muted">
                  <th className="px-4 py-2 font-medium">Work package</th>
                  <th className="px-4 py-2 text-right font-medium">Progress</th>
                  <th className="px-4 py-2 text-right font-medium">Labor</th>
                  <th className="px-4 py-2 text-right font-medium">PO</th>
                  <th className="px-4 py-2 text-right font-medium">RA bill</th>
                </tr>
              </thead>
              <tbody>
                {data.work_packages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-text-muted">
                      No work package cost breakdown available.
                    </td>
                  </tr>
                ) : (
                  data.work_packages.map((wp) => (
                    <tr key={wp.id} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 font-medium text-text">{wp.id}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatNumber(wp.progress_pct)}%</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(wp.labor_cost)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(wp.po_cost)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(wp.ra_bill_value)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={simulateOpen}
        onClose={handleCloseSimulator}
        title="What-if simulation"
        subtitle="Adjust material price, delay and variations to see the impact on forecast cost & profit."
        size="lg"
      >
        <ProfitabilitySimulator
          pending={simulate.isPending}
          error={simulate.error}
          result={simulateResult}
          onCancel={handleCloseSimulator}
          onSubmit={handleSimulate}
        />
      </Modal>
    </main>
  );
}