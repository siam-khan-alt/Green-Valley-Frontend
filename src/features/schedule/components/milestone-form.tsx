"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select } from "@/components/ui";
import { toApiError } from "@/services";
import { MILESTONE_STATUS_OPTIONS } from "../constants";
import type { Milestone, MilestonePayload, MilestoneStatus } from "../types";

const EMPTY_FORM: MilestonePayload = {
  name: "",
  planned_date: "",
  actual_date: null,
  status: "not_started",
};

function pickPayload(milestone: Milestone): MilestonePayload {
  return {
    name: milestone.name,
    planned_date: milestone.planned_date,
    actual_date: milestone.actual_date,
    status: milestone.status,
  };
}

export function MilestoneForm({
  initial,
  submitLabel = "Add milestone",
  onCancel,
  onSubmit,
}: {
  initial?: Milestone;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: MilestonePayload) => Promise<void>;
}) {
  const [form, setForm] = useState<MilestonePayload>(() =>
    initial ? pickPayload(initial) : EMPTY_FORM
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof MilestonePayload>(
    key: K,
    value: MilestonePayload[K]
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
      await onSubmit({
        ...form,
        actual_date: form.actual_date || null,
      });
    } catch (error) {
      setFieldErrors(toApiError(error).fields ?? {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        label="Milestone name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
        placeholder="e.g. Piling & deep foundation"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Planned date"
          type="date"
          required
          value={form.planned_date}
          onChange={(e) => update("planned_date", e.target.value)}
          error={fieldErrors.planned_date}
        />
        <Input
          label="Actual date (optional)"
          type="date"
          value={form.actual_date ?? ""}
          onChange={(e) => update("actual_date", e.target.value)}
        />
      </div>
      <Select
        label="Status"
        value={form.status}
        onChange={(e) =>
          update("status", e.target.value as MilestoneStatus)
        }
        error={fieldErrors.status}
      >
        {MILESTONE_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

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