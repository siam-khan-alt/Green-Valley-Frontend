"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select } from "@/components/ui";
import { toApiError } from "@/services";
import {
  DEFAULT_LABOR_RATES,
  LABOR_TYPE_OPTIONS,
  musterAmount,
} from "../constants";
import type { LaborType, MusterPayload } from "../types";
import type { WorkPackage } from "@/features/work-packages";

export function MusterEntryForm({
  workPackages,
  submitLabel = "Record muster",
  onCancel,
  onSubmit,
}: {
  workPackages: WorkPackage[];
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: MusterPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<MusterPayload>({
    work_package: workPackages[0]?.id ?? "",
    date: new Date().toISOString().slice(0, 10),
    labor_type: "mason",
    head_count: 0,
    hours_worked: 8,
    rate: DEFAULT_LABOR_RATES.mason,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const amount = musterAmount(form.head_count, form.hours_worked, form.rate);

  function update<K extends keyof MusterPayload>(key: K, value: MusterPayload[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "labor_type" && current.rate === DEFAULT_LABOR_RATES[current.labor_type]) {
        next.rate = DEFAULT_LABOR_RATES[value as LaborType];
      }
      return next;
    });
    setFieldErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFieldErrors({});
    try {
      await onSubmit(form);
    } catch (error) {
      setFieldErrors(toApiError(error).fields ?? {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Select
        label="Work package"
        required
        value={form.work_package}
        onChange={(e) => update("work_package", e.target.value)}
        error={fieldErrors.work_package}
        className="sm:col-span-2"
      >
        {workPackages.map((wp) => (
          <option key={wp.id} value={wp.id}>
            {wp.code} — {wp.name}
          </option>
        ))}
      </Select>
      <Input
        label="Date"
        type="date"
        required
        value={form.date}
        onChange={(e) => update("date", e.target.value)}
        error={fieldErrors.date}
      />
      <Select
        label="Labor type"
        required
        value={form.labor_type}
        onChange={(e) => update("labor_type", e.target.value as LaborType)}
        error={fieldErrors.labor_type}
      >
        {LABOR_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        label="Head count"
        type="number"
        min={1}
        required
        value={form.head_count}
        onChange={(e) => update("head_count", Number(e.target.value))}
        error={fieldErrors.head_count}
        placeholder="e.g. 12"
      />
      <Input
        label="Hours worked"
        type="number"
        min={1}
        max={16}
        required
        value={form.hours_worked}
        onChange={(e) => update("hours_worked", Number(e.target.value))}
        error={fieldErrors.hours_worked}
        placeholder="8"
      />
      <Input
        label="Rate (৳/hr per head)"
        type="number"
        min={0}
        step="any"
        required
        value={form.rate}
        onChange={(e) => update("rate", Number(e.target.value))}
        error={fieldErrors.rate}
        className="sm:col-span-2"
      />
      <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 sm:col-span-2">
        <span className="text-sm text-text-muted">Labor cost (derived)</span>
        <span className="font-mono text-sm font-semibold text-text">
          {amount.toLocaleString("en-IN")} ৳
        </span>
      </div>

      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}