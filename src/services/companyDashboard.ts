// ============= Company Dashboard Service =============
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface CompanyApplicant {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  appliedDate: string;
  status: "applied" | "shortlisted" | "interviewing" | "selected" | "rejected";
  resumeUrl?: string;
  experience: string;
  skills: string[];
  matchScore: number;
}

export interface CompanyStats {
  totalVacancies: number;
  activeVacancies: number;
  totalApplicants: number;
  shortlisted: number;
  selected: number;
  interviewsScheduled: number;
  avgTimeToHire: string;
  offerAcceptRate: number;
}

export interface CompanyVacancySummary {
  id: string;
  title: string;
  status: "active" | "closed" | "draft";
  applicants: number;
  shortlisted: number;
  selected: number;
  postedDate: string;
  deadline: string;
}

export interface CompanyDashboardData {
  stats: CompanyStats;
  applicants: CompanyApplicant[];
  vacancies: CompanyVacancySummary[];
  recentActivity: { action: string; applicant: string; vacancy: string; time: string; type: "success" | "info" | "warning" }[];
}

const mockCompanyDashboard: CompanyDashboardData = {
  stats: {
    totalVacancies: 8,
    activeVacancies: 5,
    totalApplicants: 342,
    shortlisted: 48,
    selected: 12,
    interviewsScheduled: 15,
    avgTimeToHire: "18 days",
    offerAcceptRate: 85,
  },
  applicants: [
    { id: "CA1", vacancyId: "V001", vacancyTitle: "Frontend Engineer", studentId: "S001", studentName: "Alice Johnson", studentEmail: "alice@email.com", appliedDate: "2026-02-22", status: "shortlisted", experience: "1 year", skills: ["React", "TypeScript", "CSS"], matchScore: 92 },
    { id: "CA2", vacancyId: "V001", vacancyTitle: "Frontend Engineer", studentId: "S004", studentName: "David Lee", studentEmail: "david@email.com", appliedDate: "2026-02-23", status: "interviewing", experience: "2 years", skills: ["React", "Node.js", "GraphQL"], matchScore: 88 },
    { id: "CA3", vacancyId: "V002", vacancyTitle: "Full-Stack Developer", studentId: "S002", studentName: "Bob Smith", studentEmail: "bob@email.com", appliedDate: "2026-02-20", status: "applied", experience: "Fresh Graduate", skills: ["Node.js", "React", "SQL"], matchScore: 75 },
    { id: "CA4", vacancyId: "V001", vacancyTitle: "Frontend Engineer", studentId: "S005", studentName: "Eva Martinez", studentEmail: "eva@email.com", appliedDate: "2026-02-25", status: "applied", experience: "6 months", skills: ["React", "CSS", "JavaScript"], matchScore: 70 },
    { id: "CA5", vacancyId: "V003", vacancyTitle: "Backend Intern", studentId: "S007", studentName: "Grace Kim", studentEmail: "grace@email.com", appliedDate: "2026-02-26", status: "selected", experience: "Intern", skills: ["Python", "PostgreSQL", "Docker"], matchScore: 95 },
    { id: "CA6", vacancyId: "V002", vacancyTitle: "Full-Stack Developer", studentId: "S008", studentName: "Henry Brown", studentEmail: "henry@email.com", appliedDate: "2026-02-28", status: "rejected", experience: "1 year", skills: ["Vue.js", "PHP", "MySQL"], matchScore: 45 },
  ],
  vacancies: [
    { id: "V001", title: "Frontend Engineer", status: "active", applicants: 42, shortlisted: 8, selected: 2, postedDate: "2026-02-20", deadline: "2026-04-15" },
    { id: "V002", title: "Full-Stack Developer", status: "active", applicants: 38, shortlisted: 5, selected: 1, postedDate: "2026-02-18", deadline: "2026-04-10" },
    { id: "V003", title: "Backend Intern", status: "active", applicants: 85, shortlisted: 12, selected: 3, postedDate: "2026-02-15", deadline: "2026-03-30" },
    { id: "V004", title: "SDE-1", status: "active", applicants: 120, shortlisted: 15, selected: 4, postedDate: "2026-02-25", deadline: "2026-04-20" },
    { id: "V005", title: "UI Engineer", status: "closed", applicants: 95, shortlisted: 8, selected: 2, postedDate: "2026-01-15", deadline: "2026-03-20" },
  ],
  recentActivity: [
    { action: "Application received", applicant: "Alice Johnson", vacancy: "Frontend Engineer", time: "2 min ago", type: "info" },
    { action: "Shortlisted", applicant: "David Lee", vacancy: "Frontend Engineer", time: "1 hr ago", type: "success" },
    { action: "Interview scheduled", applicant: "Bob Smith", vacancy: "Full-Stack Developer", time: "3 hrs ago", type: "warning" },
    { action: "Selected", applicant: "Grace Kim", vacancy: "Backend Intern", time: "1 day ago", type: "success" },
    { action: "Rejected", applicant: "Henry Brown", vacancy: "Full-Stack Developer", time: "2 days ago", type: "info" },
  ],
};

export async function fetchCompanyDashboard(_companyId: string): Promise<ApiResponse<CompanyDashboardData>> {
  return mockApiCall({ data: mockCompanyDashboard });
}

export async function updateApplicationStatus(applicationId: string, status: string): Promise<ApiResponse<CompanyApplicant>> {
  const applicant = mockCompanyDashboard.applicants.find((a) => a.id === applicationId);
  if (!applicant) throw new Error("Applicant not found");
  applicant.status = status as any;
  return mockApiCall({ data: applicant, message: `Status updated to ${status}` });
}
