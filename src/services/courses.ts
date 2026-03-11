import { mockApiCall } from "./api";
import type { Course, ApiResponse, SearchParams } from "@/types";

const mockCourses: Course[] = [
  // Institute 1 - TechVerse Academy
  { id: "C1", name: "Full-Stack Developer 2026", description: "24-week comprehensive program covering Next.js, NestJS, PostgreSQL, Docker", students: 128, modules: 24, completedModules: 9, status: "active", startDate: "Jan 2026", endDate: "Jun 2026", topics: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"], instituteId: "1" },
  { id: "C2", name: "Frontend Bootcamp", description: "12-week intensive frontend development with React and modern CSS", students: 45, modules: 12, completedModules: 6, status: "active", startDate: "Feb 2026", endDate: "Apr 2026", topics: ["HTML/CSS", "JavaScript", "React", "Tailwind"], instituteId: "1" },
  { id: "C3", name: "Backend Mastery", description: "16-week backend engineering with NestJS, databases, and DevOps", students: 38, modules: 16, completedModules: 4, status: "active", startDate: "Feb 2026", endDate: "May 2026", topics: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Docker"], instituteId: "1" },
  { id: "C4", name: "DevOps Fundamentals", description: "8-week course on CI/CD, Docker, Kubernetes, and cloud deployment", students: 22, modules: 8, completedModules: 0, status: "upcoming", startDate: "Apr 2026", endDate: "May 2026", topics: ["Docker", "Kubernetes", "AWS", "CI/CD"], instituteId: "1" },
  { id: "C4b", name: "API Design Patterns", description: "10-week course on RESTful APIs, GraphQL, and microservices", students: 35, modules: 10, completedModules: 3, status: "active", startDate: "Feb 2026", endDate: "Apr 2026", topics: ["REST", "GraphQL", "gRPC", "OpenAPI"], instituteId: "1" },
  // Institute 2 - CodeMaster Institute
  { id: "C5", name: "Python for Data Science", description: "20-week data science program with Python, Pandas, ML basics", students: 85, modules: 20, completedModules: 10, status: "active", startDate: "Jan 2026", endDate: "May 2026", topics: ["Python", "Pandas", "NumPy", "Scikit-learn", "Matplotlib"], instituteId: "2" },
  { id: "C6", name: "Mobile App Development", description: "16-week React Native course for cross-platform mobile apps", students: 32, modules: 16, completedModules: 3, status: "active", startDate: "Feb 2026", endDate: "Jun 2026", topics: ["React Native", "Expo", "TypeScript", "Firebase"], instituteId: "2" },
  { id: "C6b", name: "AI & Machine Learning", description: "18-week deep dive into ML algorithms, neural networks, and TensorFlow", students: 60, modules: 18, completedModules: 7, status: "active", startDate: "Jan 2026", endDate: "May 2026", topics: ["Python", "TensorFlow", "PyTorch", "NLP"], instituteId: "2" },
  { id: "C6c", name: "Data Engineering Pipeline", description: "14-week course on building scalable data pipelines", students: 28, modules: 14, completedModules: 5, status: "active", startDate: "Feb 2026", endDate: "May 2026", topics: ["Spark", "Kafka", "Airflow", "BigQuery"], instituteId: "2" },
  // Institute 3 - Digital Skills Hub
  { id: "C7", name: "UI/UX Design Mastery", description: "12-week design program covering Figma, user research, prototyping", students: 55, modules: 12, completedModules: 8, status: "active", startDate: "Jan 2026", endDate: "Apr 2026", topics: ["Figma", "User Research", "Prototyping", "Design Systems"], instituteId: "3" },
  { id: "C8", name: "Digital Marketing", description: "10-week course covering SEO, SEM, social media marketing", students: 40, modules: 10, completedModules: 0, status: "upcoming", startDate: "Apr 2026", endDate: "Jun 2026", topics: ["SEO", "Google Ads", "Social Media", "Analytics"], instituteId: "3" },
  { id: "C8b", name: "Product Management", description: "8-week course on product strategy, roadmapping, and analytics", students: 30, modules: 8, completedModules: 4, status: "active", startDate: "Feb 2026", endDate: "Apr 2026", topics: ["Strategy", "Roadmaps", "Metrics", "Agile"], instituteId: "3" },
  // Institute 4 - FutureStack University
  { id: "C9", name: "Cloud Architecture", description: "16-week AWS/GCP cloud architecture and solutions design", students: 48, modules: 16, completedModules: 6, status: "active", startDate: "Jan 2026", endDate: "May 2026", topics: ["AWS", "GCP", "Terraform", "Serverless"], instituteId: "4" },
  { id: "C10", name: "Cybersecurity Basics", description: "12-week intro to network security, ethical hacking, and compliance", students: 35, modules: 12, completedModules: 4, status: "active", startDate: "Feb 2026", endDate: "Apr 2026", topics: ["Network Security", "Ethical Hacking", "OWASP", "Compliance"], instituteId: "4" },
  { id: "C10b", name: "Blockchain Development", description: "10-week Solidity and smart contract development", students: 20, modules: 10, completedModules: 0, status: "upcoming", startDate: "Apr 2026", endDate: "Jun 2026", topics: ["Solidity", "Ethereum", "Web3.js", "DeFi"], instituteId: "4" },
  // Institute 5 - ByteForge Academy
  { id: "C11", name: "Rust Systems Programming", description: "14-week low-level systems programming with Rust", students: 25, modules: 14, completedModules: 5, status: "active", startDate: "Jan 2026", endDate: "Apr 2026", topics: ["Rust", "Memory Safety", "Concurrency", "WebAssembly"], instituteId: "5" },
  { id: "C12", name: "Game Dev with Unity", description: "16-week game development with C# and Unity engine", students: 42, modules: 16, completedModules: 7, status: "active", startDate: "Jan 2026", endDate: "May 2026", topics: ["Unity", "C#", "3D Graphics", "Game Design"], instituteId: "5" },
];

export async function fetchCourses(instituteId?: string, params?: SearchParams): Promise<ApiResponse<Course[]>> {
  let filtered = instituteId ? mockCourses.filter((c) => c.instituteId === instituteId) : [...mockCourses];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((c) => c.status === params.status);
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 50;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function createCourse(course: Omit<Course, "id">): Promise<ApiResponse<Course>> {
  const newCourse: Course = { ...course, id: `C${mockCourses.length + 1}` };
  mockCourses.push(newCourse);
  return mockApiCall({ data: newCourse, message: "Course created successfully" });
}

export async function updateCourse(id: string, data: Partial<Course>): Promise<ApiResponse<Course>> {
  const idx = mockCourses.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Course not found");
  mockCourses[idx] = { ...mockCourses[idx], ...data };
  return mockApiCall({ data: mockCourses[idx], message: "Course updated successfully" });
}
