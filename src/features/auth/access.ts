import type { Role } from "./types";

export const ALL_ROLES: Role[] = ["admin", "project_manager", "site_staff", "finance", "viewer"];

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

/** Per-project sub-module access, keyed by the route segment after /dashboard/projects/:id. */
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

export function hasModuleAccess(role: Role, module: string): boolean {
  return MODULE_ACCESS[module]?.includes(role) ?? false;
}

export function resolveProjectSubmoduleRoles(segment: string | undefined): Role[] {
  if (!segment) return ALL_ROLES;
  return PROJECT_SUBMODULE_ROLES[segment] ?? ALL_ROLES;
}

/** Extracts the sub-module segment from e.g. /dashboard/projects/abc/operations → "operations" */
export function parseProjectSubmodule(pathname: string): string | undefined {
  const match = pathname.match(/^\/dashboard\/projects\/[^/]+(?:\/([^/]+))?/);
  if (!match) return undefined;
  return match[1] || undefined;
}