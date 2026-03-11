import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPlacements, fetchPlacementDrives, createPlacement, createPlacementDrive, updatePlacement } from "@/services/placements";
import type { Placement, PlacementDrive, SearchParams } from "@/types";

export function usePlacements(params?: SearchParams) {
  return useQuery({
    queryKey: ["placements", params],
    queryFn: () => fetchPlacements(params),
    select: (res) => res.data,
  });
}

export function usePlacementDrives(instituteId?: string) {
  return useQuery({
    queryKey: ["placementDrives", instituteId],
    queryFn: () => fetchPlacementDrives(instituteId),
    select: (res) => res.data,
  });
}

export function useCreatePlacement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (placement: Omit<Placement, "id">) => createPlacement(placement),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["placements"] }),
  });
}

export function useCreatePlacementDrive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (drive: Omit<PlacementDrive, "id">) => createPlacementDrive(drive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["placementDrives"] }),
  });
}

export function useUpdatePlacement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Placement> }) => updatePlacement(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["placements"] }),
  });
}
