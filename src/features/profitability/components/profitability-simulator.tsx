"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import { toApiError } from "@/services";
import { formatCurrency } from "@/lib/format";
import type { SimulationInput, SimulationResult } from "../types";

export function ProfitabilitySimulator({
  pending,
  error,
  result,
  onCancel,
  onSubmit,
}: {
  pending: boolean;
  error: unknown;
  result: SimulationResult | null;
  onCancel: () => void;
  onSubmit: (input: SimulationInput) => Promise<void>;
}) {
  const [form, setForm] = useState<SimulationInput>({
    material_price_change_pct: 0,
    delay_days: 0,
    extra_variation_cost: 0,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  function update<K extends keyof SimulationInput>(key: K, value: SimulationInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    try {
      await onSubmit(form);
    } catch (error) {
      setFieldErrors(toApiError(error).fields ?? {});
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Material price change (%)"
          type="number"
          min={0}
          step="any"
          value={form.material_price_change_pct ?? 0}
          onChange={(e) => update("material_price_change_pct", parseFloat(e.target.value) || 0)}
          error={fieldErrors.material_price_change_pct}
        />
        <Input
          label="Delay (days)"
          type="number"
          min={0}
          step={1}
          value={form.delay_days ?? 0}
          onChange={(e) => update("delay_days", Math.round(parseFloat(e.target.value) || 0))}
          error={fieldErrors.delay_days}
        />
        <Input
          label="Extra variation cost (৳)"
          type="number"
          min={0}
          step="any"
          value={form.extra_variation_cost ?? 0}
          onChange={(e) => update("extra_variation_cost", parseFloat(e.target.value) || 0)}
          error={fieldErrors.extra_variation_cost}
        />
        <div className="flex justify-end gap-2 sm:col-span-3">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Close
          </Button>
          <Button type="submit" loading={pending}>
            Run simulation
          </Button>
        </div>
      </form>

      {(!!error || !!result) && (
        <div className="space-y-3">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-warning">
            Hypothetical — not persisted
          </div>

          {!!error && (
            <p className="text-sm text-danger">
              {toApiError(error).message ?? "Simulation failed."}
            </p>
          )}

          {result && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface-muted/40 p-4">
                <p className="text-sm font-medium text-text">Baseline</p>
                <p className="mt-2 text-sm text-text-muted">
                  Forecast final cost
                </p>
                <p className="text-xl font-bold text-text">{formatCurrency(result.baseline.forecast_final_cost)}</p>
                <p className="mt-2 text-sm text-text-muted">Expected profit</p>
                <p className="text-lg font-semibold text-text">{formatCurrency(result.baseline.expected_profit)}</p>
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="text-sm font-medium text-primary">Simulated</p>
                <p className="mt-2 text-sm text-text-muted">
                  Forecast final cost
                </p>
                <p className="text-xl font-bold text-primary">{formatCurrency(result.simulated.forecast_final_cost)}</p>
                <p className="mt-2 text-sm text-text-muted">Expected profit</p>
                <p className={`text-lg font-semibold ${result.simulated.expected_profit < 0 ? "text-danger" : "text-text"}`}>
                  {formatCurrency(result.simulated.expected_profit)}
                </p>
              </div>
              <div className="sm:col-span-2 rounded-lg border border-border p-4">
                <p className="text-sm font-medium text-text">Delta</p>
                <div className="mt-2 flex flex-wrap gap-6 text-sm">
                  <span className="text-text-muted">
                    Cost change{" "}
                    <span className={`font-semibold ${result.delta.cost_change > 0 ? "text-danger" : "text-success"}`}>
                      {formatCurrency(result.delta.cost_change)}
                    </span>
                  </span>
                  <span className="text-text-muted">
                    Profit change{" "}
                    <span className={`font-semibold ${result.delta.profit_change < 0 ? "text-danger" : "text-success"}`}>
                      {formatCurrency(result.delta.profit_change)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}