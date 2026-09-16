"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
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
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/kpi-card";
import { MODULE_ACCESS, RequireRole, useAuth } from "@/features/auth";
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
import { exportCsv, formatDateForFile } from "@/lib/csv";
import { useCrud } from "@/hooks/use-crud";

const unitLabel = (unit: string) =>
  MATERIAL_UNITS.find((u) => u.value === unit)?.label ?? unit;

function MaterialsContent() {
  const { user } = useAuth();
  const toast = useToast();
  const canWrite = !!user && MATERIALS_WRITE_ROLES.includes(user.role);
  const crud = useCrud<Material>({ resource: "material" });

  const materialsQuery = useMaterials();
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial();

  const [search, setSearch] = useState("");

  const materials = useMemo(() => materialsQuery.data ?? [], [materialsQuery.data]);

  const visibleMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter((m) =>
      [m.name, m.unit, m.id].some((field) => field.toLowerCase().includes(q))
    );
  }, [materials, search]);

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

  function handleExport() {
    exportCsv({
      filename: `materials-${formatDateForFile(new Date())}`,
      headers: ["Material", "Unit", "Default rate"],
      rows: visibleMaterials.map((m) => [m.name, unitLabel(m.unit), m.default_rate]),
    });
  }

  async function handleSave(payload: MaterialPayload) {
    if (crud.editing) {
      await updateMaterial.mutateAsync({ id: crud.editing.id, patch: payload });
      toast({ title: "Material updated", variant: "success" });
    } else {
      await createMaterial.mutateAsync(payload);
      toast({ title: "Material added", variant: "success" });
    }
    crud.setFormOpen(false);
    crud.setEditing(null);
  }

  function handleDelete() {
    void crud.confirmDelete(
      (material) => deleteMaterial.mutateAsync(material.id),
      { successLabel: "Material removed." }
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="Materials"
        description="Shared catalog of construction materials with default rates."
        actions={
          <>
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 lg:w-56"
            />
            <Button variant="outline" onClick={handleExport}>
              Export CSV
            </Button>
            {canWrite && <Button onClick={() => crud.startCreate()}>Add material</Button>}
          </>
        }
      />

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
                <Button onClick={() => crud.startCreate()}>Add material</Button>
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
                {visibleMaterials.map((material) => (
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
                            onClick={() => crud.startEdit(material)}
                            className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => crud.requestDelete(material, material.id)}
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
        open={crud.formOpen}
        onClose={() => {
          crud.setFormOpen(false);
          crud.setEditing(null);
        }}
        title={crud.editing ? "Edit material" : "Add material"}
        subtitle="Rates are used as defaults when raising BOQ items and material indents."
        size="lg"
      >
        <MaterialForm
          key={crud.editing?.id ?? "new"}
          initial={crud.editing ?? undefined}
          submitLabel={crud.editing ? "Save changes" : "Add material"}
          onCancel={() => {
            crud.setFormOpen(false);
            crud.setEditing(null);
          }}
          onSubmit={handleSave}
        />
      </Modal>

      <ConfirmDialog
        open={crud.deleteTarget !== null}
        onClose={() => crud.setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete material"
        description={`Remove ${crud.deleteTarget?.name} from the materials catalog? This cannot be undone.`}
        busy={crud.busy}
      />
    </main>
  );
}

export default function MaterialsPage() {
  return (
    <RequireRole roles={MODULE_ACCESS.materials}>
      <MaterialsContent />
    </RequireRole>
  );
}