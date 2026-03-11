// ============= Consultancy Analytics Service =============
import { mockApiCall } from "./api";
import type { ApiResponse, ChartDataPoint } from "@/types";

export interface ConsultancyAnalyticsStats {
  totalVisaApps: number;
  visaChange: string;
  universityApps: number;
  uniChange: string;
  languageStudents: number;
  langChange: string;
  activeCounselors: number;
  counselorRate: string;
}

export interface VisaStatusItem { name: string; value: number; color: string; }
export interface Destination { country: string; apps: number; acceptance: number; }
export interface LanguageEnrollmentItem { language: string; students: number; avgScore: string | number; }
export interface CounselorPerf { name: string; clients: number; successRate: number; pending: number; }

export interface ConsultancyAnalyticsData {
  stats: ConsultancyAnalyticsStats;
  visaStatus: VisaStatusItem[];
  universityAppsTrend: ChartDataPoint[];
  topDestinations: Destination[];
  languageEnrollment: LanguageEnrollmentItem[];
  counselorPerformance: CounselorPerf[];
  monthlyRevenue: ChartDataPoint[];
}

const mockData: ConsultancyAnalyticsData = {
  stats: {
    totalVisaApps: 156, visaChange: "+23 this month",
    universityApps: 505, uniChange: "75 accepted this month",
    languageStudents: 673, langChange: "+45 enrolled",
    activeCounselors: 18, counselorRate: "92% avg success rate",
  },
  visaStatus: [
    { name: "Approved", value: 68, color: "hsl(152, 55%, 50%)" },
    { name: "Pending", value: 45, color: "hsl(38, 92%, 50%)" },
    { name: "Under Review", value: 28, color: "hsl(224, 76%, 63%)" },
    { name: "Rejected", value: 15, color: "hsl(0, 84%, 60%)" },
  ],
  universityAppsTrend: [
    { month: "Sep", submitted: 45, accepted: 32, rejected: 8 },
    { month: "Oct", submitted: 62, accepted: 41, rejected: 12 },
    { month: "Nov", submitted: 78, accepted: 55, rejected: 10 },
    { month: "Dec", submitted: 35, accepted: 28, rejected: 5 },
    { month: "Jan", submitted: 88, accepted: 62, rejected: 14 },
    { month: "Feb", submitted: 95, accepted: 70, rejected: 11 },
    { month: "Mar", submitted: 102, accepted: 75, rejected: 13 },
  ],
  topDestinations: [
    { country: "🇺🇸 USA", apps: 145, acceptance: 72 },
    { country: "🇬🇧 UK", apps: 120, acceptance: 78 },
    { country: "🇨🇦 Canada", apps: 98, acceptance: 85 },
    { country: "🇦🇺 Australia", apps: 87, acceptance: 80 },
    { country: "🇩🇪 Germany", apps: 65, acceptance: 82 },
    { country: "🇳🇿 New Zealand", apps: 42, acceptance: 88 },
  ],
  languageEnrollment: [
    { language: "English (IELTS)", students: 320, avgScore: 7.2 },
    { language: "English (TOEFL)", students: 185, avgScore: 95 },
    { language: "German", students: 78, avgScore: "B1" },
    { language: "French", students: 56, avgScore: "B2" },
    { language: "Japanese", students: 34, avgScore: "N3" },
  ],
  counselorPerformance: [
    { name: "Priya Sharma", clients: 45, successRate: 92, pending: 8 },
    { name: "Ravi Kumar", clients: 38, successRate: 88, pending: 12 },
    { name: "Anjali Patel", clients: 42, successRate: 90, pending: 5 },
    { name: "Vikram Singh", clients: 35, successRate: 85, pending: 10 },
  ],
  monthlyRevenue: [
    { month: "Sep", revenue: 45000 }, { month: "Oct", revenue: 52000 },
    { month: "Nov", revenue: 48000 }, { month: "Dec", revenue: 38000 },
    { month: "Jan", revenue: 58000 }, { month: "Feb", revenue: 62000 },
    { month: "Mar", revenue: 67000 },
  ],
};

export async function fetchConsultancyAnalytics(): Promise<ApiResponse<ConsultancyAnalyticsData>> {
  return mockApiCall({ data: mockData });
}
