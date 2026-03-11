import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to determine if the current user can perform CRUD operations.
 * Platform owners are view-only (oversight role).
 * Students are view-only for content creation.
 */
export function useCanManage() {
  const { user } = useAuth();
  const role = user?.role;
  const isViewOnly = role === "platform_owner" || role === "student" || role === "public";
  return {
    canCreate: !isViewOnly,
    canEdit: !isViewOnly,
    canDelete: !isViewOnly,
    isViewOnly,
    role: role ?? "public",
  };
}

/**
 * Determines if user can create/manage announcements.
 * Only owner-level roles can create; all others view-only.
 */
export function useCanManageAnnouncements() {
  const { user } = useAuth();
  const role = user?.role;
  const canManage = ["platform_owner", "institute_owner", "consultancy_owner", "company"].includes(role ?? "");
  return { canCreate: canManage, canEdit: canManage, canDelete: canManage, isViewOnly: !canManage };
}
