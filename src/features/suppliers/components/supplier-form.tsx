"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import type { Supplier, SupplierPayload } from "../types";

function pickPayload(supplier: Supplier): SupplierPayload {
  return { name: supplier.name, contact_info: supplier.contact_info };
}

export function SupplierForm({
  initial,
  submitLabel = "Add supplier",
  onCancel,
  onSubmit,
}: {
  initial?: Supplier;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: SupplierPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<SupplierPayload>(() =>
    initial ? pickPayload(initial) : { name: "", contact_info: "" }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof SupplierPayload>(key: K, value: SupplierPayload[K]) {
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
        label="Supplier name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
        placeholder="e.g. Bashundhara Steel"
      />
      <Textarea
        label="Contact information"
        value={form.contact_info}
        onChange={(e) => update("contact_info", e.target.value)}
        error={fieldErrors.contact_info}
        placeholder="Phone · email · address"
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