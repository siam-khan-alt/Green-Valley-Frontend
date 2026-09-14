export const ORG_NAME = "Green Valley";
export const ORG_SUBTITLE = "Developers";

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
  /** extra paths that should highlight this item (e.g. "/" for dashboard) */
  match?: string[];
};

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
} as const;

/** Single source of truth for sidebar navigation. Future modules add their items here. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: ICONS.dashboard, match: ["/"] },
      { label: "Projects", href: "/projects", icon: ICONS.projects },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Materials", href: "/materials", icon: ICONS.materials },
      { label: "Suppliers", href: "/suppliers", icon: ICONS.suppliers },
    ],
  },
  {
    label: "Design System",
    items: [{ label: "UI Kit", href: "/ui-kit", icon: ICONS.kit }],
  },
];