import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStudents, createStudent, updateStudent, deleteStudent } from "@/services/students";
import type { Student, SearchParams } from "@/types";

export function useStudents(params?: SearchParams) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => fetchStudents(params),
    select: (res) => res.data,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (student: Omit<Student, "id">) => createStudent(student),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) => updateStudent(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}
