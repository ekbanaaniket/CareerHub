import { mockApiCall } from "./api";
import type { VisaApplication, UniversityApplication, LanguageCourse, Counselor, ApiResponse } from "@/types";

// ============= Visa Applications =============
const mockVisaApplications: VisaApplication[] = [
  // Consultancy 1 - Global Education Consultancy
  { id: "V1", studentId: "S1", studentName: "Raj Patel", country: "United Kingdom", visaType: "Tier 4 Student", status: "approved", appliedDate: "2026-01-15", interviewDate: "2026-02-10", documents: ["Passport", "I-20", "Financial Proof", "IELTS Score"], notes: "Visa approved, valid for 2 years", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  { id: "V2", studentId: "S2", studentName: "Priya Mehta", country: "Canada", visaType: "Study Permit", status: "processing", appliedDate: "2026-02-01", documents: ["Passport", "Acceptance Letter", "Financial Proof"], notes: "Awaiting biometrics appointment", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  { id: "V3", studentId: "S3", studentName: "Amit Kumar", country: "Australia", visaType: "Subclass 500", status: "documents_submitted", appliedDate: "2026-02-20", documents: ["Passport", "CoE", "OSHC", "GTE Statement"], notes: "Documents under review", counselorId: "C2", counselorName: "James Wilson", instituteId: "CON1", consultancyId: "CON1" },
  { id: "V4", studentId: "S4", studentName: "Sneha Reddy", country: "Germany", visaType: "National Visa", status: "interview_scheduled", appliedDate: "2026-02-10", interviewDate: "2026-03-15", documents: ["Passport", "Blocked Account", "Admission Letter"], notes: "Embassy interview on March 15", counselorId: "C2", counselorName: "James Wilson", instituteId: "CON1", consultancyId: "CON1" },
  { id: "V5", studentId: "S5", studentName: "Karan Singh", country: "United States", visaType: "F-1 Student", status: "pending", appliedDate: "2026-03-01", documents: ["Passport", "I-20"], notes: "Collecting remaining documents", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  { id: "V6", studentId: "S6", studentName: "Meera Nair", country: "United Kingdom", visaType: "Tier 4 Student", status: "approved", appliedDate: "2026-01-20", interviewDate: "2026-02-15", documents: ["Passport", "CAS", "Financial Proof", "IELTS Score"], notes: "Visa approved for 3 years", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  { id: "V7", studentId: "S7", studentName: "Arjun Das", country: "New Zealand", visaType: "Student Visa", status: "processing", appliedDate: "2026-02-25", documents: ["Passport", "Offer Letter", "Medical"], notes: "Medical check pending", counselorId: "C2", counselorName: "James Wilson", instituteId: "CON1", consultancyId: "CON1" },
  // Consultancy 2 - StudyAbroad Pro
  { id: "V8", studentId: "S8", studentName: "Riya Sharma", country: "Canada", visaType: "Study Permit", status: "approved", appliedDate: "2026-01-10", interviewDate: "2026-02-05", documents: ["Passport", "Acceptance Letter", "GIC", "Medical"], notes: "Permit approved", counselorId: "C5", counselorName: "Maria Garcia", instituteId: "CON2", consultancyId: "CON2" },
  { id: "V9", studentId: "S9", studentName: "Vikram Joshi", country: "Australia", visaType: "Subclass 500", status: "pending", appliedDate: "2026-03-02", documents: ["Passport"], notes: "Just started application", counselorId: "C5", counselorName: "Maria Garcia", instituteId: "CON2", consultancyId: "CON2" },
  { id: "V10", studentId: "S10", studentName: "Ananya Gupta", country: "United States", visaType: "F-1 Student", status: "interview_scheduled", appliedDate: "2026-02-15", interviewDate: "2026-03-20", documents: ["Passport", "I-20", "Financial Proof", "TOEFL Score"], notes: "Consulate interview scheduled", counselorId: "C6", counselorName: "Peter Brown", instituteId: "CON2", consultancyId: "CON2" },
  { id: "V11", studentId: "S11", studentName: "Rohan Kapoor", country: "Germany", visaType: "National Visa", status: "documents_submitted", appliedDate: "2026-02-20", documents: ["Passport", "Blocked Account", "Admission Letter", "Insurance"], notes: "VFS appointment done", counselorId: "C6", counselorName: "Peter Brown", instituteId: "CON2", consultancyId: "CON2" },
  { id: "V12", studentId: "S12", studentName: "Kavya Iyer", country: "France", visaType: "Long-Stay Student", status: "processing", appliedDate: "2026-02-28", documents: ["Passport", "Campus France", "Financial Proof"], notes: "Campus France interview done", counselorId: "C5", counselorName: "Maria Garcia", instituteId: "CON2", consultancyId: "CON2" },
  // Consultancy 3 - Pathway Advisors
  { id: "V13", studentId: "S13", studentName: "Neha Saxena", country: "United Kingdom", visaType: "Tier 4 Student", status: "approved", appliedDate: "2026-01-05", interviewDate: "2026-01-30", documents: ["Passport", "CAS", "Financial Proof", "PTE Score"], notes: "Approved, valid until 2028", counselorId: "C7", counselorName: "Sarah Chen", instituteId: "CON3", consultancyId: "CON3" },
  { id: "V14", studentId: "S14", studentName: "Siddharth Menon", country: "Canada", visaType: "Study Permit", status: "processing", appliedDate: "2026-02-18", documents: ["Passport", "Acceptance Letter", "GIC"], notes: "Biometrics done, awaiting decision", counselorId: "C7", counselorName: "Sarah Chen", instituteId: "CON3", consultancyId: "CON3" },
  { id: "V15", studentId: "S15", studentName: "Divya Pillai", country: "Japan", visaType: "Student Visa", status: "pending", appliedDate: "2026-03-05", documents: ["Passport", "CoE"], notes: "Certificate of Eligibility received", counselorId: "C8", counselorName: "Yuki Tanaka", instituteId: "CON3", consultancyId: "CON3" },
  // Consultancy 4 - EduBridge International
  { id: "V16", studentId: "S16", studentName: "Aditya Roy", country: "Australia", visaType: "Subclass 500", status: "approved", appliedDate: "2026-01-12", documents: ["Passport", "CoE", "OSHC", "GTE", "Financial Proof"], notes: "Visa granted for 4 years", counselorId: "C9", counselorName: "Emily Watson", instituteId: "CON4", consultancyId: "CON4" },
  { id: "V17", studentId: "S17", studentName: "Pooja Verma", country: "United States", visaType: "F-1 Student", status: "interview_scheduled", appliedDate: "2026-02-22", interviewDate: "2026-03-18", documents: ["Passport", "I-20", "Financial Proof"], notes: "SEVIS fee paid, interview prep ongoing", counselorId: "C9", counselorName: "Emily Watson", instituteId: "CON4", consultancyId: "CON4" },
  { id: "V18", studentId: "S18", studentName: "Rahul Deshpande", country: "Germany", visaType: "National Visa", status: "documents_submitted", appliedDate: "2026-02-28", documents: ["Passport", "Blocked Account", "Admission Letter"], notes: "Embassy submission done", counselorId: "C10", counselorName: "Hans Mueller", instituteId: "CON4", consultancyId: "CON4" },
];

export async function fetchVisaApplications(instituteId?: string): Promise<ApiResponse<VisaApplication[]>> {
  const filtered = instituteId ? mockVisaApplications.filter((v) => v.consultancyId === instituteId || v.instituteId === instituteId) : mockVisaApplications;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createVisaApplication(app: Omit<VisaApplication, "id">): Promise<ApiResponse<VisaApplication>> {
  const newApp: VisaApplication = { ...app, id: `V${mockVisaApplications.length + 1}` };
  mockVisaApplications.push(newApp);
  return mockApiCall({ data: newApp, message: "Visa application created" });
}

export async function updateVisaApplication(id: string, data: Partial<VisaApplication>): Promise<ApiResponse<VisaApplication>> {
  const idx = mockVisaApplications.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Visa application not found");
  mockVisaApplications[idx] = { ...mockVisaApplications[idx], ...data };
  return mockApiCall({ data: mockVisaApplications[idx], message: "Visa application updated" });
}

export async function deleteVisaApplication(id: string): Promise<ApiResponse<null>> {
  const idx = mockVisaApplications.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Not found");
  mockVisaApplications.splice(idx, 1);
  return mockApiCall({ data: null, message: "Visa application deleted" });
}

// ============= University Applications =============
const mockUniversityApplications: UniversityApplication[] = [
  // Consultancy 1 - Global Education Consultancy
  { id: "UA1", studentId: "S1", studentName: "Raj Patel", universityName: "University of Oxford", country: "United Kingdom", program: "MSc Computer Science", intake: "Fall 2026", status: "offer_received", appliedDate: "2025-12-01", deadline: "2026-01-15", scholarshipApplied: true, scholarshipStatus: "approved", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  { id: "UA2", studentId: "S2", studentName: "Priya Mehta", universityName: "University of Toronto", country: "Canada", program: "MBA", intake: "Fall 2026", status: "applied", appliedDate: "2026-01-20", deadline: "2026-03-01", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  { id: "UA3", studentId: "S3", studentName: "Amit Kumar", universityName: "University of Melbourne", country: "Australia", program: "MS Data Science", intake: "Spring 2026", status: "accepted", appliedDate: "2025-10-15", deadline: "2025-12-01", scholarshipApplied: false, counselorId: "C2", counselorName: "James Wilson", instituteId: "CON1", consultancyId: "CON1" },
  { id: "UA4", studentId: "S4", studentName: "Sneha Reddy", universityName: "TU Munich", country: "Germany", program: "MS Mechanical Engineering", intake: "Winter 2026", status: "shortlisted", appliedDate: "2026-02-15", deadline: "2026-04-30", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C2", counselorName: "James Wilson", instituteId: "CON1", consultancyId: "CON1" },
  { id: "UA5", studentId: "S5", studentName: "Karan Singh", universityName: "MIT", country: "United States", program: "MS AI", intake: "Fall 2026", status: "applied", appliedDate: "2026-01-10", deadline: "2026-02-15", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  { id: "UA6", studentId: "S6", studentName: "Meera Nair", universityName: "Imperial College London", country: "United Kingdom", program: "MSc Finance", intake: "Fall 2026", status: "offer_received", appliedDate: "2025-12-15", deadline: "2026-02-01", scholarshipApplied: true, scholarshipStatus: "approved", counselorId: "C1", counselorName: "Dr. Anita Sharma", instituteId: "CON1", consultancyId: "CON1" },
  // Consultancy 2 - StudyAbroad Pro
  { id: "UA7", studentId: "S8", studentName: "Riya Sharma", universityName: "University of British Columbia", country: "Canada", program: "MS Computer Science", intake: "Fall 2026", status: "accepted", appliedDate: "2025-11-15", deadline: "2026-01-15", scholarshipApplied: true, scholarshipStatus: "approved", counselorId: "C5", counselorName: "Maria Garcia", instituteId: "CON2", consultancyId: "CON2" },
  { id: "UA8", studentId: "S9", studentName: "Vikram Joshi", universityName: "UNSW Sydney", country: "Australia", program: "Master of Engineering", intake: "Spring 2026", status: "applied", appliedDate: "2026-01-20", deadline: "2026-03-15", scholarshipApplied: false, counselorId: "C5", counselorName: "Maria Garcia", instituteId: "CON2", consultancyId: "CON2" },
  { id: "UA9", studentId: "S10", studentName: "Ananya Gupta", universityName: "Stanford University", country: "United States", program: "MS Data Science", intake: "Fall 2026", status: "shortlisted", appliedDate: "2026-01-05", deadline: "2026-02-15", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C6", counselorName: "Peter Brown", instituteId: "CON2", consultancyId: "CON2" },
  { id: "UA10", studentId: "S11", studentName: "Rohan Kapoor", universityName: "TU Berlin", country: "Germany", program: "MS Informatics", intake: "Winter 2026", status: "applied", appliedDate: "2026-02-10", deadline: "2026-04-30", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C6", counselorName: "Peter Brown", instituteId: "CON2", consultancyId: "CON2" },
  { id: "UA11", studentId: "S12", studentName: "Kavya Iyer", universityName: "Sciences Po Paris", country: "France", program: "Master of International Affairs", intake: "Fall 2026", status: "offer_received", appliedDate: "2025-12-20", deadline: "2026-02-28", scholarshipApplied: true, scholarshipStatus: "approved", counselorId: "C5", counselorName: "Maria Garcia", instituteId: "CON2", consultancyId: "CON2" },
  // Consultancy 3 - Pathway Advisors
  { id: "UA12", studentId: "S13", studentName: "Neha Saxena", universityName: "University of Edinburgh", country: "United Kingdom", program: "MSc Artificial Intelligence", intake: "Fall 2026", status: "accepted", appliedDate: "2025-11-20", deadline: "2026-01-31", scholarshipApplied: false, counselorId: "C7", counselorName: "Sarah Chen", instituteId: "CON3", consultancyId: "CON3" },
  { id: "UA13", studentId: "S14", studentName: "Siddharth Menon", universityName: "McGill University", country: "Canada", program: "MBA", intake: "Fall 2026", status: "applied", appliedDate: "2026-01-25", deadline: "2026-03-15", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C7", counselorName: "Sarah Chen", instituteId: "CON3", consultancyId: "CON3" },
  { id: "UA14", studentId: "S15", studentName: "Divya Pillai", universityName: "University of Tokyo", country: "Japan", program: "MS Computer Science", intake: "Spring 2027", status: "shortlisted", appliedDate: "2026-02-28", deadline: "2026-05-15", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C8", counselorName: "Yuki Tanaka", instituteId: "CON3", consultancyId: "CON3" },
  // Consultancy 4 - EduBridge International
  { id: "UA15", studentId: "S16", studentName: "Aditya Roy", universityName: "Monash University", country: "Australia", program: "Master of IT", intake: "Spring 2026", status: "enrolled", appliedDate: "2025-09-15", deadline: "2025-11-30", scholarshipApplied: true, scholarshipStatus: "approved", counselorId: "C9", counselorName: "Emily Watson", instituteId: "CON4", consultancyId: "CON4" },
  { id: "UA16", studentId: "S17", studentName: "Pooja Verma", universityName: "Columbia University", country: "United States", program: "MS Operations Research", intake: "Fall 2026", status: "applied", appliedDate: "2026-01-15", deadline: "2026-03-01", scholarshipApplied: true, scholarshipStatus: "pending", counselorId: "C9", counselorName: "Emily Watson", instituteId: "CON4", consultancyId: "CON4" },
  { id: "UA17", studentId: "S18", studentName: "Rahul Deshpande", universityName: "RWTH Aachen University", country: "Germany", program: "MS Mechanical Engineering", intake: "Winter 2026", status: "shortlisted", appliedDate: "2026-02-10", deadline: "2026-05-01", scholarshipApplied: false, counselorId: "C10", counselorName: "Hans Mueller", instituteId: "CON4", consultancyId: "CON4" },
];

export async function fetchUniversityApplications(instituteId?: string): Promise<ApiResponse<UniversityApplication[]>> {
  const filtered = instituteId ? mockUniversityApplications.filter((u) => u.consultancyId === instituteId || u.instituteId === instituteId) : mockUniversityApplications;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createUniversityApplication(app: Omit<UniversityApplication, "id">): Promise<ApiResponse<UniversityApplication>> {
  const newApp: UniversityApplication = { ...app, id: `UA${mockUniversityApplications.length + 1}` };
  mockUniversityApplications.push(newApp);
  return mockApiCall({ data: newApp, message: "University application created" });
}

export async function updateUniversityApplication(id: string, data: Partial<UniversityApplication>): Promise<ApiResponse<UniversityApplication>> {
  const idx = mockUniversityApplications.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("Not found");
  mockUniversityApplications[idx] = { ...mockUniversityApplications[idx], ...data };
  return mockApiCall({ data: mockUniversityApplications[idx], message: "University application updated" });
}

export async function deleteUniversityApplication(id: string): Promise<ApiResponse<null>> {
  const idx = mockUniversityApplications.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("Not found");
  mockUniversityApplications.splice(idx, 1);
  return mockApiCall({ data: null, message: "Deleted" });
}

// ============= Language Courses =============
const mockLanguageCourses: LanguageCourse[] = [
  // Consultancy 1
  { id: "LC1", name: "IELTS Preparation Batch A", language: "English", level: "intermediate", instructor: "Prof. Emily Watson", students: 25, schedule: "Mon, Wed, Fri - 10:00 AM", startDate: "2026-03-01", endDate: "2026-05-30", status: "active", testType: "IELTS", instituteId: "CON1", consultancyId: "CON1" },
  { id: "LC2", name: "TOEFL Intensive", language: "English", level: "advanced", instructor: "Dr. Robert Clarke", students: 18, schedule: "Tue, Thu - 2:00 PM", startDate: "2026-03-15", endDate: "2026-06-15", status: "upcoming", testType: "TOEFL", instituteId: "CON1", consultancyId: "CON1" },
  { id: "LC3", name: "PTE Academic Crash Course", language: "English", level: "intermediate", instructor: "Sarah Adams", students: 30, schedule: "Daily - 9:00 AM", startDate: "2026-02-01", endDate: "2026-03-15", status: "active", testType: "PTE", instituteId: "CON1", consultancyId: "CON1" },
  { id: "LC4", name: "German A1-A2", language: "German", level: "beginner", instructor: "Dr. Hans Mueller", students: 15, schedule: "Mon, Wed - 4:00 PM", startDate: "2026-04-01", endDate: "2026-07-30", status: "upcoming", testType: "Goethe", instituteId: "CON1", consultancyId: "CON1" },
  { id: "LC5", name: "French Beginner", language: "French", level: "beginner", instructor: "Marie Dupont", students: 12, schedule: "Sat - 10:00 AM", startDate: "2026-01-15", endDate: "2026-04-15", status: "active", testType: "DELF", instituteId: "CON1", consultancyId: "CON1" },
  { id: "LC6", name: "Japanese N5-N4", language: "Japanese", level: "beginner", instructor: "Yuki Tanaka", students: 8, schedule: "Tue, Thu - 6:00 PM", startDate: "2026-03-01", endDate: "2026-08-30", status: "active", testType: "JLPT", instituteId: "CON1", consultancyId: "CON1" },
  // Consultancy 2
  { id: "LC7", name: "IELTS Academic Band 7+", language: "English", level: "advanced", instructor: "Prof. John Williams", students: 20, schedule: "Mon, Wed, Fri - 11:00 AM", startDate: "2026-02-15", endDate: "2026-05-15", status: "active", testType: "IELTS", instituteId: "CON2", consultancyId: "CON2" },
  { id: "LC8", name: "Duolingo English Test Prep", language: "English", level: "intermediate", instructor: "Anna Roberts", students: 22, schedule: "Tue, Thu - 3:00 PM", startDate: "2026-03-01", endDate: "2026-04-30", status: "active", testType: "Duolingo", instituteId: "CON2", consultancyId: "CON2" },
  { id: "LC9", name: "Korean Beginner", language: "Korean", level: "beginner", instructor: "Min-Ji Park", students: 10, schedule: "Sat - 2:00 PM", startDate: "2026-04-01", endDate: "2026-08-01", status: "upcoming", instituteId: "CON2", consultancyId: "CON2" },
  // Consultancy 3
  { id: "LC10", name: "PTE Scored Practice", language: "English", level: "intermediate", instructor: "David Brown", students: 28, schedule: "Mon-Fri - 8:00 AM", startDate: "2026-02-10", endDate: "2026-03-20", status: "active", testType: "PTE", instituteId: "CON3", consultancyId: "CON3" },
  { id: "LC11", name: "IELTS General Training", language: "English", level: "intermediate", instructor: "Lisa Taylor", students: 16, schedule: "Mon, Wed - 5:00 PM", startDate: "2026-03-15", endDate: "2026-06-15", status: "upcoming", testType: "IELTS", instituteId: "CON3", consultancyId: "CON3" },
  // Consultancy 4
  { id: "LC12", name: "German B1-B2", language: "German", level: "intermediate", instructor: "Klaus Schmidt", students: 14, schedule: "Tue, Thu - 4:00 PM", startDate: "2026-02-01", endDate: "2026-06-30", status: "active", testType: "Goethe", instituteId: "CON4", consultancyId: "CON4" },
  { id: "LC13", name: "TOEFL iBT Masterclass", language: "English", level: "advanced", instructor: "Michael Brown", students: 15, schedule: "Mon, Wed, Fri - 1:00 PM", startDate: "2026-03-01", endDate: "2026-05-30", status: "active", testType: "TOEFL", instituteId: "CON4", consultancyId: "CON4" },
  { id: "LC14", name: "Spanish Beginner A1", language: "Spanish", level: "beginner", instructor: "Carlos Mendez", students: 18, schedule: "Sat, Sun - 10:00 AM", startDate: "2026-04-01", endDate: "2026-07-01", status: "upcoming", instituteId: "CON4", consultancyId: "CON4" },
];

export async function fetchLanguageCourses(instituteId?: string): Promise<ApiResponse<LanguageCourse[]>> {
  const filtered = instituteId ? mockLanguageCourses.filter((l) => l.consultancyId === instituteId || l.instituteId === instituteId) : mockLanguageCourses;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createLanguageCourse(course: Omit<LanguageCourse, "id">): Promise<ApiResponse<LanguageCourse>> {
  const newCourse: LanguageCourse = { ...course, id: `LC${mockLanguageCourses.length + 1}` };
  mockLanguageCourses.push(newCourse);
  return mockApiCall({ data: newCourse, message: "Language course created" });
}

export async function updateLanguageCourse(id: string, data: Partial<LanguageCourse>): Promise<ApiResponse<LanguageCourse>> {
  const idx = mockLanguageCourses.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Not found");
  mockLanguageCourses[idx] = { ...mockLanguageCourses[idx], ...data };
  return mockApiCall({ data: mockLanguageCourses[idx], message: "Updated" });
}

export async function deleteLanguageCourse(id: string): Promise<ApiResponse<null>> {
  const idx = mockLanguageCourses.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Not found");
  mockLanguageCourses.splice(idx, 1);
  return mockApiCall({ data: null, message: "Deleted" });
}

// ============= Counselors =============
const mockCounselors: Counselor[] = [
  // Consultancy 1
  { id: "C1", name: "Dr. Anita Sharma", email: "anita@globaledconsultancy.com", phone: "+91 98765 43210", specialization: ["UK", "USA", "Canada"], countries: ["United Kingdom", "United States", "Canada"], activeStudents: 15, totalPlacements: 120, rating: 4.8, status: "active", instituteId: "CON1", consultancyId: "CON1" },
  { id: "C2", name: "James Wilson", email: "james@globaledconsultancy.com", phone: "+91 98765 43211", specialization: ["Australia", "Germany", "Europe"], countries: ["Australia", "Germany", "France", "Netherlands"], activeStudents: 12, totalPlacements: 95, rating: 4.6, status: "active", instituteId: "CON1", consultancyId: "CON1" },
  { id: "C3", name: "Meera Joshi", email: "meera@globaledconsultancy.com", phone: "+91 98765 43212", specialization: ["Japan", "South Korea", "Singapore"], countries: ["Japan", "South Korea", "Singapore"], activeStudents: 8, totalPlacements: 45, rating: 4.5, status: "active", instituteId: "CON1", consultancyId: "CON1" },
  { id: "C4", name: "David Chen", email: "david@globaledconsultancy.com", phone: "+91 98765 43213", specialization: ["New Zealand", "Ireland"], countries: ["New Zealand", "Ireland"], activeStudents: 5, totalPlacements: 30, rating: 4.3, status: "inactive", instituteId: "CON1", consultancyId: "CON1" },
  // Consultancy 2
  { id: "C5", name: "Maria Garcia", email: "maria@studyabroadpro.com", phone: "+1 555-100-2001", specialization: ["Canada", "Australia", "France"], countries: ["Canada", "Australia", "France"], activeStudents: 18, totalPlacements: 110, rating: 4.7, status: "active", instituteId: "CON2", consultancyId: "CON2" },
  { id: "C6", name: "Peter Brown", email: "peter@studyabroadpro.com", phone: "+1 555-100-2002", specialization: ["USA", "Germany", "UK"], countries: ["United States", "Germany", "United Kingdom"], activeStudents: 14, totalPlacements: 85, rating: 4.5, status: "active", instituteId: "CON2", consultancyId: "CON2" },
  // Consultancy 3
  { id: "C7", name: "Sarah Chen", email: "sarah@pathwayadvisors.com", phone: "+1 555-200-3001", specialization: ["UK", "Canada", "Ireland"], countries: ["United Kingdom", "Canada", "Ireland"], activeStudents: 20, totalPlacements: 140, rating: 4.9, status: "active", instituteId: "CON3", consultancyId: "CON3" },
  { id: "C8", name: "Yuki Tanaka", email: "yuki@pathwayadvisors.com", phone: "+1 555-200-3002", specialization: ["Japan", "South Korea"], countries: ["Japan", "South Korea"], activeStudents: 10, totalPlacements: 55, rating: 4.4, status: "active", instituteId: "CON3", consultancyId: "CON3" },
  // Consultancy 4
  { id: "C9", name: "Emily Watson", email: "emily@edubridge.com", phone: "+1 555-300-4001", specialization: ["Australia", "USA", "Canada"], countries: ["Australia", "United States", "Canada"], activeStudents: 16, totalPlacements: 100, rating: 4.6, status: "active", instituteId: "CON4", consultancyId: "CON4" },
  { id: "C10", name: "Hans Mueller", email: "hans@edubridge.com", phone: "+49 170-123-4567", specialization: ["Germany", "Austria", "Switzerland"], countries: ["Germany", "Austria", "Switzerland"], activeStudents: 11, totalPlacements: 70, rating: 4.5, status: "active", instituteId: "CON4", consultancyId: "CON4" },
];

export async function fetchCounselors(instituteId?: string): Promise<ApiResponse<Counselor[]>> {
  const filtered = instituteId ? mockCounselors.filter((c) => c.consultancyId === instituteId || c.instituteId === instituteId) : mockCounselors;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createCounselor(counselor: Omit<Counselor, "id">): Promise<ApiResponse<Counselor>> {
  const newCounselor: Counselor = { ...counselor, id: `C${mockCounselors.length + 1}` };
  mockCounselors.push(newCounselor);
  return mockApiCall({ data: newCounselor, message: "Counselor added" });
}

export async function updateCounselor(id: string, data: Partial<Counselor>): Promise<ApiResponse<Counselor>> {
  const idx = mockCounselors.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Not found");
  mockCounselors[idx] = { ...mockCounselors[idx], ...data };
  return mockApiCall({ data: mockCounselors[idx], message: "Updated" });
}

export async function deleteCounselor(id: string): Promise<ApiResponse<null>> {
  const idx = mockCounselors.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Not found");
  mockCounselors.splice(idx, 1);
  return mockApiCall({ data: null, message: "Deleted" });
}
