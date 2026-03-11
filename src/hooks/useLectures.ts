import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLectures, createLecture } from "@/services/lectures";
import type { Lecture, SearchParams } from "@/types";

export function useLectures(params?: SearchParams) {
  return useQuery({
    queryKey: ["lectures", params],
    queryFn: () => fetchLectures(params),
    select: (res) => res.data,
  });
}

export function useCreateLecture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (lecture: Omit<Lecture, "id">) => createLecture(lecture),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["lectures"] }),
  });
}
