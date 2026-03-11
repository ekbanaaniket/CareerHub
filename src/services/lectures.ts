import { mockApiCall } from "./api";
import type { Lecture, ApiResponse, SearchParams } from "@/types";

const mockLectures: Lecture[] = [
  // Institute 1 - TechVerse Academy
  { id: "L1", title: "Introduction to HTML & CSS", instructor: "John Doe", duration: "2h 15m", date: "Jan 15, 2026", views: 245, status: "recorded", module: "Week 1", instituteId: "1" },
  { id: "L2", title: "JavaScript Fundamentals", instructor: "John Doe", duration: "2h 30m", date: "Jan 16, 2026", views: 230, status: "recorded", module: "Week 1", instituteId: "1" },
  { id: "L3", title: "DOM Manipulation Deep Dive", instructor: "Jane Smith", duration: "1h 45m", date: "Jan 20, 2026", views: 198, status: "recorded", module: "Week 2", instituteId: "1" },
  { id: "L4", title: "React Basics - Components & Props", instructor: "John Doe", duration: "2h 00m", date: "Feb 3, 2026", views: 175, status: "recorded", module: "Week 5", instituteId: "1" },
  { id: "L5", title: "TypeScript for React", instructor: "Jane Smith", duration: "2h 20m", date: "Feb 10, 2026", views: 160, status: "recorded", module: "Week 6", instituteId: "1" },
  { id: "L6", title: "State Management with Hooks", instructor: "John Doe", duration: "—", date: "Mar 3, 2026", views: 0, status: "upcoming", module: "Week 9", instituteId: "1" },
  { id: "L7", title: "API Integration & Fetching", instructor: "Jane Smith", duration: "—", date: "Mar 5, 2026", views: 0, status: "scheduled", module: "Week 9", instituteId: "1" },
  { id: "L8", title: "Git Workflow & Collaboration", instructor: "John Doe", duration: "1h 50m", date: "Jan 22, 2026", views: 210, status: "recorded", module: "Week 4", instituteId: "1" },
  { id: "L14", title: "Testing with Vitest & React Testing Library", instructor: "John Doe", duration: "2h 10m", date: "Feb 17, 2026", views: 142, status: "recorded", module: "Week 7", instituteId: "1" },
  { id: "L15", title: "Tailwind CSS Advanced Patterns", instructor: "Jane Smith", duration: "1h 35m", date: "Feb 20, 2026", views: 135, status: "recorded", module: "Week 7", instituteId: "1" },
  { id: "L16", title: "Authentication & Authorization", instructor: "John Doe", duration: "—", date: "Mar 10, 2026", views: 0, status: "scheduled", module: "Week 10", instituteId: "1" },
  { id: "L17", title: "Database Design with PostgreSQL", instructor: "Jane Smith", duration: "—", date: "Mar 12, 2026", views: 0, status: "scheduled", module: "Week 10", instituteId: "1" },
  { id: "L18", title: "Docker Containerization", instructor: "John Doe", duration: "—", date: "Mar 17, 2026", views: 0, status: "upcoming", module: "Week 11", instituteId: "1" },
  // Institute 2 - CodeMaster Institute
  { id: "L9", title: "Python Data Structures", instructor: "Karen White", duration: "2h 00m", date: "Jan 18, 2026", views: 190, status: "recorded", module: "Week 2", instituteId: "2" },
  { id: "L10", title: "Pandas DataFrames", instructor: "Karen White", duration: "2h 30m", date: "Feb 5, 2026", views: 145, status: "recorded", module: "Week 5", instituteId: "2" },
  { id: "L11", title: "Machine Learning Intro", instructor: "Karen White", duration: "—", date: "Mar 10, 2026", views: 0, status: "upcoming", module: "Week 10", instituteId: "2" },
  { id: "L19", title: "NumPy for Scientific Computing", instructor: "Karen White", duration: "1h 50m", date: "Jan 25, 2026", views: 165, status: "recorded", module: "Week 3", instituteId: "2" },
  { id: "L20", title: "Data Visualization with Matplotlib", instructor: "Karen White", duration: "2h 15m", date: "Feb 12, 2026", views: 130, status: "recorded", module: "Week 6", instituteId: "2" },
  { id: "L21", title: "Scikit-learn Regression Models", instructor: "Karen White", duration: "2h 00m", date: "Feb 19, 2026", views: 110, status: "recorded", module: "Week 7", instituteId: "2" },
  { id: "L22", title: "Deep Learning Fundamentals", instructor: "Karen White", duration: "—", date: "Mar 15, 2026", views: 0, status: "scheduled", module: "Week 11", instituteId: "2" },
  { id: "L23", title: "React Native Navigation", instructor: "Alex Park", duration: "1h 45m", date: "Feb 8, 2026", views: 88, status: "recorded", module: "Week 4", instituteId: "2" },
  { id: "L24", title: "Firebase Integration for Mobile", instructor: "Alex Park", duration: "2h 00m", date: "Feb 22, 2026", views: 72, status: "recorded", module: "Week 6", instituteId: "2" },
  // Institute 3 - Digital Skills Hub
  { id: "L12", title: "Figma Basics & Interface", instructor: "Tom Harris", duration: "1h 30m", date: "Jan 20, 2026", views: 120, status: "recorded", module: "Week 1", instituteId: "3" },
  { id: "L13", title: "User Research Methods", instructor: "Tom Harris", duration: "2h 00m", date: "Feb 1, 2026", views: 95, status: "recorded", module: "Week 3", instituteId: "3" },
  { id: "L25", title: "Wireframing & Prototyping", instructor: "Tom Harris", duration: "1h 45m", date: "Feb 8, 2026", views: 102, status: "recorded", module: "Week 4", instituteId: "3" },
  { id: "L26", title: "Design Systems & Component Libraries", instructor: "Tom Harris", duration: "2h 10m", date: "Feb 15, 2026", views: 88, status: "recorded", module: "Week 5", instituteId: "3" },
  { id: "L27", title: "Accessibility in Design", instructor: "Tom Harris", duration: "—", date: "Mar 8, 2026", views: 0, status: "upcoming", module: "Week 8", instituteId: "3" },
  // Institute 4 - FutureStack University
  { id: "L28", title: "AWS EC2 & S3 Fundamentals", instructor: "Mike Chen", duration: "2h 00m", date: "Jan 22, 2026", views: 155, status: "recorded", module: "Week 2", instituteId: "4" },
  { id: "L29", title: "Terraform Infrastructure as Code", instructor: "Mike Chen", duration: "2h 30m", date: "Feb 5, 2026", views: 120, status: "recorded", module: "Week 4", instituteId: "4" },
  { id: "L30", title: "Serverless Architecture Patterns", instructor: "Mike Chen", duration: "1h 50m", date: "Feb 15, 2026", views: 98, status: "recorded", module: "Week 6", instituteId: "4" },
  { id: "L31", title: "Network Security Fundamentals", instructor: "Sara Lopez", duration: "2h 00m", date: "Feb 8, 2026", views: 110, status: "recorded", module: "Week 3", instituteId: "4" },
  { id: "L32", title: "Ethical Hacking Workshop", instructor: "Sara Lopez", duration: "—", date: "Mar 10, 2026", views: 0, status: "upcoming", module: "Week 8", instituteId: "4" },
  // Institute 5 - ByteForge Academy
  { id: "L33", title: "Rust Ownership & Borrowing", instructor: "Dan Keller", duration: "2h 15m", date: "Jan 25, 2026", views: 85, status: "recorded", module: "Week 2", instituteId: "5" },
  { id: "L34", title: "Concurrency in Rust", instructor: "Dan Keller", duration: "2h 30m", date: "Feb 10, 2026", views: 68, status: "recorded", module: "Week 5", instituteId: "5" },
  { id: "L35", title: "WebAssembly with Rust", instructor: "Dan Keller", duration: "—", date: "Mar 5, 2026", views: 0, status: "scheduled", module: "Week 8", instituteId: "5" },
  { id: "L36", title: "Unity Game Physics", instructor: "Lisa Wang", duration: "2h 00m", date: "Feb 3, 2026", views: 92, status: "recorded", module: "Week 3", instituteId: "5" },
  { id: "L37", title: "C# Advanced Patterns for Games", instructor: "Lisa Wang", duration: "1h 45m", date: "Feb 18, 2026", views: 75, status: "recorded", module: "Week 5", instituteId: "5" },
];

export async function fetchLectures(params?: SearchParams): Promise<ApiResponse<Lecture[]>> {
  let filtered = [...mockLectures];
  if (params?.instituteId) filtered = filtered.filter((l) => l.instituteId === params.instituteId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((l) => l.title.toLowerCase().includes(q) || l.instructor.toLowerCase().includes(q));
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((l) => l.status === params.status);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function createLecture(lecture: Omit<Lecture, "id">): Promise<ApiResponse<Lecture>> {
  const newLecture: Lecture = { ...lecture, id: `L${mockLectures.length + 1}` };
  mockLectures.push(newLecture);
  return mockApiCall({ data: newLecture, message: "Lecture scheduled successfully" });
}
