"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import type { Variation, VariationPayload } from "../types";

export function VariationForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Variation;
  onCancel: () => void;
  onSubmit: (payload: VariationPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<VariationPayload>(() => ({
    description: initial?.description ?? "",
    cost_impact: initial?.cost_impact ?? 0,
    schedule_impact_days: initial?.schedule_impact_days ?? 0,
    notes: initial?.notes ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof VariationPayload>(key: K, value: VariationPayload[K]) {
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
      <Textarea
        label="Description"
        required
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        placeholder="Describe the scope change…"
        error={fieldErrors.description}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Cost impact (৳)"
          type="number"
          step="any"
          required
          value={form.cost_impact}
          onChange={(e) => update("cost_impact", parseFloat(e.target.value) || 0)}
          placeholder="Positive = extra cost, negative = saving"
          error={fieldErrors.cost_impact}
        />
        <Input
          label="Schedule impact (days)"
          type="number"
          min={0}
          step="any"
          required
          value={form.schedule_impact_days}
          onChange={(e) => update("schedule_impact_days", parseFloat(e.target.value) || 0)}
          error={fieldErrors.schedule_impact_days}
        />
      </div>
      <Textarea
        label="Notes"
        value={form.notes ?? ""}
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Reference numbers, approvals, vendor details…"
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? "Save changes" : "Submit variation"}
        </Button>
      </div>
    </form>
  );
}