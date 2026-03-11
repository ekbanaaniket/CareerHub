// ============= Multi-Tenant Service Layer =============
// Handles: registrations, entity-scoped roles, assignments, featured entities, applications
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

// ============= Types =============

export type EntityType = "institute" | "consultancy" | "company";

export interface EntityRegistration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  roleId: string;
  roleName: string;
  assignedContext?: string; // e.g., course name, vacancy title
  assignedContextId?: string;
  status: "active" | "inactive" | "pending" | "suspended";
  registeredAt: string;
  registeredBy: string;
}

export interface EntityRole {
  id: string;
  entityType: EntityType;
  entityId: string;
  name: string;
  description: string;
  permissions: string[];
  isDefault: boolean;
  createdBy: string;
  createdByName: string;
  userCount: number;
  createdAt: string;
}

export interface RoleAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleId: string;
  roleName: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  contextType?: "course" | "vacancy" | "service" | "department";
  contextId?: string;
  contextName?: string;
  assignedBy: string;
  assignedByName: string;
  assignedAt: string;
  status: "active" | "inactive";
}

export interface FeaturedEntity {
  id: string;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  featuredBy: string; // platform_owner user id
  featuredAt: string;
  priority: number; // lower = shown first
  expiresAt?: string;
  isActive: boolean;
}

export interface CompanyApplication {
  id: string;
  companyId: string;
  companyName: string;
  vacancyId: string;
  vacancyTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  appliedAt: string;
  status: "applied" | "shortlisted" | "interviewing" | "selected" | "rejected";
  resumeUrl?: string;
  notes?: string;
}

// ============= Consultancy Permission Definitions =============
export const CONSULTANCY_PERMISSIONS = [
  "dashboard", "visa_tracking", "university_applications", "language_courses",
  "counselor_management", "students", "announcements", "notifications",
  "roles", "settings", "reports", "billing"
] as const;

export const INSTITUTE_PERMISSIONS = [
  "dashboard", "students", "tests", "progress", "library", "lectures",
  "courses", "placements", "fees", "attendance", "announcements",
  "notifications", "roles", "settings", "billing", "enrollment"
] as const;

export const COMPANY_PERMISSIONS = [
  "dashboard", "vacancies", "applications", "candidates",
  "notifications", "roles", "settings", "billing"
] as const;

// ============= Mock Data =============

const mockRegistrations: EntityRegistration[] = [
  // Student registered with institute
  { id: "REG001", userId: "U005", userName: "Alice Johnson", userEmail: "alice@email.com", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", roleId: "IR_STUDENT", roleName: "Student", assignedContext: "Full-Stack Development", assignedContextId: "CRS001", status: "active", registeredAt: "2025-09-01", registeredBy: "U002" },
  // Same student registered with consultancy
  { id: "REG002", userId: "U005", userName: "Alice Johnson", userEmail: "alice@email.com", entityType: "consultancy", entityId: "CON1", entityName: "Global Consultancy", roleId: "CR_CLIENT", roleName: "Client", status: "active", registeredAt: "2025-10-15", registeredBy: "U008" },
  // Same student applied to a company
  { id: "REG003", userId: "U005", userName: "Alice Johnson", userEmail: "alice@email.com", entityType: "company", entityId: "C001", entityName: "TechCorp", roleId: "COMP_APPLICANT", roleName: "Applicant", assignedContext: "Frontend Engineer", assignedContextId: "V001", status: "active", registeredAt: "2026-02-22", registeredBy: "U005" },
  // Instructor assigned to institute
  { id: "REG004", userId: "U004", userName: "Sarah Wilson", userEmail: "sarah@techverse.com", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", roleId: "IR_INSTRUCTOR", roleName: "Instructor", assignedContext: "Full-Stack Development", assignedContextId: "CRS001", status: "active", registeredAt: "2025-06-01", registeredBy: "U002" },
  // Another student with only institute
  { id: "REG005", userId: "U010", userName: "Bob Smith", userEmail: "bob@email.com", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", roleId: "IR_STUDENT", roleName: "Student", assignedContext: "Frontend Bootcamp", assignedContextId: "CRS002", status: "active", registeredAt: "2025-09-15", registeredBy: "U002" },
  // Student registered with a second institute
  { id: "REG006", userId: "U005", userName: "Alice Johnson", userEmail: "alice@email.com", entityType: "institute", entityId: "2", entityName: "CodeCraft Institute", roleId: "IR_STUDENT", roleName: "Student", assignedContext: "Web Development", assignedContextId: "CRS010", status: "active", registeredAt: "2026-01-10", registeredBy: "U002" },
  // Counselor in consultancy
  { id: "REG007", userId: "U011", userName: "Dr. Anita Sharma", userEmail: "anita@globalconsult.com", entityType: "consultancy", entityId: "CON1", entityName: "Global Consultancy", roleId: "CR_COUNSELOR", roleName: "Counselor", assignedContext: "UK & USA", status: "active", registeredAt: "2024-01-15", registeredBy: "U008" },
  // Visa officer in consultancy
  { id: "REG008", userId: "U012", userName: "James Wilson", userEmail: "james@globalconsult.com", entityType: "consultancy", entityId: "CON1", entityName: "Global Consultancy", roleId: "CR_VISA_OFFICER", roleName: "Visa Officer", assignedContext: "Australia & Germany", status: "active", registeredAt: "2024-03-10", registeredBy: "U008" },
  // HR Manager in company
  { id: "REG009", userId: "U006", userName: "TechCorp HR", userEmail: "hr@techcorp.com", entityType: "company", entityId: "C001", entityName: "TechCorp", roleId: "COMP_HR", roleName: "HR Manager", status: "active", registeredAt: "2025-01-01", registeredBy: "U001" },
  // Recruiter in company
  { id: "REG010", userId: "U013", userName: "Lisa Chen", userEmail: "lisa@techcorp.com", entityType: "company", entityId: "C001", entityName: "TechCorp", roleId: "COMP_RECRUITER", roleName: "Recruiter", assignedContext: "Frontend Engineer", assignedContextId: "V001", status: "active", registeredAt: "2025-06-01", registeredBy: "U006" },
];

// ============= Entity-Scoped Roles =============
const mockEntityRoles: EntityRole[] = [
  // Institute roles
  { id: "IR_OWNER", entityType: "institute", entityId: "*", name: "Institute Owner", description: "Full access to own institute — can create roles, assign users", permissions: [...INSTITUTE_PERMISSIONS], isDefault: true, createdBy: "system", createdByName: "System", userCount: 1, createdAt: "2024-01-01" },
  { id: "IR_MANAGER", entityType: "institute", entityId: "*", name: "Manager", description: "Manage instructors and students — cannot manage roles or billing", permissions: ["dashboard", "students", "tests", "progress", "library", "lectures", "courses", "placements", "fees", "attendance", "announcements", "notifications", "enrollment"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 3, createdAt: "2024-01-01" },
  { id: "IR_INSTRUCTOR", entityType: "institute", entityId: "*", name: "Instructor", description: "Create and manage course content, tests, and track students", permissions: ["dashboard", "tests", "progress", "library", "lectures", "courses", "attendance", "announcements", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 12, createdAt: "2024-01-01" },
  { id: "IR_STUDENT", entityType: "institute", entityId: "*", name: "Student", description: "Access assigned courses, take tests, view library", permissions: ["dashboard", "library", "lectures", "courses", "tests", "progress", "fees", "attendance", "announcements", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 1284, createdAt: "2024-01-01" },
  // Custom institute role example
  { id: "IR_CUSTOM_1", entityType: "institute", entityId: "1", name: "Lab Assistant", description: "Manage library and attendance only", permissions: ["dashboard", "library", "attendance", "notifications"], isDefault: false, createdBy: "U002", createdByName: "Jane Smith", userCount: 2, createdAt: "2025-06-15" },

  // Consultancy roles
  { id: "CR_OWNER", entityType: "consultancy", entityId: "*", name: "Consultancy Owner", description: "Full access to consultancy — manage counselors, visa tracking, university apps", permissions: [...CONSULTANCY_PERMISSIONS], isDefault: true, createdBy: "system", createdByName: "System", userCount: 1, createdAt: "2024-01-01" },
  { id: "CR_MANAGER", entityType: "consultancy", entityId: "*", name: "Operations Manager", description: "Manage day-to-day consultancy operations", permissions: ["dashboard", "visa_tracking", "university_applications", "language_courses", "counselor_management", "students", "announcements", "notifications", "reports"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 2, createdAt: "2024-01-01" },
  { id: "CR_COUNSELOR", entityType: "consultancy", entityId: "*", name: "Counselor", description: "Guide students on university selection, applications, and visa", permissions: ["dashboard", "visa_tracking", "university_applications", "students", "announcements", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 8, createdAt: "2024-01-01" },
  { id: "CR_VISA_OFFICER", entityType: "consultancy", entityId: "*", name: "Visa Officer", description: "Handle visa processing and document verification", permissions: ["dashboard", "visa_tracking", "students", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 4, createdAt: "2024-01-01" },
  { id: "CR_LANG_INSTRUCTOR", entityType: "consultancy", entityId: "*", name: "Language Instructor", description: "Teach language courses (IELTS, TOEFL, etc.)", permissions: ["dashboard", "language_courses", "students", "announcements", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 6, createdAt: "2024-01-01" },
  { id: "CR_CLIENT", entityType: "consultancy", entityId: "*", name: "Client", description: "Student registered with consultancy for services", permissions: ["dashboard", "visa_tracking", "university_applications", "language_courses", "announcements", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 245, createdAt: "2024-01-01" },

  // Company roles
  { id: "COMP_OWNER", entityType: "company", entityId: "*", name: "Company Owner", description: "Full company access — manage vacancies, HR, and recruitment", permissions: [...COMPANY_PERMISSIONS], isDefault: true, createdBy: "system", createdByName: "System", userCount: 1, createdAt: "2024-01-01" },
  { id: "COMP_HR", entityType: "company", entityId: "*", name: "HR Manager", description: "Manage vacancies, review applications, schedule interviews", permissions: ["dashboard", "vacancies", "applications", "candidates", "notifications", "settings"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 3, createdAt: "2024-01-01" },
  { id: "COMP_RECRUITER", entityType: "company", entityId: "*", name: "Recruiter", description: "View and shortlist candidates for assigned vacancies", permissions: ["dashboard", "applications", "candidates", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 5, createdAt: "2024-01-01" },
  { id: "COMP_INTERVIEWER", entityType: "company", entityId: "*", name: "Interviewer", description: "Conduct interviews and provide feedback", permissions: ["dashboard", "candidates", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 8, createdAt: "2024-01-01" },
  { id: "COMP_APPLICANT", entityType: "company", entityId: "*", name: "Applicant", description: "Applied for a vacancy — can track application status", permissions: ["dashboard", "notifications"], isDefault: true, createdBy: "system", createdByName: "System", userCount: 150, createdAt: "2024-01-01" },
];

// ============= Role Assignments (context-specific) =============
const mockAssignments: RoleAssignment[] = [
  { id: "RA001", userId: "U004", userName: "Sarah Wilson", userEmail: "sarah@techverse.com", roleId: "IR_INSTRUCTOR", roleName: "Instructor", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", contextType: "course", contextId: "CRS001", contextName: "Full-Stack Development", assignedBy: "U002", assignedByName: "Jane Smith", assignedAt: "2025-06-01", status: "active" },
  { id: "RA002", userId: "U004", userName: "Sarah Wilson", userEmail: "sarah@techverse.com", roleId: "IR_INSTRUCTOR", roleName: "Instructor", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", contextType: "course", contextId: "CRS002", contextName: "Frontend Bootcamp", assignedBy: "U002", assignedByName: "Jane Smith", assignedAt: "2025-06-01", status: "active" },
  { id: "RA003", userId: "U005", userName: "Alice Johnson", userEmail: "alice@email.com", roleId: "IR_STUDENT", roleName: "Student", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", contextType: "course", contextId: "CRS001", contextName: "Full-Stack Development", assignedBy: "U002", assignedByName: "Jane Smith", assignedAt: "2025-09-01", status: "active" },
  { id: "RA004", userId: "U011", userName: "Dr. Anita Sharma", userEmail: "anita@globalconsult.com", roleId: "CR_COUNSELOR", roleName: "Counselor", entityType: "consultancy", entityId: "CON1", entityName: "Global Consultancy", contextType: "service", contextId: "SVC001", contextName: "UK & USA Admissions", assignedBy: "U008", assignedByName: "Ravi Kumar", assignedAt: "2024-01-15", status: "active" },
  { id: "RA005", userId: "U013", userName: "Lisa Chen", userEmail: "lisa@techcorp.com", roleId: "COMP_RECRUITER", roleName: "Recruiter", entityType: "company", entityId: "C001", entityName: "TechCorp", contextType: "vacancy", contextId: "V001", contextName: "Frontend Engineer", assignedBy: "U006", assignedByName: "TechCorp HR", assignedAt: "2025-06-01", status: "active" },
];

// ============= Featured Entities =============
const mockFeaturedEntities: FeaturedEntity[] = [
  { id: "FE001", entityType: "institute", entityId: "1", entityName: "TechVerse Academy", featuredBy: "U001", featuredAt: "2026-01-01", priority: 1, isActive: true },
  { id: "FE002", entityType: "institute", entityId: "4", entityName: "ByteForge Labs", featuredBy: "U001", featuredAt: "2026-02-01", priority: 2, isActive: true },
  { id: "FE003", entityType: "consultancy", entityId: "CON1", entityName: "Global Consultancy", featuredBy: "U001", featuredAt: "2026-01-15", priority: 1, isActive: true },
  { id: "FE004", entityType: "consultancy", entityId: "CON2", entityName: "StudyAbroad Pro", featuredBy: "U001", featuredAt: "2026-02-15", priority: 2, isActive: true },
  { id: "FE005", entityType: "company", entityId: "C001", entityName: "Google", featuredBy: "U001", featuredAt: "2026-01-01", priority: 1, isActive: true, expiresAt: "2026-12-31" },
];

// ============= Company Applications =============
const mockCompanyApplications: CompanyApplication[] = [
  { id: "CA001", companyId: "C001", companyName: "TechCorp", vacancyId: "V001", vacancyTitle: "Frontend Engineer", applicantId: "U005", applicantName: "Alice Johnson", applicantEmail: "alice@email.com", appliedAt: "2026-02-22", status: "shortlisted" },
  { id: "CA002", companyId: "C001", companyName: "TechCorp", vacancyId: "V001", vacancyTitle: "Frontend Engineer", applicantId: "U010", applicantName: "Bob Smith", applicantEmail: "bob@email.com", appliedAt: "2026-02-23", status: "applied" },
  { id: "CA003", companyId: "C001", companyName: "TechCorp", vacancyId: "V002", vacancyTitle: "Full-Stack Developer", applicantId: "U005", applicantName: "Alice Johnson", applicantEmail: "alice@email.com", appliedAt: "2026-02-25", status: "interviewing" },
  { id: "CA004", companyId: "C001", companyName: "TechCorp", vacancyId: "V001", vacancyTitle: "Frontend Engineer", applicantId: "U014", applicantName: "David Lee", applicantEmail: "david@email.com", appliedAt: "2026-02-24", status: "interviewing" },
  { id: "CA005", companyId: "C001", companyName: "TechCorp", vacancyId: "V003", vacancyTitle: "Backend Engineer Intern", applicantId: "U015", applicantName: "Eva Martinez", applicantEmail: "eva@email.com", appliedAt: "2026-02-16", status: "selected" },
];

// ============= Registration CRUD =============

export async function fetchUserRegistrations(userId: string): Promise<ApiResponse<EntityRegistration[]>> {
  const filtered = mockRegistrations.filter((r) => r.userId === userId);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchEntityRegistrations(entityType: EntityType, entityId: string): Promise<ApiResponse<EntityRegistration[]>> {
  const filtered = mockRegistrations.filter((r) => r.entityType === entityType && r.entityId === entityId);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createRegistration(reg: Omit<EntityRegistration, "id">): Promise<ApiResponse<EntityRegistration>> {
  // Check for duplicate
  const exists = mockRegistrations.find(
    (r) => r.userId === reg.userId && r.entityType === reg.entityType && r.entityId === reg.entityId && r.roleId === reg.roleId
  );
  if (exists) throw new Error("User already registered with this role at this entity");
  
  const newReg: EntityRegistration = { ...reg, id: `REG${String(mockRegistrations.length + 1).padStart(3, "0")}` };
  mockRegistrations.push(newReg);
  return mockApiCall({ data: newReg, message: "Registration created successfully" });
}

export async function updateRegistration(id: string, data: Partial<EntityRegistration>): Promise<ApiResponse<EntityRegistration>> {
  const idx = mockRegistrations.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Registration not found");
  mockRegistrations[idx] = { ...mockRegistrations[idx], ...data };
  return mockApiCall({ data: mockRegistrations[idx], message: "Registration updated" });
}

export async function deleteRegistration(id: string): Promise<ApiResponse<null>> {
  const idx = mockRegistrations.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Registration not found");
  mockRegistrations.splice(idx, 1);
  return mockApiCall({ data: null, message: "Registration removed" });
}

// ============= Entity Roles CRUD =============

export async function fetchEntityRoles(entityType: EntityType, entityId?: string): Promise<ApiResponse<EntityRole[]>> {
  const filtered = mockEntityRoles.filter((r) => {
    if (r.entityType !== entityType) return false;
    if (entityId && r.entityId !== "*" && r.entityId !== entityId) return false;
    return true;
  });
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchEntityRoleById(roleId: string): Promise<ApiResponse<EntityRole>> {
  const role = mockEntityRoles.find((r) => r.id === roleId);
  if (!role) throw new Error("Role not found");
  return mockApiCall({ data: role });
}

export async function createEntityRole(role: Omit<EntityRole, "id" | "userCount" | "createdAt">): Promise<ApiResponse<EntityRole>> {
  // Validate: only owners can create roles (checked at caller level)
  const exists = mockEntityRoles.find(
    (r) => r.entityType === role.entityType && (r.entityId === role.entityId || r.entityId === "*") && r.name.toLowerCase() === role.name.toLowerCase()
  );
  if (exists) throw new Error("A role with this name already exists for this entity");

  const newRole: EntityRole = {
    ...role,
    id: `${role.entityType.charAt(0).toUpperCase()}R_CUSTOM_${Date.now()}`,
    userCount: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  mockEntityRoles.push(newRole);
  return mockApiCall({ data: newRole, message: "Role created successfully" });
}

export async function updateEntityRole(roleId: string, data: Partial<EntityRole>): Promise<ApiResponse<EntityRole>> {
  const idx = mockEntityRoles.findIndex((r) => r.id === roleId);
  if (idx === -1) throw new Error("Role not found");
  if (mockEntityRoles[idx].isDefault) throw new Error("Cannot modify default system roles");
  mockEntityRoles[idx] = { ...mockEntityRoles[idx], ...data };
  return mockApiCall({ data: mockEntityRoles[idx], message: "Role updated" });
}

export async function deleteEntityRole(roleId: string): Promise<ApiResponse<null>> {
  const idx = mockEntityRoles.findIndex((r) => r.id === roleId);
  if (idx === -1) throw new Error("Role not found");
  if (mockEntityRoles[idx].isDefault) throw new Error("Cannot delete default system roles");
  if (mockEntityRoles[idx].userCount > 0) throw new Error("Cannot delete role with active users — reassign them first");
  mockEntityRoles.splice(idx, 1);
  return mockApiCall({ data: null, message: "Role deleted" });
}

// ============= Role Assignments CRUD =============

export async function fetchRoleAssignments(params?: {
  entityType?: EntityType;
  entityId?: string;
  userId?: string;
  roleId?: string;
}): Promise<ApiResponse<RoleAssignment[]>> {
  let filtered = [...mockAssignments];
  if (params?.entityType) filtered = filtered.filter((a) => a.entityType === params.entityType);
  if (params?.entityId) filtered = filtered.filter((a) => a.entityId === params.entityId);
  if (params?.userId) filtered = filtered.filter((a) => a.userId === params.userId);
  if (params?.roleId) filtered = filtered.filter((a) => a.roleId === params.roleId);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createRoleAssignment(assignment: Omit<RoleAssignment, "id" | "assignedAt">): Promise<ApiResponse<RoleAssignment>> {
  // Check for duplicate context assignment
  const exists = mockAssignments.find(
    (a) => a.userId === assignment.userId && a.roleId === assignment.roleId &&
           a.entityId === assignment.entityId && a.contextId === assignment.contextId
  );
  if (exists) throw new Error("This user is already assigned this role in this context");

  const newAssignment: RoleAssignment = {
    ...assignment,
    id: `RA${String(mockAssignments.length + 1).padStart(3, "0")}`,
    assignedAt: new Date().toISOString().split("T")[0],
  };
  mockAssignments.push(newAssignment);
  return mockApiCall({ data: newAssignment, message: "Role assigned successfully" });
}

export async function updateRoleAssignment(id: string, data: Partial<RoleAssignment>): Promise<ApiResponse<RoleAssignment>> {
  const idx = mockAssignments.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Assignment not found");
  mockAssignments[idx] = { ...mockAssignments[idx], ...data };
  return mockApiCall({ data: mockAssignments[idx], message: "Assignment updated" });
}

export async function deleteRoleAssignment(id: string): Promise<ApiResponse<null>> {
  const idx = mockAssignments.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Assignment not found");
  mockAssignments.splice(idx, 1);
  return mockApiCall({ data: null, message: "Assignment removed" });
}

// ============= Featured Entities CRUD =============

export async function fetchFeaturedEntities(entityType?: EntityType): Promise<ApiResponse<FeaturedEntity[]>> {
  let filtered = mockFeaturedEntities.filter((f) => f.isActive);
  if (entityType) filtered = filtered.filter((f) => f.entityType === entityType);
  // Check expiry
  const now = new Date().toISOString().split("T")[0];
  filtered = filtered.filter((f) => !f.expiresAt || f.expiresAt >= now);
  filtered.sort((a, b) => a.priority - b.priority);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createFeaturedEntity(feat: Omit<FeaturedEntity, "id" | "featuredAt">): Promise<ApiResponse<FeaturedEntity>> {
  const exists = mockFeaturedEntities.find(
    (f) => f.entityType === feat.entityType && f.entityId === feat.entityId && f.isActive
  );
  if (exists) throw new Error("This entity is already featured");

  const newFeat: FeaturedEntity = {
    ...feat,
    id: `FE${String(mockFeaturedEntities.length + 1).padStart(3, "0")}`,
    featuredAt: new Date().toISOString().split("T")[0],
  };
  mockFeaturedEntities.push(newFeat);
  return mockApiCall({ data: newFeat, message: "Entity featured successfully" });
}

export async function updateFeaturedEntity(id: string, data: Partial<FeaturedEntity>): Promise<ApiResponse<FeaturedEntity>> {
  const idx = mockFeaturedEntities.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Featured entity not found");
  mockFeaturedEntities[idx] = { ...mockFeaturedEntities[idx], ...data };
  return mockApiCall({ data: mockFeaturedEntities[idx], message: "Featured entity updated" });
}

export async function removeFeaturedEntity(id: string): Promise<ApiResponse<null>> {
  const idx = mockFeaturedEntities.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Featured entity not found");
  mockFeaturedEntities[idx].isActive = false;
  return mockApiCall({ data: null, message: "Entity unfeatured" });
}

// ============= Company Applications CRUD =============

export async function fetchCompanyApplications(params?: {
  companyId?: string;
  vacancyId?: string;
  applicantId?: string;
  status?: string;
}): Promise<ApiResponse<CompanyApplication[]>> {
  let filtered = [...mockCompanyApplications];
  if (params?.companyId) filtered = filtered.filter((a) => a.companyId === params.companyId);
  if (params?.vacancyId) filtered = filtered.filter((a) => a.vacancyId === params.vacancyId);
  if (params?.applicantId) filtered = filtered.filter((a) => a.applicantId === params.applicantId);
  if (params?.status && params.status !== "all") filtered = filtered.filter((a) => a.status === params.status);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createCompanyApplication(app: Omit<CompanyApplication, "id" | "appliedAt">): Promise<ApiResponse<CompanyApplication>> {
  const exists = mockCompanyApplications.find(
    (a) => a.applicantId === app.applicantId && a.vacancyId === app.vacancyId
  );
  if (exists) throw new Error("Already applied for this vacancy");

  const newApp: CompanyApplication = {
    ...app,
    id: `CA${String(mockCompanyApplications.length + 1).padStart(3, "0")}`,
    appliedAt: new Date().toISOString().split("T")[0],
  };
  mockCompanyApplications.push(newApp);
  return mockApiCall({ data: newApp, message: "Application submitted" });
}

export async function updateCompanyApplication(id: string, data: Partial<CompanyApplication>): Promise<ApiResponse<CompanyApplication>> {
  const idx = mockCompanyApplications.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Application not found");
  mockCompanyApplications[idx] = { ...mockCompanyApplications[idx], ...data };
  return mockApiCall({ data: mockCompanyApplications[idx], message: "Application updated" });
}

export async function deleteCompanyApplication(id: string): Promise<ApiResponse<null>> {
  const idx = mockCompanyApplications.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Application not found");
  mockCompanyApplications.splice(idx, 1);
  return mockApiCall({ data: null, message: "Application withdrawn" });
}

// ============= Helper: Get student's entities =============

export async function getStudentEntities(userId: string): Promise<ApiResponse<{
  institutes: EntityRegistration[];
  consultancies: EntityRegistration[];
  companies: EntityRegistration[];
}>> {
  const all = mockRegistrations.filter((r) => r.userId === userId && r.status === "active");
  return mockApiCall({
    data: {
      institutes: all.filter((r) => r.entityType === "institute"),
      consultancies: all.filter((r) => r.entityType === "consultancy"),
      companies: all.filter((r) => r.entityType === "company"),
    },
  });
}

// ============= Helper: Check entity-level permission =============

export function checkEntityPermission(
  roleId: string,
  permission: string,
): boolean {
  const role = mockEntityRoles.find((r) => r.id === roleId);
  if (!role) return false;
  return role.permissions.includes(permission);
}

// ============= Helper: Get roles an owner can assign =============

export function getAssignableRoles(entityType: EntityType): EntityRole[] {
  return mockEntityRoles.filter((r) => r.entityType === entityType && r.name !== `${entityType.charAt(0).toUpperCase()}${entityType.slice(1)} Owner`);
}

// ============= Permission: Can user manage featured entities =============

export function canManageFeatured(userRole: string): boolean {
  return userRole === "platform_owner";
}
