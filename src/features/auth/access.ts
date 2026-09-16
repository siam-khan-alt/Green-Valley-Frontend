import type { Role } from "./types";

export const ALL_ROLES: Role[] = ["admin", "project_manager", "site_staff", "finance", "viewer"];

/** Short URL segment per role: /admin, /pm, /site, /finance, /viewer */
export const ROLE_SLUG: Record<Role, string> = {
  admin: "admin",
  project_manager: "pm",
  site_staff: "site",
  finance: "finance",
  viewer: "viewer",
};

export const SLUG_TO_ROLE: Record<string, Role> = {
  admin: "admin",
  pm: "project_manager",
  site: "site_staff",
  finance: "finance",
  viewer: "viewer",
};

export function roleSlug(role: Role): string {
  return ROLE_SLUG[role];
}

/** Which roles may open each module. Keys match NavItem id / route segments. */
export const MODULE_ACCESS: Record<string, Role[]> = {
  dashboard: ALL_ROLES,
  projects: ALL_ROLES,
  reports: ALL_ROLES,
  "ui-kit": ["admin"],
  materials: ["admin", "project_manager", "finance", "viewer"],
  suppliers: ["admin", "project_manager", "finance", "viewer"],
  contractors: ["admin", "project_manager", "finance", "viewer"],
  operations: ["admin", "project_manager", "site_staff", "viewer"],
  inspections: ["admin", "project_manager", "site_staff", "viewer"],
  quality: ["admin", "project_manager", "site_staff", "viewer"],
  labor: ["admin", "project_manager", "site_staff", "viewer"],
  machinery: ["admin", "project_manager", "site_staff", "viewer"],
  schedule: ["admin", "project_manager", "finance", "viewer"],
  "work-packages": ["admin", "project_manager", "finance", "viewer"],
  boq: ["admin", "project_manager", "finance", "viewer"],
  procurement: ["admin", "project_manager", "finance", "viewer"],
  variations: ["admin", "project_manager", "finance", "viewer"],
  billing: ["admin", "project_manager", "finance", "viewer"],
  expenses: ["admin", "project_manager", "finance", "viewer"],
  profitability: ["admin", "project_manager", "finance", "viewer"],
  users: ["admin"],
  "audit-log": ["admin"],
};

/** Per-project sub-module access, keyed by the route segment after /:role/projects/:id. */
export const PROJECT_SUBMODULE_ROLES: Record<string, Role[]> = {
  operations: ["admin", "project_manager", "site_staff", "viewer"],
  labor: ["admin", "project_manager", "site_staff", "viewer"],
  machinery: ["admin", "project_manager", "site_staff", "viewer"],
  quality: ["admin", "project_manager", "site_staff", "viewer"],
  schedule: ["admin", "project_manager", "finance", "viewer"],
  "work-packages": ["admin", "project_manager", "finance", "viewer"],
  boq: ["admin", "project_manager", "finance", "viewer"],
  procurement: ["admin", "project_manager", "finance", "viewer"],
  variations: ["admin", "project_manager", "finance", "viewer"],
  billing: ["admin", "project_manager", "finance", "viewer"],
  expenses: ["admin", "project_manager", "finance", "viewer"],
  profitability: ["admin", "project_manager", "finance", "viewer"],
  reports: ALL_ROLES,
};

export function hasModuleAccess(role: Role, name: string): boolean {
  return MODULE_ACCESS[name]?.includes(role) ?? false;
}

export function resolveProjectSubmoduleRoles(segment: string | undefined): Role[] {
  if (!segment) return ALL_ROLES;
  return PROJECT_SUBMODULE_ROLES[segment] ?? ALL_ROLES;
}

export interface ParsedRolePath {
  slug: string;
  role: Role | undefined;
  area: string | undefined;
  subarea: string | undefined;
}

/** Parses /:slug, /:slug/projects, /:slug/projects/:id/:sub, /:slug/materials, … */
export function parseRolePath(pathname: string): ParsedRolePath | null {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const slug = parts[0];
  const role = SLUG_TO_ROLE[slug];
  if (!role) return null;
  const area = parts[1];
  let subarea: string | undefined;
  if (area === "projects" && parts.length >= 4) {
    subarea = parts[3];
  }
  return { slug, role, area, subarea };
}