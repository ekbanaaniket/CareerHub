// ============= Company Analytics Service =============
import { mockApiCall } from "./api";
import type { ApiResponse, ChartDataPoint } from "@/types";

export interface CompanyAnalyticsStats {
  activeVacancies: number;
  vacancyChange: string;
  totalPlacements: number;
  placementChange: string;
  avgTimeToHire: string;
  hireTimeChange: string;
  placementRate: number;
  rateChange: string;
}

export interface IndustryItem { name: string; value: number; color: string; }
export interface SalaryRange { range: string; count: number; }
export interface TopHiringCompany { name: string; positions: number; filled: number; industry: string; }
export interface JobTypeItem { type: string; count: number; }

export interface CompanyAnalyticsData {
  stats: CompanyAnalyticsStats;
  placementTrend: ChartDataPoint[];
  industryDistribution: IndustryItem[];
  salaryRanges: SalaryRange[];
  topHiringCompanies: TopHiringCompany[];
  jobTypeBreakdown: JobTypeItem[];
  hiringTimeline: ChartDataPoint[];
}

const mockData: CompanyAnalyticsData = {
  stats: {
    activeVacancies: 376, vacancyChange: "+42 this month",
    totalPlacements: 245, placementChange: "+38 this month",
    avgTimeToHire: "16 days", hireTimeChange: "-4 days improvement",
    placementRate: 78, rateChange: "+6% from last quarter",
  },
  placementTrend: [
    { month: "Sep", placed: 18, pending: 12 }, { month: "Oct", placed: 22, pending: 15 },
    { month: "Nov", placed: 28, pending: 10 }, { month: "Dec", placed: 15, pending: 8 },
    { month: "Jan", placed: 32, pending: 14 }, { month: "Feb", placed: 35, pending: 11 },
    { month: "Mar", placed: 38, pending: 16 },
  ],
  industryDistribution: [
    { name: "Technology", value: 35, color: "hsl(224, 76%, 63%)" },
    { name: "Finance", value: 20, color: "hsl(152, 55%, 50%)" },
    { name: "Healthcare", value: 15, color: "hsl(38, 92%, 50%)" },
    { name: "Education", value: 12, color: "hsl(280, 65%, 60%)" },
    { name: "Manufacturing", value: 10, color: "hsl(0, 84%, 60%)" },
    { name: "Other", value: 8, color: "hsl(220, 9%, 60%)" },
  ],
  salaryRanges: [
    { range: "$30-40k", count: 25 }, { range: "$40-50k", count: 45 },
    { range: "$50-60k", count: 62 }, { range: "$60-70k", count: 48 },
    { range: "$70-80k", count: 35 }, { range: "$80k+", count: 30 },
  ],
  topHiringCompanies: [
    { name: "TechCorp", positions: 45, filled: 38, industry: "Technology" },
    { name: "FinanceHub", positions: 32, filled: 28, industry: "Finance" },
    { name: "HealthFirst", positions: 28, filled: 22, industry: "Healthcare" },
    { name: "EduTech Pro", positions: 25, filled: 20, industry: "Education" },
    { name: "BuildRight", positions: 22, filled: 18, industry: "Manufacturing" },
  ],
  jobTypeBreakdown: [
    { type: "Full-time", count: 156 },
    { type: "Part-time", count: 45 },
    { type: "Internship", count: 78 },
    { type: "Contract", count: 32 },
    { type: "Remote", count: 65 },
  ],
  hiringTimeline: [
    { month: "Sep", avgDays: 28 }, { month: "Oct", avgDays: 25 },
    { month: "Nov", avgDays: 22 }, { month: "Dec", avgDays: 30 },
    { month: "Jan", avgDays: 20 }, { month: "Feb", avgDays: 18 },
    { month: "Mar", avgDays: 16 },
  ],
};

export async function fetchCompanyAnalytics(): Promise<ApiResponse<CompanyAnalyticsData>> {
  return mockApiCall({ data: mockData });
}
