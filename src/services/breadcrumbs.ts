// ============= Breadcrumb Service =============
// Breadcrumb labels come from backend navigation config + this fallback map
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

// Segment-level fallback labels (for path segments not covered by nav items)
export interface BreadcrumbConfig {
  segmentLabels: Record<string, string>;
}

const breadcrumbConfig: BreadcrumbConfig = {
  segmentLabels: {
    dashboard: "Dashboard",
    students: "Students",
    tests: "Tests & Exams",
    progress: "Progress Reports",
    library: "Library",
    lectures: "Lectures",
    courses: "Courses",
    roles: "Roles & Permissions",
    settings: "Settings",
    attendance: "Attendance",
    fees: "Fees & Billing",
    vacancies: "Job Board",
    placements: "Placements",
    institutes: "Institutes",
    manage: "Manage",
    announcements: "Announcements",
    consultancy: "Consultancy",
    consultancies: "Consultancies",
    companies: "Companies",
    visa: "Visa Tracking",
    university: "University Applications",
    language: "Language Courses",
    counselors: "Counselors",
    featured: "Featured",
    profile: "My Profile",
    help: "Help & Support",
    browse: "Browse",
    my: "My",
    enrollment: "Enrollment",
    analytics: "Analytics",
    permissions: "Permission Management",
    applications: "Applications",
  },
};

export async function fetchBreadcrumbConfig(): Promise<ApiResponse<BreadcrumbConfig>> {
  return mockApiCall({ data: breadcrumbConfig });
}
