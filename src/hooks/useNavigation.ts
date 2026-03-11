// ============= Navigation Hook =============
import { useQuery } from "@tanstack/react-query";
import { fetchNavigation, buildRouteLabelMap } from "@/services/navigation";
import type { AppRole } from "@/config/roles";
import { useMemo } from "react";

export function useNavigation(role?: AppRole, instituteId?: string, instructorId?: string) {
  const query = useQuery({
    queryKey: ["navigation", role, instituteId, instructorId],
    queryFn: () => fetchNavigation(role!, instituteId, instructorId),
    enabled: !!role,
    select: (res) => res.data,
  });

  const routeLabels = useMemo(() => {
    if (!query.data?.groups) return {};
    return buildRouteLabelMap(query.data.groups);
  }, [query.data]);

  return { ...query, routeLabels };
}
