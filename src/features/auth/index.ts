export { AuthProvider, useAuth } from "./context/auth-context";
export { RequireAuth, RequireRole } from "./components/guards";
export { DEMO_USERS } from "./services/auth.mock";
export type { AuthUser, LoginCredentials, LoginResponse, Role, AuthServiceImpl } from "./types";
export { ROLES, ROLE_CAPABILITIES, STORAGE_KEYS } from "./constants";
export {
  ALL_ROLES,
  MODULE_ACCESS,
  PROJECT_SUBMODULE_ROLES,
  hasModuleAccess,
  parseProjectSubmodule,
  resolveProjectSubmoduleRoles,
} from "./access";