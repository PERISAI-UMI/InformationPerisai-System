export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type WorkProgramStatus = "PLANNED" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type OpportunityCategory = "LOMBA" | "BEASISWA" | "SEMINAR" | "MAGANG";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  departmentId?: string;
}

export interface Session {
  user: AuthUser;
  expires: string;
}

export type PermissionAction = "create" | "read" | "update" | "delete" | "publish" | "manage";

export type PermissionResource =
  | "posts"
  | "work_programs"
  | "opportunities"
  | "departments"
  | "members"
  | "periods"
  | "statistics"
  | "gallery"
  | "inbox"
  | "settings"
  | "users"
  | "audit_log";

export interface ActionResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
