"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { DPR_WEATHER_OPTIONS } from "../constants";
import type { DprPayload, DprLaborEntry, DprMachineryEntry } from "../types";
import { useWorkPackages } from "@/features/work-packages";

interface InitialDprData {
  date?: string;
  work_package_id?: string;
}

export function DprForm({
  projectId,
  initial,
  submitLabel = "Save report",
  onCancel,
  onSubmit,
}: {
  projectId: string;
  initial?: InitialDprData;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: DprPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<DprPayload>(() => ({
    work_package_id: initial?.work_package_id ?? "",
    date: initial?.date ?? new Date().toISOString().split("T")[0],
    weather: "sunny",
    work_done: "",
    quantity_achieved: 0,
    labor_entries: [],
    machinery_entries: [],
    notes: "",
  }));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [laborEntries, setLaborEntries] = useState<DprLaborEntry[]>(() =>
    initial ? [] : [{ labor_type: "", head_count: 0, hours_worked: 0, rate: 0 }]
  );
  const [machineryEntries, setMachineryEntries] = useState<DprMachineryEntry[]>(() =>
    initial ? [] : [{ machinery_id: "", machinery_name: "", hours_used: 0, rate: 0 }]
  );

  const { data: workPackages = [] } = useWorkPackages(projectId);

  function updateField<K extends keyof Omit<DprPayload, "labor_entries" | "machinery_entries">>(
    key: K,
    value: DprPayload[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function updateLaborEntry(index: number, field: keyof DprLaborEntry, value: string | number) {
    setLaborEntries((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addLaborEntry() {
    setLaborEntries((current) => [...current, { labor_type: "", head_count: 0, hours_worked: 0, rate: 0 }]);
  }

  function removeLaborEntry(index: number) {
    setLaborEntries((current) => current.filter((_, i) => i !== index));
  }

  function updateMachineryEntry(index: number, field: keyof DprMachineryEntry, value: string | number) {
    setMachineryEntries((current) => {
      const next = [...current];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addMachineryEntry() {
    setMachineryEntries((current) => [...current, { machinery_id: "", machinery_name: "", hours_used: 0, rate: 0 }]);
  }

  function removeMachineryEntry(index: number) {
    setMachineryEntries((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFieldErrors({});

    const payload: DprPayload = {
      ...form,
      labor_entries: laborEntries.filter(
        (e) => e.labor_type && e.head_count > 0 && e.hours_worked > 0 && e.rate > 0
      ),
      machinery_entries: machineryEntries.filter(
        (e) => e.machinery_id && e.machinery_name && e.hours_used > 0 && e.rate > 0
      ),
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setFieldErrors(toApiError(error).fields ?? {});
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Work package"
          required
          value={form.work_package_id}
          onChange={(e) => updateField("work_package_id", e.target.value)}
          error={fieldErrors.work_package_id}
        >
          {workPackages.map((wp) => (
            <option key={wp.id} value={wp.id}>
              {wp.code} — {wp.name}
            </option>
          ))}
        </Select>
        <Input
          label="Date"
          type="date"
          required
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
          error={fieldErrors.date}
        />
        <Select
          label="Weather"
          required
          value={form.weather}
          onChange={(e) => updateField("weather", e.target.value as DprPayload["weather"])}
          error={fieldErrors.weather}
        >
          {DPR_WEATHER_OPTIONS.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </Select>
        <Input
          label="Quantity achieved"
          type="number"
          min={0}
          step="any"
          value={form.quantity_achieved}
          onChange={(e) => updateField("quantity_achieved", parseFloat(e.target.value) || 0)}
          error={fieldErrors.quantity_achieved}
        />
      </div>

      <Textarea
        label="Work done"
        required
        value={form.work_done}
        onChange={(e) => updateField("work_done", e.target.value)}
        error={fieldErrors.work_done}
        placeholder="Describe the work completed today…"
        className="min-h-[72px]"
      />

      <fieldset className="grid gap-3">
        <legend className="font-medium text-text">Labor entries</legend>
        {laborEntries.length === 0 && (
          <p className="text-sm text-text-muted">Add labor types used today.</p>
        )}
        {laborEntries.map((entry, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-5">
            <Input
              label="Labor type"
              value={entry.labor_type}
              onChange={(e) => updateLaborEntry(index, "labor_type", e.target.value)}
              placeholder="e.g. Mason"
            />
            <Input
              label="Head count"
              type="number"
              min={0}
              value={entry.head_count}
              onChange={(e) => updateLaborEntry(index, "head_count", parseInt(e.target.value) || 0)}
            />
            <Input
              label="Hours worked"
              type="number"
              min={0}
              step="0.5"
              value={entry.hours_worked}
              onChange={(e) => updateLaborEntry(index, "hours_worked", parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Rate"
              type="number"
              min={0}
              step="any"
              value={entry.rate}
              onChange={(e) => updateLaborEntry(index, "rate", parseFloat(e.target.value) || 0)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLaborEntry(index)}
              className="mt-6 h-8"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addLaborEntry} className="w-fit">
          Add labor entry
        </Button>
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="font-medium text-text">Machinery entries</legend>
        {machineryEntries.length === 0 && (
          <p className="text-sm text-text-muted">Add machinery used today.</p>
        )}
        {machineryEntries.map((entry, index) => (
          <div key={index} className="grid gap-3 sm:grid-cols-5">
            <Input
              label="Asset no."
              value={entry.machinery_id}
              onChange={(e) => updateMachineryEntry(index, "machinery_id", e.target.value)}
              placeholder="e.g. mach_001"
            />
            <Input
              label="Name"
              value={entry.machinery_name}
              onChange={(e) => updateMachineryEntry(index, "machinery_name", e.target.value)}
              placeholder="e.g. Excavator 20T"
            />
            <Input
              label="Hours used"
              type="number"
              min={0}
              step="0.5"
              value={entry.hours_used}
              onChange={(e) => updateMachineryEntry(index, "hours_used", parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Rate"
              type="number"
              min={0}
              step="any"
              value={entry.rate}
              onChange={(e) => updateMachineryEntry(index, "rate", parseFloat(e.target.value) || 0)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeMachineryEntry(index)}
              className="mt-6 h-8"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addMachineryEntry} className="w-fit">
          Add machinery entry
        </Button>
      </fieldset>

      <Textarea
        label="Notes"
        value={form.notes}
        onChange={(e) => updateField("notes", e.target.value)}
        placeholder="Additional notes…"
        className="min-h-[72px]"
      />

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