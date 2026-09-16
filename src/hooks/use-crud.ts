"use client";

import { useState } from "react";
import { useToast } from "@/components/ui";
import { toErrorMessage } from "@/services";
import { recordAction } from "@/features/audit-log/services/audit-log.mock";
import { useAuth } from "@/features/auth";
import type { AuditTargetType } from "@/features/audit-log/types";

/**
 * Shared state for the standard page CRUD flow:
 * create/edit modal + delete confirmation + audit recording.
 * Kills the 15× duplicated `formOpen/editing/deleting/busy` triple.
 */
export function useCrud<T>({ resource }: { resource: AuditTargetType }) {
  const toast = useToast();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string>("");
  const [busy, setBusy] = useState(false);

  function startCreate() {
    setEditing(null);
    setFormOpen(true);
    recordAction({
      action: "created",
      target_type: resource,
      target_id: "(new)",
      metadata: {},
      user: user?.name ?? "",
      user_email: user?.email ?? "",
    });
  }

  function startEdit(_item: T) {
    setEditing(_item);
    setFormOpen(true);
  }

  function requestDelete(item: T, id: string) {
    setDeleteTarget(item);
    setDeleteTargetId(id);
  }

  async function confirmDelete(
    onDelete: (item: T) => Promise<void>,
    options?: { successLabel?: string; onDone?: () => void; targetId?: string },
  ) {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await onDelete(deleteTarget);
      recordAction({
        action: "deleted",
        target_type: resource,
        target_id: options?.targetId ?? deleteTargetId,
        metadata: {},
        user: user?.name ?? "",
        user_email: user?.email ?? "",
      });
      toast({
        title: "Deleted",
        description: options?.successLabel ?? "Record deleted.",
        variant: "success",
      });
      setDeleteTarget(null);
      setDeleteTargetId("");
      options?.onDone?.();
    } catch (error) {
      toast({ title: "Delete failed", description: toErrorMessage(error), variant: "error" });
    } finally {
      setBusy(false);
    }
  }

  return {
    formOpen,
    setFormOpen,
    editing,
    setEditing,
    startCreate,
    startEdit,
    deleteTarget,
    setDeleteTarget,
    requestDelete,
    confirmDelete,
    busy,
  } as const;
}