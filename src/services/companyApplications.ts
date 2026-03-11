// ============= Company Applications Service (Platform Owner View) =============
// Applications grouped by company, then by vacancy, then applicants
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface ApplicantDetail {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  appliedDate: string;
  status: "applied" | "shortlisted" | "interviewing" | "selected" | "rejected" | "offer_sent" | "offer_accepted" | "offer_declined";
  experience: string;
  skills: string[];
  matchScore: number;
  resumeUrl?: string;
  interviewDate?: string;
  interviewNotes?: string;
  offerSalary?: string;
  institute?: string;
  graduationYear?: string;
}

export interface VacancyGroup {
  vacancyId: string;
  vacancyTitle: string;
  positions: number;
  location: string;
  locationType: "onsite" | "remote" | "hybrid";
  salary: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  deadline: string;
  status: "active" | "closed" | "draft";
  applicants: ApplicantDetail[];
  stats: {
    total: number;
    applied: number;
    shortlisted: number;
    interviewing: number;
    selected: number;
    rejected: number;
    offerSent: number;
    offerAccepted: number;
  };
}

export interface CompanyApplicationGroup {
  companyId: string;
  companyName: string;
  companyLogo: string;
  industry: string;
  city: string;
  totalVacancies: number;
  totalApplicants: number;
  totalSelected: number;
  totalRejected: number;
  vacancies: VacancyGroup[];
}

export interface CompanyApplicationsData {
  companies: CompanyApplicationGroup[];
  overallStats: {
    totalCompanies: number;
    totalVacancies: number;
    totalApplicants: number;
    totalSelected: number;
    totalInterviewing: number;
    avgMatchScore: number;
    avgTimeToHire: string;
    conversionRate: number;
  };
}

const mockData: CompanyApplicationsData = {
  companies: [
    {
      companyId: "C001",
      companyName: "Google",
      companyLogo: "GO",
      industry: "Technology",
      city: "Mountain View, CA",
      totalVacancies: 2,
      totalApplicants: 8,
      totalSelected: 2,
      totalRejected: 1,
      vacancies: [
        {
          vacancyId: "V001",
          vacancyTitle: "Frontend Engineer",
          positions: 5,
          location: "Mountain View, CA",
          locationType: "hybrid",
          salary: "$130K - $180K",
          type: "full-time",
          deadline: "2026-04-15",
          status: "active",
          stats: { total: 5, applied: 1, shortlisted: 1, interviewing: 1, selected: 1, rejected: 1, offerSent: 0, offerAccepted: 0 },
          applicants: [
            { id: "A001", studentId: "S001", studentName: "Alice Johnson", studentEmail: "alice@email.com", phone: "+1 555-0101", appliedDate: "2026-02-22", status: "selected", experience: "1 year", skills: ["React", "TypeScript", "CSS"], matchScore: 92, institute: "TechVerse Academy", graduationYear: "2025", offerSalary: "$145K" },
            { id: "A002", studentId: "S004", studentName: "David Lee", studentEmail: "david@email.com", phone: "+1 555-0104", appliedDate: "2026-02-23", status: "interviewing", experience: "2 years", skills: ["React", "Node.js", "GraphQL"], matchScore: 88, institute: "CodeMaster Institute", graduationYear: "2024", interviewDate: "2026-03-12" },
            { id: "A003", studentId: "S005", studentName: "Eva Martinez", studentEmail: "eva@email.com", phone: "+1 555-0105", appliedDate: "2026-02-25", status: "shortlisted", experience: "6 months", skills: ["React", "CSS", "JavaScript"], matchScore: 70, institute: "Digital Skills Hub", graduationYear: "2025" },
            { id: "A004", studentId: "S010", studentName: "James Wilson", studentEmail: "james@email.com", phone: "+1 555-0110", appliedDate: "2026-02-26", status: "rejected", experience: "Fresh Graduate", skills: ["HTML", "CSS", "jQuery"], matchScore: 35, institute: "FutureStack University", graduationYear: "2026" },
            { id: "A005", studentId: "S012", studentName: "Lily Chen", studentEmail: "lily@email.com", phone: "+1 555-0112", appliedDate: "2026-02-28", status: "applied", experience: "1.5 years", skills: ["React", "TypeScript", "Tailwind"], matchScore: 85, institute: "ByteForge Academy", graduationYear: "2024" },
          ],
        },
        {
          vacancyId: "V011",
          vacancyTitle: "ML Engineer",
          positions: 2,
          location: "Mountain View, CA",
          locationType: "onsite",
          salary: "$160K - $220K",
          type: "full-time",
          deadline: "2026-04-20",
          status: "active",
          stats: { total: 3, applied: 1, shortlisted: 1, interviewing: 0, selected: 1, rejected: 0, offerSent: 0, offerAccepted: 0 },
          applicants: [
            { id: "A006", studentId: "S015", studentName: "Raj Patel", studentEmail: "raj@email.com", phone: "+1 555-0115", appliedDate: "2026-03-01", status: "selected", experience: "3 years", skills: ["Python", "TensorFlow", "PyTorch", "ML"], matchScore: 96, institute: "TechVerse Academy", graduationYear: "2023", offerSalary: "$175K" },
            { id: "A007", studentId: "S016", studentName: "Sophie Wang", studentEmail: "sophie@email.com", phone: "+1 555-0116", appliedDate: "2026-03-02", status: "shortlisted", experience: "2 years", skills: ["Python", "Scikit-learn", "SQL"], matchScore: 78, institute: "CodeMaster Institute", graduationYear: "2024" },
            { id: "A008", studentId: "S017", studentName: "Omar Hassan", studentEmail: "omar@email.com", phone: "+1 555-0117", appliedDate: "2026-03-03", status: "applied", experience: "1 year", skills: ["Python", "Keras", "NLP"], matchScore: 72, institute: "Digital Skills Hub", graduationYear: "2025" },
          ],
        },
      ],
    },
    {
      companyId: "C002",
      companyName: "Microsoft",
      companyLogo: "MS",
      industry: "Technology",
      city: "Seattle, WA",
      totalVacancies: 1,
      totalApplicants: 4,
      totalSelected: 1,
      totalRejected: 1,
      vacancies: [
        {
          vacancyId: "V002",
          vacancyTitle: "Full-Stack Developer",
          positions: 3,
          location: "Seattle, WA",
          locationType: "onsite",
          salary: "$125K - $165K",
          type: "full-time",
          deadline: "2026-04-10",
          status: "active",
          stats: { total: 4, applied: 1, shortlisted: 0, interviewing: 1, selected: 1, rejected: 1, offerSent: 0, offerAccepted: 0 },
          applicants: [
            { id: "A009", studentId: "S002", studentName: "Bob Smith", studentEmail: "bob@email.com", phone: "+1 555-0102", appliedDate: "2026-02-20", status: "interviewing", experience: "Fresh Graduate", skills: ["Node.js", "React", "SQL"], matchScore: 75, institute: "TechVerse Academy", graduationYear: "2026", interviewDate: "2026-03-15" },
            { id: "A010", studentId: "S008", studentName: "Henry Brown", studentEmail: "henry@email.com", phone: "+1 555-0108", appliedDate: "2026-02-28", status: "rejected", experience: "1 year", skills: ["Vue.js", "PHP", "MySQL"], matchScore: 45, institute: "FutureStack University", graduationYear: "2025" },
            { id: "A011", studentId: "S019", studentName: "Nora Kim", studentEmail: "nora@email.com", phone: "+1 555-0119", appliedDate: "2026-03-01", status: "selected", experience: "2 years", skills: ["React", "Node.js", "Azure", "MongoDB"], matchScore: 90, institute: "ByteForge Academy", graduationYear: "2024", offerSalary: "$140K" },
            { id: "A012", studentId: "S020", studentName: "Carlos Rivera", studentEmail: "carlos@email.com", phone: "+1 555-0120", appliedDate: "2026-03-04", status: "applied", experience: "6 months", skills: ["Python", "Django", "PostgreSQL"], matchScore: 62, institute: "CodeMaster Institute", graduationYear: "2025" },
          ],
        },
      ],
    },
    {
      companyId: "C003",
      companyName: "Stripe",
      companyLogo: "ST",
      industry: "Fintech",
      city: "San Francisco, CA",
      totalVacancies: 1,
      totalApplicants: 5,
      totalSelected: 2,
      totalRejected: 0,
      vacancies: [
        {
          vacancyId: "V003",
          vacancyTitle: "Backend Engineer Intern",
          positions: 10,
          location: "San Francisco, CA",
          locationType: "onsite",
          salary: "$8K/month",
          type: "internship",
          deadline: "2026-03-30",
          status: "active",
          stats: { total: 5, applied: 1, shortlisted: 1, interviewing: 1, selected: 2, rejected: 0, offerSent: 0, offerAccepted: 0 },
          applicants: [
            { id: "A013", studentId: "S007", studentName: "Grace Kim", studentEmail: "grace@email.com", phone: "+1 555-0107", appliedDate: "2026-02-16", status: "selected", experience: "Intern", skills: ["Python", "PostgreSQL", "Docker"], matchScore: 95, institute: "TechVerse Academy", graduationYear: "2026" },
            { id: "A014", studentId: "S021", studentName: "Aisha Mohammed", studentEmail: "aisha@email.com", phone: "+1 555-0121", appliedDate: "2026-02-18", status: "selected", experience: "Intern", skills: ["Go", "PostgreSQL", "Redis"], matchScore: 91, institute: "CodeMaster Institute", graduationYear: "2026" },
            { id: "A015", studentId: "S022", studentName: "Ethan Park", studentEmail: "ethan@email.com", phone: "+1 555-0122", appliedDate: "2026-02-20", status: "interviewing", experience: "Intern", skills: ["Python", "Flask", "SQL"], matchScore: 80, institute: "Digital Skills Hub", graduationYear: "2026", interviewDate: "2026-03-10" },
            { id: "A016", studentId: "S023", studentName: "Mia Johnson", studentEmail: "mia@email.com", phone: "+1 555-0123", appliedDate: "2026-02-22", status: "shortlisted", experience: "Intern", skills: ["Java", "Spring", "MySQL"], matchScore: 73, institute: "ByteForge Academy", graduationYear: "2027" },
            { id: "A017", studentId: "S024", studentName: "Finn O'Brien", studentEmail: "finn@email.com", phone: "+1 555-0124", appliedDate: "2026-02-25", status: "applied", experience: "Intern", skills: ["Ruby", "Rails", "PostgreSQL"], matchScore: 68, institute: "FutureStack University", graduationYear: "2027" },
          ],
        },
      ],
    },
    {
      companyId: "C004",
      companyName: "Amazon",
      companyLogo: "AM",
      industry: "E-Commerce",
      city: "Seattle, WA",
      totalVacancies: 1,
      totalApplicants: 6,
      totalSelected: 1,
      totalRejected: 2,
      vacancies: [
        {
          vacancyId: "V004",
          vacancyTitle: "SDE-1",
          positions: 8,
          location: "Remote",
          locationType: "remote",
          salary: "$140K - $175K",
          type: "full-time",
          deadline: "2026-04-20",
          status: "active",
          stats: { total: 6, applied: 2, shortlisted: 0, interviewing: 1, selected: 1, rejected: 2, offerSent: 0, offerAccepted: 0 },
          applicants: [
            { id: "A018", studentId: "S025", studentName: "Priya Sharma", studentEmail: "priya@email.com", phone: "+1 555-0125", appliedDate: "2026-02-26", status: "selected", experience: "1 year", skills: ["Java", "AWS", "Docker", "Microservices"], matchScore: 93, institute: "TechVerse Academy", graduationYear: "2025", offerSalary: "$155K" },
            { id: "A019", studentId: "S026", studentName: "Liam Taylor", studentEmail: "liam@email.com", phone: "+1 555-0126", appliedDate: "2026-02-27", status: "interviewing", experience: "2 years", skills: ["Java", "Spring Boot", "AWS"], matchScore: 87, institute: "CodeMaster Institute", graduationYear: "2024", interviewDate: "2026-03-14" },
            { id: "A020", studentId: "S027", studentName: "Yuki Tanaka", studentEmail: "yuki@email.com", phone: "+1 555-0127", appliedDate: "2026-02-28", status: "rejected", experience: "Fresh Graduate", skills: ["C++", "Python"], matchScore: 40, institute: "Digital Skills Hub", graduationYear: "2026" },
            { id: "A021", studentId: "S028", studentName: "Noah Garcia", studentEmail: "noah@email.com", phone: "+1 555-0128", appliedDate: "2026-03-01", status: "rejected", experience: "Fresh Graduate", skills: ["JavaScript", "React"], matchScore: 38, institute: "FutureStack University", graduationYear: "2026" },
            { id: "A022", studentId: "S029", studentName: "Zara Ali", studentEmail: "zara@email.com", phone: "+1 555-0129", appliedDate: "2026-03-02", status: "applied", experience: "1.5 years", skills: ["Java", "Kubernetes", "AWS", "Docker"], matchScore: 89, institute: "ByteForge Academy", graduationYear: "2024" },
            { id: "A023", studentId: "S030", studentName: "Daniel Kim", studentEmail: "daniel@email.com", phone: "+1 555-0130", appliedDate: "2026-03-04", status: "applied", experience: "6 months", skills: ["Python", "AWS Lambda", "DynamoDB"], matchScore: 71, institute: "TechVerse Academy", graduationYear: "2025" },
          ],
        },
      ],
    },
    {
      companyId: "C007",
      companyName: "Spotify",
      companyLogo: "SP",
      industry: "Music/Tech",
      city: "Stockholm, Sweden",
      totalVacancies: 1,
      totalApplicants: 3,
      totalSelected: 0,
      totalRejected: 0,
      vacancies: [
        {
          vacancyId: "V007",
          vacancyTitle: "Data Engineer",
          positions: 3,
          location: "Stockholm, Sweden",
          locationType: "remote",
          salary: "$120K - $160K",
          type: "full-time",
          deadline: "2026-04-18",
          status: "active",
          stats: { total: 3, applied: 1, shortlisted: 1, interviewing: 1, selected: 0, rejected: 0, offerSent: 0, offerAccepted: 0 },
          applicants: [
            { id: "A024", studentId: "S031", studentName: "Emma Nielsen", studentEmail: "emma@email.com", phone: "+46 555-0131", appliedDate: "2026-03-01", status: "interviewing", experience: "2 years", skills: ["Python", "Spark", "Kafka", "Airflow"], matchScore: 94, institute: "CodeMaster Institute", graduationYear: "2024", interviewDate: "2026-03-18" },
            { id: "A025", studentId: "S032", studentName: "Lucas Berg", studentEmail: "lucas@email.com", phone: "+46 555-0132", appliedDate: "2026-03-03", status: "shortlisted", experience: "1 year", skills: ["Python", "SQL", "Airflow"], matchScore: 76, institute: "Digital Skills Hub", graduationYear: "2025" },
            { id: "A026", studentId: "S033", studentName: "Maya Singh", studentEmail: "maya@email.com", phone: "+1 555-0133", appliedDate: "2026-03-05", status: "applied", experience: "Fresh Graduate", skills: ["Python", "Pandas", "SQL"], matchScore: 65, institute: "TechVerse Academy", graduationYear: "2026" },
          ],
        },
      ],
    },
  ],
  overallStats: {
    totalCompanies: 5,
    totalVacancies: 6,
    totalApplicants: 26,
    totalSelected: 6,
    totalInterviewing: 5,
    avgMatchScore: 74,
    avgTimeToHire: "16 days",
    conversionRate: 23,
  },
};

export async function fetchCompanyApplications(): Promise<ApiResponse<CompanyApplicationsData>> {
  return mockApiCall({ data: mockData });
}

export async function updateApplicantStatus(
  applicantId: string,
  newStatus: ApplicantDetail["status"]
): Promise<ApiResponse<ApplicantDetail>> {
  for (const company of mockData.companies) {
    for (const vacancy of company.vacancies) {
      const applicant = vacancy.applicants.find((a) => a.id === applicantId);
      if (applicant) {
        applicant.status = newStatus;
        return mockApiCall({ data: applicant, message: `Status updated to ${newStatus}` });
      }
    }
  }
  throw new Error("Applicant not found");
}
