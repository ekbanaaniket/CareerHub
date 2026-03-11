import { useQuery } from "@tanstack/react-query";
import { fetchInstitutes } from "@/services/institutes";

export function useInstitutes(params?: { search?: string; city?: string }) {
  return useQuery({
    queryKey: ["institutes", params],
    queryFn: () => fetchInstitutes(params),
    select: (res) => res.data,
  });
}
