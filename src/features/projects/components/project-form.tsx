"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from "../constants";
import type { Project, ProjectPayload } from "../types";

const EMPTY_FORM: ProjectPayload = {
  name: "",
  type: "residential",
  location: "",
  status: "planning",
  budget: 0,
  start_date: "",
  end_date: "",
  description: "",
  client: "",
  area_sqft: 0,
  units: 0,
};

function pickPayload(project: Project): ProjectPayload {
  const { name, type, location, status, budget, start_date, end_date, description, client, area_sqft, units } =
    project;
  return { name, type, location, status, budget, start_date, end_date, description, client, area_sqft, units };
}

export function ProjectForm({
  initial,
  submitLabel = "Save project",
  onCancel,
  onSubmit,
}: {
  initial?: Project;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: ProjectPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<ProjectPayload>(() =>
    initial ? pickPayload(initial) : EMPTY_FORM
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ProjectPayload>(key: K, value: ProjectPayload[K]) {
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

  const numberField = (key: "budget" | "area_sqft" | "units") => ({
    value: form[key] === 0 ? "" : String(form[key]),
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      update(key, event.target.value === "" ? 0 : Number(event.target.value)),
  });

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Project name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
        placeholder="e.g. Green Valley Heights"
        className="sm:col-span-2"
      />
      <Select
        label="Type"
        required
        value={form.type}
        onChange={(e) => update("type", e.target.value as ProjectPayload["type"])}
        error={fieldErrors.type}
      >
        {PROJECT_TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Select
        label="Status"
        required
        value={form.status}
        onChange={(e) => update("status", e.target.value as ProjectPayload["status"])}
        error={fieldErrors.status}
      >
        {PROJECT_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        label="Location"
        required
        value={form.location}
        onChange={(e) => update("location", e.target.value)}
        error={fieldErrors.location}
        placeholder="e.g. Uttara, Dhaka"
      />
      <Input
        label="Client"
        required
        value={form.client}
        onChange={(e) => update("client", e.target.value)}
        error={fieldErrors.client}
        placeholder="Client or sponsoring entity"
      />
      <Input
        label="Budget (৳)"
        required
        type="number"
        min={0}
        {...numberField("budget")}
        error={fieldErrors.budget}
      />
      <Input label="Area (sq ft)" type="number" min={0} {...numberField("area_sqft")} />
      <Input label="Start date" type="date" required value={form.start_date} onChange={(e) => update("start_date", e.target.value)} error={fieldErrors.start_date} />
      <Input label="End date" type="date" required value={form.end_date} onChange={(e) => update("end_date", e.target.value)} error={fieldErrors.end_date} />
      <Input label="Units" type="number" min={0} {...numberField("units")} className="sm:col-span-2" />
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