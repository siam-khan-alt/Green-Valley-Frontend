"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select } from "@/components/ui";
import { toApiError } from "@/services";
import { MACHINE_TYPE_OPTIONS, usageAmount } from "../constants";
import type { Machinery, MachineryPayload, MachineryUsagePayload } from "../types";
import type { WorkPackage } from "@/features/work-packages";

function pickPayload(machinery: Machinery): MachineryPayload {
  return {
    name: machinery.name,
    type: machinery.type,
    asset_no: machinery.asset_no,
    daily_rate: machinery.daily_rate,
  };
}

export function MachineryForm({
  initial,
  submitLabel = "Add machinery",
  onCancel,
  onSubmit,
}: {
  initial?: Machinery;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: MachineryPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<MachineryPayload>(() =>
    initial
      ? pickPayload(initial)
      : { name: "", type: "excavator", asset_no: "", daily_rate: 0 }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof MachineryPayload>(key: K, value: MachineryPayload[K]) {
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
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        label="Machinery name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
        placeholder="e.g. Caterpillar 320 Excavator"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Type"
          required
          value={form.type}
          onChange={(e) => update("type", e.target.value)}
          error={fieldErrors.type}
        >
          {MACHINE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input
          label="Asset number"
          required
          value={form.asset_no}
          onChange={(e) => update("asset_no", e.target.value)}
          error={fieldErrors.asset_no}
          placeholder="e.g. EXC-001"
        />
      </div>
      <Input
        label="Daily rate (৳ / 8h)"
        type="number"
        min={0}
        step="any"
        required
        value={form.daily_rate}
        onChange={(e) => update("daily_rate", Number(e.target.value))}
        error={fieldErrors.daily_rate}
        placeholder="0"
      />
      <div className="flex justify-end gap-2">
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

export function MachineryUsageForm({
  workPackages,
  machinery,
  submitLabel = "Record usage",
  onCancel,
  onSubmit,
}: {
  workPackages: WorkPackage[];
  machinery: Machinery[];
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: MachineryUsagePayload) => Promise<void>;
}) {
  const [form, setForm] = useState<MachineryUsagePayload>(() => ({
    machinery: machinery[0]?.id ?? "",
    work_package: workPackages[0]?.id ?? "",
    date: new Date().toISOString().slice(0, 10),
    hours_used: 8,
    operator: "",
    rate: hourlyRate(machinery[0]?.daily_rate ?? 0),
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const amount = usageAmount(form.hours_used, form.rate);

  const selected = machinery.find((m) => m.id === form.machinery);

  function update<K extends keyof MachineryUsagePayload>(
    key: K,
    value: MachineryUsagePayload[K]
  ) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "machinery") {
        const machine = machinery.find((m) => m.id === value);
        if (machine && current.rate === hourlyRate(machine.daily_rate)) {
          next.rate = hourlyRate(machine.daily_rate);
        }
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
        label="Machinery"
        required
        value={form.machinery}
        onChange={(e) => update("machinery", e.target.value)}
        error={fieldErrors.machinery}
        className="sm:col-span-2"
      >
        {machinery.map((machine) => (
          <option key={machine.id} value={machine.id}>
            {machine.name} · {machine.asset_no}
          </option>
        ))}
      </Select>
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
      <Input
        label="Hours used"
        type="number"
        min={1}
        max={24}
        required
        value={form.hours_used}
        onChange={(e) => update("hours_used", Number(e.target.value))}
        error={fieldErrors.hours_used}
      />
      <Input
        label="Operator"
        value={form.operator}
        onChange={(e) => update("operator", e.target.value)}
        error={fieldErrors.operator}
        placeholder="Towab/operator name"
      />
      <Input
        label="Rate (৳/hr)"
        type="number"
        min={0}
        step="any"
        required
        value={form.rate}
        onChange={(e) => update("rate", Number(e.target.value))}
        error={fieldErrors.rate}
        hint={
          selected
            ? `Daily rate ৳${selected.daily_rate.toLocaleString("en-IN")} → ৳${hourlyRate(
                selected.daily_rate
              ).toLocaleString("en-IN")}/hr`
            : undefined
        }
      />
      <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 sm:col-span-2">
        <span className="text-sm text-text-muted">Usage cost (derived)</span>
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

function hourlyRate(dailyRate: number): number {
  return Math.round(dailyRate / 8);
}