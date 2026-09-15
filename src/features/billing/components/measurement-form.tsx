"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { useWorkPackages } from "@/features/work-packages";
import { useBoq } from "@/features/boq";
import type { Measurement, MeasurementPayload } from "../types";

export function MeasurementForm({
  projectId,
  initial,
  onCancel,
  onSubmit,
}: {
  projectId: string;
  initial?: Measurement;
  onCancel: () => void;
  onSubmit: (payload: MeasurementPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<MeasurementPayload>(() => ({
    work_package_id: initial?.work_package_id ?? "",
    boq_item_id: initial?.boq_item_id ?? "",
    boq_item_description: initial?.boq_item_description ?? "",
    unit: initial?.unit ?? "",
    measured_quantity: initial?.measured_quantity ?? 0,
    measurement_date: initial?.measurement_date ?? new Date().toISOString().split("T")[0],
    notes: initial?.notes ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const { data: workPackages = [] } = useWorkPackages(projectId);
  const { data: boq } = useBoq(projectId);

  const boqItems = useMemo(() => {
    const items = boq?.items ?? [];
    return form.work_package_id
      ? items.filter((i) => i.work_package === form.work_package_id)
      : items;
  }, [boq, form.work_package_id]);

  function update<K extends keyof MeasurementPayload>(key: K, value: MeasurementPayload[K]) {
    setForm((current) => {
      if (key === "work_package_id") {
        return { ...current, work_package_id: value as string, boq_item_id: "" };
      }
      if (key === "boq_item_id") {
        const item = boqItems.find((i) => i.id === value);
        return {
          ...current,
          boq_item_id: value as string,
          boq_item_description: item?.material ?? "",
          unit: item?.unit ?? "",
        };
      }
      return { ...current, [key]: value };
    });
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
        value={form.work_package_id}
        onChange={(e) => update("work_package_id", e.target.value)}
        error={fieldErrors.work_package_id}
      >
        <option value="">Select…</option>
        {workPackages.map((wp) => (
          <option key={wp.id} value={wp.id}>
            {wp.code} — {wp.name}
          </option>
        ))}
      </Select>
      <Select
        label="BOQ item"
        required
        value={form.boq_item_id}
        onChange={(e) => update("boq_item_id", e.target.value)}
        error={fieldErrors.boq_item_id}
      >
        <option value="">Select…</option>
        {boqItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.material}
          </option>
        ))}
      </Select>
      <Input
        label="Measured quantity"
        type="number"
        min={0}
        step="any"
        required
        value={form.measured_quantity}
        onChange={(e) => update("measured_quantity", parseFloat(e.target.value) || 0)}
        error={fieldErrors.measured_quantity}
      />
      <Input
        label="Unit"
        value={form.unit}
        onChange={(e) => update("unit", e.target.value)}
        placeholder="Auto-filled from BOQ item"
      />
      <Input
        label="Measurement date"
        type="date"
        required
        value={form.measurement_date}
        onChange={(e) => update("measurement_date", e.target.value)}
        error={fieldErrors.measurement_date}
      />
      <div />
      <Textarea
        label="Notes"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        placeholder="Measurement details…"
        className="sm:col-span-2"
      />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          {initial ? "Save changes" : "Add measurement"}
        </Button>
      </div>
    </form>
  );
}