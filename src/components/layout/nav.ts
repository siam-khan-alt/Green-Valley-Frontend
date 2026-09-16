export const ORG_NAME = "Green Valley";
export const ORG_SUBTITLE = "Developers";

export type NavItem = {
  /** unique within the whole sidebar; required when several items share an href */
  id: string;
  label: string;
  href: string;
  icon?: string;
  /** module path under a project (e.g. "/operations"); item links there when a project is open */
  projectPath?: string;
  /** extra paths that should highlight this item (e.g. "/" for dashboard) */
  match?: string[];
};

export const ACTIVE_PROJECT_KEY = "gv.activeProjectId";

/** Resolves a nav item's href once we know which project the user is working in. */
export function resolveHref(item: NavItem, activeProjectId: string | null): string {
  if (!item.projectPath || !activeProjectId) return item.href;
  return `/dashboard/projects/${activeProjectId}${item.projectPath}`;
}

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const ICONS = {
  dashboard: "M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z",
  projects:
    "M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6M9 10h.01M15 10h.01",
  kit: "M12 2 2 7v10l10 5 10-5V7l-10-5Zm-7 8.2 5 2.5v6.3l-5-2.5V10.2Zm12-1-5 2.5v6.5l5-2.5V9.2Zm-1.2-2.1L12 9.3 8.2 7.1 12 5l3.8 2.1ZM4 17.1l5 2.5v-6.2l-5-2.5v6.2Z",
  materials:
    "M21 8l-9-5-9 5v8l9 5 9-5V8Zm-9 3V4.5M3.4 8.2l8.6 4.8 8.6-4.8M12 13v6.5",
  suppliers:
    "M16 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm-5.5 9c.7-2.6 2.5-4.5 5.5-4.5s4.8 1.9 5.5 4.5M4 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm3.1 4.4C5.6 16.6 4.3 17.9 3.5 20M15 16.5c-2.1 0-4.1.9-5.6 2.6",
  contractors:
    "M9 7h6M9 7a2 2 0 0 1-2-2V3.5M9 7c0 2.8-1.2 4.5-3 6l1 2h10l1-2c-1.8-1.5-3-3.2-3-6M15 7a2 2 0 0 0 2-2V3.5M7 21h10M7 21c.5-2.5 1.8-4.5 5-4.5s4.5 2 5 4.5M7 21v.5M17 21v.5",
  operations:
    "M12 4v16m8-8H4m7-7 5 5-5 5",
  quality:
    "M12 2 4 6v5c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V6l-8-4Zm-2.5 12.5L7.5 12l-1 1L9.5 15 12 12l-1-1-2.5 3.5Z",
  billing:
    "M4 5v14h16V5H4Zm2 2h12v10H6V7Zm2 3h8v2H8v-2Zm0 4h8v2H8v-2Z",
  variations:
    "M4 4h9v9H4V4zm7 7V6H6v5h5zM7 17h4v2H7v-2zm6-9h7v2h-7V8zm-3 4v7h7v-7h-7zm2 5v-3h3v3h-3z",
  expenses:
    "M4 4h16v3H4V4zm0 5h16v11H4V9zm3 5h6v2H7v-2zm8 0h2v2h-2v-2zm-8 4h6v2H7v-2z",
  profitability:
    "M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7-5h4v19h-4V2z",
  reports:
    "M4 4h5v16H4V4zm6 0h5v10h-5V4zm6 0h4v16h-4V4z",
  users:
    "M12 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm-8 9a8 8 0 1 1 16 0H4Z",
  audit:
    "M5 3h14v18H5V3zm3 4h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z",
} as const;

/** Single source of truth for sidebar navigation. Future modules add their items here. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", id: "dashboard", href: "/dashboard", icon: ICONS.dashboard, match: ["/"] },
      { label: "Projects", id: "projects", href: "/dashboard/projects", icon: ICONS.projects },
      { label: "Reports", id: "reports", href: "/reports", icon: ICONS.reports },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Materials", id: "materials", href: "/materials", icon: ICONS.materials },
      { label: "Suppliers", id: "suppliers", href: "/suppliers", icon: ICONS.suppliers },
      { label: "Contractors", id: "contractors", href: "/contractors", icon: ICONS.contractors },
    ],
  },
  {
    label: "Site & Billing",
    items: [
      { label: "Operations (DPR)", id: "operations", href: "/dashboard/projects", icon: ICONS.operations, projectPath: "/operations" },
      { label: "Inspections", id: "inspections", href: "/dashboard/projects", icon: ICONS.quality, projectPath: "/quality" },
      { label: "Billing", id: "billing", href: "/dashboard/projects", icon: ICONS.billing, projectPath: "/billing" },
      { label: "Variations", id: "variations", href: "/dashboard/projects", icon: ICONS.variations, projectPath: "/variations" },
      { label: "Expenses", id: "expenses", href: "/dashboard/projects", icon: ICONS.expenses, projectPath: "/expenses" },
      { label: "Profitability", id: "profitability", href: "/dashboard/projects", icon: ICONS.profitability, projectPath: "/profitability" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Users & Roles", id: "users", href: "/users", icon: ICONS.users },
      { label: "Audit Log", id: "audit-log", href: "/audit-log", icon: ICONS.audit },
    ],
  },
  {
    label: "Design System",
    items: [{ label: "UI Kit", id: "ui-kit", href: "/ui-kit", icon: ICONS.kit }],
  },
];