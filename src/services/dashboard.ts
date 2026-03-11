import { mockApiCall } from "./api";
import type { DashboardStats, ActivityItem, ChartDataPoint, ApiResponse } from "@/types";

const mockStats: DashboardStats = {
  totalStudents: 1284,
  activeCourses: 24,
  testsConducted: 156,
  avgPerformance: 82,
  totalPlacements: 45,
};

const mockActivities: ActivityItem[] = [
  { student: "Alice Johnson", action: "Submitted Quiz: JavaScript Basics", time: "2 min ago", status: "success" },
  { student: "Bob Smith", action: "Enrolled in Advanced React Course", time: "15 min ago", status: "info" },
  { student: "Carol Davis", action: "Failed Exam: Data Structures", time: "1 hr ago", status: "destructive" },
  { student: "David Lee", action: "Completed Module: Git Workflow", time: "2 hrs ago", status: "success" },
  { student: "Eva Martinez", action: "Requested book: Clean Code", time: "3 hrs ago", status: "warning" },
];

const mockPerformanceData: ChartDataPoint[] = [
  { month: "Jan", avg: 72 }, { month: "Feb", avg: 75 }, { month: "Mar", avg: 78 },
  { month: "Apr", avg: 74 }, { month: "May", avg: 82 }, { month: "Jun", avg: 85 },
];

const mockAttendanceData: ChartDataPoint[] = [
  { day: "Mon", present: 92 }, { day: "Tue", present: 88 }, { day: "Wed", present: 95 },
  { day: "Thu", present: 90 }, { day: "Fri", present: 87 }, { day: "Sat", present: 78 },
];

export async function fetchDashboardStats(instituteId?: string): Promise<ApiResponse<DashboardStats>> {
  return mockApiCall({ data: mockStats });
}

export async function fetchRecentActivities(instituteId?: string): Promise<ApiResponse<ActivityItem[]>> {
  return mockApiCall({ data: mockActivities });
}

export async function fetchPerformanceData(instituteId?: string): Promise<ApiResponse<ChartDataPoint[]>> {
  return mockApiCall({ data: mockPerformanceData });
}

export async function fetchAttendanceData(instituteId?: string): Promise<ApiResponse<ChartDataPoint[]>> {
  return mockApiCall({ data: mockAttendanceData });
}
