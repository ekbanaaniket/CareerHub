import { useQuery } from "@tanstack/react-query";
import { fetchStudentDashboard } from "@/services/studentDashboard";

export function useStudentDashboard(studentId: string, instituteId?: string) {
  return useQuery({
    queryKey: ["studentDashboard", studentId, instituteId],
    queryFn: () => fetchStudentDashboard(studentId, instituteId),
    select: (res) => res.data,
    enabled: !!studentId,
  });
}
