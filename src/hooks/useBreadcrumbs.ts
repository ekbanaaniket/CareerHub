// ============= Breadcrumb Hook =============
import { useQuery } from "@tanstack/react-query";
import { fetchBreadcrumbConfig } from "@/services/breadcrumbs";

export function useBreadcrumbConfig() {
  return useQuery({
    queryKey: ["breadcrumbConfig"],
    queryFn: () => fetchBreadcrumbConfig(),
    select: (res) => res.data,
    staleTime: Infinity,
  });
}
