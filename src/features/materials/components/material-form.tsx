"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select } from "@/components/ui";
import { toApiError } from "@/services";
import { MATERIAL_UNITS } from "../constants";
import type { Material, MaterialPayload } from "../types";

function pickPayload(material: Material): MaterialPayload {
  return {
    name: material.name,
    unit: material.unit,
    default_rate: material.default_rate,
  };
}

export function MaterialForm({
  initial,
  submitLabel = "Add material",
  onCancel,
  onSubmit,
}: {
  initial?: Material;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: MaterialPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<MaterialPayload>(() =>
    initial ? pickPayload(initial) : { name: "", unit: "cum", default_rate: 0 }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof MaterialPayload>(key: K, value: MaterialPayload[K]) {
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
      <Input
        label="Material name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
        placeholder="e.g. Portland cement (50 kg bag)"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Unit of measure"
          required
          value={form.unit}
          onChange={(e) => update("unit", e.target.value)}
          error={fieldErrors.unit}
        >
          {MATERIAL_UNITS.map((unit) => (
            <option key={unit.value} value={unit.value}>
              {unit.label}
            </option>
          ))}
        </Select>
        <Input
          label="Default rate (৳)"
          type="number"
          min={0}
          step="any"
          required
          value={form.default_rate}
          onChange={(e) => update("default_rate", Number(e.target.value))}
          error={fieldErrors.default_rate}
          placeholder="0"
        />
      </div>
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