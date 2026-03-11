// ============= Student Dashboard Service =============
// Students can be registered across multiple institutes, consultancies, and companies simultaneously
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface EntityInfo {
  id: string;
  name: string;
  type: "institute" | "consultancy" | "company";
  logo: string;
}

export interface EnrolledCourse {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  nextClass: string;
  grade: string;
  entityId: string;
  entityName: string;
  entityType: "institute" | "consultancy";
}

export interface UpcomingItem {
  id: string;
  title: string;
  type: "lecture" | "test" | "assignment" | "exam";
  date: string;
  time: string;
  course: string;
  instructor?: string;
  entityId: string;
  entityName: string;
}

export interface AttendanceSummary {
  totalClasses: number;
  attended: number;
  percentage: number;
  lastWeek: number[];
  entityId: string;
  entityName: string;
}

export interface FeeSummary {
  totalFees: number;
  paid: number;
  pending: number;
  nextDueDate: string;
  nextDueAmount: number;
  entityId: string;
  entityName: string;
}

export interface PlacementOpportunity {
  id: string;
  company: string;
  position: string;
  salary: string;
  deadline: string;
  status: "open" | "applied" | "shortlisted";
  type: "full-time" | "internship";
  companyId: string;
}

export interface ConsultancyService {
  id: string;
  type: "visa" | "university" | "language";
  title: string;
  status: string;
  counselor: string;
  nextStep: string;
  entityId: string;
  entityName: string;
}

export interface StudentDashboardData {
  registeredEntities: EntityInfo[];
  enrolledCourses: EnrolledCourse[];
  upcomingItems: UpcomingItem[];
  attendanceByEntity: AttendanceSummary[];
  feesByEntity: FeeSummary[];
  placementOpportunities: PlacementOpportunity[];
  consultancyServices: ConsultancyService[];
  overallProgress: number;
  rank: number;
  totalStudents: number;
}

const mockStudentDashboard: StudentDashboardData = {
  registeredEntities: [
    { id: "1", name: "TechVerse Academy", type: "institute", logo: "TV" },
    { id: "2", name: "CodeCraft Institute", type: "institute", logo: "CC" },
    { id: "CON1", name: "Global Consultancy", type: "consultancy", logo: "GC" },
    { id: "C001", name: "TechCorp", type: "company", logo: "TC" },
    { id: "C002", name: "InnoSoft", type: "company", logo: "IS" },
  ],
  enrolledCourses: [
    { id: "EC1", name: "Advanced React & TypeScript", instructor: "Sarah Wilson", progress: 72, totalModules: 12, completedModules: 8, nextClass: "Mar 6, 2026 10:00 AM", grade: "A-", entityId: "1", entityName: "TechVerse Academy", entityType: "institute" },
    { id: "EC2", name: "Data Structures & Algorithms", instructor: "Dr. James Brown", progress: 55, totalModules: 15, completedModules: 8, nextClass: "Mar 7, 2026 2:00 PM", grade: "B+", entityId: "1", entityName: "TechVerse Academy", entityType: "institute" },
    { id: "EC3", name: "System Design Fundamentals", instructor: "Mike Chen", progress: 30, totalModules: 10, completedModules: 3, nextClass: "Mar 8, 2026 11:00 AM", grade: "B", entityId: "2", entityName: "CodeCraft Institute", entityType: "institute" },
    { id: "EC4", name: "Node.js Backend Development", instructor: "Sarah Wilson", progress: 90, totalModules: 8, completedModules: 7, nextClass: "Mar 6, 2026 3:00 PM", grade: "A", entityId: "1", entityName: "TechVerse Academy", entityType: "institute" },
    { id: "EC5", name: "IELTS Preparation", instructor: "David Park", progress: 45, totalModules: 6, completedModules: 3, nextClass: "Mar 9, 2026 9:00 AM", grade: "B+", entityId: "CON1", entityName: "Global Consultancy", entityType: "consultancy" },
  ],
  upcomingItems: [
    { id: "UI1", title: "React Hooks Deep Dive", type: "lecture", date: "Mar 6, 2026", time: "10:00 AM", course: "Advanced React & TypeScript", instructor: "Sarah Wilson", entityId: "1", entityName: "TechVerse Academy" },
    { id: "UI2", title: "Binary Tree Quiz", type: "test", date: "Mar 7, 2026", time: "2:00 PM", course: "Data Structures & Algorithms", entityId: "1", entityName: "TechVerse Academy" },
    { id: "UI3", title: "API Design Assignment", type: "assignment", date: "Mar 10, 2026", time: "11:59 PM", course: "System Design Fundamentals", entityId: "2", entityName: "CodeCraft Institute" },
    { id: "UI4", title: "Midterm Exam: DSA", type: "exam", date: "Mar 15, 2026", time: "9:00 AM", course: "Data Structures & Algorithms", entityId: "1", entityName: "TechVerse Academy" },
    { id: "UI5", title: "IELTS Mock Speaking Test", type: "test", date: "Mar 9, 2026", time: "9:00 AM", course: "IELTS Preparation", entityId: "CON1", entityName: "Global Consultancy" },
  ],
  attendanceByEntity: [
    { totalClasses: 65, attended: 60, percentage: 92.3, lastWeek: [1, 1, 1, 0, 1, 1, 0], entityId: "1", entityName: "TechVerse Academy" },
    { totalClasses: 20, attended: 17, percentage: 85.0, lastWeek: [1, 0, 1, 1, 1, 0, 0], entityId: "2", entityName: "CodeCraft Institute" },
    { totalClasses: 12, attended: 11, percentage: 91.7, lastWeek: [1, 1, 0, 1, 1, 0, 0], entityId: "CON1", entityName: "Global Consultancy" },
  ],
  feesByEntity: [
    { totalFees: 8000, paid: 6000, pending: 2000, nextDueDate: "Apr 1, 2026", nextDueAmount: 1000, entityId: "1", entityName: "TechVerse Academy" },
    { totalFees: 4000, paid: 2000, pending: 2000, nextDueDate: "Apr 15, 2026", nextDueAmount: 2000, entityId: "2", entityName: "CodeCraft Institute" },
    { totalFees: 3000, paid: 1500, pending: 1500, nextDueDate: "May 1, 2026", nextDueAmount: 1500, entityId: "CON1", entityName: "Global Consultancy" },
  ],
  placementOpportunities: [
    { id: "PO1", company: "Google", position: "Frontend Engineer", salary: "$145K", deadline: "Mar 20, 2026", status: "open", type: "full-time", companyId: "C003" },
    { id: "PO2", company: "TechCorp", position: "SDE Intern", salary: "$8K/mo", deadline: "Mar 15, 2026", status: "applied", type: "internship", companyId: "C001" },
    { id: "PO3", company: "InnoSoft", position: "Backend Developer", salary: "$120K", deadline: "Apr 1, 2026", status: "shortlisted", type: "full-time", companyId: "C002" },
    { id: "PO4", company: "Stripe", position: "Backend Intern", salary: "$9K/mo", deadline: "Mar 30, 2026", status: "open", type: "internship", companyId: "C004" },
  ],
  consultancyServices: [
    { id: "CS1", type: "visa", title: "US Student Visa (F1)", status: "Documents Submitted", counselor: "Ahmed Khan", nextStep: "Interview scheduled Mar 20", entityId: "CON1", entityName: "Global Consultancy" },
    { id: "CS2", type: "university", title: "MIT Application — MS CS", status: "Applied", counselor: "Lisa Chen", nextStep: "Decision expected Apr 15", entityId: "CON1", entityName: "Global Consultancy" },
    { id: "CS3", type: "language", title: "IELTS Preparation", status: "In Progress", counselor: "David Park", nextStep: "Mock test Mar 9", entityId: "CON1", entityName: "Global Consultancy" },
  ],
  overallProgress: 62,
  rank: 15,
  totalStudents: 284,
};

export async function fetchStudentDashboard(_studentId: string, _instituteId?: string): Promise<ApiResponse<StudentDashboardData>> {
  return mockApiCall({ data: mockStudentDashboard });
}

export async function fetchStudentEntities(_studentId: string): Promise<ApiResponse<EntityInfo[]>> {
  return mockApiCall({ data: mockStudentDashboard.registeredEntities });
}
