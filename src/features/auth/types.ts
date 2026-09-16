export type Role = "admin" | "project_manager" | "site_staff" | "finance" | "viewer";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  is_active: boolean;
  title?: string;
  phone?: string;
}

export type ProfilePatch = Partial<Pick<AuthUser, "name" | "title" | "phone">>;

/** Matches API.md §2: POST /auth/login/ → { access, refresh, user } */
export interface LoginResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthServiceImpl {
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  refresh: (refreshToken: string) => Promise<{ access: string }>;
  logout: () => Promise<void>;
  me: () => Promise<AuthUser>;
  updateProfile: (patch: ProfilePatch) => Promise<AuthUser>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}