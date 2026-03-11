import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/services/announcements";
import type { Announcement } from "@/types";

export function useAnnouncements(instituteId?: string) {
  return useQuery({
    queryKey: ["announcements", instituteId],
    queryFn: () => fetchAnnouncements(instituteId),
    select: (res) => res.data,
  });
}

export function useCreateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Announcement, "id">) => createAnnouncement(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useUpdateAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Announcement> }) => updateAnnouncement(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}
