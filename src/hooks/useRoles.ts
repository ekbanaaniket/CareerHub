import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRoles, createRole, updateRole, deleteRole, fetchTeamMembers, updateTeamMemberRole, fetchRolesByCategory, fetchTeamMembersByCategory, validateInstructorExclusivity, registerUserToEntity, getUserRegistrations } from "@/services/roles";
import type { RoleCategory } from "@/services/roles";
import type { Role, TeamMember } from "@/types";

export function useRoles(instituteId?: string) {
  return useQuery({
    queryKey: ["roles", instituteId],
    queryFn: () => fetchRoles(instituteId),
    select: (res) => res.data,
  });
}

export function useRolesByCategory(category: RoleCategory) {
  return useQuery({
    queryKey: ["roles", "category", category],
    queryFn: () => fetchRolesByCategory(category),
    select: (res) => res.data,
  });
}

export function useTeamMembers(instituteId?: string) {
  return useQuery({
    queryKey: ["teamMembers", instituteId],
    queryFn: () => fetchTeamMembers(instituteId),
    select: (res) => res.data,
  });
}

export function useTeamMembersByCategory(category: RoleCategory) {
  return useQuery({
    queryKey: ["teamMembers", "category", category],
    queryFn: () => fetchTeamMembersByCategory(category),
    select: (res) => res.data,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (role: Omit<Role, "id">) => createRole(role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) => updateRole(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roles"] }),
  });
}

export function useUpdateTeamMemberRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, newRole }: { memberId: string; newRole: string }) => updateTeamMemberRole(memberId, newRole),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teamMembers"] }),
  });
}

export function useValidateInstructorExclusivity() {
  return {
    validate: (userId: string, entityType: "institute" | "consultancy", entityId: string) =>
      validateInstructorExclusivity(userId, entityType, entityId),
  };
}

export function useRegisterUserToEntity() {
  return {
    register: (userId: string, entityType: "institute" | "consultancy" | "company", entityId: string, role: string) =>
      registerUserToEntity(userId, entityType, entityId, role),
  };
}

export function useUserRegistrations(userId: string) {
  return useQuery({
    queryKey: ["userRegistrations", userId],
    queryFn: () => getUserRegistrations(userId),
    enabled: !!userId,
  });
}
