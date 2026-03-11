// ============= Student Data Service =============
// All student page data fetched from here (simulating backend)
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

// ─── Consultancy grouped data ───

export interface StudentConsultancyService {
  id: string;
  type: "visa" | "university" | "language";
  label: string;
  status: string;
  counselor: string;
  details?: Record<string, string>;
}

export interface StudentConsultancy {
  id: string;
  name: string;
  logo: string;
  location: string;
  status: "active" | "completed";
  joinDate: string;
  services: StudentConsultancyService[];
}

const mockConsultancies: StudentConsultancy[] = [
  {
    id: "CON1", name: "Global Education Consultancy", logo: "GE", location: "Mumbai, India", status: "active", joinDate: "Jan 2026",
    services: [
      { id: "S1", type: "visa", label: "US Student Visa (F1)", status: "In Review", counselor: "Dr. Ravi Kumar", details: { country: "United States", appliedDate: "Feb 10, 2026", interviewDate: "Mar 20, 2026" } },
      { id: "S2", type: "university", label: "MIT Application — MS CS", status: "Documents Submitted", counselor: "Anita Shah", details: { university: "MIT", program: "MS Computer Science", deadline: "Apr 1, 2026" } },
      { id: "S3", type: "language", label: "IELTS Preparation", status: "In Progress", counselor: "John Smith", details: { targetScore: "7.5", currentScore: "6.5", nextClass: "Mar 7, 2026" } },
    ],
  },
  {
    id: "CON2", name: "StudyAbroad Plus", logo: "SA", location: "London, UK", status: "active", joinDate: "Feb 2026",
    services: [
      { id: "S4", type: "visa", label: "UK Student Visa (Tier 4)", status: "Approved", counselor: "Emma Wilson", details: { country: "United Kingdom", appliedDate: "Jan 15, 2026" } },
      { id: "S5", type: "university", label: "Oxford Application — MSc ACS", status: "Under Review", counselor: "James Brown", details: { university: "Oxford", program: "MSc Advanced CS", deadline: "Mar 15, 2026" } },
      { id: "S6", type: "language", label: "TOEFL Preparation", status: "In Progress", counselor: "Sarah Lee", details: { targetScore: "100", currentScore: "78", nextClass: "Mar 8, 2026" } },
    ],
  },
  {
    id: "CON3", name: "Pathway Advisors", logo: "PA", location: "Sydney, Australia", status: "active", joinDate: "Mar 2026",
    services: [
      { id: "S7", type: "visa", label: "Australia Student Visa (500)", status: "Documents Pending", counselor: "Mark Taylor", details: { country: "Australia", appliedDate: "Mar 1, 2026" } },
      { id: "S8", type: "university", label: "University of Melbourne — MS Data Science", status: "Preparing", counselor: "Lisa Wang", details: { university: "University of Melbourne", program: "MS Data Science", deadline: "May 1, 2026" } },
    ],
  },
];

// ─── Company grouped data ───

export interface StudentJobApplication {
  id: string;
  vacancyTitle: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  salary: string;
  appliedDate: string;
  status: "applied" | "under_review" | "interview_scheduled" | "selected" | "rejected" | "offer_received";
  interviewDate?: string;
  offerSalary?: string;
}

export interface StudentCompanyGroup {
  companyId: string;
  companyName: string;
  companyLogo: string;
  industry: string;
  city: string;
  applications: StudentJobApplication[];
}

const mockCompanyGroups: StudentCompanyGroup[] = [
  {
    companyId: "C001", companyName: "Google", companyLogo: "GO", industry: "Technology", city: "Mountain View, CA",
    applications: [
      { id: "A1", vacancyTitle: "Frontend Engineer", location: "Mountain View, CA", type: "full-time", salary: "$130K-$180K", appliedDate: "Feb 25, 2026", status: "interview_scheduled", interviewDate: "Mar 10, 2026" },
      { id: "A2", vacancyTitle: "ML Engineer Intern", location: "Mountain View, CA", type: "internship", salary: "$9K/month", appliedDate: "Mar 1, 2026", status: "applied" },
    ],
  },
  {
    companyId: "C002", companyName: "Microsoft", companyLogo: "MS", industry: "Technology", city: "Seattle, WA",
    applications: [
      { id: "A3", vacancyTitle: "Full-Stack Developer", location: "Seattle, WA", type: "full-time", salary: "$125K-$165K", appliedDate: "Feb 20, 2026", status: "under_review" },
    ],
  },
  {
    companyId: "C003", companyName: "Stripe", companyLogo: "ST", industry: "Fintech", city: "San Francisco, CA",
    applications: [
      { id: "A4", vacancyTitle: "Backend Engineer Intern", location: "San Francisco, CA", type: "internship", salary: "$8K/month", appliedDate: "Feb 18, 2026", status: "selected", offerSalary: "$8.5K/month" },
    ],
  },
  {
    companyId: "C004", companyName: "Amazon", companyLogo: "AM", industry: "E-Commerce", city: "Seattle, WA",
    applications: [
      { id: "A5", vacancyTitle: "SDE-1", location: "Remote", type: "full-time", salary: "$140K-$175K", appliedDate: "Mar 1, 2026", status: "applied" },
    ],
  },
  {
    companyId: "C005", companyName: "Netflix", companyLogo: "NF", industry: "Entertainment", city: "Los Gatos, CA",
    applications: [
      { id: "A6", vacancyTitle: "UI Engineer", location: "Los Gatos, CA", type: "full-time", salary: "$150K-$200K", appliedDate: "Jan 15, 2026", status: "rejected" },
    ],
  },
];

// ─── Institute grouped data for student ───

export interface StudentInstitute {
  id: string;
  name: string;
  logo: string;
  location: string;
  status: "active" | "completed";
  joinDate: string;
  courses: number;
  progress: number;
}

const mockStudentInstitutes: StudentInstitute[] = [
  { id: "1", name: "TechVerse Academy", logo: "TV", location: "San Francisco, CA", courses: 3, status: "active", joinDate: "Jan 2026", progress: 78 },
  { id: "2", name: "CodeCraft Institute", logo: "CC", location: "New York, NY", courses: 1, status: "active", joinDate: "Feb 2026", progress: 45 },
  { id: "3", name: "Digital Skills Hub", logo: "DS", location: "London, UK", courses: 2, status: "completed", joinDate: "Sep 2025", progress: 100 },
];

// ─── Institute-grouped courses, lectures, tests, etc. ───

export interface StudentCourse {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  grade: string;
  modules: number;
  completed: number;
  nextClass: string;
  status: "active" | "completed";
  instituteId: string;
  instituteName: string;
}

const mockStudentCourses: StudentCourse[] = [
  { id: "C1", name: "Full-Stack Developer 2026", instructor: "John Doe", progress: 78, grade: "A-", modules: 24, completed: 18, nextClass: "Mar 7 at 9:00 AM", status: "active", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "C2", name: "Frontend Bootcamp", instructor: "Jane Smith", progress: 65, grade: "B+", modules: 12, completed: 8, nextClass: "Mar 6 at 2:00 PM", status: "active", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "C3", name: "Backend Mastery", instructor: "Sarah Wilson", progress: 45, grade: "B", modules: 16, completed: 7, nextClass: "Mar 8 at 10:00 AM", status: "active", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "C4", name: "React Advanced", instructor: "Mike Chen", progress: 30, grade: "B+", modules: 10, completed: 3, nextClass: "Mar 9 at 11:00 AM", status: "active", instituteId: "2", instituteName: "CodeCraft Institute" },
  { id: "C5", name: "Python Basics", instructor: "Emma Davis", progress: 100, grade: "A", modules: 8, completed: 8, nextClass: "Completed", status: "completed", instituteId: "3", instituteName: "Digital Skills Hub" },
  { id: "C6", name: "Data Science Intro", instructor: "Dr. Alan Turing", progress: 100, grade: "A-", modules: 10, completed: 10, nextClass: "Completed", status: "completed", instituteId: "3", instituteName: "Digital Skills Hub" },
];

export interface StudentLecture {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  date: string;
  views: number;
  status: "recorded" | "upcoming" | "scheduled" | "live";
  module: string;
  instituteId: string;
  instituteName: string;
}

const mockStudentLectures: StudentLecture[] = [
  { id: "L1", title: "Introduction to HTML & CSS", instructor: "John Doe", duration: "2h 15m", date: "Jan 15, 2026", views: 245, status: "recorded", module: "Week 1", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "L2", title: "JavaScript Fundamentals", instructor: "John Doe", duration: "2h 30m", date: "Jan 16, 2026", views: 230, status: "recorded", module: "Week 1", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "L3", title: "React Basics", instructor: "Jane Smith", duration: "2h 00m", date: "Feb 3, 2026", views: 175, status: "recorded", module: "Week 5", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "L4", title: "Advanced React Patterns", instructor: "Mike Chen", duration: "1h 45m", date: "Mar 1, 2026", views: 50, status: "recorded", module: "Week 3", instituteId: "2", instituteName: "CodeCraft Institute" },
  { id: "L5", title: "State Management", instructor: "John Doe", duration: "—", date: "Mar 7, 2026", views: 0, status: "upcoming", module: "Week 9", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "L6", title: "API Integration", instructor: "Jane Smith", duration: "—", date: "Mar 9, 2026", views: 0, status: "scheduled", module: "Week 9", instituteId: "1", instituteName: "TechVerse Academy" },
];

export interface StudentTest {
  id: string;
  name: string;
  type: "Quiz" | "Exam" | "Assignment";
  course: string;
  date: string;
  duration: string;
  myScore: number | null;
  maxMarks: number;
  status: "completed" | "upcoming" | "in_progress";
  instituteId: string;
  instituteName: string;
}

const mockStudentTests: StudentTest[] = [
  { id: "T001", name: "JavaScript Fundamentals", type: "Quiz", course: "Full-Stack 2026", date: "Feb 20, 2026", duration: "30 min", myScore: 85, maxMarks: 100, status: "completed", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "T002", name: "HTML/CSS Basics", type: "Quiz", course: "Frontend Bootcamp", date: "Feb 28, 2026", duration: "20 min", myScore: 92, maxMarks: 50, status: "completed", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "T003", name: "Git & GitHub Workflow", type: "Quiz", course: "Full-Stack 2026", date: "Feb 20, 2026", duration: "15 min", myScore: 28, maxMarks: 30, status: "completed", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "T004", name: "React & TypeScript Mid-Term", type: "Exam", course: "Full-Stack 2026", date: "Mar 8, 2026", duration: "2 hrs", myScore: null, maxMarks: 200, status: "upcoming", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "T005", name: "React Patterns Quiz", type: "Quiz", course: "React Advanced", date: "Mar 5, 2026", duration: "20 min", myScore: null, maxMarks: 50, status: "upcoming", instituteId: "2", instituteName: "CodeCraft Institute" },
  { id: "T006", name: "Python Final Exam", type: "Exam", course: "Python Basics", date: "Dec 15, 2025", duration: "2 hrs", myScore: 88, maxMarks: 100, status: "completed", instituteId: "3", instituteName: "Digital Skills Hub" },
];

// ─── Fetch functions ───

export async function fetchStudentInstitutes(): Promise<ApiResponse<StudentInstitute[]>> {
  return mockApiCall({ data: mockStudentInstitutes });
}

export async function fetchStudentCourses(): Promise<ApiResponse<StudentCourse[]>> {
  return mockApiCall({ data: mockStudentCourses });
}

export async function fetchStudentLectures(): Promise<ApiResponse<StudentLecture[]>> {
  return mockApiCall({ data: mockStudentLectures });
}

export async function fetchStudentTests(): Promise<ApiResponse<StudentTest[]>> {
  return mockApiCall({ data: mockStudentTests });
}

export async function fetchStudentConsultancies(): Promise<ApiResponse<StudentConsultancy[]>> {
  return mockApiCall({ data: mockConsultancies });
}

export async function fetchStudentCompanyGroups(): Promise<ApiResponse<StudentCompanyGroup[]>> {
  return mockApiCall({ data: mockCompanyGroups });
}

// Placement data grouped by institute
export interface StudentPlacement {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  status: "applied" | "shortlisted" | "interview" | "selected" | "rejected";
  date: string;
  instituteId: string;
  instituteName: string;
}

const mockPlacements: StudentPlacement[] = [
  { id: "P1", company: "Google", role: "Frontend Engineer", location: "Mountain View, CA", salary: "$130K", status: "interview", date: "Mar 10, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "P2", company: "Stripe", role: "Backend Intern", location: "San Francisco, CA", salary: "$8K/mo", status: "applied", date: "Feb 28, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
  { id: "P3", company: "Microsoft", role: "Full-Stack Dev", location: "Seattle, WA", salary: "$125K", status: "shortlisted", date: "Mar 5, 2026", instituteId: "2", instituteName: "CodeCraft Institute" },
  { id: "P4", company: "Amazon", role: "SDE-1", location: "Remote", salary: "$140K", status: "applied", date: "Mar 1, 2026", instituteId: "1", instituteName: "TechVerse Academy" },
];

export async function fetchStudentPlacements(): Promise<ApiResponse<StudentPlacement[]>> {
  return mockApiCall({ data: mockPlacements });
}
