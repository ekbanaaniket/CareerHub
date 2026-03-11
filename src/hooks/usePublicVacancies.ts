import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchVacancies, applyToVacancy } from "@/services/vacancies";
import type { SearchParams } from "@/types";

export function usePublicVacancies(params?: SearchParams & { type?: string; locationType?: string }) {
  return useQuery({
    queryKey: ["publicVacancies", params],
    queryFn: () => fetchVacancies(params),
    select: (r) => r.data,
  });
}

export function useApplyToVacancy() {
  return useMutation({
    mutationFn: ({ vacancyId, studentId, studentName }: { vacancyId: string; studentId: string; studentName: string }) =>
      applyToVacancy(vacancyId, studentId, studentName),
  });
}
