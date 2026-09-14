import { STORAGE_KEYS } from "../constants";
import type { AuthServiceImpl, AuthUser, LoginCredentials } from "../types";

/**
 * Mock implementation of API.md §2 — same contract shape as the future
 * Django/DRF endpoints, so swapping this for the real Axios-backed service
 * (Module 4: API Core) is a services-layer-only change.
 */

const MOCK_DELAY = 450;

interface SeedUser extends AuthUser {
  password: string;
}

const SEED_USERS: SeedUser[] = [
  {
    id: "u_admin",
    email: "admin@greenvalley.dev",
    password: "password123",
    name: "Rehana Rahman",
    role: "admin",
    is_active: true,
  },
  {
    id: "u_pm",
    email: "pm@greenvalley.dev",
    password: "password123",
    name: "Sajid Hasan",
    role: "project_manager",
    is_active: true,
  },
  {
    id: "u_site",
    email: "site@greenvalley.dev",
    password: "password123",
    name: "Imran Chowdhury",
    role: "site_staff",
    is_active: true,
  },
  {
    id: "u_finance",
    email: "finance@greenvalley.dev",
    password: "password123",
    name: "Nadia Akter",
    role: "finance",
    is_active: true,
  },
  {
    id: "u_viewer",
    email: "viewer@greenvalley.dev",
    password: "password123",
    name: "Tanvir Kabir",
    role: "viewer",
    is_active: true,
  },
];

export const DEMO_USERS = SEED_USERS.map((u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  is_active: u.is_active,
}));

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY));
}

function makeToken(seed: string) {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ seed, exp: Date.now() + 3600_000 }))));
  return `mock_${seed}_${payload}`;
}

function toPublicUser(seed: SeedUser): AuthUser {
  return {
    id: seed.id,
    email: seed.email,
    name: seed.name,
    role: seed.role,
    is_active: seed.is_active,
  };
}

export const authMockService: AuthServiceImpl = {
  async login(credentials: LoginCredentials) {
    const matched = SEED_USERS.find((u) => u.email === credentials.email);
    if (!matched || matched.password !== credentials.password || !matched.is_active) {
      throw new Error("Invalid email or password.");
    }
    const user = toPublicUser(matched);
    const access = makeToken(matched.email);
    const refresh = makeToken(`${matched.email}-refresh`);
    return wait({ access, refresh, user });
  },

  async refresh(refreshToken: string) {
    if (!refreshToken.startsWith("mock_")) {
      throw new Error("Refresh token expired. Log in again.");
    }
    return wait({ access: makeToken(`fresh-${Date.now()}`) });
  },

  async logout() {
    return wait(undefined);
  },

  async me() {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    if (!user) throw new Error("No active session.");
    return wait(JSON.parse(user) as AuthUser);
  },
};