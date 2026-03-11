import { describe, it, expect } from "vitest";
import {
  hasPermission,
  getEffectivePermissions,
  canRoleAssign,
  canCreateRoles,
  canViewRole,
  getVisibleRolesForRole,
  ROLE_CONFIGS,
  type AppRole,
} from "@/config/roles";

describe("Roles & Permissions", () => {
  describe("Role Configuration", () => {
    it("should not have an 'admin' role", () => {
      expect(Object.keys(ROLE_CONFIGS)).not.toContain("admin");
    });

    it("platform_owner should have all permissions including featured_management", () => {
      const perms = ROLE_CONFIGS.platform_owner.permissions;
      expect(perms).toContain("featured_management");
      expect(perms).toContain("dashboard");
      expect(perms).toContain("roles");
      expect(perms).toContain("settings");
    });

    it("institute_owner should not have featured_management", () => {
      expect(ROLE_CONFIGS.institute_owner.permissions).not.toContain("featured_management");
    });

    it("consultancy_owner should have visa_tracking and counselor_management", () => {
      const perms = ROLE_CONFIGS.consultancy_owner.permissions;
      expect(perms).toContain("visa_tracking");
      expect(perms).toContain("counselor_management");
      expect(perms).toContain("roles");
    });

    it("company should have roles permission to manage their own roles", () => {
      expect(ROLE_CONFIGS.company.permissions).toContain("roles");
    });
  });

  describe("Permission Checks", () => {
    it("platform_owner has all permissions", () => {
      expect(hasPermission("platform_owner", "dashboard")).toBe(true);
      expect(hasPermission("platform_owner", "featured_management")).toBe(true);
      expect(hasPermission("platform_owner", "roles")).toBe(true);
    });

    it("student should have dashboard but not roles", () => {
      expect(hasPermission("student", "dashboard", "1")).toBe(true);
      expect(hasPermission("student", "roles", "1")).toBe(false);
    });

    it("instructor permissions should be scoped by institute grant", () => {
      // Institute 1 grants full instructor permissions
      const perms1 = getEffectivePermissions("instructor", "1");
      expect(perms1).toContain("dashboard");
      expect(perms1).toContain("tests");

      // Institute 2 grants limited instructor permissions
      const perms2 = getEffectivePermissions("instructor", "2");
      expect(perms2).toContain("tests");
      expect(perms2).not.toContain("attendance");
    });

    it("student permissions should be further scoped by instructor delegation", () => {
      const withDelegation = getEffectivePermissions("student", "1", "U004");
      const withoutDelegation = getEffectivePermissions("student", "1");
      
      // With delegation, permissions are intersected
      expect(withDelegation.length).toBeLessThanOrEqual(withoutDelegation.length);
    });

    it("public user should only have institutes_view", () => {
      const perms = getEffectivePermissions("public");
      expect(perms).toEqual(["institutes_view"]);
    });
  });

  describe("Role Assignment Rules", () => {
    it("platform_owner can assign institute_owner, consultancy_owner, company", () => {
      expect(canRoleAssign("platform_owner", "institute_owner")).toBe(true);
      expect(canRoleAssign("platform_owner", "consultancy_owner")).toBe(true);
      expect(canRoleAssign("platform_owner", "company")).toBe(true);
    });

    it("institute_owner can assign instructor and student only", () => {
      expect(canRoleAssign("institute_owner", "instructor")).toBe(true);
      expect(canRoleAssign("institute_owner", "student")).toBe(true);
      expect(canRoleAssign("institute_owner", "company")).toBe(false);
      expect(canRoleAssign("institute_owner", "platform_owner")).toBe(false);
    });

    it("consultancy_owner can assign instructor", () => {
      expect(canRoleAssign("consultancy_owner", "instructor")).toBe(true);
      expect(canRoleAssign("consultancy_owner", "student")).toBe(false);
    });

    it("student and instructor cannot assign any roles", () => {
      expect(canRoleAssign("student", "instructor")).toBe(false);
      expect(canRoleAssign("instructor", "student")).toBe(false);
    });
  });

  describe("Custom Role Creation", () => {
    it("owners can create custom roles", () => {
      expect(canCreateRoles("platform_owner")).toBe(true);
      expect(canCreateRoles("institute_owner")).toBe(true);
      expect(canCreateRoles("consultancy_owner")).toBe(true);
      expect(canCreateRoles("company")).toBe(true);
    });

    it("non-owners cannot create custom roles", () => {
      expect(canCreateRoles("instructor")).toBe(false);
      expect(canCreateRoles("student")).toBe(false);
      expect(canCreateRoles("public")).toBe(false);
    });
  });

  describe("Role Visibility", () => {
    it("platform_owner sees all roles", () => {
      const visible = getVisibleRolesForRole("platform_owner");
      expect(visible.length).toBe(Object.keys(ROLE_CONFIGS).length);
    });

    it("institute_owner sees lower-level roles only", () => {
      const visible = getVisibleRolesForRole("institute_owner");
      expect(visible).toContain("instructor");
      expect(visible).toContain("student");
      expect(visible).not.toContain("platform_owner");
      expect(visible).not.toContain("institute_owner");
    });

    it("student sees no roles below them except public", () => {
      const visible = getVisibleRolesForRole("student");
      expect(visible).toContain("public");
      expect(visible.length).toBe(1);
    });

    it("canViewRole respects hierarchy", () => {
      expect(canViewRole("platform_owner", "student")).toBe(true);
      expect(canViewRole("institute_owner", "instructor")).toBe(true);
      expect(canViewRole("student", "platform_owner")).toBe(false);
      expect(canViewRole("instructor", "institute_owner")).toBe(false);
    });
  });
});
