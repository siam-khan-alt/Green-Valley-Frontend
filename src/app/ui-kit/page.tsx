"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Modal,
  Pagination,
  Select,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  Tabs,
  TdCell,
  Textarea,
  ThCell,
  useToast,
} from "@/components/ui";

const section = "mt-10 flex flex-col gap-3";
const h2 = "text-lg font-semibold text-text";

const statuses = [
  { label: "Planning", variant: "info" as const },
  { label: "Active", variant: "primary" as const },
  { label: "Delayed", variant: "warning" as const },
  { label: "Completed", variant: "success" as const },
  { label: "Over budget", variant: "danger" as const },
  { label: "Not started", variant: "neutral" as const },
];

export default function UIKitPage() {
  return <UIKitShowcase />;
}

function UIKitShowcase() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [demoError, setDemoError] = useState<string | undefined>(undefined);
  const [inputWork, setInputWork] = useState("");

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-bold text-text">UI Kit — Design System</h1>
      <p className="mt-1 text-sm text-text-muted">
        Green Valley Developers · Module 1 · tokens & core components (Docs/UI.md)
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          Toggle dark mode
        </Button>
        <span className="inline-flex items-center gap-2 rounded-md bg-surface-muted px-3 py-1 text-xs text-text-muted">
          This page is a live showcase — every component below is the real kit.
        </span>
      </div>

      <section className={section}>
        <h2 className={h2}>Color tokens</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            ["background", "bg-background"],
            ["surface", "bg-surface"],
            ["surface-muted", "bg-surface-muted"],
            ["border", "bg-border"],
            ["text", "bg-text"],
            ["text-muted", "bg-text-muted"],
            ["primary", "bg-primary"],
            ["primary-soft", "bg-primary-soft"],
            ["success", "bg-success"],
            ["warning", "bg-warning"],
            ["danger", "bg-danger"],
            ["info", "bg-info"],
          ].map(([name, cls]) => (
            <div
              key={name}
              className="rounded-md border border-border bg-surface p-2"
            >
              <div className={`h-10 rounded-md border border-border/40 ${cls}`} />
              <p className="mt-1.5 text-xs font-medium text-text">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={section}>
        <h2 className={h2}>Typography</h2>
        <Card>
          <CardBody className="flex flex-col gap-2">
            <p className="text-2xl font-bold">Heading 1 — Project overview</p>
            <p className="text-lg font-semibold">Heading 2 — Cost summary</p>
            <p className="text-base font-semibold">Heading 3 — Work packages</p>
            <p className="text-sm font-medium">Body — 14px medium weight</p>
            <p className="text-sm text-text-muted">
              Muted text — secondary information, helper copy.
            </p>
            <code className="rounded bg-surface-muted px-2 py-1 font-mono text-xs">
              Code / mono — BOQ_item_001
            </code>
          </CardBody>
        </Card>
      </section>

      <section className={section}>
        <h2 className={h2}>Buttons</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Destroy</Button>
          <Button variant="success">Success</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <div className="flex items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </section>

      <section className={section}>
        <h2 className={h2}>Form controls</h2>
        <Card className="max-w-lg">
          <CardBody className="flex flex-col gap-4">
            <Input
              label="Project name"
              placeholder="Riverfront Towers"
              value={inputWork}
              onChange={(e) => setInputWork(e.target.value)}
              hint="Visible on every project screen."
            />
            <Input
              label="Budget"
              required
              type="number"
              defaultValue={0}
              error={demoError}
              onChange={() => setDemoError(undefined)}
            />
            <Select
              label="Project type"
              defaultValue="residential"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed">Mixed use</option>
            </Select>
            <Textarea
              label="Description"
              placeholder="Scope, floors, key specs…"
            />
            <div className="flex gap-2">
              <Button onClick={() => setDemoError("Budget must be a positive number.")}>
                Trigger error
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      <section className={section}>
        <h2 className={h2}>Badges & status</h2>
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => (
            <Badge key={s.label} variant={s.variant} dot>
              {s.label}
            </Badge>
          ))}
        </div>
      </section>

      <section className={section}>
        <h2 className={h2}>Card</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs text-text-muted">Budget</p>
            <p className="mt-1 text-2xl font-bold">৳ 12,40,00,000</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-text-muted">Actual cost</p>
            <p className="mt-1 text-2xl font-bold">৳ 8,15,00,000</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-text-muted">Expected profit</p>
            <p className="mt-1 text-2xl font-bold text-success">৳ 2,30,00,000</p>
          </Card>
        </div>
        <Card>
          <CardHeader title="Project overview" subtitle="Key figures across work packages" />
          <CardBody>
            <p className="text-sm text-text">
              KPI cards, tables, and other data-dense blocks live in Cards.
            </p>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="secondary">
              View report
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className={section}>
        <h2 className={h2}>Table</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <ThCell>Work package</ThCell>
                <ThCell>BOQ progress</ThCell>
                <ThCell>Status</ThCell>
                <ThCell className="text-right">Cost to date</ThCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Substructure", "45%", "Active", "৳ 2,10,00,000"],
                ["Superstructure", "12%", "Active", "৳ 96,00,000"],
                ["MEP works", "0%", "Not started", "৳ 0"],
                ["Finishing", "0%", "Delayed", "৳ 4,50,000"],
              ].map((row) => (
                <TableRow key={row[0]}>
                  <TdCell className="font-medium">{row[0]}</TdCell>
                  <TdCell>{row[1]}</TdCell>
                  <TdCell>
                    <Badge
                      variant={
                        row[2] === "Active"
                          ? "primary"
                          : row[2] === "Delayed"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {row[2]}
                    </Badge>
                  </TdCell>
                  <TdCell className="text-right">{row[3]}</TdCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className={section}>
        <h2 className={h2}>Tabs</h2>
        <Tabs
          defaultValue="summary"
          tabs={[
            { value: "summary", label: "Summary", badge: 12 },
            { value: "boq", label: "BOQ" },
            { value: "billing", label: "RA Bills" },
          ]}
        >
          {(active) => (
            <Card>
              <CardBody className="text-sm text-text">
                Active tab: <code className="font-mono">{active}</code> — content swaps
                here (in real pages this renders the feature&apos;s view).
              </CardBody>
            </Card>
          )}
        </Tabs>
      </section>

      <section className={section}>
        <h2 className={h2}>Dropdown</h2>
        <div className="flex gap-4">
          <Dropdown
            label="Row actions"
            trigger={<Button variant="secondary">Actions…</Button>}
            items={[
              { label: "View details" },
              { label: "Edit" },
              { label: "Approve RA bill" },
              { divider: true },
              { label: "Delete", danger: true },
            ]}
          />
        </div>
      </section>

      <section className={section}>
        <h2 className={h2}>Modal</h2>
        <div className="flex gap-2">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="New work package"
          subtitle="Substructure phase — excavated footing works"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>Create WPI-04</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <Input label="Work package code" placeholder="WPI-04" />
            <Input label="Name" placeholder="Footing + column necks" />
            <Textarea label="Description" placeholder="Reinforcement, formwork, concrete grade C30…" />
          </div>
        </Modal>
      </section>

      <section className={section}>
        <h2 className={h2}>Toast notifications</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="success"
            onClick={() => toast({ title: "RA bill approved", description: "BIL-2026-014 · net ৳ 6,20,000", variant: "success" })}
          >
            Success toast
          </Button>
          <Button
            variant="danger"
            onClick={() => toast({ title: "Simulation not applied", description: "Values are hypothetical — press Apply to persist.", variant: "error" })}
          >
            Error toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast({ title: "3 changes to review", variant: "warning" })}
          >
            Warning toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast({ title: "Inspection requested", description: "Footing level-1 · scheduled for inspection.", variant: "info" })}
          >
            Info toast
          </Button>
        </div>
      </section>

      <section className={section}>
        <h2 className={h2}>Pagination</h2>
        <Card>
          <CardBody>
            <Pagination
              page={page}
              totalPages={8}
              totalItems={78}
              onPageChange={setPage}
            />
          </CardBody>
        </Card>
      </section>

      <section className={section}>
        <h2 className={h2}>Empty, loading & error states</h2>
        <div className="grid gap-3 lg:grid-cols-3">
          <EmptyState
            title="No BOQ items yet"
            description="Add line items from the project BOQ to start tracking quantities."
            action={<Button size="sm">Add BOQ item</Button>}
          />
          <LoadingState label="Loading work packages…" />
          <ErrorState
            title="Failed to load profitability"
            description="The calculation engine did not respond. Retry the request."
            retry={<Button size="sm" variant="danger">Retry</Button>}
          />
        </div>
      </section>
    </main>
  );
}