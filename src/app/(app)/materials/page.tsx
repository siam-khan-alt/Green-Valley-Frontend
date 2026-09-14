"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TdCell,
  ThCell,
  useToast,
} from "@/components/ui";
import { useAuth } from "@/features/auth";
import { KpiCard } from "@/features/projects";
import {
  MATERIALS_WRITE_ROLES,
  MATERIAL_UNITS,
  MaterialForm,
  useCreateMaterial,
  useDeleteMaterial,
  useMaterials,
  useUpdateMaterial,
} from "@/features/materials";
import type { Material, MaterialPayload } from "@/features/materials";
import { formatCurrency } from "@/lib/format";

const unitLabel = (unit: string) =>
  MATERIAL_UNITS.find((u) => u.value === unit)?.label ?? unit;

export default function MaterialsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && MATERIALS_WRITE_ROLES.includes(user.role);

  const materialsQuery = useMaterials();
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [deleting, setDeleting] = useState<Material | null>(null);
  const [busy, setBusy] = useState(false);

  const materials = useMemo(() => materialsQuery.data ?? [], [materialsQuery.data]);

  const avgRate = useMemo(() => {
    if (materials.length === 0) return 0;
    return Math.round(
      materials.reduce((sum, m) => sum + m.default_rate, 0) / materials.length
    );
  }, [materials]);
  const highest = useMemo(() => {
    return materials.reduce<Material | null>(
      (max, m) => (max === null || m.default_rate > max.default_rate ? m : max),
      null
    );
  }, [materials]);

  if (materialsQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <LoadingState label="Loading materials…" />
      </main>
    );
  }

  if (materialsQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <ErrorState
          title="Could not load materials"
          description={materialsQuery.error.message}
          retry={
            <Button variant="outline" onClick={() => void materialsQuery.refetch()}>
              Retry
            </Button>
          }
        />
      </main>
    );
  }

  async function handleSave(payload: MaterialPayload) {
    if (editing) {
      await updateMaterial.mutateAsync({ id: editing.id, patch: payload });
      toast({ title: "Material updated", variant: "success" });
    } else {
      await createMaterial.mutateAsync(payload);
      toast({ title: "Material added", variant: "success" });
    }
    setFormOpen(false);
    setEditing(null);
  }

  async function handleDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteMaterial.mutateAsync(deleting.id);
      toast({ title: "Material removed", variant: "success" });
      setDeleting(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">Materials</h1>
          <p className="mt-1 text-sm text-text-muted">
            Shared catalog of construction materials with default rates.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setFormOpen(true)}>Add material</Button>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <KpiCard label="Materials in catalog" value={materials.length} tone="info" />
        <KpiCard label="Average default rate" value={formatCurrency(avgRate)} tone="muted" />
        <KpiCard
          label="Highest rate item"
          value={highest ? formatCurrency(highest.default_rate) : "—"}
          tone="primary"
          sub={highest?.name}
        />
      </div>

      <div className="mt-6">
        {materials.length === 0 ? (
          <EmptyState
            title="No materials yet"
            description="Add the materials you buy regularly so BOQ and indent rates can be sourced."
            action={
              canWrite ? (
                <Button onClick={() => setFormOpen(true)}>Add material</Button>
              ) : undefined
            }
          />
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <ThCell>Material</ThCell>
                  <ThCell>Unit</ThCell>
                  <ThCell className="text-right">Default rate</ThCell>
                  <ThCell>‎</ThCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TdCell className="font-medium text-text">{material.name}</TdCell>
                    <TdCell className="text-text-muted">
                      {unitLabel(material.unit)}
                    </TdCell>
                    <TdCell className="whitespace-nowrap text-right tabular-nums">
                      {formatCurrency(material.default_rate)}
                    </TdCell>
                    <TdCell>
                      {canWrite && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(material);
                              setFormOpen(true);
                            }}
                            className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(material)}
                            className="text-xs font-medium text-danger transition-colors hover:text-danger-hover"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </TdCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit material" : "Add material"}
        subtitle="Rates are used as defaults when raising BOQ items and material indents."
        size="lg"
      >
        <MaterialForm
          key={editing?.id ?? "new"}
          initial={editing ?? undefined}
          submitLabel={editing ? "Save changes" : "Add material"}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSave}
        />
      </Modal>

      <Modal
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete material"
        subtitle="Removing an item from the catalog."
        size="sm"
      >
        <p className="text-sm text-text-muted">
          Remove <span className="font-semibold text-text">{deleting?.name}</span> from
          the materials catalog? This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} onClick={handleDelete}>
            Delete material
          </Button>
        </div>
      </Modal>
    </main>
  );
}