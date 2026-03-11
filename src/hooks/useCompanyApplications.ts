// ============= Company Applications Hook =============
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCompanyApplications, updateApplicantStatus } from "@/services/companyApplications";
import type { ApplicantDetail } from "@/services/companyApplications";

export function useCompanyApplications() {
  return useQuery({
    queryKey: ["companyApplications"],
    queryFn: () => fetchCompanyApplications(),
    select: (res) => res.data,
  });
}

export function useUpdateApplicantStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicantId, status }: { applicantId: string; status: ApplicantDetail["status"] }) =>
      updateApplicantStatus(applicantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyApplications"] });
    },
  });
}
