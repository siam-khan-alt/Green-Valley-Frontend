"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import type { GrnPayload, PurchaseOrder } from "../types";

export function GoodsReceiptForm({
  order,
  remaining,
  submitLabel = "Record receipt",
  onCancel,
  onSubmit,
}: {
  order: PurchaseOrder;
  remaining: number;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: GrnPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<GrnPayload>({
    received_quantity: Math.min(order.quantity, remaining),
    received_date: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof GrnPayload>(key: K, value: GrnPayload[K]) {
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
      <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm">
        <span className="font-medium text-text">{order.po_no}</span>
        <span className="text-text-muted"> · {order.supplier}</span>
        <p className="mt-0.5 text-text-muted">{order.material}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Receiving quantity"
          type="number"
          min={1}
          max={remaining}
          required
          value={form.received_quantity}
          onChange={(e) => update("received_quantity", Number(e.target.value))}
          error={fieldErrors.received_quantity}
        />
        <Input
          label="Received date"
          type="date"
          required
          value={form.received_date}
          onChange={(e) => update("received_date", e.target.value)}
          error={fieldErrors.received_date}
        />
      </div>
      <Textarea
        label="Notes"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        error={fieldErrors.notes}
        placeholder="Delivery details, quality check remarks… (optional)"
      />
      <p className="text-xs text-text-muted">
        Remaining on order: <span className="font-semibold text-text">{remaining.toLocaleString("en-IN")}</span>{" "}
        units. The PO status updates automatically when fully received.
      </p>

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