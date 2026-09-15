"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import { toApiError } from "@/services";
import type { RaBill, RaBillPayload, RaBillPatch } from "../types";

export function RaBillForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: RaBill;
  onCancel: () => void;
  onSubmit: (payload: RaBillPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<RaBillPayload>(() => ({
    bill_no: initial?.bill_no ?? "",
    bill_date:
      initial?.bill_date ?? new Date().toISOString().split("T")[0],
    period_from: initial?.period_from ?? "",
    period_to: initial?.period_to ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof RaBillPayload>(key: K, value: RaBillPayload[K]) {
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
      <Input
        label="Bill number"
        required
        value={form.bill_no}
        onChange={(e) => update("bill_no", e.target.value)}
        error={fieldErrors.bill_no}
        placeholder="e.g. GV-003"
      />
      <Input
        label="Bill date"
        type="date"
        required
        value={form.bill_date}
        onChange={(e) => update("bill_date", e.target.value)}
        error={fieldErrors.bill_date}
      />
      <Input
        label="Period from"
        type="date"
        required
        value={form.period_from}
        onChange={(e) => update("period_from", e.target.value)}
        error={fieldErrors.period_from}
      />
      <Input
        label="Period to"
        type="date"
        required
        value={form.period_to}
        onChange={(e) => update("period_to", e.target.value)}
        error={fieldErrors.period_to}
      />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Create bill
        </Button>
      </div>
    </form>
  );
}

export function RaDeductionsForm({
  bill,
  onCancel,
  onSubmit,
}: {
  bill: RaBill;
  onCancel: () => void;
  onSubmit: (patch: RaBillPatch) => Promise<void>;
}) {
  const [form, setForm] = useState<RaBillPatch>({
    deductions: { ...bill.deductions },
    status: bill.status,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function updateDeduction(key: keyof RaBill["deductions"], value: number) {
    setForm((current) => ({
      ...current,
      deductions: { ...(current.deductions ?? bill.deductions), [key]: value },
    }));
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

  const d = form.deductions ?? bill.deductions;
  const gross = bill.gross_amount;
  const net = gross - (d.advance + d.retention + d.material_issue + d.penalty);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Advance deduction"
        type="number"
        min={0}
        step="any"
        value={d.advance}
        onChange={(e) => updateDeduction("advance", parseFloat(e.target.value) || 0)}
        error={fieldErrors.advance}
      />
      <Input
        label="Retention (default 5%)"
        type="number"
        min={0}
        step="any"
        value={d.retention}
        onChange={(e) => updateDeduction("retention", parseFloat(e.target.value) || 0)}
        error={fieldErrors.retention}
      />
      <Input
        label="Material issue deduction"
        type="number"
        min={0}
        step="any"
        value={d.material_issue}
        onChange={(e) => updateDeduction("material_issue", parseFloat(e.target.value) || 0)}
        error={fieldErrors.material_issue}
      />
      <Input
        label="Penalty"
        type="number"
        min={0}
        step="any"
        value={d.penalty}
        onChange={(e) => updateDeduction("penalty", parseFloat(e.target.value) || 0)}
        error={fieldErrors.penalty}
      />
      <div className="flex items-center justify-between rounded-md bg-surface-muted px-3 py-2 text-sm sm:col-span-2">
        <span className="text-text-muted">
          Gross <span className="font-medium text-text">৳{gross.toLocaleString("en-IN")}</span> − deductions =
        </span>
        <span className={`font-semibold ${net < 0 ? "text-danger" : "text-primary"}`}>
          ৳{Math.round(net).toLocaleString("en-IN")}
        </span>
      </div>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save deductions
        </Button>
      </div>
    </form>
  );
}