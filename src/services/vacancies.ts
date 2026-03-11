// ============= Vacancies / Job Board Service =============
// Only vacancies from ACTIVE companies are returned to public/student views
import { mockApiCall } from "./api";
import type { ApiResponse, SearchParams } from "@/types";

// Suspended company IDs — in real backend this would be a JOIN filter
const SUSPENDED_COMPANY_IDS = ["C006"]; // Meta is suspended

export interface Vacancy {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  positions: number;
  location: string;
  locationType: "onsite" | "remote" | "hybrid";
  salary: string;
  skills: string[];
  deadline: string;
  status: "active" | "closed" | "draft";
  applicants: number;
  postedDate: string;
  experience: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  isFeatured?: boolean;
}

export interface VacancyApplication {
  id: string;
  vacancyId: string;
  studentId: string;
  studentName: string;
  appliedDate: string;
  status: "applied" | "shortlisted" | "interviewing" | "selected" | "rejected";
  resumeUrl?: string;
}

const mockVacancies: Vacancy[] = [
  {
    id: "V001", companyId: "C001", companyName: "Google", title: "Frontend Engineer",
    description: "Build next-gen web applications with React and TypeScript at scale.",
    positions: 5, location: "Mountain View, CA", locationType: "hybrid", salary: "$130K - $180K",
    skills: ["React", "TypeScript", "CSS", "GraphQL"], deadline: "2026-04-15",
    status: "active", applicants: 42, postedDate: "2026-02-20", experience: "0-2 years", type: "full-time",
    isFeatured: true,
  },
  {
    id: "V002", companyId: "C002", companyName: "Microsoft", title: "Full-Stack Developer",
    description: "Work on Azure cloud services and developer tools.",
    positions: 3, location: "Seattle, WA", locationType: "onsite", salary: "$125K - $165K",
    skills: ["Node.js", "React", "Azure", "SQL"], deadline: "2026-04-10",
    status: "active", applicants: 38, postedDate: "2026-02-18", experience: "1-3 years", type: "full-time",
    isFeatured: true,
  },
  {
    id: "V003", companyId: "C003", companyName: "Stripe", title: "Backend Engineer Intern",
    description: "Join the payments infrastructure team for a 6-month internship.",
    positions: 10, location: "San Francisco, CA", locationType: "onsite", salary: "$8K/month",
    skills: ["Python", "Go", "PostgreSQL", "APIs"], deadline: "2026-03-30",
    status: "active", applicants: 85, postedDate: "2026-02-15", experience: "Students", type: "internship",
    isFeatured: true,
  },
  {
    id: "V004", companyId: "C004", companyName: "Amazon", title: "SDE-1",
    description: "Build highly scalable systems for AWS services.",
    positions: 8, location: "Remote", locationType: "remote", salary: "$140K - $175K",
    skills: ["Java", "AWS", "Distributed Systems", "Docker"], deadline: "2026-04-20",
    status: "active", applicants: 120, postedDate: "2026-02-25", experience: "0-2 years", type: "full-time",
    isFeatured: true,
  },
  {
    id: "V005", companyId: "C005", companyName: "Netflix", title: "UI Engineer",
    description: "Create delightful streaming experiences for millions of users.",
    positions: 2, location: "Los Gatos, CA", locationType: "hybrid", salary: "$150K - $200K",
    skills: ["React", "TypeScript", "Node.js", "A/B Testing"], deadline: "2026-03-20",
    status: "closed", applicants: 95, postedDate: "2026-01-15", experience: "2-5 years", type: "full-time",
  },
  {
    // This vacancy belongs to SUSPENDED company Meta — will be filtered out
    id: "V006", companyId: "C006", companyName: "Meta", title: "React Native Developer",
    description: "Build cross-platform mobile experiences for Instagram and WhatsApp.",
    positions: 4, location: "Menlo Park, CA", locationType: "hybrid", salary: "$135K - $185K",
    skills: ["React Native", "TypeScript", "iOS", "Android"], deadline: "2026-04-25",
    status: "active", applicants: 67, postedDate: "2026-03-01", experience: "1-3 years", type: "full-time",
    isFeatured: true,
  },
  {
    id: "V007", companyId: "C007", companyName: "Spotify", title: "Data Engineer",
    description: "Design and build data pipelines powering music recommendations.",
    positions: 3, location: "Stockholm, Sweden", locationType: "remote", salary: "$120K - $160K",
    skills: ["Python", "Spark", "Kafka", "Airflow"], deadline: "2026-04-18",
    status: "active", applicants: 53, postedDate: "2026-02-28", experience: "2-4 years", type: "full-time",
    isFeatured: true,
  },
  {
    id: "V008", companyId: "C008", companyName: "Airbnb", title: "Product Design Intern",
    description: "Join the design team to create world-class travel experiences.",
    positions: 6, location: "San Francisco, CA", locationType: "onsite", salary: "$7K/month",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"], deadline: "2026-04-12",
    status: "active", applicants: 112, postedDate: "2026-02-22", experience: "Students", type: "internship",
    isFeatured: true,
  },
  {
    id: "V009", companyId: "C009", companyName: "Salesforce", title: "DevOps Engineer",
    description: "Automate CI/CD pipelines and manage cloud infrastructure at scale.",
    positions: 2, location: "Indianapolis, IN", locationType: "hybrid", salary: "$115K - $155K",
    skills: ["Terraform", "Kubernetes", "Jenkins", "AWS"], deadline: "2026-04-08",
    status: "active", applicants: 28, postedDate: "2026-03-02", experience: "2-5 years", type: "full-time",
  },
  {
    id: "V010", companyId: "C010", companyName: "Shopify", title: "Ruby on Rails Developer",
    description: "Build e-commerce platform features used by millions of merchants.",
    positions: 5, location: "Remote", locationType: "remote", salary: "$110K - $150K",
    skills: ["Ruby", "Rails", "PostgreSQL", "Redis"], deadline: "2026-04-30",
    status: "active", applicants: 35, postedDate: "2026-03-03", experience: "1-3 years", type: "full-time",
  },
];

const mockApplications: VacancyApplication[] = [
  { id: "VA001", vacancyId: "V001", studentId: "S001", studentName: "Alice Johnson", appliedDate: "2026-02-22", status: "shortlisted" },
  { id: "VA002", vacancyId: "V001", studentId: "S004", studentName: "David Lee", appliedDate: "2026-02-23", status: "interviewing" },
  { id: "VA003", vacancyId: "V002", studentId: "S002", studentName: "Bob Smith", appliedDate: "2026-02-20", status: "applied" },
  { id: "VA004", vacancyId: "V003", studentId: "S005", studentName: "Eva Martinez", appliedDate: "2026-02-16", status: "selected" },
  { id: "VA005", vacancyId: "V004", studentId: "S007", studentName: "Grace Kim", appliedDate: "2026-02-26", status: "applied" },
];

// Vacancies from suspended companies are excluded at the service level
export async function fetchVacancies(params?: SearchParams & { type?: string; locationType?: string; includeAll?: boolean }): Promise<ApiResponse<Vacancy[]>> {
  let filtered = [...mockVacancies];

  // Unless includeAll is true (admin view), exclude suspended companies' vacancies
  if (!params?.includeAll) {
    filtered = filtered.filter((v) => !SUSPENDED_COMPANY_IDS.includes(v.companyId));
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((v) =>
      v.title.toLowerCase().includes(q) || v.companyName.toLowerCase().includes(q) ||
      v.skills.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((v) => v.status === params.status);
  if (params?.type && params.type !== "all") filtered = filtered.filter((v) => v.type === params.type);
  if (params?.locationType && params.locationType !== "all") filtered = filtered.filter((v) => v.locationType === params.locationType);
  if (params?.city) {
    const c = params.city.toLowerCase();
    filtered = filtered.filter((v) => v.location.toLowerCase().includes(c));
  }
  filtered.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return 0;
  });
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createVacancy(vacancy: Omit<Vacancy, "id" | "applicants" | "postedDate">): Promise<ApiResponse<Vacancy>> {
  const newVacancy: Vacancy = { ...vacancy, id: `V${String(mockVacancies.length + 1).padStart(3, "0")}`, applicants: 0, postedDate: new Date().toISOString().split("T")[0] };
  mockVacancies.push(newVacancy);
  return mockApiCall({ data: newVacancy, message: "Vacancy posted successfully" });
}

export async function updateVacancy(id: string, data: Partial<Vacancy>): Promise<ApiResponse<Vacancy>> {
  const idx = mockVacancies.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Vacancy not found");
  mockVacancies[idx] = { ...mockVacancies[idx], ...data };
  return mockApiCall({ data: mockVacancies[idx], message: "Vacancy updated" });
}

export async function deleteVacancy(id: string): Promise<ApiResponse<null>> {
  const idx = mockVacancies.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Vacancy not found");
  mockVacancies.splice(idx, 1);
  return mockApiCall({ data: null, message: "Vacancy deleted" });
}

export async function applyToVacancy(vacancyId: string, studentId: string, studentName: string): Promise<ApiResponse<VacancyApplication>> {
  const app: VacancyApplication = {
    id: `VA${String(mockApplications.length + 1).padStart(3, "0")}`,
    vacancyId, studentId, studentName,
    appliedDate: new Date().toISOString().split("T")[0],
    status: "applied",
  };
  mockApplications.push(app);
  const vIdx = mockVacancies.findIndex((v) => v.id === vacancyId);
  if (vIdx !== -1) mockVacancies[vIdx].applicants++;
  return mockApiCall({ data: app, message: "Application submitted" });
}

export async function fetchApplications(vacancyId?: string): Promise<ApiResponse<VacancyApplication[]>> {
  const filtered = vacancyId ? mockApplications.filter((a) => a.vacancyId === vacancyId) : mockApplications;
  return mockApiCall({ data: filtered, total: filtered.length });
}