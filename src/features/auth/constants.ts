import type { Role } from "./types";

export const STORAGE_KEYS = {
  accessToken: "gv_access_token",
  refreshToken: "gv_refresh_token",
  user: "gv_user",
} as const;

export const ROLES: Record<
  Role,
  { label: string; description: string }
> = {
  admin: {
    label: "Admin",
    description: "Manages users, organization, and all modules.",
  },
  project_manager: {
    label: "Project Manager",
    description: "Manages BOQ, indents, POs, variations, work packages, measurements, and inspection approvals.",
  },
  site_staff: {
    label: "Site/Progress Staff",
    description: "Logs daily work reports, muster roll, and machinery usage.",
  },
  finance: {
    label: "Finance",
    description: "Writes expenses and payments; manages RA bill approvals.",
  },
  viewer: {
    label: "Viewer",
    description: "Read-only dashboards for stakeholders.",
  },
};

export const ROLE_CAPABILITIES: Record<Role, string[]> = {
  admin: [
    "Manage users & roles",
    "Create projects & work packages",
    "Full read/write on every module",
    "View audit log & portfolio reports",
  ],
  project_manager: [
    "Create & edit projects, schedule, work packages",
    "Manage BOQ, indents, purchase orders",
    "Approve/reject variations & inspections",
    "Create measurement entries & RA bills",
  ],
  site_staff: [
    "Submit daily work reports (DPR)",
    "Log muster roll attendance",
    "Log machinery usage",
  ],
  finance: [
    "Create expenses & payments",
    "Approve & generate RA bills",
    "View cost breakdown & budget vs actual",
  ],
  viewer: [
    "View projects, progress & profitability (read-only)",
  ],
};