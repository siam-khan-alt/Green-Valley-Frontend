"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select } from "@/components/ui";
import { toApiError } from "@/services";
import type { Indent, IndentPayload } from "../types";
import type { WorkPackage } from "@/features/work-packages";

function pickPayload(indent: Indent): IndentPayload {
  return {
    work_package: indent.work_package,
    material: indent.material,
    required_quantity: indent.required_quantity,
    required_date: indent.required_date,
  };
}

export function IndentForm({
  workPackages,
  initial,
  submitLabel = "Create indent",
  onCancel,
  onSubmit,
}: {
  workPackages: WorkPackage[];
  initial?: Indent;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: IndentPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<IndentPayload>(() =>
    initial
      ? pickPayload(initial)
      : {
          work_package: workPackages[0]?.id ?? "",
          material: "",
          required_quantity: 0,
          required_date: "",
        }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof IndentPayload>(key: K, value: IndentPayload[K]) {
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
        label="Material"
        required
        value={form.material}
        onChange={(e) => update("material", e.target.value)}
        error={fieldErrors.material}
        placeholder="e.g. Ready-mix concrete M28"
        className="sm:col-span-2"
      />
      <Input
        label="Required quantity"
        type="number"
        min={0}
        step="any"
        required
        value={form.required_quantity}
        onChange={(e) => update("required_quantity", Number(e.target.value))}
        error={fieldErrors.required_quantity}
        placeholder="0"
      />
      <Input
        label="Required by"
        type="date"
        required
        value={form.required_date}
        onChange={(e) => update("required_date", e.target.value)}
        error={fieldErrors.required_date}
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