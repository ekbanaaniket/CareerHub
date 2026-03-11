// ============= Role & Permission Configuration =============
// Permission Hierarchy (updated — no standalone "admin" role):
// Platform Owner → top level, manages everything including featured entities
// Institute Owner → manages own institute, creates custom roles (manager, instructor, student, etc.)
// Consultancy Owner → manages consultancy, creates roles (counselor, visa officer, language instructor, etc.)
// Company → manages company, creates roles (HR, recruiter, interviewer, etc.)
// Instructor → content creation within institute (assigned by institute owner)
// Student → can be registered with multiple entities simultaneously
// Public → browsing only

export type AppRole = 
  | "platform_owner"
  | "institute_owner" 
  | "consultancy_owner"
  | "instructor"
  | "student"
  | "company"
  | "public";

// Role hierarchy level (lower number = higher authority)
export const ROLE_HIERARCHY: Record<AppRole, number> = {
  platform_owner: 0,
  institute_owner: 1,
  consultancy_owner: 1,
  company: 1,
  instructor: 3,
  student: 4,
  public: 5,
};

export type Permission =
  | "dashboard"
  | "students"
  | "tests"
  | "progress"
  | "library"
  | "lectures"
  | "courses"
  | "placements"
  | "roles"
  | "settings"
  | "billing"
  | "fees"
  | "attendance"
  | "vacancies"
  | "institutes_manage"
  | "institutes_view"
  | "company_vacancies"
  | "announcements"
  | "notifications"
  | "visa_tracking"
  | "university_applications"
  | "language_courses"
  | "counselor_management"
  | "consultancy_manage"
  | "enrollment"
  | "featured_management";

export interface RoleConfig {
  id: AppRole;
  label: string;
  description: string;
  permissions: Permission[];
  canAssignRoles: AppRole[];
  canCreateCustomRoles: boolean;
}

export const ROLE_CONFIGS: Record<AppRole, RoleConfig> = {
  platform_owner: {
    id: "platform_owner",
    label: "Platform Owner",
    description: "Full access to all platform features, all entities, and featured management",
    permissions: [
      "dashboard", "students", "tests", "progress", "library", "lectures",
      "courses", "placements", "roles", "settings", "billing", "fees",
      "attendance", "vacancies", "institutes_manage", "institutes_view",
      "company_vacancies", "announcements", "notifications",
      "visa_tracking", "university_applications", "language_courses", "counselor_management",
      "consultancy_manage", "enrollment", "featured_management"
    ],
    canAssignRoles: ["institute_owner", "consultancy_owner", "company"],
    canCreateCustomRoles: true,
  },
  institute_owner: {
    id: "institute_owner",
    label: "Institute Owner",
    description: "Full access to own institute — creates custom roles, assigns instructors & students to specific courses",
    permissions: [
      "dashboard", "students", "tests", "progress", "library", "lectures",
      "courses", "placements", "roles", "settings", "billing", "fees",
      "attendance", "announcements", "notifications", "enrollment"
    ],
    canAssignRoles: ["instructor", "student"],
    canCreateCustomRoles: true,
  },
  consultancy_owner: {
    id: "consultancy_owner",
    label: "Consultancy Owner",
    description: "Manages consultancy — creates roles like counselor, visa officer, language instructor",
    permissions: [
      "dashboard", "visa_tracking", "university_applications", "language_courses",
      "counselor_management", "consultancy_manage", "roles", "settings",
      "announcements", "notifications", "students", "billing"
    ],
    canAssignRoles: ["instructor"],
    canCreateCustomRoles: true,
  },
  instructor: {
    id: "instructor",
    label: "Instructor",
    description: "Permissions assigned by entity owner — scoped to specific courses or services",
    permissions: [
      "dashboard", "tests", "progress", "library", "lectures", "courses",
      "attendance", "announcements", "notifications", "language_courses"
    ],
    canAssignRoles: [],
    canCreateCustomRoles: false,
  },
  student: {
    id: "student",
    label: "Student",
    description: "Can be registered with multiple institutes, consultancies, and companies simultaneously",
    permissions: [
      "dashboard", "library", "lectures", "courses", "tests", "progress",
      "placements", "fees", "attendance", "announcements", "notifications",
      "visa_tracking", "university_applications", "language_courses"
    ],
    canAssignRoles: [],
    canCreateCustomRoles: false,
  },
  company: {
    id: "company",
    label: "Company",
    description: "Post vacancies, view applicants — creates roles like HR, recruiter, interviewer",
    permissions: ["dashboard", "company_vacancies", "placements", "notifications", "roles", "settings"],
    canAssignRoles: [],
    canCreateCustomRoles: true,
  },
  public: {
    id: "public",
    label: "Public User",
    description: "Browse institutes, consultancies, and jobs publicly",
    permissions: ["institutes_view"],
    canAssignRoles: [],
    canCreateCustomRoles: false,
  },
};

// ============= Institute Permission Assignment System =============

export interface InstitutePermissionGrant {
  instituteId: string;
  instructorPermissions: Permission[];
  studentPermissions: Permission[];
}

const INSTITUTE_GRANTS: Record<string, InstitutePermissionGrant> = {
  "1": {
    instituteId: "1",
    instructorPermissions: ["dashboard", "tests", "progress", "library", "lectures", "courses", "attendance", "announcements", "language_courses"],
    studentPermissions: ["dashboard", "library", "lectures", "courses", "tests", "progress", "fees", "announcements", "visa_tracking", "university_applications", "language_courses"],
  },
  "2": {
    instituteId: "2",
    instructorPermissions: ["dashboard", "tests", "library", "lectures", "courses"],
    studentPermissions: ["dashboard", "library", "courses", "tests"],
  },
  "3": {
    instituteId: "3",
    instructorPermissions: ["dashboard", "lectures", "courses", "attendance"],
    studentPermissions: ["dashboard", "lectures", "courses"],
  },
};

export interface UserPermissionOverride {
  userId: string;
  grantedBy: string;
  permissions: Permission[];
  instituteId: string;
}

const USER_PERMISSION_OVERRIDES: Record<string, UserPermissionOverride> = {};

export interface InstructorDelegation {
  instructorId: string;
  instituteId: string;
  studentPermissions: Permission[];
}

const INSTRUCTOR_DELEGATIONS: Record<string, InstructorDelegation> = {
  "U004": {
    instructorId: "U004",
    instituteId: "1",
    studentPermissions: ["dashboard", "library", "lectures", "courses", "tests", "progress"],
  },
};

export function getInstituteGrant(instituteId: string): InstitutePermissionGrant | undefined {
  return INSTITUTE_GRANTS[instituteId];
}

export function getInstructorDelegation(instructorId: string): InstructorDelegation | undefined {
  return INSTRUCTOR_DELEGATIONS[instructorId];
}

export function getUserOverride(userId: string): UserPermissionOverride | undefined {
  return USER_PERMISSION_OVERRIDES[userId];
}

export function setUserOverride(userId: string, override: UserPermissionOverride) {
  USER_PERMISSION_OVERRIDES[userId] = override;
}

export function removeUserOverride(userId: string) {
  delete USER_PERMISSION_OVERRIDES[userId];
}

export function updateInstituteGrant(instituteId: string, grant: Partial<InstitutePermissionGrant>) {
  if (INSTITUTE_GRANTS[instituteId]) {
    Object.assign(INSTITUTE_GRANTS[instituteId], grant);
  }
}

export function updateInstructorDelegation(instructorId: string, delegation: Partial<InstructorDelegation>) {
  if (INSTRUCTOR_DELEGATIONS[instructorId]) {
    Object.assign(INSTRUCTOR_DELEGATIONS[instructorId], delegation);
  } else {
    INSTRUCTOR_DELEGATIONS[instructorId] = {
      instructorId,
      instituteId: delegation.instituteId ?? "",
      studentPermissions: delegation.studentPermissions ?? [],
    };
  }
}

export function getEffectivePermissions(
  role: AppRole,
  instituteId?: string,
  instructorId?: string,
  userId?: string,
): Permission[] {
  if (userId) {
    const override = getUserOverride(userId);
    if (override) return override.permissions;
  }

  const roleCap = ROLE_CONFIGS[role]?.permissions ?? [];
  
  if (["platform_owner", "institute_owner", "consultancy_owner", "company", "public"].includes(role)) {
    return roleCap;
  }

  if (!instituteId) return roleCap;

  const grant = getInstituteGrant(instituteId);
  if (!grant) return roleCap;

  if (role === "instructor") {
    return roleCap.filter((p) => grant.instructorPermissions.includes(p));
  }

  if (role === "student") {
    let allowed = roleCap.filter((p) => grant.studentPermissions.includes(p));
    if (instructorId) {
      const delegation = getInstructorDelegation(instructorId);
      if (delegation) {
        allowed = allowed.filter((p) => delegation.studentPermissions.includes(p));
      }
    }
    return allowed;
  }

  return roleCap;
}

export function hasPermission(role: AppRole, permission: Permission, instituteId?: string, instructorId?: string, userId?: string): boolean {
  const effective = getEffectivePermissions(role, instituteId, instructorId, userId);
  return effective.includes(permission);
}

export function getPermissionsForRole(role: AppRole): Permission[] {
  return ROLE_CONFIGS[role]?.permissions ?? [];
}

export function canRoleAssign(assignerRole: AppRole, targetRole: AppRole): boolean {
  return ROLE_CONFIGS[assignerRole]?.canAssignRoles.includes(targetRole) ?? false;
}

export function canCreateRoles(role: AppRole): boolean {
  return ROLE_CONFIGS[role]?.canCreateCustomRoles ?? false;
}

export function canViewRole(viewerRole: AppRole, targetRole: AppRole): boolean {
  if (viewerRole === "platform_owner") return true;
  return ROLE_HIERARCHY[viewerRole] < ROLE_HIERARCHY[targetRole];
}

export function canEditRole(editorRole: AppRole, targetRole: AppRole): boolean {
  if (editorRole === "platform_owner") return true;
  return ROLE_HIERARCHY[editorRole] < ROLE_HIERARCHY[targetRole];
}

export function getVisibleRolesForRole(viewerRole: AppRole): AppRole[] {
  if (viewerRole === "platform_owner") {
    return Object.keys(ROLE_CONFIGS) as AppRole[];
  }
  return (Object.keys(ROLE_CONFIGS) as AppRole[]).filter(
    (r) => ROLE_HIERARCHY[viewerRole] < ROLE_HIERARCHY[r]
  );
}
