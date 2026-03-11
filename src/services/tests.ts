import { mockApiCall } from "./api";
import type { Test, ApiResponse, SearchParams } from "@/types";

const mockTests: Test[] = [
  // Institute 1 - TechVerse Academy
  { id: "T001", name: "JavaScript Fundamentals", type: "Quiz", course: "Full-Stack 2026", date: "Mar 5, 2026", duration: "30 min", questions: 25, maxMarks: 100, status: "upcoming", submissions: 0, avgScore: null, instituteId: "1" },
  { id: "T002", name: "React & TypeScript Mid-Term", type: "Exam", course: "Full-Stack 2026", date: "Mar 8, 2026", duration: "2 hrs", questions: 50, maxMarks: 200, status: "upcoming", submissions: 0, avgScore: null, instituteId: "1" },
  { id: "T003", name: "HTML/CSS Basics", type: "Quiz", course: "Frontend Bootcamp", date: "Feb 28, 2026", duration: "20 min", questions: 20, maxMarks: 50, status: "completed", submissions: 42, avgScore: 78, instituteId: "1" },
  { id: "T004", name: "Node.js API Design", type: "Exam", course: "Backend Mastery", date: "Feb 25, 2026", duration: "1.5 hrs", questions: 35, maxMarks: 150, status: "completed", submissions: 38, avgScore: 72, instituteId: "1" },
  { id: "T005", name: "Git & GitHub Workflow", type: "Quiz", course: "Full-Stack 2026", date: "Feb 20, 2026", duration: "15 min", questions: 15, maxMarks: 30, status: "completed", submissions: 45, avgScore: 85, instituteId: "1" },
  { id: "T006", name: "Database Design", type: "Assignment", course: "Full-Stack 2026", date: "Mar 15, 2026", duration: "3 days", questions: 5, maxMarks: 100, status: "draft", submissions: 0, avgScore: null, instituteId: "1" },
  { id: "T007", name: "TypeScript Advanced", type: "Quiz", course: "Full-Stack 2026", date: "Mar 1, 2026", duration: "25 min", questions: 20, maxMarks: 80, status: "in_progress", submissions: 28, avgScore: null, instituteId: "1" },
  { id: "T012", name: "CSS Flexbox & Grid", type: "Quiz", course: "Frontend Bootcamp", date: "Mar 3, 2026", duration: "20 min", questions: 15, maxMarks: 50, status: "completed", submissions: 40, avgScore: 82, instituteId: "1" },
  { id: "T013", name: "REST API Final Project", type: "Assignment", course: "Backend Mastery", date: "Mar 20, 2026", duration: "5 days", questions: 3, maxMarks: 200, status: "upcoming", submissions: 0, avgScore: null, instituteId: "1" },
  { id: "T014", name: "React State Management Quiz", type: "Quiz", course: "Full-Stack 2026", date: "Mar 10, 2026", duration: "25 min", questions: 20, maxMarks: 60, status: "upcoming", submissions: 0, avgScore: null, instituteId: "1" },
  // Institute 2 - CodeMaster Institute
  { id: "T008", name: "Python Basics Quiz", type: "Quiz", course: "Python for Data Science", date: "Mar 3, 2026", duration: "30 min", questions: 25, maxMarks: 100, status: "completed", submissions: 80, avgScore: 82, instituteId: "2" },
  { id: "T009", name: "React Native Mid-Term", type: "Exam", course: "Mobile App Development", date: "Mar 12, 2026", duration: "2 hrs", questions: 40, maxMarks: 200, status: "upcoming", submissions: 0, avgScore: null, instituteId: "2" },
  { id: "T015", name: "Pandas Data Analysis", type: "Assignment", course: "Python for Data Science", date: "Feb 28, 2026", duration: "2 days", questions: 5, maxMarks: 100, status: "completed", submissions: 75, avgScore: 79, instituteId: "2" },
  { id: "T016", name: "ML Algorithms Quiz", type: "Quiz", course: "AI & Machine Learning", date: "Mar 5, 2026", duration: "40 min", questions: 30, maxMarks: 120, status: "in_progress", submissions: 42, avgScore: null, instituteId: "2" },
  { id: "T017", name: "Data Pipeline Design", type: "Assignment", course: "Data Engineering Pipeline", date: "Mar 15, 2026", duration: "4 days", questions: 2, maxMarks: 150, status: "upcoming", submissions: 0, avgScore: null, instituteId: "2" },
  // Institute 3 - Digital Skills Hub
  { id: "T010", name: "Figma Proficiency Test", type: "Assignment", course: "UI/UX Design Mastery", date: "Mar 5, 2026", duration: "2 days", questions: 3, maxMarks: 100, status: "in_progress", submissions: 30, avgScore: null, instituteId: "3" },
  { id: "T011", name: "Design Systems Quiz", type: "Quiz", course: "UI/UX Design Mastery", date: "Feb 20, 2026", duration: "20 min", questions: 15, maxMarks: 50, status: "completed", submissions: 52, avgScore: 88, instituteId: "3" },
  { id: "T018", name: "User Research Portfolio", type: "Assignment", course: "UI/UX Design Mastery", date: "Mar 12, 2026", duration: "3 days", questions: 4, maxMarks: 100, status: "upcoming", submissions: 0, avgScore: null, instituteId: "3" },
  { id: "T019", name: "Product Strategy Case Study", type: "Exam", course: "Product Management", date: "Mar 8, 2026", duration: "2 hrs", questions: 10, maxMarks: 100, status: "upcoming", submissions: 0, avgScore: null, instituteId: "3" },
  // Institute 4 - FutureStack University
  { id: "T020", name: "AWS Solutions Architect Quiz", type: "Quiz", course: "Cloud Architecture", date: "Mar 3, 2026", duration: "45 min", questions: 35, maxMarks: 100, status: "completed", submissions: 45, avgScore: 76, instituteId: "4" },
  { id: "T021", name: "Terraform Lab Assessment", type: "Assignment", course: "Cloud Architecture", date: "Mar 10, 2026", duration: "3 days", questions: 5, maxMarks: 100, status: "upcoming", submissions: 0, avgScore: null, instituteId: "4" },
  { id: "T022", name: "Network Security Exam", type: "Exam", course: "Cybersecurity Basics", date: "Mar 15, 2026", duration: "2 hrs", questions: 40, maxMarks: 200, status: "upcoming", submissions: 0, avgScore: null, instituteId: "4" },
  // Institute 5 - ByteForge Academy
  { id: "T023", name: "Rust Memory Management Quiz", type: "Quiz", course: "Rust Systems Programming", date: "Feb 28, 2026", duration: "30 min", questions: 20, maxMarks: 80, status: "completed", submissions: 22, avgScore: 74, instituteId: "5" },
  { id: "T024", name: "Unity Game Project", type: "Assignment", course: "Game Dev with Unity", date: "Mar 20, 2026", duration: "7 days", questions: 1, maxMarks: 300, status: "upcoming", submissions: 0, avgScore: null, instituteId: "5" },
  { id: "T025", name: "Concurrency Patterns Exam", type: "Exam", course: "Rust Systems Programming", date: "Mar 12, 2026", duration: "1.5 hrs", questions: 25, maxMarks: 100, status: "upcoming", submissions: 0, avgScore: null, instituteId: "5" },
];

export async function fetchTests(params?: SearchParams): Promise<ApiResponse<Test[]>> {
  let filtered = [...mockTests];
  if (params?.instituteId) filtered = filtered.filter((t) => t.instituteId === params.instituteId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((t) => t.name.toLowerCase().includes(q));
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((t) => t.status === params.status);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function createTest(test: Omit<Test, "id">): Promise<ApiResponse<Test>> {
  const newTest: Test = { ...test, id: `T${String(mockTests.length + 1).padStart(3, "0")}` };
  mockTests.push(newTest);
  return mockApiCall({ data: newTest, message: "Test created successfully" });
}

export async function updateTest(id: string, data: Partial<Test>): Promise<ApiResponse<Test>> {
  const idx = mockTests.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Test not found");
  mockTests[idx] = { ...mockTests[idx], ...data };
  return mockApiCall({ data: mockTests[idx], message: "Test updated successfully" });
}

export async function deleteTest(id: string): Promise<ApiResponse<null>> {
  const idx = mockTests.findIndex((t) => t.id === id);
  if (idx === -1) throw new Error("Test not found");
  mockTests.splice(idx, 1);
  return mockApiCall({ data: null, message: "Test deleted successfully" });
}
