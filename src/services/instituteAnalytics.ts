// ============= Institute Analytics Service =============
import { mockApiCall } from "./api";
import type { ApiResponse, ChartDataPoint } from "@/types";

export interface InstituteAnalyticsStats {
  totalEnrollment: number;
  enrollmentChange: string;
  activeCourses: number;
  coursesChange: string;
  avgCompletionRate: number;
  completionChange: string;
  avgAttendance: number;
  attendanceChange: string;
}

export interface CoursePopularity {
  name: string;
  students: number;
  completion: number;
}

export interface PerformanceDistItem {
  name: string;
  value: number;
  color: string;
}

export interface RadarDataPoint {
  subject: string;
  A: number;
}

export interface TopPerformer {
  name: string;
  course: string;
  score: number;
  trend: "up" | "down" | "stable";
}

export interface InstituteAnalyticsData {
  stats: InstituteAnalyticsStats;
  enrollmentTrend: ChartDataPoint[];
  performanceDistribution: PerformanceDistItem[];
  coursePopularity: CoursePopularity[];
  radarData: RadarDataPoint[];
  attendanceByMonth: ChartDataPoint[];
  topPerformers: TopPerformer[];
}

const mockData: InstituteAnalyticsData = {
  stats: {
    totalEnrollment: 3420,
    enrollmentChange: "+142 this month",
    activeCourses: 87,
    coursesChange: "12 new this quarter",
    avgCompletionRate: 72,
    completionChange: "+4% from last month",
    avgAttendance: 91,
    attendanceChange: "+2% improvement",
  },
  enrollmentTrend: [
    { month: "Sep", new: 120, dropped: 8 }, { month: "Oct", new: 95, dropped: 12 },
    { month: "Nov", new: 78, dropped: 5 }, { month: "Dec", new: 45, dropped: 15 },
    { month: "Jan", new: 110, dropped: 7 }, { month: "Feb", new: 130, dropped: 10 },
    { month: "Mar", new: 142, dropped: 6 },
  ],
  performanceDistribution: [
    { name: "A+ (90-100)", value: 18, color: "hsl(152, 55%, 50%)" },
    { name: "A (80-89)", value: 28, color: "hsl(152, 55%, 65%)" },
    { name: "B (70-79)", value: 25, color: "hsl(224, 76%, 63%)" },
    { name: "C (60-69)", value: 18, color: "hsl(38, 92%, 50%)" },
    { name: "D (<60)", value: 11, color: "hsl(0, 84%, 60%)" },
  ],
  coursePopularity: [
    { name: "React & TypeScript", students: 245, completion: 78 },
    { name: "Python ML", students: 198, completion: 65 },
    { name: "Data Science", students: 176, completion: 72 },
    { name: "UI/UX Design", students: 156, completion: 85 },
    { name: "Node.js Backend", students: 134, completion: 60 },
    { name: "DevOps", students: 98, completion: 55 },
  ],
  radarData: [
    { subject: "Attendance", A: 92 }, { subject: "Test Scores", A: 78 },
    { subject: "Assignments", A: 85 }, { subject: "Participation", A: 70 },
    { subject: "Course Completion", A: 88 }, { subject: "Satisfaction", A: 82 },
  ],
  attendanceByMonth: [
    { month: "Sep", rate: 94 }, { month: "Oct", rate: 91 }, { month: "Nov", rate: 88 },
    { month: "Dec", rate: 82 }, { month: "Jan", rate: 90 }, { month: "Feb", rate: 93 },
    { month: "Mar", rate: 95 },
  ],
  topPerformers: [
    { name: "Alice Johnson", course: "React & TypeScript", score: 98, trend: "up" },
    { name: "Bob Chen", course: "Python ML", score: 96, trend: "up" },
    { name: "Carol Davis", course: "Data Science", score: 95, trend: "stable" },
    { name: "David Kim", course: "UI/UX Design", score: 94, trend: "up" },
    { name: "Eva Martinez", course: "Node.js Backend", score: 93, trend: "down" },
  ],
};

export async function fetchInstituteAnalytics(): Promise<ApiResponse<InstituteAnalyticsData>> {
  return mockApiCall({ data: mockData });
}
