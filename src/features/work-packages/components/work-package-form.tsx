"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { WP_STATUS_OPTIONS } from "../constants";
import type { WorkPackage, WorkPackagePayload, WorkPackageStatus } from "../types";

const EMPTY_FORM: WorkPackagePayload = {
  code: "",
  name: "",
  description: "",
  planned_start: "",
  planned_end: "",
  contractor: "",
  status: "not_started",
};

function pickPayload(wp: WorkPackage): WorkPackagePayload {
  return {
    code: wp.code,
    name: wp.name,
    description: wp.description,
    planned_start: wp.planned_start,
    planned_end: wp.planned_end,
    contractor: wp.contractor,
    status: wp.status,
  };
}

export function WorkPackageForm({
  initial,
  projectCodePrefix,
  submitLabel = "Add work package",
  onCancel,
  onSubmit,
}: {
  initial?: WorkPackage;
  projectCodePrefix?: string;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: WorkPackagePayload) => Promise<void>;
}) {
  const [form, setForm] = useState<WorkPackagePayload>(() =>
    initial ? pickPayload(initial) : { ...EMPTY_FORM, code: nextCode(projectCodePrefix) }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof WorkPackagePayload>(
    key: K,
    value: WorkPackagePayload[K]
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
      <Input
        label="Code"
        required
        value={form.code}
        onChange={(e) => update("code", e.target.value)}
        error={fieldErrors.code}
        placeholder="e.g. WP-04"
      />
      <Select
        label="Status"
        required
        value={form.status}
        onChange={(e) => update("status", e.target.value as WorkPackageStatus)}
        error={fieldErrors.status}
      >
        {WP_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        label="Work package name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
        placeholder="e.g. Superstructure slabs & columns"
        className="sm:col-span-2"
      />
      <Input
        label="Contractor"
        value={form.contractor}
        onChange={(e) => update("contractor", e.target.value)}
        error={fieldErrors.contractor}
        placeholder="Assign a contractor (optional)"
      />
      <div className="sm:col-span-1" />
      <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
        <Input
          label="Planned start"
          type="date"
          required
          value={form.planned_start}
          onChange={(e) => update("planned_start", e.target.value)}
          error={fieldErrors.planned_start}
        />
        <Input
          label="Planned end"
          type="date"
          required
          value={form.planned_end}
          onChange={(e) => update("planned_end", e.target.value)}
          error={fieldErrors.planned_end}
        />
      </div>
      <Textarea
        label="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        error={fieldErrors.description}
        className="sm:col-span-2"
      />

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

function nextCode(prefix?: string): string {
  if (!prefix) return "WP-00";
  return `${prefix}${String(Math.floor(Math.random() * 90) + 10)}`;
}