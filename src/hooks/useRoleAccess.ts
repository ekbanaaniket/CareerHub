// ============= Role-Based Access Control Hook =============
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/config/roles";

export interface RoleAccess {
  /** Can this role create/add new records in this context? */
  canCreate: boolean;
  /** Can this role edit/update existing records? */
  canEdit: boolean;
  /** Can this role delete records? */
  canDelete: boolean;
  /** Is this a view-only role for this context? */
  isViewOnly: boolean;
  /** Current role */
  role: AppRole;
}

/**
 * Determines CRUD permissions based on current user role.
 * 
 * Platform Owner: View-only across all entity data (oversees, doesn't manage)
 * Institute Owner: Full CRUD on own institute data
 * Consultancy Owner: Full CRUD on own consultancy data
 * Company: Full CRUD on own company data (vacancies, placements)
 * Instructor: Can create/edit content assigned to them
 * Student: Read-only (view enrolled content, track progress)
 * Public: Browse only
 */
export function useRoleAccess(context?: "institute" | "consultancy" | "company" | "platform"): RoleAccess {
  const { user } = useAuth();
  const role = user?.role ?? "public";

  // Platform owner is always view-only — they oversee, not manage
  if (role === "platform_owner") {
    // Platform owner CAN manage platform-level things (featured, institutes management, roles)
    if (context === "platform") {
      return { canCreate: true, canEdit: true, canDelete: true, isViewOnly: false, role };
    }
    return { canCreate: false, canEdit: false, canDelete: false, isViewOnly: true, role };
  }

  // Student is always read-only for content creation
  if (role === "student") {
    return { canCreate: false, canEdit: false, canDelete: false, isViewOnly: true, role };
  }

  // Public — browse only
  if (role === "public") {
    return { canCreate: false, canEdit: false, canDelete: false, isViewOnly: true, role };
  }

  // Institute owner has full access to institute context
  if (role === "institute_owner") {
    return { canCreate: true, canEdit: true, canDelete: true, isViewOnly: false, role };
  }

  // Consultancy owner has full access to consultancy context
  if (role === "consultancy_owner") {
    return { canCreate: true, canEdit: true, canDelete: true, isViewOnly: false, role };
  }

  // Company has full access to company context
  if (role === "company") {
    return { canCreate: true, canEdit: true, canDelete: true, isViewOnly: false, role };
  }

  // Instructor can create/edit but typically not delete
  if (role === "instructor") {
    return { canCreate: true, canEdit: true, canDelete: false, isViewOnly: false, role };
  }

  return { canCreate: false, canEdit: false, canDelete: false, isViewOnly: true, role };
}
