"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { CONTRACTOR_OPTIONS } from "../constants";
import type { Contractor, ContractorPayload } from "../types";

function pickPayload(contractor: Contractor): ContractorPayload {
  return {
    name: contractor.name,
    contact_info: contractor.contact_info,
    type: contractor.type,
  };
}

export function ContractorForm({
  initial,
  submitLabel = "Add contractor",
  onCancel,
  onSubmit,
}: {
  initial?: Contractor;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: ContractorPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<ContractorPayload>(() =>
    initial ? pickPayload(initial) : { name: "", contact_info: "", type: "contractor" }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ContractorPayload>(key: K, value: ContractorPayload[K]) {
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
        label="Contractor name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
        placeholder="e.g. Apex Construction"
      />
      <Select
        label="Type"
        required
        value={form.type}
        onChange={(e) => update("type", e.target.value as Contractor["type"])}
        error={fieldErrors.type}
      >
        {CONTRACTOR_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Textarea
        label="Contact information"
        value={form.contact_info}
        onChange={(e) => update("contact_info", e.target.value)}
        error={fieldErrors.contact_info}
        placeholder="Phone · email · address"
        className="min-h-[72px]"
      />
<p className="text-xs text-text-muted">
        This contractor will appear as an option in the Contractor field of work packages.
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