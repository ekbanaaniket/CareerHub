import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCompanyDashboard, updateApplicationStatus } from "@/services/companyDashboard";

export function useCompanyDashboard(companyId: string) {
  return useQuery({
    queryKey: ["companyDashboard", companyId],
    queryFn: () => fetchCompanyDashboard(companyId),
    select: (res) => res.data,
    enabled: !!companyId,
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: string }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["companyDashboard"] }),
  });
}
