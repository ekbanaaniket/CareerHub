import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFeaturedEntities, toggleFeatured, updateFeaturedBadge } from "@/services/featured";

export function useFeaturedEntities(entityType?: string) {
  return useQuery({
    queryKey: ["featured", entityType],
    queryFn: () => fetchFeaturedEntities(entityType),
    select: (res) => res.data,
  });
}

export function useToggleFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, featured, badge }: { id: string; featured: boolean; badge?: string }) =>
      toggleFeatured(id, featured, badge),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["featured"] }),
  });
}

export function useUpdateFeaturedBadge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, badge }: { id: string; badge: string }) => updateFeaturedBadge(id, badge),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["featured"] }),
  });
}
