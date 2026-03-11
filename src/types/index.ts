// ============= Shared Type Definitions =============

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  batch: string;
  status: "active" | "inactive" | "suspended";
  progress: number;
  joinDate: string;
  instituteId: string;
  city?: string;
  avatar?: string;
}

export interface Test {
  id: string;
  name: string;
  type: "Quiz" | "Exam" | "Assignment";
  course: string;
  date: string;
  duration: string;
  questions: number;
  maxMarks: number;
  status: "upcoming" | "in_progress" | "completed" | "draft";
  submissions: number;
  avgScore: number | null;
  instituteId: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
  type: "system" | "custom";
  permissions: Record<string, boolean>;
  instituteId: string;
  createdBy?: string;
  scope: "global" | "institute";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
  instituteId: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  students: number;
  modules: number;
  completedModules: number;
  status: "active" | "upcoming" | "completed";
  startDate: string;
  endDate: string;
  topics: string[];
  instituteId: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  rating: number;
  borrowed: number;
  instituteId?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadDate: string;
  downloads: number;
  instituteId?: string;
}

export interface Lecture {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  date: string;
  views: number;
  status: "recorded" | "upcoming" | "scheduled" | "live";
  module: string;
  instituteId?: string;
}

export interface Placement {
  id: string;
  studentName: string;
  studentId: string;
  company: string;
  position: string;
  package: string;
  date: string;
  status: "placed" | "offered" | "interviewing" | "rejected";
  city: string;
  instituteId: string;
  companyId?: string;
}

export interface PlacementDrive {
  id: string;
  company: string;
  positions: string[];
  date: string;
  registeredStudents: number;
  status: "upcoming" | "ongoing" | "completed";
  packageRange: string;
  city: string;
  instituteId: string;
}

export interface Institute {
  id: string;
  name: string;
  logo: string;
  role: string;
  city?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  studentCount?: number;
  courseCount?: number;
  type?: "education" | "consultancy" | "hybrid";
}

export interface DashboardStats {
  totalStudents: number;
  activeCourses: number;
  testsConducted: number;
  avgPerformance: number;
  totalPlacements: number;
}

export interface ActivityItem {
  student: string;
  action: string;
  time: string;
  status: "success" | "info" | "destructive" | "warning";
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

// ============= Notification Types =============
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  userId: string;
  link?: string;
}

// ============= Announcement Types =============
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  instituteId: string;
  targetRoles: string[];
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "published" | "archived";
  createdAt: string;
  expiresAt?: string;
  pinned: boolean;
}

// ============= Consultancy Types =============
export interface VisaApplication {
  id: string;
  studentId: string;
  studentName: string;
  country: string;
  visaType: string;
  status: "pending" | "documents_submitted" | "interview_scheduled" | "approved" | "rejected" | "processing";
  appliedDate: string;
  interviewDate?: string;
  documents: string[];
  notes: string;
  counselorId: string;
  counselorName: string;
  instituteId: string;
  consultancyId?: string;
}

export interface UniversityApplication {
  id: string;
  studentId: string;
  studentName: string;
  universityName: string;
  country: string;
  program: string;
  intake: string;
  status: "shortlisted" | "applied" | "offer_received" | "accepted" | "rejected" | "enrolled";
  appliedDate: string;
  deadline: string;
  scholarshipApplied: boolean;
  scholarshipStatus?: "pending" | "approved" | "rejected";
  counselorId: string;
  counselorName: string;
  instituteId: string;
  consultancyId?: string;
}

export interface LanguageCourse {
  id: string;
  name: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  instructor: string;
  students: number;
  schedule: string;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "completed";
  testType?: "IELTS" | "TOEFL" | "PTE" | "Duolingo" | "JLPT" | "DELF" | "Goethe";
  instituteId: string;
  consultancyId?: string;
}

export interface Counselor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  countries: string[];
  activeStudents: number;
  totalPlacements: number;
  rating: number;
  status: "active" | "inactive";
  instituteId: string;
  consultancyId?: string;
}

// ============= User Permission Grant (per-user) =============
export interface UserPermissionGrant {
  id: string;
  userId: string;
  userName: string;
  grantedBy: string;
  grantedByName: string;
  permissions: string[];
  instituteId: string;
  createdAt: string;
}

// Permission labels
export const PERMISSION_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Students",
  tests: "Tests & Exams",
  progress: "Progress Reports",
  library: "Library",
  lectures: "Lectures",
  courses: "Courses",
  roles: "Roles & Permissions",
  settings: "Settings",
  billing: "Billing",
  placements: "Placements",
  fees: "Fees",
  attendance: "Attendance",
  vacancies: "Job Board",
  institutes_manage: "Manage Institutes",
  institutes_view: "Browse Institutes",
  company_vacancies: "Company Vacancies",
  announcements: "Announcements",
  notifications: "Notifications",
  visa_tracking: "Visa Tracking",
  university_applications: "University Applications",
  language_courses: "Language Courses",
  counselor_management: "Counselor Management",
  consultancy_manage: "Consultancy Management",
  enrollment: "Enrollment",
};

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
}

// Search/filter params
export interface SearchParams {
  search?: string;
  status?: string;
  course?: string;
  batch?: string;
  city?: string;
  instituteId?: string;
  page?: number;
  limit?: number;
}
