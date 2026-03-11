// ============= Platform Owner Dashboard Service =============
import { mockApiCall } from "./api";
import type { ApiResponse, ChartDataPoint } from "@/types";

export interface PlatformStats {
  totalInstitutes: number;
  totalConsultancies: number;
  totalCompanies: number;
  totalStudents: number;
  activeCourses: number;
  visaApplications: number;
  visaPending: number;
  totalPlacements: number;
  placementsChangePercent: number;
}

export interface EntityDistributionItem {
  name: string;
  value: number;
  color: string;
}

export interface FlaggedEntity {
  name: string;
  type: string;
  issue: string;
  severity: "warning" | "destructive";
}

export interface AnalyticsLink {
  title: string;
  description: string;
  path: string;
  iconName: string;
  color: string;
}

export interface PlatformDashboardData {
  stats: PlatformStats;
  entityDistribution: EntityDistributionItem[];
  platformGrowth: ChartDataPoint[];
  revenueData: ChartDataPoint[];
  flaggedEntities: FlaggedEntity[];
  analyticsLinks: AnalyticsLink[];
}

const mockPlatformDashboard: PlatformDashboardData = {
  stats: {
    totalInstitutes: 12,
    totalConsultancies: 8,
    totalCompanies: 25,
    totalStudents: 3420,
    activeCourses: 87,
    visaApplications: 156,
    visaPending: 34,
    totalPlacements: 245,
    placementsChangePercent: 18,
  },
  entityDistribution: [
    { name: "Institutes", value: 12, color: "hsl(224, 76%, 63%)" },
    { name: "Consultancies", value: 8, color: "hsl(152, 55%, 50%)" },
    { name: "Companies", value: 25, color: "hsl(38, 92%, 50%)" },
  ],
  platformGrowth: [
    { month: "Oct", institutes: 8, consultancies: 5, companies: 15 },
    { month: "Nov", institutes: 9, consultancies: 6, companies: 18 },
    { month: "Dec", institutes: 10, consultancies: 7, companies: 20 },
    { month: "Jan", institutes: 11, consultancies: 7, companies: 22 },
    { month: "Feb", institutes: 12, consultancies: 8, companies: 24 },
    { month: "Mar", institutes: 12, consultancies: 8, companies: 25 },
  ],
  revenueData: [
    { month: "Oct", revenue: 125000 },
    { month: "Nov", revenue: 138000 },
    { month: "Dec", revenue: 112000 },
    { month: "Jan", revenue: 145000 },
    { month: "Feb", revenue: 158000 },
    { month: "Mar", revenue: 172000 },
  ],
  flaggedEntities: [
    { name: "Digital Skills Hub", type: "Institute", issue: "Low attendance rate (45%)", severity: "warning" },
    { name: "StudyAbroad Pro", type: "Consultancy", issue: "3 pending complaints", severity: "destructive" },
    { name: "Stripe", type: "Company", issue: "Overdue placement reports", severity: "warning" },
  ],
  analyticsLinks: [
    { title: "Institute Analytics", description: "Enrollment, performance, attendance & course insights", path: "/analytics/institutes", iconName: "Building2", color: "hsl(224, 76%, 63%)" },
    { title: "Consultancy Analytics", description: "Visa tracking, university apps & counselor metrics", path: "/analytics/consultancies", iconName: "Globe", color: "hsl(152, 55%, 50%)" },
    { title: "Company Analytics", description: "Placements, hiring trends & salary distribution", path: "/analytics/companies", iconName: "Briefcase", color: "hsl(38, 92%, 50%)" },
  ],
};

export async function fetchPlatformDashboard(): Promise<ApiResponse<PlatformDashboardData>> {
  return mockApiCall({ data: mockPlatformDashboard });
}
