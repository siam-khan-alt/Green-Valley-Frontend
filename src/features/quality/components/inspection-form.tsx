"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { toApiError } from "@/services";
import { INSPECTION_TYPES, INSPECTION_STATUS_OPTIONS } from "../constants";
import type { Inspection, InspectionPayload, InspectionPatch } from "../types";
import { useWorkPackages } from "@/features/work-packages";

const EMPTY_FORM: InspectionPayload = {
  work_package_id: "",
  type: "foundation",
  requested_by: "",
  scheduled_date: "",
  remarks: "",
};

function pickPayload(insp: Inspection): InspectionPayload {
  return {
    work_package_id: insp.work_package_id,
    type: insp.type,
    requested_by: insp.requested_by,
    scheduled_date: insp.scheduled_date,
    remarks: insp.remarks,
  };
}

export function InspectionForm({
  initial,
  projectId,
  submitLabel = "Request inspection",
  onCancel,
  onSubmit,
}: {
  initial?: Inspection;
  projectId: string;
  submitLabel?: string;
  onCancel: () => void;
  onSubmit: (payload: InspectionPayload) => Promise<void>;
}) {
  const [form, setForm] = useState<InspectionPayload>(() =>
    initial
      ? pickPayload(initial)
      : { ...EMPTY_FORM, scheduled_date: new Date().toISOString().split("T")[0] }
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  const { data: workPackages = [] } = useWorkPackages(projectId);

  function update<K extends keyof InspectionPayload>(
    key: K,
    value: InspectionPayload[K]
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
      <Select
        label="Work package"
        required
        value={form.work_package_id}
        onChange={(e) => update("work_package_id", e.target.value)}
        error={fieldErrors.work_package_id}
      >
        {workPackages.map((wp) => (
          <option key={wp.id} value={wp.id}>
            {wp.code} — {wp.name}
          </option>
        ))}
      </Select>
      <Select
        label="Inspection type"
        required
        value={form.type}
        onChange={(e) => update("type", e.target.value as InspectionPayload["type"])}
        error={fieldErrors.type}
      >
        {INSPECTION_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>
      <Input
        label="Requested by"
        required
        value={form.requested_by}
        onChange={(e) => update("requested_by", e.target.value)}
        error={fieldErrors.requested_by}
        placeholder="e.g. Site Engineer"
      />
      <Input
        label="Scheduled date"
        type="date"
        required
        value={form.scheduled_date}
        onChange={(e) => update("scheduled_date", e.target.value)}
        error={fieldErrors.scheduled_date}
      />
      <Textarea
        label="Remarks"
        value={form.remarks}
        onChange={(e) => update("remarks", e.target.value)}
        error={fieldErrors.remarks}
        placeholder="Additional details or prerequisites…"
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

export function InspectionStatusForm({
  inspection,
  onCancel,
  onSubmit,
}: {
  inspection: Inspection;
  onCancel: () => void;
  onSubmit: (patch: InspectionPatch) => Promise<void>;
}) {
  const [form, setForm] = useState<InspectionPatch>({
    status: inspection.status,
    scheduled_date: inspection.scheduled_date,
    actual_date: inspection.actual_date ?? "",
    remarks: inspection.remarks,
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof InspectionPatch>(key: K, value: InspectionPatch[K]) {
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
        label="Status"
        required
        value={form.status ?? inspection.status}
        onChange={(e) => update("status", e.target.value as InspectionPatch["status"])}
        error={fieldErrors.status}
      >
        {INSPECTION_STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>
      <Input
        label="Actual date"
        type="date"
        value={form.actual_date ?? ""}
        onChange={(e) => update("actual_date", e.target.value)}
        error={fieldErrors.actual_date}
      />
      <Textarea
        label="Remarks"
        value={form.remarks ?? inspection.remarks}
        onChange={(e) => update("remarks", e.target.value)}
        error={fieldErrors.remarks}
        className="sm:col-span-2"
      />
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}