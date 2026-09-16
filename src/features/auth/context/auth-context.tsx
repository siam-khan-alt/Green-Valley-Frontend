"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEYS } from "../constants";
import { authMockService } from "../services/auth.mock";
import type { AuthUser, LoginCredentials, ProfilePatch } from "../types";

/* eslint-disable react-hooks/set-state-in-effect */

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string>;
  updateProfile: (patch: ProfilePatch) => Promise<AuthUser>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUser = readStoredUser();
    const storedAccess = window.localStorage.getItem(STORAGE_KEYS.accessToken);
    const storedRefresh = window.localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (storedUser && storedAccess && storedRefresh) {
      setUser(storedUser);
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((access: string, refresh: string, u: AuthUser) => {
    window.localStorage.setItem(STORAGE_KEYS.accessToken, access);
    window.localStorage.setItem(STORAGE_KEYS.refreshToken, refresh);
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
    setAccessToken(access);
    setRefreshToken(refresh);
    setUser(u);
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEYS.accessToken);
    window.localStorage.removeItem(STORAGE_KEYS.refreshToken);
    window.localStorage.removeItem(STORAGE_KEYS.user);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const response = await authMockService.login(credentials);
      persist(response.access, response.refresh, response.user);
      return response.user;
    },
    [persist],
  );

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) throw new Error("No refresh token available.");
    const { access } = await authMockService.refresh(refreshToken);
    window.localStorage.setItem(STORAGE_KEYS.accessToken, access);
    setAccessToken(access);
    return access;
  }, [refreshToken]);

  const updateProfile = useCallback(async (patch: ProfilePatch) => {
    const updated = await authMockService.updateProfile(patch);
    window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updated));
    setUser(updated);
    return updated;
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await authMockService.changePassword(currentPassword, newPassword);
    },
    [],
  );

  const logout = useCallback(async () => {
    await authMockService.logout();
    clear();
  }, [clear]);

  const value: AuthContextValue = {
    user,
    accessToken,
    isLoading,
    login,
    logout,
    refreshAccessToken,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}