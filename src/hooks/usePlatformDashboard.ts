// ============= Platform Dashboard Hook =============
import { useQuery } from "@tanstack/react-query";
import { fetchPlatformDashboard } from "@/services/platformDashboard";

export function usePlatformDashboard() {
  return useQuery({
    queryKey: ["platformDashboard"],
    queryFn: () => fetchPlatformDashboard(),
    select: (res) => res.data,
  });
}
