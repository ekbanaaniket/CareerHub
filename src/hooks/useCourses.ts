import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCourses, createCourse, updateCourse } from "@/services/courses";
import type { Course } from "@/types";

export function useCourses(instituteId?: string) {
  return useQuery({
    queryKey: ["courses", instituteId],
    queryFn: () => fetchCourses(instituteId),
    select: (res) => res.data,
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (course: Omit<Course, "id">) => createCourse(course),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) => updateCourse(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}
