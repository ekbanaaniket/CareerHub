// ============= Test Submissions Service =============
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface TestSubmission {
  id: string;
  testId: string;
  testName: string;
  studentId: string;
  studentName: string;
  score: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  timeTaken: string;
  course: string;
  instituteId: string;
}

function getGrade(pct: number): string {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

const mockSubmissions: TestSubmission[] = [
  // T003 - HTML/CSS Basics (completed, inst 1)
  { id: "TS001", testId: "T003", testName: "HTML/CSS Basics", studentId: "S001", studentName: "Alice Johnson", score: 42, maxMarks: 50, percentage: 84, grade: "A", submittedAt: "Feb 28, 2026", timeTaken: "18 min", course: "Frontend Bootcamp", instituteId: "1" },
  { id: "TS002", testId: "T003", testName: "HTML/CSS Basics", studentId: "S002", studentName: "Bob Smith", score: 39, maxMarks: 50, percentage: 78, grade: "B+", submittedAt: "Feb 28, 2026", timeTaken: "19 min", course: "Frontend Bootcamp", instituteId: "1" },
  { id: "TS003", testId: "T003", testName: "HTML/CSS Basics", studentId: "S005", studentName: "Eva Martinez", score: 47, maxMarks: 50, percentage: 94, grade: "A+", submittedAt: "Feb 28, 2026", timeTaken: "15 min", course: "Frontend Bootcamp", instituteId: "1" },
  { id: "TS004", testId: "T003", testName: "HTML/CSS Basics", studentId: "S004", studentName: "David Lee", score: 45, maxMarks: 50, percentage: 90, grade: "A+", submittedAt: "Feb 28, 2026", timeTaken: "16 min", course: "Frontend Bootcamp", instituteId: "1" },
  { id: "TS005", testId: "T003", testName: "HTML/CSS Basics", studentId: "S007", studentName: "Hannah Park", score: 35, maxMarks: 50, percentage: 70, grade: "B+", submittedAt: "Feb 28, 2026", timeTaken: "20 min", course: "Frontend Bootcamp", instituteId: "1" },
  { id: "TS006", testId: "T003", testName: "HTML/CSS Basics", studentId: "S010", studentName: "Kevin O'Brien", score: 48, maxMarks: 50, percentage: 96, grade: "A+", submittedAt: "Feb 28, 2026", timeTaken: "14 min", course: "Frontend Bootcamp", instituteId: "1" },
  // T004 - Node.js API Design (completed, inst 1)
  { id: "TS007", testId: "T004", testName: "Node.js API Design", studentId: "S008", studentName: "Ian Thompson", score: 128, maxMarks: 150, percentage: 85, grade: "A", submittedAt: "Feb 25, 2026", timeTaken: "1 hr 20 min", course: "Backend Mastery", instituteId: "1" },
  { id: "TS008", testId: "T004", testName: "Node.js API Design", studentId: "S002", studentName: "Bob Smith", score: 105, maxMarks: 150, percentage: 70, grade: "B+", submittedAt: "Feb 25, 2026", timeTaken: "1 hr 25 min", course: "Backend Mastery", instituteId: "1" },
  { id: "TS009", testId: "T004", testName: "Node.js API Design", studentId: "S004", studentName: "David Lee", score: 140, maxMarks: 150, percentage: 93, grade: "A+", submittedAt: "Feb 25, 2026", timeTaken: "1 hr 10 min", course: "Backend Mastery", instituteId: "1" },
  { id: "TS010", testId: "T004", testName: "Node.js API Design", studentId: "S012", studentName: "Marco Rivera", score: 132, maxMarks: 150, percentage: 88, grade: "A", submittedAt: "Feb 25, 2026", timeTaken: "1 hr 15 min", course: "Backend Mastery", instituteId: "1" },
  // T005 - Git & GitHub (completed, inst 1)
  { id: "TS011", testId: "T005", testName: "Git & GitHub Workflow", studentId: "S001", studentName: "Alice Johnson", score: 27, maxMarks: 30, percentage: 90, grade: "A+", submittedAt: "Feb 20, 2026", timeTaken: "12 min", course: "Full-Stack 2026", instituteId: "1" },
  { id: "TS012", testId: "T005", testName: "Git & GitHub Workflow", studentId: "S002", studentName: "Bob Smith", score: 25, maxMarks: 30, percentage: 83, grade: "A", submittedAt: "Feb 20, 2026", timeTaken: "13 min", course: "Full-Stack 2026", instituteId: "1" },
  { id: "TS013", testId: "T005", testName: "Git & GitHub Workflow", studentId: "S004", studentName: "David Lee", score: 29, maxMarks: 30, percentage: 97, grade: "A+", submittedAt: "Feb 20, 2026", timeTaken: "10 min", course: "Full-Stack 2026", instituteId: "1" },
  { id: "TS014", testId: "T005", testName: "Git & GitHub Workflow", studentId: "S009", studentName: "Julia Chen", score: 21, maxMarks: 30, percentage: 70, grade: "B+", submittedAt: "Feb 20, 2026", timeTaken: "14 min", course: "Full-Stack 2026", instituteId: "1" },
  { id: "TS015", testId: "T005", testName: "Git & GitHub Workflow", studentId: "S012", studentName: "Marco Rivera", score: 28, maxMarks: 30, percentage: 93, grade: "A+", submittedAt: "Feb 20, 2026", timeTaken: "11 min", course: "Full-Stack 2026", instituteId: "1" },
  // T008 - Python Basics Quiz (completed, inst 2)
  { id: "TS016", testId: "T008", testName: "Python Basics Quiz", studentId: "S013", studentName: "Grace Kim", score: 92, maxMarks: 100, percentage: 92, grade: "A+", submittedAt: "Mar 3, 2026", timeTaken: "25 min", course: "Python for Data Science", instituteId: "2" },
  { id: "TS017", testId: "T008", testName: "Python Basics Quiz", studentId: "S014", studentName: "Henry Brown", score: 78, maxMarks: 100, percentage: 78, grade: "B+", submittedAt: "Mar 3, 2026", timeTaken: "28 min", course: "Python for Data Science", instituteId: "2" },
  { id: "TS018", testId: "T008", testName: "Python Basics Quiz", studentId: "S016", studentName: "Oscar Gutierrez", score: 85, maxMarks: 100, percentage: 85, grade: "A", submittedAt: "Mar 3, 2026", timeTaken: "26 min", course: "Python for Data Science", instituteId: "2" },
  { id: "TS019", testId: "T008", testName: "Python Basics Quiz", studentId: "S020", studentName: "Sam Turner", score: 96, maxMarks: 100, percentage: 96, grade: "A+", submittedAt: "Mar 3, 2026", timeTaken: "22 min", course: "Python for Data Science", instituteId: "2" },
  // T011 - Design Systems Quiz (completed, inst 3)
  { id: "TS020", testId: "T011", testName: "Design Systems Quiz", studentId: "S021", studentName: "Tina Patel", score: 46, maxMarks: 50, percentage: 92, grade: "A+", submittedAt: "Feb 20, 2026", timeTaken: "17 min", course: "UI/UX Design Mastery", instituteId: "3" },
  { id: "TS021", testId: "T011", testName: "Design Systems Quiz", studentId: "S022", studentName: "Uma Nakamura", score: 41, maxMarks: 50, percentage: 82, grade: "A", submittedAt: "Feb 20, 2026", timeTaken: "19 min", course: "UI/UX Design Mastery", instituteId: "3" },
  // T012 - CSS Flexbox & Grid (completed, inst 1)
  { id: "TS022", testId: "T012", testName: "CSS Flexbox & Grid", studentId: "S005", studentName: "Eva Martinez", score: 44, maxMarks: 50, percentage: 88, grade: "A", submittedAt: "Mar 3, 2026", timeTaken: "18 min", course: "Frontend Bootcamp", instituteId: "1" },
  { id: "TS023", testId: "T012", testName: "CSS Flexbox & Grid", studentId: "S007", studentName: "Hannah Park", score: 38, maxMarks: 50, percentage: 76, grade: "B+", submittedAt: "Mar 3, 2026", timeTaken: "19 min", course: "Frontend Bootcamp", instituteId: "1" },
  { id: "TS024", testId: "T012", testName: "CSS Flexbox & Grid", studentId: "S010", studentName: "Kevin O'Brien", score: 46, maxMarks: 50, percentage: 92, grade: "A+", submittedAt: "Mar 3, 2026", timeTaken: "16 min", course: "Frontend Bootcamp", instituteId: "1" },
  // T015 - Pandas Data Analysis (completed, inst 2)
  { id: "TS025", testId: "T015", testName: "Pandas Data Analysis", studentId: "S013", studentName: "Grace Kim", score: 88, maxMarks: 100, percentage: 88, grade: "A", submittedAt: "Feb 28, 2026", timeTaken: "1 day", course: "Python for Data Science", instituteId: "2" },
  { id: "TS026", testId: "T015", testName: "Pandas Data Analysis", studentId: "S020", studentName: "Sam Turner", score: 95, maxMarks: 100, percentage: 95, grade: "A+", submittedAt: "Feb 28, 2026", timeTaken: "1 day", course: "Python for Data Science", instituteId: "2" },
  // T020 - AWS Solutions Architect (completed, inst 4)
  { id: "TS027", testId: "T020", testName: "AWS Solutions Architect Quiz", studentId: "S026", studentName: "Yara Hassan", score: 82, maxMarks: 100, percentage: 82, grade: "A", submittedAt: "Mar 3, 2026", timeTaken: "40 min", course: "Cloud Architecture", instituteId: "4" },
  { id: "TS028", testId: "T020", testName: "AWS Solutions Architect Quiz", studentId: "S027", studentName: "Zach Cooper", score: 68, maxMarks: 100, percentage: 68, grade: "B", submittedAt: "Mar 3, 2026", timeTaken: "44 min", course: "Cloud Architecture", instituteId: "4" },
  { id: "TS029", testId: "T020", testName: "AWS Solutions Architect Quiz", studentId: "S030", studentName: "Chloe Park", score: 91, maxMarks: 100, percentage: 91, grade: "A+", submittedAt: "Mar 3, 2026", timeTaken: "35 min", course: "Cloud Architecture", instituteId: "4" },
  // T023 - Rust Memory Management (completed, inst 5)
  { id: "TS030", testId: "T023", testName: "Rust Memory Management Quiz", studentId: "S031", studentName: "Derek Frost", score: 62, maxMarks: 80, percentage: 78, grade: "B+", submittedAt: "Feb 28, 2026", timeTaken: "28 min", course: "Rust Systems Programming", instituteId: "5" },
  { id: "TS031", testId: "T023", testName: "Rust Memory Management Quiz", studentId: "S032", studentName: "Elena Volkov", score: 72, maxMarks: 80, percentage: 90, grade: "A+", submittedAt: "Feb 28, 2026", timeTaken: "24 min", course: "Rust Systems Programming", instituteId: "5" },
  { id: "TS032", testId: "T023", testName: "Rust Memory Management Quiz", studentId: "S035", studentName: "Hugo Andersen", score: 56, maxMarks: 80, percentage: 70, grade: "B+", submittedAt: "Feb 28, 2026", timeTaken: "29 min", course: "Rust Systems Programming", instituteId: "5" },
];

export async function fetchTestSubmissions(testId: string): Promise<ApiResponse<TestSubmission[]>> {
  const filtered = mockSubmissions.filter((s) => s.testId === testId);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchStudentSubmissions(studentId: string): Promise<ApiResponse<TestSubmission[]>> {
  const filtered = mockSubmissions.filter((s) => s.studentId === studentId);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchAllSubmissions(instituteId?: string): Promise<ApiResponse<TestSubmission[]>> {
  const filtered = instituteId ? mockSubmissions.filter((s) => s.instituteId === instituteId) : [...mockSubmissions];
  return mockApiCall({ data: filtered, total: filtered.length });
}
