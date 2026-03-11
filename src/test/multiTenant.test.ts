import { describe, it, expect, beforeEach } from "vitest";
import {
  fetchUserRegistrations,
  fetchEntityRegistrations,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  fetchEntityRoles,
  createEntityRole,
  updateEntityRole,
  deleteEntityRole,
  fetchRoleAssignments,
  createRoleAssignment,
  fetchFeaturedEntities,
  createFeaturedEntity,
  removeFeaturedEntity,
  fetchCompanyApplications,
  createCompanyApplication,
  updateCompanyApplication,
  getStudentEntities,
  checkEntityPermission,
  canManageFeatured,
} from "@/services/multiTenant";

describe("Multi-Tenant Service", () => {
  // ============= Registration Tests =============
  describe("Registrations", () => {
    it("should fetch registrations for a student across multiple entities", async () => {
      const result = await fetchUserRegistrations("U005");
      expect(result.data.length).toBeGreaterThanOrEqual(3);
      
      const entityTypes = result.data.map((r) => r.entityType);
      expect(entityTypes).toContain("institute");
      expect(entityTypes).toContain("consultancy");
      expect(entityTypes).toContain("company");
    });

    it("should fetch registrations for a specific entity", async () => {
      const result = await fetchEntityRegistrations("institute", "1");
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((r) => {
        expect(r.entityType).toBe("institute");
        expect(r.entityId).toBe("1");
      });
    });

    it("should prevent duplicate registrations", async () => {
      await expect(
        createRegistration({
          userId: "U005", userName: "Alice Johnson", userEmail: "alice@email.com",
          entityType: "institute", entityId: "1", entityName: "TechVerse Academy",
          roleId: "IR_STUDENT", roleName: "Student",
          status: "active", registeredAt: "2026-03-01", registeredBy: "U002",
        })
      ).rejects.toThrow("already registered");
    });

    it("should create a new registration", async () => {
      const result = await createRegistration({
        userId: "U020", userName: "New Student", userEmail: "new@email.com",
        entityType: "institute", entityId: "1", entityName: "TechVerse Academy",
        roleId: "IR_STUDENT", roleName: "Student",
        assignedContext: "Backend Mastery", assignedContextId: "CRS003",
        status: "active", registeredAt: "2026-03-05", registeredBy: "U002",
      });
      expect(result.data.id).toBeTruthy();
      expect(result.data.userId).toBe("U020");
    });

    it("should get student entities grouped by type", async () => {
      const result = await getStudentEntities("U005");
      expect(result.data.institutes.length).toBeGreaterThanOrEqual(1);
      expect(result.data.consultancies.length).toBeGreaterThanOrEqual(1);
      expect(result.data.companies.length).toBeGreaterThanOrEqual(1);
    });

    it("student should only see their own registrations, not others", async () => {
      const aliceRegs = await fetchUserRegistrations("U005");
      const bobRegs = await fetchUserRegistrations("U010");
      
      // Alice has multi-entity, Bob has only institute
      expect(aliceRegs.data.length).toBeGreaterThan(bobRegs.data.length);
      
      // No overlap in user IDs
      aliceRegs.data.forEach((r) => expect(r.userId).toBe("U005"));
      bobRegs.data.forEach((r) => expect(r.userId).toBe("U010"));
    });
  });

  // ============= Entity Roles Tests =============
  describe("Entity Roles", () => {
    it("should fetch institute roles", async () => {
      const result = await fetchEntityRoles("institute");
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((r) => expect(r.entityType).toBe("institute"));
    });

    it("should fetch consultancy roles including counselor, visa officer, etc.", async () => {
      const result = await fetchEntityRoles("consultancy");
      const roleNames = result.data.map((r) => r.name);
      expect(roleNames).toContain("Counselor");
      expect(roleNames).toContain("Visa Officer");
      expect(roleNames).toContain("Language Instructor");
      expect(roleNames).toContain("Client");
      expect(roleNames).toContain("Operations Manager");
    });

    it("should fetch company roles including HR, recruiter, interviewer", async () => {
      const result = await fetchEntityRoles("company");
      const roleNames = result.data.map((r) => r.name);
      expect(roleNames).toContain("HR Manager");
      expect(roleNames).toContain("Recruiter");
      expect(roleNames).toContain("Interviewer");
      expect(roleNames).toContain("Applicant");
    });

    it("should not allow deleting default system roles", async () => {
      await expect(deleteEntityRole("IR_OWNER")).rejects.toThrow("Cannot delete default");
    });

    it("should not allow modifying default system roles", async () => {
      await expect(updateEntityRole("CR_OWNER", { name: "Changed" })).rejects.toThrow("Cannot modify default");
    });

    it("should prevent duplicate role names", async () => {
      await expect(
        createEntityRole({
          entityType: "institute", entityId: "1",
          name: "Instructor", description: "Duplicate",
          permissions: ["dashboard"], isDefault: false,
          createdBy: "U002", createdByName: "Jane Smith",
        })
      ).rejects.toThrow("already exists");
    });

    it("should create custom entity role", async () => {
      const result = await createEntityRole({
        entityType: "institute", entityId: "1",
        name: "Teaching Assistant", description: "Help instructors with course material",
        permissions: ["dashboard", "library", "lectures", "courses"],
        isDefault: false, createdBy: "U002", createdByName: "Jane Smith",
      });
      expect(result.data.name).toBe("Teaching Assistant");
      expect(result.data.userCount).toBe(0);
    });
  });

  // ============= Role Assignments Tests =============
  describe("Role Assignments", () => {
    it("should fetch assignments by entity", async () => {
      const result = await fetchRoleAssignments({ entityType: "institute", entityId: "1" });
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("should fetch assignments by user", async () => {
      const result = await fetchRoleAssignments({ userId: "U004" });
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((a) => expect(a.userId).toBe("U004"));
    });

    it("instructor should be assigned to specific courses only", async () => {
      const result = await fetchRoleAssignments({ userId: "U004", entityType: "institute" });
      result.data.forEach((a) => {
        expect(a.contextType).toBe("course");
        expect(a.contextName).toBeTruthy();
      });
    });

    it("should prevent duplicate context assignments", async () => {
      await expect(
        createRoleAssignment({
          userId: "U004", userName: "Sarah Wilson", userEmail: "sarah@techverse.com",
          roleId: "IR_INSTRUCTOR", roleName: "Instructor",
          entityType: "institute", entityId: "1", entityName: "TechVerse Academy",
          contextType: "course", contextId: "CRS001", contextName: "Full-Stack Development",
          assignedBy: "U002", assignedByName: "Jane Smith", status: "active",
        })
      ).rejects.toThrow("already assigned");
    });
  });

  // ============= Entity Permission Check =============
  describe("Permission Checks", () => {
    it("consultancy counselor should have visa_tracking permission", () => {
      expect(checkEntityPermission("CR_COUNSELOR", "visa_tracking")).toBe(true);
    });

    it("consultancy counselor should NOT have roles permission", () => {
      expect(checkEntityPermission("CR_COUNSELOR", "roles")).toBe(false);
    });

    it("company recruiter should have applications permission", () => {
      expect(checkEntityPermission("COMP_RECRUITER", "applications")).toBe(true);
    });

    it("company recruiter should NOT have vacancies permission", () => {
      expect(checkEntityPermission("COMP_RECRUITER", "vacancies")).toBe(false);
    });

    it("institute student should have library permission", () => {
      expect(checkEntityPermission("IR_STUDENT", "library")).toBe(true);
    });

    it("institute student should NOT have roles permission", () => {
      expect(checkEntityPermission("IR_STUDENT", "roles")).toBe(false);
    });
  });

  // ============= Featured Entities =============
  describe("Featured Entities", () => {
    it("should fetch featured institutes", async () => {
      const result = await fetchFeaturedEntities("institute");
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((f) => {
        expect(f.entityType).toBe("institute");
        expect(f.isActive).toBe(true);
      });
    });

    it("should fetch featured consultancies", async () => {
      const result = await fetchFeaturedEntities("consultancy");
      expect(result.data.length).toBeGreaterThan(0);
    });

    it("featured entities should be sorted by priority", async () => {
      const result = await fetchFeaturedEntities("institute");
      for (let i = 1; i < result.data.length; i++) {
        expect(result.data[i].priority).toBeGreaterThanOrEqual(result.data[i - 1].priority);
      }
    });

    it("only platform_owner can manage featured", () => {
      expect(canManageFeatured("platform_owner")).toBe(true);
      expect(canManageFeatured("institute_owner")).toBe(false);
      expect(canManageFeatured("student")).toBe(false);
    });

    it("should prevent featuring an already-featured entity", async () => {
      await expect(
        createFeaturedEntity({
          entityType: "institute", entityId: "1", entityName: "TechVerse Academy",
          featuredBy: "U001", priority: 1, isActive: true,
        })
      ).rejects.toThrow("already featured");
    });
  });

  // ============= Company Applications =============
  describe("Company Applications", () => {
    it("company should see only their applicants", async () => {
      const result = await fetchCompanyApplications({ companyId: "C001" });
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((a) => expect(a.companyId).toBe("C001"));
    });

    it("should filter applications by vacancy", async () => {
      const result = await fetchCompanyApplications({ companyId: "C001", vacancyId: "V001" });
      result.data.forEach((a) => expect(a.vacancyId).toBe("V001"));
    });

    it("should filter applications by status", async () => {
      const result = await fetchCompanyApplications({ companyId: "C001", status: "shortlisted" });
      result.data.forEach((a) => expect(a.status).toBe("shortlisted"));
    });

    it("should prevent duplicate applications", async () => {
      await expect(
        createCompanyApplication({
          companyId: "C001", companyName: "TechCorp",
          vacancyId: "V001", vacancyTitle: "Frontend Engineer",
          applicantId: "U005", applicantName: "Alice Johnson", applicantEmail: "alice@email.com",
          status: "applied",
        })
      ).rejects.toThrow("Already applied");
    });

    it("student can see their own applications across companies", async () => {
      const result = await fetchCompanyApplications({ applicantId: "U005" });
      expect(result.data.length).toBeGreaterThanOrEqual(2);
      result.data.forEach((a) => expect(a.applicantId).toBe("U005"));
    });
  });
});
