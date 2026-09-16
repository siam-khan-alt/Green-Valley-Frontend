"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Badge, Card, CardBody, CardHeader } from "@/components/ui";
import {
  ACTIVE_PROJECT_KEY,
  NAV_GROUPS,
  resolveHref,
} from "@/components/layout/nav";
import { NavIcon } from "@/components/layout/icons";
import {
  hasModuleAccess,
  ROLES,
  ROLE_CAPABILITIES,
  roleSlug,
  useAuth,
} from "@/features/auth";
import type { Role } from "@/features/auth";
import { cn } from "@/lib/cn";
import { usePendingApprovals } from "@/hooks/use-pending-approvals";

function firstName(name: string) {
  return name.split(" ")[0];
}

function subscribeToActiveProject(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getActiveProjectSnapshot(): string | null {
  return window.localStorage.getItem(ACTIVE_PROJECT_KEY);
}

function getActiveProjectServerSnapshot(): string | null {
  return null;
}

const QUICK_ACTIONS: Record<
  Role,
  { label: string; desc: string; slug?: string; href?: string }[]
> = {
  admin: [
    { label: "Create project", desc: "Add a new project to the portfolio" },
    { label: "Manage users & roles", desc: "Assign roles and activate accounts", href: "/users" },
    { label: "Audit log", desc: "Review all sensitive record changes", href: "/audit-log" },
  ],
  project_manager: [
    { label: "Update schedule", desc: "Track milestone progress", slug: "/schedule" },
    { label: "Manage BOQ", desc: "Control quantities and measurements", slug: "/boq" },
    { label: "Raise purchase order", desc: "Convert indents to POs", slug: "/procurement" },
    { label: "Approve variations", desc: "Review scope change requests", slug: "/variations" },
  ],
  site_staff: [
    { label: "Log daily progress", desc: "Submit DPR for today's site work", slug: "/operations" },
    { label: "Update muster roll", desc: "Record daily attendance", slug: "/labor" },
    { label: "Record machinery usage", desc: "Log equipment hours", slug: "/machinery" },
  ],
  finance: [
    { label: "Record expense", desc: "Capture costs and payments", slug: "/expenses" },
    { label: "Approve RA bills", desc: "Validate running account bills", slug: "/billing" },
    { label: "View profitability", desc: "Budget vs actual overview", slug: "/profitability" },
  ],
  viewer: [
    { label: "Browse projects", desc: "Read-only portfolio overview", href: "/projects" },
    { label: "View reports", desc: "Portfolio-level summaries", href: "/reports" },
  ],
};

export default function DashboardPage() {
  const { user } = useAuth();
  const activeProjectId = useSyncExternalStore(
    subscribeToActiveProject,
    getActiveProjectSnapshot,
    getActiveProjectServerSnapshot,
  );

  if (!user) return null;

  const role = user.role;
  const slug = roleSlug(role);
  const visibleItems = NAV_GROUPS.flatMap((group) =>
    group.items.filter((item) => hasModuleAccess(role, item.id)),
  );

  const actions = QUICK_ACTIONS[role].map((action) => ({
    ...action,
    href: action.href
      ? `/${slug}${action.href}`
      : activeProjectId
        ? `/${slug}/projects/${activeProjectId}${action.slug}`
        : `/${slug}/projects`,
  }));

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Welcome back, {firstName(user.name)}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {ROLES[role].description}
          </p>
        </div>
        <Badge variant="primary" dot>
          {ROLES[role].label}
        </Badge>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="group rounded-xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-semibold text-text group-hover:text-primary">
              {action.label}
            </p>
            <p className="mt-1 text-xs text-text-muted">{action.desc}</p>
            {!action.href && !activeProjectId && (
              <p className="mt-2 inline-block rounded bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium text-primary">
                Pick a project first
              </p>
            )}
          </Link>
        ))}
      </div>

      <PendingApprovals slug={slug} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-text">Your modules</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visibleItems.map((item) => {
            const href = resolveHref(item, slug, activeProjectId);
            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border border-border bg-surface p-3 text-sm font-medium text-text-muted transition-colors hover:text-primary hover:shadow-sm",
                  Boolean(item.projectPath) && !activeProjectId && "opacity-60",
                )}
              >
                {item.icon && (
                  <NavIcon name={item.icon} className="shrink-0 text-primary" />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title={`What ${ROLES[role].label} can do`} />
          <CardBody>
            <ul className="flex flex-col gap-1.5">
              {ROLE_CAPABILITIES[role].map((cap) => (
                <li key={cap} className="flex items-start gap-2 text-sm text-text">
                  <svg className="mt-0.5 size-4 shrink-0 text-success" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {cap}
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Role-based access" />
          <CardBody>
            <p className="text-sm text-text-muted">
              Sidebar, dashboards, and module pages are filtered by your role —{" "}
              {ROLES[role].label} only sees its own team&apos;s flow.
            </p>
            <p className="mt-3 text-sm text-text-muted">
              Pick a project to access that project&apos;s module pages from the
              sidebar or the quick actions above.
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

const TYPE_META: Record<string, { label: string; variant: "warning" | "info" | "primary" }> = {
  indent: { label: "Indent", variant: "warning" },
  ra_bill: { label: "RA Bill", variant: "info" },
  variation: { label: "Variation", variant: "primary" },
};

function PendingApprovals({ slug }: { slug: string }) {
  const { items, isPending, isError } = usePendingApprovals();

  if (isPending || isError || items.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">
          Awaiting your approval
          <Badge variant="warning" className="ml-2">{items.length}</Badge>
        </h2>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => {
          const meta = TYPE_META[item.type];
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={`/${slug}/${item.url}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 transition-colors hover:shadow-sm"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Badge variant={meta.variant}>{meta.label}</Badge>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{item.label}</p>
                  <p className="text-xs text-text-muted">{item.projectName}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-medium text-primary">Review →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}