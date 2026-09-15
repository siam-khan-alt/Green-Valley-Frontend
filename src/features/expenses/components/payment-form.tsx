"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select } from "@/components/ui";
import { toApiError } from "@/services";
import { PAYMENT_METHODS } from "../constants";
import type { Payment, PaymentPayload } from "../types";

export function PaymentForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Payment;
  onCancel: () => void;
  onSubmit: (payload: PaymentPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<PaymentPayload>(() => ({
    amount: initial?.amount ?? 0,
    date: initial?.date ?? new Date().toISOString().split("T")[0],
    payee: initial?.payee ?? "",
    method: initial?.method ?? "bank_transfer",
    purchase_order: initial?.purchase_order ?? null,
    ra_bill: initial?.ra_bill ?? null,
    related_expense: initial?.related_expense ?? null,
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof PaymentPayload>(key: K, value: PaymentPayload[K]) {
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
        label="Amount (৳)"
        type="number"
        min={0}
        step="any"
        required
        value={form.amount}
        onChange={(e) => update("amount", parseFloat(e.target.value) || 0)}
        error={fieldErrors.amount}
      />
      <Input
        label="Date"
        type="date"
        required
        value={form.date}
        onChange={(e) => update("date", e.target.value)}
        error={fieldErrors.date}
      />
      <Input
        label="Payee"
        required
        value={form.payee}
        onChange={(e) => update("payee", e.target.value)}
        error={fieldErrors.payee}
      />
      <Select
        label="Method"
        required
        value={form.method}
        onChange={(e) => update("method", e.target.value as PaymentPayload["method"])}
        error={fieldErrors.method}
      >
        {PAYMENT_METHODS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>
      <Input
        label="Purchase order (optional)"
        value={form.purchase_order ?? ""}
        onChange={(e) => update("purchase_order", e.target.value || null)}
        placeholder="e.g. po_001"
      />
      <Input
        label="RA bill (optional)"
        value={form.ra_bill ?? ""}
        onChange={(e) => update("ra_bill", e.target.value || null)}
        placeholder="e.g. rab_001"
      />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? "Save changes" : "Record payment"}
        </Button>
      </div>
    </form>
  );
}