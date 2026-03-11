// ============= Permission Revocation Service =============
import { mockApiCall } from "./api";
import type { ApiResponse, SearchParams } from "@/types";
import type { AppRole } from "@/config/roles";
import { ROLE_HIERARCHY } from "@/config/roles";

export interface UserPermission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: AppRole;
  entityType: "institute" | "consultancy" | "company";
  entityId: string;
  entityName: string;
  permissions: string[];
  revokedPermissions: string[];
  revokedBy?: string;
  revokedByName?: string;
  revokedAt?: string;
  status: "active" | "partially_revoked" | "fully_revoked";
}

export interface PermissionRevocation {
  id: string;
  userId: string;
  userName: string;
  permission: string;
  revokedBy: string;
  revokedByName: string;
  revokedByRole: AppRole;
  entityType: "institute" | "consultancy" | "company";
  entityId: string;
  entityName: string;
  reason?: string;
  revokedAt: string;
}

export interface EntitySummary {
  id: string;
  name: string;
  type: "institute" | "consultancy" | "company";
  userCount: number;
  revokedCount: number;
}

const mockUserPermissions: UserPermission[] = [
  // Institute 1 - TechVerse Academy
  { id: "UP001", userId: "U004", userName: "Sarah Wilson", userEmail: "sarah@techverse.com", userRole: "instructor", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", permissions: ["dashboard", "tests", "progress", "library", "lectures", "courses", "attendance", "announcements"], revokedPermissions: [], status: "active" },
  { id: "UP002", userId: "U005", userName: "Alice Johnson", userEmail: "alice@email.com", userRole: "student", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", permissions: ["dashboard", "library", "lectures", "courses", "tests", "progress", "fees", "announcements"], revokedPermissions: [], status: "active" },
  { id: "UP003", userId: "U010", userName: "Bob Smith", userEmail: "bob@email.com", userRole: "student", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", permissions: ["dashboard", "library", "lectures", "courses", "tests", "progress", "fees", "announcements"], revokedPermissions: [], status: "active" },
  { id: "UP004", userId: "U011", userName: "Carol Davis", userEmail: "carol@email.com", userRole: "student", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", permissions: ["dashboard", "library", "lectures", "courses", "tests", "progress", "fees", "announcements"], revokedPermissions: ["library", "tests"], revokedBy: "U002", revokedByName: "Jane Smith", revokedAt: "2026-02-15", status: "partially_revoked" },
  // Institute 2 - CodeCraft Institute
  { id: "UP005", userId: "U012", userName: "David Lee", userEmail: "david@email.com", userRole: "student", entityType: "institute", entityId: "2", entityName: "CodeCraft Institute", permissions: ["dashboard", "library", "courses", "tests"], revokedPermissions: [], status: "active" },
  { id: "UP010", userId: "U017", userName: "Karen White", userEmail: "karen@codecraft.edu", userRole: "instructor", entityType: "institute", entityId: "2", entityName: "CodeCraft Institute", permissions: ["dashboard", "tests", "library", "lectures", "courses"], revokedPermissions: [], status: "active" },
  // Institute 3 - DigitalMinds School
  { id: "UP011", userId: "U018", userName: "Tom Harris", userEmail: "tom@digitalminds.org", userRole: "instructor", entityType: "institute", entityId: "3", entityName: "DigitalMinds School", permissions: ["dashboard", "lectures", "courses", "attendance"], revokedPermissions: [], status: "active" },
  { id: "UP012", userId: "U019", userName: "Lisa Chen", userEmail: "lisa@email.com", userRole: "student", entityType: "institute", entityId: "3", entityName: "DigitalMinds School", permissions: ["dashboard", "lectures", "courses"], revokedPermissions: ["courses"], revokedBy: "U018", revokedByName: "Tom Harris", revokedAt: "2026-03-02", status: "partially_revoked" },
  // Consultancy users
  { id: "UP006", userId: "U013", userName: "Dr. Anita Sharma", userEmail: "anita@globalconsult.com", userRole: "instructor", entityType: "consultancy", entityId: "CON1", entityName: "Global Consultancy", permissions: ["dashboard", "visa_tracking", "university_applications", "students", "announcements"], revokedPermissions: [], status: "active" },
  { id: "UP007", userId: "U014", userName: "James Wilson", userEmail: "james@globalconsult.com", userRole: "instructor", entityType: "consultancy", entityId: "CON1", entityName: "Global Consultancy", permissions: ["dashboard", "visa_tracking", "students"], revokedPermissions: [], status: "active" },
  { id: "UP013", userId: "U020", userName: "Priya Patel", userEmail: "priya@studyabroad.com", userRole: "instructor", entityType: "consultancy", entityId: "CON2", entityName: "StudyAbroad Pro", permissions: ["dashboard", "visa_tracking", "university_applications"], revokedPermissions: [], status: "active" },
  // Company users
  { id: "UP008", userId: "U015", userName: "Emily Davis", userEmail: "emily@techcorp.com", userRole: "company", entityType: "company", entityId: "C001", entityName: "TechCorp", permissions: ["dashboard", "company_vacancies", "placements"], revokedPermissions: [], status: "active" },
  { id: "UP009", userId: "U016", userName: "Robert Lee", userEmail: "robert@techcorp.com", userRole: "company", entityType: "company", entityId: "C001", entityName: "TechCorp", permissions: ["dashboard", "company_vacancies", "placements"], revokedPermissions: ["placements"], revokedBy: "U006", revokedByName: "TechCorp HR", revokedAt: "2026-03-01", status: "partially_revoked" },
  { id: "UP014", userId: "U021", userName: "Mike Johnson", userEmail: "mike@google.com", userRole: "company", entityType: "company", entityId: "C002", entityName: "Google", permissions: ["dashboard", "company_vacancies", "placements"], revokedPermissions: [], status: "active" },
];

const mockRevocations: PermissionRevocation[] = [
  { id: "REV001", userId: "U011", userName: "Carol Davis", permission: "library", revokedBy: "U002", revokedByName: "Jane Smith", revokedByRole: "institute_owner", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", reason: "Library access suspended due to overdue books", revokedAt: "2026-02-15" },
  { id: "REV002", userId: "U011", userName: "Carol Davis", permission: "tests", revokedBy: "U002", revokedByName: "Jane Smith", revokedByRole: "institute_owner", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", reason: "Test access suspended pending fee clearance", revokedAt: "2026-02-15" },
  { id: "REV003", userId: "U016", userName: "Robert Lee", permission: "placements", revokedBy: "U006", revokedByName: "TechCorp HR", revokedByRole: "company", entityType: "company", entityId: "C001", entityName: "TechCorp", reason: "Role change - no longer handling placements", revokedAt: "2026-03-01" },
  { id: "REV004", userId: "U019", userName: "Lisa Chen", permission: "courses", revokedBy: "U018", revokedByName: "Tom Harris", revokedByRole: "instructor", entityType: "institute", entityId: "3", entityName: "DigitalMinds School", reason: "Course access paused", revokedAt: "2026-03-02" },
];

// Get entity summaries for drill-down
export async function fetchEntitySummaries(
  entityType: "institute" | "consultancy" | "company",
  viewerRole: AppRole,
  viewerEntityId?: string
): Promise<ApiResponse<EntitySummary[]>> {
  let filtered = mockUserPermissions.filter((p) => p.entityType === entityType);
  
  // Non-platform owners only see their own entity
  if (viewerRole !== "platform_owner" && viewerEntityId) {
    filtered = filtered.filter((p) => p.entityId === viewerEntityId);
  }

  const entityMap: Record<string, EntitySummary> = {};
  for (const p of filtered) {
    if (!entityMap[p.entityId]) {
      entityMap[p.entityId] = {
        id: p.entityId,
        name: p.entityName,
        type: p.entityType,
        userCount: 0,
        revokedCount: 0,
      };
    }
    entityMap[p.entityId].userCount++;
    if (p.status !== "active") entityMap[p.entityId].revokedCount++;
  }

  return mockApiCall({ data: Object.values(entityMap), total: Object.keys(entityMap).length });
}

export async function fetchUserPermissions(params?: SearchParams & { entityType?: string; entityId?: string; viewerRole?: AppRole; viewerEntityId?: string }): Promise<ApiResponse<UserPermission[]>> {
  let filtered = [...mockUserPermissions];
  if (params?.entityType) filtered = filtered.filter((p) => p.entityType === params.entityType);
  if (params?.entityId) filtered = filtered.filter((p) => p.entityId === params.entityId);
  
  // Role-based scoping: non-platform owners only see their own entity
  if (params?.viewerRole && params.viewerRole !== "platform_owner" && params.viewerEntityId) {
    filtered = filtered.filter((p) => p.entityId === params.viewerEntityId);
  }

  // Higher roles can only see lower roles
  if (params?.viewerRole) {
    const viewerLevel = ROLE_HIERARCHY[params.viewerRole] ?? 5;
    filtered = filtered.filter((p) => ROLE_HIERARCHY[p.userRole] > viewerLevel);
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.userName.toLowerCase().includes(q) || p.userEmail.toLowerCase().includes(q) || p.entityName.toLowerCase().includes(q));
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((p) => p.status === params.status);
  
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function fetchRevocationHistory(params?: SearchParams & { entityId?: string; entityType?: string }): Promise<ApiResponse<PermissionRevocation[]>> {
  let filtered = [...mockRevocations];
  if (params?.entityId) filtered = filtered.filter((r) => r.entityId === params.entityId);
  if (params?.entityType) filtered = filtered.filter((r) => r.entityType === params.entityType);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((r) => r.userName.toLowerCase().includes(q) || r.permission.toLowerCase().includes(q));
  }
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function revokePermission(
  userId: string,
  permission: string,
  revokedBy: string,
  revokedByName: string,
  revokedByRole: AppRole,
  entityType: "institute" | "consultancy" | "company",
  entityId: string,
  entityName: string,
  reason?: string
): Promise<ApiResponse<PermissionRevocation>> {
  const userPerm = mockUserPermissions.find((p) => p.userId === userId && p.entityId === entityId);
  if (userPerm) {
    if (!userPerm.revokedPermissions.includes(permission)) {
      userPerm.revokedPermissions.push(permission);
    }
    userPerm.revokedBy = revokedBy;
    userPerm.revokedByName = revokedByName;
    userPerm.revokedAt = new Date().toISOString().split("T")[0];
    userPerm.status = userPerm.revokedPermissions.length >= userPerm.permissions.length ? "fully_revoked" : "partially_revoked";
  }
  const revocation: PermissionRevocation = {
    id: `REV${Date.now()}`,
    userId,
    userName: userPerm?.userName ?? "",
    permission,
    revokedBy,
    revokedByName,
    revokedByRole,
    entityType,
    entityId,
    entityName,
    reason,
    revokedAt: new Date().toISOString().split("T")[0],
  };
  mockRevocations.push(revocation);
  return mockApiCall({ data: revocation, message: "Permission revoked successfully" });
}

export async function restorePermission(userId: string, permission: string, entityId: string): Promise<ApiResponse<null>> {
  const userPerm = mockUserPermissions.find((p) => p.userId === userId && p.entityId === entityId);
  if (userPerm) {
    userPerm.revokedPermissions = userPerm.revokedPermissions.filter((p) => p !== permission);
    userPerm.status = userPerm.revokedPermissions.length === 0 ? "active" : "partially_revoked";
  }
  return mockApiCall({ data: null, message: "Permission restored successfully" });
}

export async function revokeAllPermissions(
  userId: string,
  revokedBy: string,
  revokedByName: string,
  revokedByRole: AppRole,
  entityType: "institute" | "consultancy" | "company",
  entityId: string,
  entityName: string,
  reason?: string
): Promise<ApiResponse<null>> {
  const userPerm = mockUserPermissions.find((p) => p.userId === userId && p.entityId === entityId);
  if (userPerm) {
    userPerm.revokedPermissions = [...userPerm.permissions];
    userPerm.revokedBy = revokedBy;
    userPerm.revokedByName = revokedByName;
    userPerm.revokedAt = new Date().toISOString().split("T")[0];
    userPerm.status = "fully_revoked";
    for (const perm of userPerm.permissions) {
      mockRevocations.push({
        id: `REV${Date.now()}_${perm}`,
        userId,
        userName: userPerm.userName,
        permission: perm,
        revokedBy,
        revokedByName,
        revokedByRole,
        entityType,
        entityId,
        entityName,
        reason,
        revokedAt: new Date().toISOString().split("T")[0],
      });
    }
  }
  return mockApiCall({ data: null, message: "All permissions revoked" });
}

export async function grantPermission(
  userId: string,
  permission: string,
  entityId: string,
): Promise<ApiResponse<null>> {
  const userPerm = mockUserPermissions.find((p) => p.userId === userId && p.entityId === entityId);
  if (userPerm && !userPerm.permissions.includes(permission)) {
    userPerm.permissions.push(permission);
  }
  return mockApiCall({ data: null, message: "Permission granted successfully" });
}
