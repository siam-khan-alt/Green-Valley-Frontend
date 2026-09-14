"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input } from "@/components/ui";
import { toApiError } from "@/services";
import type { Indent } from "../types";

export type CreatePoPayload = {
  supplier: string;
  unit_price: number;
  po_date: string;
  due_date: string;
};

export function CreatePoForm({
  indent,
  confirmLabel = "Create purchase order",
  onCancel,
  onSubmit,
}: {
  indent: Indent;
  confirmLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: CreatePoPayload) => Promise<void>;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState<CreatePoPayload>({
    supplier: "",
    unit_price: 0,
    po_date: today,
    due_date: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof CreatePoPayload>(key: K, value: CreatePoPayload[K]) {
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
      <div className="grid sm:grid-cols-2">
        <div className="text-sm text-text-muted">Material</div>
        <output className="text-sm font-medium text-text">{indent.material}</output>
        <div className="text-sm text-text-muted">Quantity</div>
        <output className="text-sm font-medium text-text">
          {indent.required_quantity.toLocaleString("en-IN")}
        </output>
      </div>
      <Input
        label="Supplier"
        required
        value={form.supplier}
        onChange={(e) => update("supplier", e.target.value)}
        error={fieldErrors.supplier}
        placeholder="e.g. Bashundhara Steel"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Unit price (৳)"
          type="number"
          min={0}
          step="any"
          required
          value={form.unit_price}
          onChange={(e) => update("unit_price", Number(e.target.value))}
          error={fieldErrors.unit_price}
          placeholder="0"
        />
        <Input
          label="Estimated amount"
          readOnly
          value={(form.unit_price * indent.required_quantity).toLocaleString("en-IN")}
        />
        <Input
          label="PO date"
          type="date"
          required
          value={form.po_date}
          onChange={(e) => update("po_date", e.target.value)}
          error={fieldErrors.po_date}
        />
        <Input
          label="Due date"
          type="date"
          required
          value={form.due_date}
          onChange={(e) => update("due_date", e.target.value)}
          error={fieldErrors.due_date}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {confirmLabel}
        </Button>
      </div>
    </form>
  );
}