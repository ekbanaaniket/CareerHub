import { mockApiCall } from "./api";
import type { Book, StudyMaterial, ApiResponse, SearchParams } from "@/types";

const mockBooks: Book[] = [
  // Institute 1
  { id: "B1", title: "Clean Code", author: "Robert C. Martin", category: "Best Practices", available: true, rating: 4.8, borrowed: 12, instituteId: "1" },
  { id: "B2", title: "JavaScript: The Good Parts", author: "Douglas Crockford", category: "JavaScript", available: true, rating: 4.5, borrowed: 25, instituteId: "1" },
  { id: "B3", title: "Design Patterns", author: "Gang of Four", category: "Architecture", available: false, rating: 4.7, borrowed: 18, instituteId: "1" },
  { id: "B4", title: "You Don't Know JS", author: "Kyle Simpson", category: "JavaScript", available: true, rating: 4.9, borrowed: 30, instituteId: "1" },
  { id: "B5", title: "The Pragmatic Programmer", author: "Hunt & Thomas", category: "Best Practices", available: true, rating: 4.6, borrowed: 22, instituteId: "1" },
  { id: "B6", title: "Eloquent JavaScript", author: "Marijn Haverbeke", category: "JavaScript", available: true, rating: 4.4, borrowed: 15, instituteId: "1" },
  // Institute 2
  { id: "B7", title: "Python Crash Course", author: "Eric Matthes", category: "Python", available: true, rating: 4.7, borrowed: 20, instituteId: "2" },
  { id: "B8", title: "Hands-On Machine Learning", author: "Aurélien Géron", category: "Machine Learning", available: false, rating: 4.8, borrowed: 28, instituteId: "2" },
  // Institute 3
  { id: "B9", title: "Don't Make Me Think", author: "Steve Krug", category: "UX", available: true, rating: 4.6, borrowed: 15, instituteId: "3" },
  { id: "B10", title: "The Design of Everyday Things", author: "Don Norman", category: "Design", available: true, rating: 4.8, borrowed: 18, instituteId: "3" },
];

const mockMaterials: StudyMaterial[] = [
  { id: "M1", title: "Week 1-4: HTML/CSS/JS Fundamentals", type: "PDF", size: "12.5 MB", uploadDate: "Jan 15, 2026", downloads: 145, instituteId: "1" },
  { id: "M2", title: "Week 5-8: React & TypeScript Deep Dive", type: "PDF", size: "18.3 MB", uploadDate: "Feb 1, 2026", downloads: 120, instituteId: "1" },
  { id: "M3", title: "Git Workflow Cheatsheet", type: "PDF", size: "2.1 MB", uploadDate: "Jan 20, 2026", downloads: 210, instituteId: "1" },
  { id: "M4", title: "NestJS Architecture Guide", type: "PDF", size: "8.7 MB", uploadDate: "Feb 15, 2026", downloads: 85, instituteId: "1" },
  { id: "M5", title: "Docker Basics Handbook", type: "PDF", size: "5.4 MB", uploadDate: "Feb 20, 2026", downloads: 95, instituteId: "1" },
  // Institute 2
  { id: "M6", title: "Python Cheat Sheet", type: "PDF", size: "3.2 MB", uploadDate: "Jan 18, 2026", downloads: 180, instituteId: "2" },
  { id: "M7", title: "Data Science with Pandas", type: "PDF", size: "15.0 MB", uploadDate: "Feb 10, 2026", downloads: 110, instituteId: "2" },
  // Institute 3
  { id: "M8", title: "Figma Shortcuts Guide", type: "PDF", size: "1.8 MB", uploadDate: "Jan 22, 2026", downloads: 90, instituteId: "3" },
];

export async function fetchBooks(params?: SearchParams): Promise<ApiResponse<Book[]>> {
  let filtered = [...mockBooks];
  if (params?.instituteId) filtered = filtered.filter((b) => b.instituteId === params.instituteId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function fetchMaterials(params?: SearchParams): Promise<ApiResponse<StudyMaterial[]>> {
  let filtered = [...mockMaterials];
  if (params?.instituteId) filtered = filtered.filter((m) => m.instituteId === params.instituteId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((m) => m.title.toLowerCase().includes(q));
  }
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createBook(book: Omit<Book, "id">): Promise<ApiResponse<Book>> {
  const newBook: Book = { ...book, id: `B${mockBooks.length + 1}` };
  mockBooks.push(newBook);
  return mockApiCall({ data: newBook, message: "Book added successfully" });
}

export async function createMaterial(material: Omit<StudyMaterial, "id">): Promise<ApiResponse<StudyMaterial>> {
  const newMaterial: StudyMaterial = { ...material, id: `M${mockMaterials.length + 1}` };
  mockMaterials.push(newMaterial);
  return mockApiCall({ data: newMaterial, message: "Material uploaded successfully" });
}
