"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { BOQ_UNITS, boqItemAmount } from "../constants";
import type { WorkPackage } from "@/features/work-packages";
import type { BoqItem, BoqItemPayload } from "../types";

function pickPayload(item: BoqItem): BoqItemPayload {
  return {
    work_package: item.work_package,
    material: item.material,
    description: item.description,
    unit: item.unit,
    quantity: item.quantity,
    rate: item.rate,
  };
}

export function BoqItemForm({
  workPackages,
  initial,
  submitLabel = "Add item",
  onCancel,
  onSubmit,
}: {
  workPackages: WorkPackage[];
  initial?: BoqItem;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: BoqItemPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<BoqItemPayload>(() =>
    initial
      ? pickPayload(initial)
      : {
          work_package: workPackages[0]?.id ?? "",
          material: "",
          description: "",
          unit: "cum",
          quantity: 0,
          rate: 0,
        }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const amount = boqItemAmount(form.quantity, form.rate);

  function update<K extends keyof BoqItemPayload>(
    key: K,
    value: BoqItemPayload[K]
  ) {
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
        label="Material / item"
        required
        value={form.material}
        onChange={(e) => update("material", e.target.value)}
        error={fieldErrors.material}
        placeholder="e.g. Ready-mix concrete M30"
        className="sm:col-span-2"
      />
      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        error={fieldErrors.description}
        className="sm:col-span-2"
      />
      <Select
        label="Unit"
        required
        value={form.unit}
        onChange={(e) => update("unit", e.target.value)}
        error={fieldErrors.unit}
      >
        {BOQ_UNITS.map((unit) => (
          <option key={unit.value} value={unit.value}>
            {unit.label}
          </option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Quantity"
          type="number"
          min={0}
          step="any"
          required
          value={form.quantity}
          onChange={(e) => update("quantity", Number(e.target.value))}
          error={fieldErrors.quantity}
          placeholder="0"
        />
        <Input
          label="Rate (৳)"
          type="number"
          min={0}
          step="any"
          required
          value={form.rate}
          onChange={(e) => update("rate", Number(e.target.value))}
          error={fieldErrors.rate}
          placeholder="0"
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 sm:col-span-2">
        <span className="text-sm text-text-muted">Amount (derived)</span>
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