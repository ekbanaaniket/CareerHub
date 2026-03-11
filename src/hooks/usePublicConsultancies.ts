import { useQuery } from "@tanstack/react-query";
import { fetchPublicConsultancies, fetchPublicConsultancyById } from "@/services/publicConsultancies";

export function usePublicConsultancies(params?: { 
  search?: string; 
  country?: string;
  specialization?: string;
  city?: string;
  minRating?: number;
}) {
  return useQuery({
    queryKey: ["publicConsultancies", params],
    queryFn: () => fetchPublicConsultancies(params),
    select: (r) => r.data,
  });
}

export function usePublicConsultancyById(id: string) {
  return useQuery({
    queryKey: ["publicConsultancy", id],
    queryFn: () => fetchPublicConsultancyById(id),
    select: (r) => r.data,
    enabled: !!id,
  });
}
