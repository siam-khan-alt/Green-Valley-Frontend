"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select } from "@/components/ui";
import { toApiError } from "@/services";
import { USER_ROLE_OPTIONS } from "../constants";
import type { UserPayload } from "../types";

export function UserForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: (payload: UserPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<UserPayload>({
    name: "",
    email: "",
    role: "viewer",
    is_active: true,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof UserPayload>(key: K, value: UserPayload[K]) {
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
        label="Full name"
        required
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        error={fieldErrors.name}
      />
      <Input
        label="Email"
        type="email"
        required
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        error={fieldErrors.email}
      />
      <Select
        label="Role"
        required
        value={form.role}
        onChange={(e) => update("role", e.target.value as UserPayload["role"])}
        error={fieldErrors.role}
      >
        {USER_ROLE_OPTIONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </Select>
      <Select
        label="Status"
        required
        value={form.is_active ? "active" : "inactive"}
        onChange={(e) => update("is_active", e.target.value === "active")}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </Select>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Create user
        </Button>
      </div>
    </form>
  );
}