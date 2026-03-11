import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVisaApplications, createVisaApplication, updateVisaApplication, deleteVisaApplication,
  fetchUniversityApplications, createUniversityApplication, updateUniversityApplication, deleteUniversityApplication,
  fetchLanguageCourses, createLanguageCourse, updateLanguageCourse, deleteLanguageCourse,
  fetchCounselors, createCounselor, updateCounselor, deleteCounselor,
} from "@/services/consultancy";
import type { VisaApplication, UniversityApplication, LanguageCourse, Counselor } from "@/types";

// ============= Visa Hooks =============
export function useVisaApplications(instituteId?: string) {
  return useQuery({ queryKey: ["visa", instituteId], queryFn: () => fetchVisaApplications(instituteId), select: (r) => r.data });
}
export function useCreateVisa() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: Omit<VisaApplication, "id">) => createVisaApplication(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["visa"] }) });
}
export function useUpdateVisa() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<VisaApplication> }) => updateVisaApplication(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["visa"] }) });
}
export function useDeleteVisa() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteVisaApplication(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["visa"] }) });
}

// ============= University Hooks =============
export function useUniversityApplications(instituteId?: string) {
  return useQuery({ queryKey: ["university", instituteId], queryFn: () => fetchUniversityApplications(instituteId), select: (r) => r.data });
}
export function useCreateUniversity() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: Omit<UniversityApplication, "id">) => createUniversityApplication(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["university"] }) });
}
export function useUpdateUniversity() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<UniversityApplication> }) => updateUniversityApplication(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["university"] }) });
}
export function useDeleteUniversity() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteUniversityApplication(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["university"] }) });
}

// ============= Language Course Hooks =============
export function useLanguageCourses(instituteId?: string) {
  return useQuery({ queryKey: ["languageCourses", instituteId], queryFn: () => fetchLanguageCourses(instituteId), select: (r) => r.data });
}
export function useCreateLanguageCourse() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: Omit<LanguageCourse, "id">) => createLanguageCourse(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["languageCourses"] }) });
}
export function useUpdateLanguageCourse() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<LanguageCourse> }) => updateLanguageCourse(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["languageCourses"] }) });
}
export function useDeleteLanguageCourse() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteLanguageCourse(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["languageCourses"] }) });
}

// ============= Counselor Hooks =============
export function useCounselors(instituteId?: string) {
  return useQuery({ queryKey: ["counselors", instituteId], queryFn: () => fetchCounselors(instituteId), select: (r) => r.data });
}
export function useCreateCounselor() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: Omit<Counselor, "id">) => createCounselor(d), onSuccess: () => qc.invalidateQueries({ queryKey: ["counselors"] }) });
}
export function useUpdateCounselor() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Counselor> }) => updateCounselor(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ["counselors"] }) });
}
export function useDeleteCounselor() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => deleteCounselor(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["counselors"] }) });
}
