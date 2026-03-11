import { mockApiCall } from "./api";
import type { Role, TeamMember, ApiResponse } from "@/types";

// ============= Entity Exclusivity Logic =============
// A user can only be an instructor for ONE entity type (institute OR consultancy, not both)
// A student can be registered across multiple entities simultaneously

interface UserEntityRegistration {
  userId: string;
  entityType: "institute" | "consultancy" | "company";
  entityId: string;
  role: "instructor" | "student" | "manager" | "counselor" | "hr_manager" | "recruiter";
}

const mockRegistrations: UserEntityRegistration[] = [
  // Instructors - each locked to ONE entity type
  { userId: "U004", entityType: "institute", entityId: "1", role: "instructor" },
  { userId: "U009", entityType: "consultancy", entityId: "CON1", role: "instructor" },
  // Students - can be across multiple entities
  { userId: "U005", entityType: "institute", entityId: "1", role: "student" },
  { userId: "U005", entityType: "consultancy", entityId: "CON1", role: "student" },
  { userId: "U005", entityType: "company", entityId: "C001", role: "student" },
  { userId: "U005", entityType: "institute", entityId: "2", role: "student" },
];

export function validateInstructorExclusivity(
  userId: string,
  targetEntityType: "institute" | "consultancy",
  _targetEntityId: string
): { allowed: boolean; reason?: string } {
  const existingInstructorReg = mockRegistrations.find(
    (r) => r.userId === userId && r.role === "instructor"
  );
  if (!existingInstructorReg) return { allowed: true };
  if (existingInstructorReg.entityType !== targetEntityType) {
    return {
      allowed: false,
      reason: `User is already registered as instructor for a ${existingInstructorReg.entityType}. A user cannot be an instructor for both institute and consultancy simultaneously.`,
    };
  }
  return { allowed: true };
}

export function getUserRegistrations(userId: string): UserEntityRegistration[] {
  return mockRegistrations.filter((r) => r.userId === userId);
}

export function getStudentEntities(userId: string): UserEntityRegistration[] {
  return mockRegistrations.filter((r) => r.userId === userId && r.role === "student");
}

export function registerUserToEntity(
  userId: string,
  entityType: "institute" | "consultancy" | "company",
  entityId: string,
  role: string
): { success: boolean; error?: string } {
  if (role === "instructor") {
    const check = validateInstructorExclusivity(userId, entityType as any, entityId);
    if (!check.allowed) return { success: false, error: check.reason };
  }
  const exists = mockRegistrations.find(
    (r) => r.userId === userId && r.entityType === entityType && r.entityId === entityId && r.role === role
  );
  if (exists) return { success: false, error: "User is already registered with this role" };
  mockRegistrations.push({ userId, entityType, entityId, role: role as any });
  return { success: true };
}

// ============= Institute Roles =============
const mockRoles: Role[] = [
  { id: "R1", name: "Super Admin", description: "Full access to all institutes and features", users: 2, type: "system", instituteId: "1", scope: "global", createdBy: "platform_owner",
    permissions: { dashboard: true, students: true, tests: true, progress: true, library: true, lectures: true, courses: true, roles: true, settings: true, billing: true, placements: true, fees: true, attendance: true, announcements: true, enrollment: true } },
  { id: "R2", name: "Institute Owner", description: "Full access to their own institute", users: 3, type: "system", instituteId: "1", scope: "institute", createdBy: "platform_owner",
    permissions: { dashboard: true, students: true, tests: true, progress: true, library: true, lectures: true, courses: true, roles: true, settings: true, billing: true, placements: true, fees: true, attendance: true, announcements: true, enrollment: true } },
  { id: "R3", name: "Manager", description: "Manage students, tests, and content — cannot manage roles", users: 5, type: "custom", instituteId: "1", scope: "institute", createdBy: "institute_owner",
    permissions: { dashboard: true, students: true, tests: true, progress: true, library: true, lectures: true, courses: true, roles: false, settings: false, billing: false, placements: true, fees: false, attendance: true, announcements: true } },
  { id: "R4", name: "Instructor", description: "Create and manage course content and tests", users: 12, type: "custom", instituteId: "1", scope: "institute", createdBy: "institute_owner",
    permissions: { dashboard: true, students: false, tests: true, progress: true, library: true, lectures: true, courses: true, roles: false, settings: false, billing: false, placements: false, attendance: true, announcements: true } },
  { id: "R5", name: "Student", description: "View courses, take tests, access library", users: 1284, type: "system", instituteId: "1", scope: "institute", createdBy: "institute_owner",
    permissions: { dashboard: true, students: false, tests: false, progress: false, library: true, lectures: true, courses: true, roles: false, settings: false, billing: false, placements: false, fees: true, announcements: true } },
];

// ============= Consultancy Roles =============
const mockConsultancyRoles: Role[] = [
  { id: "CR1", name: "Consultancy Owner", description: "Full access to consultancy operations", users: 1, type: "system", instituteId: "CON1", scope: "global", createdBy: "platform_owner",
    permissions: { dashboard: true, visa_tracking: true, university_applications: true, language_courses: true, counselor_management: true, consultancy_manage: true, roles: true, settings: true, billing: true, announcements: true, students: true } },
  { id: "CR2", name: "Senior Counselor", description: "Manage counseling operations and assign junior counselors", users: 3, type: "system", instituteId: "CON1", scope: "institute", createdBy: "platform_owner",
    permissions: { dashboard: true, visa_tracking: true, university_applications: true, language_courses: true, counselor_management: true, announcements: true, students: true } },
  { id: "CR3", name: "Visa Officer", description: "Process visa applications and document verification", users: 5, type: "system", instituteId: "CON1", scope: "institute", createdBy: "platform_owner",
    permissions: { dashboard: true, visa_tracking: true, students: true, announcements: true } },
  { id: "CR4", name: "University Advisor", description: "Guide students through university application process", users: 4, type: "system", instituteId: "CON1", scope: "institute", createdBy: "platform_owner",
    permissions: { dashboard: true, university_applications: true, students: true, announcements: true } },
  { id: "CR5", name: "Language Instructor", description: "Teach language courses and conduct assessments", users: 8, type: "custom", instituteId: "CON1", scope: "institute", createdBy: "consultancy_owner",
    permissions: { dashboard: true, language_courses: true, students: true, announcements: true } },
  { id: "CR6", name: "Manager", description: "Manage consultancy operations, staff schedules and reports", users: 2, type: "custom", instituteId: "CON1", scope: "institute", createdBy: "consultancy_owner",
    permissions: { dashboard: true, visa_tracking: true, university_applications: true, language_courses: true, counselor_management: true, announcements: true, students: true, settings: false, billing: false, roles: false } },
  { id: "CR7", name: "Student", description: "Access visa tracking, university applications, language courses", users: 450, type: "system", instituteId: "CON1", scope: "institute", createdBy: "platform_owner",
    permissions: { dashboard: true, visa_tracking: true, university_applications: true, language_courses: true, announcements: true } },
];

// ============= Company Roles =============
const mockCompanyRoles: Role[] = [
  { id: "COR1", name: "Company Admin", description: "Full access to company recruitment operations", users: 1, type: "system", instituteId: "C001", scope: "global", createdBy: "platform_owner",
    permissions: { dashboard: true, company_vacancies: true, placements: true, roles: true, settings: true } },
  { id: "COR2", name: "HR Manager", description: "Manage vacancies, screen applicants, and coordinate interviews", users: 2, type: "system", instituteId: "C001", scope: "institute", createdBy: "platform_owner",
    permissions: { dashboard: true, company_vacancies: true, placements: true } },
  { id: "COR3", name: "Recruiter", description: "Post vacancies and manage candidate pipeline", users: 4, type: "system", instituteId: "C001", scope: "institute", createdBy: "platform_owner",
    permissions: { dashboard: true, company_vacancies: true, placements: true } },
  { id: "COR4", name: "Interviewer", description: "View shortlisted candidates and provide interview feedback", users: 10, type: "custom", instituteId: "C001", scope: "institute", createdBy: "company",
    permissions: { dashboard: true, placements: true } },
  { id: "COR5", name: "Hiring Manager", description: "Make final hiring decisions and extend offers", users: 3, type: "custom", instituteId: "C001", scope: "institute", createdBy: "company",
    permissions: { dashboard: true, company_vacancies: true, placements: true } },
];

// ============= Team Members (with entity type) =============
const mockTeamMembers: TeamMember[] = [
  { id: "TM1", name: "John Doe", email: "john@techverse.com", role: "Super Admin", status: "active", lastActive: "2 min ago", instituteId: "1" },
  { id: "TM2", name: "Jane Smith", email: "jane@techverse.com", role: "Instructor", status: "active", lastActive: "1 hr ago", instituteId: "1" },
  { id: "TM3", name: "Mike Johnson", email: "mike@techverse.com", role: "Admin", status: "active", lastActive: "3 hrs ago", instituteId: "1" },
  { id: "TM4", name: "Sarah Wilson", email: "sarah@techverse.com", role: "Instructor", status: "inactive", lastActive: "2 days ago", instituteId: "1" },
  { id: "TM5", name: "Tom Brown", email: "tom@techverse.com", role: "Instructor", status: "active", lastActive: "30 min ago", instituteId: "1" },
];

const mockConsultancyTeamMembers: TeamMember[] = [
  { id: "CTM1", name: "Ravi Kumar", email: "ravi@globalconsult.com", role: "Consultancy Owner", status: "active", lastActive: "5 min ago", instituteId: "CON1" },
  { id: "CTM2", name: "Priya Sharma", email: "priya@globalconsult.com", role: "Senior Counselor", status: "active", lastActive: "20 min ago", instituteId: "CON1" },
  { id: "CTM3", name: "Ahmed Khan", email: "ahmed@globalconsult.com", role: "Visa Officer", status: "active", lastActive: "1 hr ago", instituteId: "CON1" },
  { id: "CTM4", name: "Lisa Chen", email: "lisa@globalconsult.com", role: "University Advisor", status: "active", lastActive: "45 min ago", instituteId: "CON1" },
  { id: "CTM5", name: "David Park", email: "david@globalconsult.com", role: "Language Instructor", status: "active", lastActive: "2 hrs ago", instituteId: "CON1" },
];

const mockCompanyTeamMembers: TeamMember[] = [
  { id: "COM1", name: "TechCorp HR", email: "hr@techcorp.com", role: "Company Admin", status: "active", lastActive: "10 min ago", instituteId: "C001" },
  { id: "COM2", name: "Emily Davis", email: "emily@techcorp.com", role: "HR Manager", status: "active", lastActive: "25 min ago", instituteId: "C001" },
  { id: "COM3", name: "Robert Lee", email: "robert@techcorp.com", role: "Recruiter", status: "active", lastActive: "1 hr ago", instituteId: "C001" },
  { id: "COM4", name: "Nina Patel", email: "nina@techcorp.com", role: "Interviewer", status: "active", lastActive: "3 hrs ago", instituteId: "C001" },
];

export type RoleCategory = "institute" | "consultancy" | "company" | "all";

export async function fetchRoles(instituteId?: string): Promise<ApiResponse<Role[]>> {
  const filtered = instituteId ? mockRoles.filter((r) => r.instituteId === instituteId) : mockRoles;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchRolesByCategory(category: RoleCategory): Promise<ApiResponse<Role[]>> {
  switch (category) {
    case "consultancy": return mockApiCall({ data: [...mockConsultancyRoles], total: mockConsultancyRoles.length });
    case "company": return mockApiCall({ data: [...mockCompanyRoles], total: mockCompanyRoles.length });
    case "all": {
      const all = [...mockRoles, ...mockConsultancyRoles, ...mockCompanyRoles];
      return mockApiCall({ data: all, total: all.length });
    }
    default: return mockApiCall({ data: [...mockRoles], total: mockRoles.length });
  }
}

export async function fetchRoleById(id: string): Promise<ApiResponse<Role>> {
  const allRoles = [...mockRoles, ...mockConsultancyRoles, ...mockCompanyRoles];
  const role = allRoles.find((r) => r.id === id);
  if (!role) throw new Error("Role not found");
  return mockApiCall({ data: role });
}

export async function createRole(role: Omit<Role, "id">): Promise<ApiResponse<Role>> {
  const newRole: Role = { ...role, id: `R${Date.now()}` };
  mockRoles.push(newRole);
  return mockApiCall({ data: newRole, message: "Role created successfully" });
}

export async function updateRole(id: string, data: Partial<Role>): Promise<ApiResponse<Role>> {
  const allRoles = [mockRoles, mockConsultancyRoles, mockCompanyRoles];
  for (const list of allRoles) {
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      return mockApiCall({ data: list[idx], message: "Role updated successfully" });
    }
  }
  throw new Error("Role not found");
}

export async function deleteRole(id: string): Promise<ApiResponse<null>> {
  const allRoles = [mockRoles, mockConsultancyRoles, mockCompanyRoles];
  for (const list of allRoles) {
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      if (list[idx].type === "system") throw new Error("Cannot delete system role");
      list.splice(idx, 1);
      return mockApiCall({ data: null, message: "Role deleted successfully" });
    }
  }
  throw new Error("Role not found");
}

export async function fetchTeamMembers(instituteId?: string): Promise<ApiResponse<TeamMember[]>> {
  const filtered = instituteId ? mockTeamMembers.filter((m) => m.instituteId === instituteId) : mockTeamMembers;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchTeamMembersByCategory(category: RoleCategory): Promise<ApiResponse<TeamMember[]>> {
  switch (category) {
    case "consultancy": return mockApiCall({ data: [...mockConsultancyTeamMembers], total: mockConsultancyTeamMembers.length });
    case "company": return mockApiCall({ data: [...mockCompanyTeamMembers], total: mockCompanyTeamMembers.length });
    case "all": {
      const all = [...mockTeamMembers, ...mockConsultancyTeamMembers, ...mockCompanyTeamMembers];
      return mockApiCall({ data: all, total: all.length });
    }
    default: return mockApiCall({ data: [...mockTeamMembers], total: mockTeamMembers.length });
  }
}

export async function updateTeamMemberRole(memberId: string, newRole: string): Promise<ApiResponse<TeamMember>> {
  const allMembers = [...mockTeamMembers, ...mockConsultancyTeamMembers, ...mockCompanyTeamMembers];
  const member = allMembers.find((m) => m.id === memberId);
  if (!member) throw new Error("Team member not found");
  member.role = newRole;
  return mockApiCall({ data: member, message: "Role updated successfully" });
}
