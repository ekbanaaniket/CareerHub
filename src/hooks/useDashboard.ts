import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchRecentActivities, fetchPerformanceData, fetchAttendanceData } from "@/services/dashboard";

export function useDashboardStats(instituteId?: string) {
  return useQuery({
    queryKey: ["dashboardStats", instituteId],
    queryFn: () => fetchDashboardStats(instituteId),
    select: (res) => res.data,
  });
}

export function useRecentActivities(instituteId?: string) {
  return useQuery({
    queryKey: ["recentActivities", instituteId],
    queryFn: () => fetchRecentActivities(instituteId),
    select: (res) => res.data,
  });
}

export function usePerformanceData(instituteId?: string) {
  return useQuery({
    queryKey: ["performanceData", instituteId],
    queryFn: () => fetchPerformanceData(instituteId),
    select: (res) => res.data,
  });
}

export function useAttendanceData(instituteId?: string) {
  return useQuery({
    queryKey: ["attendanceData", instituteId],
    queryFn: () => fetchAttendanceData(instituteId),
    select: (res) => res.data,
  });
}
