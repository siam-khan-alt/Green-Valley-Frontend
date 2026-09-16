import { STORAGE_KEYS } from "../constants";
import type { AuthServiceImpl, AuthUser, LoginCredentials } from "../types";

/**
 * Mock implementation of API.md §2 — same contract shape as the future
 * Django/DRF endpoints, so swapping this for the real Axios-backed service
 * (Module 4: API Core) is a services-layer-only change.
 *
 * User records (password + profile) are persisted to localStorage so that
 * self-service profile updates and password resets survive reloads.
 */

const MOCK_DELAY = 450;

const MOCK_USERS_KEY = "gv_mock_users";

interface SeedUser extends AuthUser {
  password: string;
}

const DEFAULT_USERS: SeedUser[] = [
  {
    id: "u_admin",
    email: "admin@greenvalley.dev",
    password: "password123",
    name: "Rehana Rahman",
    title: "Administrator",
    role: "admin",
    is_active: true,
  },
  {
    id: "u_pm",
    email: "pm@greenvalley.dev",
    password: "password123",
    name: "Sajid Hasan",
    title: "Project Manager",
    role: "project_manager",
    is_active: true,
  },
  {
    id: "u_site",
    email: "site@greenvalley.dev",
    password: "password123",
    name: "Imran Chowdhury",
    title: "Site Engineer",
    role: "site_staff",
    is_active: true,
  },
  {
    id: "u_finance",
    email: "finance@greenvalley.dev",
    password: "password123",
    name: "Nadia Akter",
    title: "Accounts & Finance",
    role: "finance",
    is_active: true,
  },
  {
    id: "u_viewer",
    email: "viewer@greenvalley.dev",
    password: "password123",
    name: "Tanvir Kabir",
    title: "Stakeholder",
    role: "viewer",
    is_active: true,
  },
];

export const DEMO_USERS = DEFAULT_USERS.map((u) => toPublicUser(u));

function toPublicUser(seed: SeedUser): AuthUser {
  return {
    id: seed.id,
    email: seed.email,
    name: seed.name,
    title: seed.title,
    phone: seed.phone,
    role: seed.role,
    is_active: seed.is_active,
  };
}

function readStore(): SeedUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const raw = window.localStorage.getItem(MOCK_USERS_KEY);
  if (!raw) return DEFAULT_USERS;
  try {
    const parsed = JSON.parse(raw) as SeedUser[];
    return parsed.length ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

function writeStore(users: SeedUser[]) {
  window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function currentUserId(): string {
  const raw = window.localStorage.getItem(STORAGE_KEYS.user);
  const parsed = raw ? (JSON.parse(raw) as AuthUser) : null;
  if (!parsed?.id) throw new Error("No active session.");
  return parsed.id;
}

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY));
}

function makeToken(seed: string) {
  const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ seed, exp: Date.now() + 3600_000 }))));
  return `mock_${seed}_${payload}`;
}

export const authMockService: AuthServiceImpl = {
  async login(credentials: LoginCredentials) {
    const matched = readStore().find((u) => u.email === credentials.email);
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

  async updateProfile(patch) {
    const id = currentUserId();
    const users = readStore();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Account not found.");
    users[index] = { ...users[index], ...patch };
    writeStore(users);
    return wait(toPublicUser(users[index]));
  },

  async changePassword(currentPassword, newPassword) {
    const id = currentUserId();
    const users = readStore();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Account not found.");
    if (users[index].password !== currentPassword) {
      throw new Error("Current password is incorrect.");
    }
    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters.");
    }
    if (newPassword === currentPassword) {
      throw new Error("New password must be different from the current one.");
    }
    users[index].password = newPassword;
    writeStore(users);
    return wait(undefined);
  },
};