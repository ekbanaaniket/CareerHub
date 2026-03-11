import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTests, createTest, updateTest, deleteTest } from "@/services/tests";
import type { Test, SearchParams } from "@/types";

export function useTests(params?: SearchParams) {
  return useQuery({
    queryKey: ["tests", params],
    queryFn: () => fetchTests(params),
    select: (res) => res.data,
  });
}

export function useCreateTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (test: Omit<Test, "id">) => createTest(test),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tests"] }),
  });
}

export function useUpdateTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Test> }) => updateTest(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tests"] }),
  });
}

export function useDeleteTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tests"] }),
  });
}
