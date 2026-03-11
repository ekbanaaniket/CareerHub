import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBooks, fetchMaterials, createBook, createMaterial } from "@/services/library";
import type { Book, StudyMaterial, SearchParams } from "@/types";

export function useBooks(params?: SearchParams) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => fetchBooks(params),
    select: (res) => res.data,
  });
}

export function useMaterials(params?: SearchParams) {
  return useQuery({
    queryKey: ["materials", params],
    queryFn: () => fetchMaterials(params),
    select: (res) => res.data,
  });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (book: Omit<Book, "id">) => createBook(book),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useCreateMaterial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (material: Omit<StudyMaterial, "id">) => createMaterial(material),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["materials"] }),
  });
}
