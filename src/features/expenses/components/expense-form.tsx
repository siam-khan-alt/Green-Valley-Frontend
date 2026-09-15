"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { EXPENSE_CATEGORIES } from "../constants";
import type { Expense, ExpensePayload } from "../types";

export function ExpenseForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Expense;
  onCancel: () => void;
  onSubmit: (payload: ExpensePayload) => Promise<void>;
}) {
  const [form, setForm] = useState<ExpensePayload>(() => ({
    category: initial?.category ?? "materials",
    amount: initial?.amount ?? 0,
    date: initial?.date ?? new Date().toISOString().split("T")[0],
    description: initial?.description ?? "",
    purchase_order: initial?.purchase_order ?? null,
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ExpensePayload>(key: K, value: ExpensePayload[K]) {
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
        label="Category"
        required
        value={form.category}
        onChange={(e) => update("category", e.target.value as ExpensePayload["category"])}
        error={fieldErrors.category}
      >
        {EXPENSE_CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </Select>
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
        label="Purchase order (optional)"
        value={form.purchase_order ?? ""}
        onChange={(e) => update("purchase_order", e.target.value || null)}
        placeholder="e.g. po_001"
      />
      <Textarea
        label="Description"
        required
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        placeholder="What was this expense for?"
        className="sm:col-span-2"
      />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? "Save changes" : "Add expense"}
        </Button>
      </div>
    </form>
  );
}