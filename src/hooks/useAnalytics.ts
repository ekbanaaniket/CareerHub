// ============= Analytics Hooks =============
import { useQuery } from "@tanstack/react-query";
import { fetchInstituteAnalytics } from "@/services/instituteAnalytics";
import { fetchConsultancyAnalytics } from "@/services/consultancyAnalytics";
import { fetchCompanyAnalytics } from "@/services/companyAnalytics";

export function useInstituteAnalytics() {
  return useQuery({
    queryKey: ["instituteAnalytics"],
    queryFn: () => fetchInstituteAnalytics(),
    select: (res) => res.data,
  });
}

export function useConsultancyAnalytics() {
  return useQuery({
    queryKey: ["consultancyAnalytics"],
    queryFn: () => fetchConsultancyAnalytics(),
    select: (res) => res.data,
  });
}

export function useCompanyAnalytics() {
  return useQuery({
    queryKey: ["companyAnalytics"],
    queryFn: () => fetchCompanyAnalytics(),
    select: (res) => res.data,
  });
}
