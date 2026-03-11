import { mockApiCall } from "./api";
import type { Student, ApiResponse, SearchParams } from "@/types";

const mockStudents: Student[] = [
  // Institute 1 - TechVerse Academy
  { id: "S001", name: "Alice Johnson", email: "alice@email.com", phone: "+1 234-567-8901", course: "Full-Stack 2026", batch: "Batch A", status: "active", progress: 78, joinDate: "Jan 15, 2026", instituteId: "1", city: "San Francisco" },
  { id: "S002", name: "Bob Smith", email: "bob@email.com", phone: "+1 234-567-8902", course: "Full-Stack 2026", batch: "Batch A", status: "active", progress: 85, joinDate: "Jan 15, 2026", instituteId: "1", city: "New York" },
  { id: "S003", name: "Carol Davis", email: "carol@email.com", phone: "+1 234-567-8903", course: "Full-Stack 2026", batch: "Batch B", status: "inactive", progress: 45, joinDate: "Feb 1, 2026", instituteId: "1", city: "Chicago" },
  { id: "S004", name: "David Lee", email: "david@email.com", phone: "+1 234-567-8904", course: "Full-Stack 2026", batch: "Batch A", status: "active", progress: 92, joinDate: "Jan 15, 2026", instituteId: "1", city: "San Francisco" },
  { id: "S005", name: "Eva Martinez", email: "eva@email.com", phone: "+1 234-567-8905", course: "Frontend Bootcamp", batch: "Batch C", status: "active", progress: 67, joinDate: "Feb 10, 2026", instituteId: "1", city: "Austin" },
  { id: "S006", name: "Frank Wilson", email: "frank@email.com", phone: "+1 234-567-8906", course: "Full-Stack 2026", batch: "Batch B", status: "suspended", progress: 30, joinDate: "Feb 1, 2026", instituteId: "1", city: "Los Angeles" },
  { id: "S007", name: "Hannah Park", email: "hannah@email.com", phone: "+1 234-567-8910", course: "Frontend Bootcamp", batch: "Batch A", status: "active", progress: 71, joinDate: "Jan 20, 2026", instituteId: "1", city: "Portland" },
  { id: "S008", name: "Ian Thompson", email: "ian@email.com", phone: "+1 234-567-8911", course: "Backend Mastery", batch: "Batch A", status: "active", progress: 83, joinDate: "Jan 20, 2026", instituteId: "1", city: "Denver" },
  { id: "S009", name: "Julia Chen", email: "julia@email.com", phone: "+1 234-567-8912", course: "Full-Stack 2026", batch: "Batch C", status: "active", progress: 56, joinDate: "Feb 15, 2026", instituteId: "1", city: "Seattle" },
  { id: "S010", name: "Kevin O'Brien", email: "kevin@email.com", phone: "+1 234-567-8913", course: "Frontend Bootcamp", batch: "Batch B", status: "active", progress: 89, joinDate: "Feb 1, 2026", instituteId: "1", city: "Boston" },
  { id: "S011", name: "Lisa Wang", email: "lisa@email.com", phone: "+1 234-567-8914", course: "Backend Mastery", batch: "Batch B", status: "inactive", progress: 34, joinDate: "Feb 10, 2026", instituteId: "1", city: "Miami" },
  { id: "S012", name: "Marco Rivera", email: "marco@email.com", phone: "+1 234-567-8915", course: "Full-Stack 2026", batch: "Batch A", status: "active", progress: 91, joinDate: "Jan 15, 2026", instituteId: "1", city: "Houston" },
  // Institute 2 - CodeMaster Institute
  { id: "S013", name: "Grace Kim", email: "grace@email.com", phone: "+1 234-567-8907", course: "Python for Data Science", batch: "Batch A", status: "active", progress: 88, joinDate: "Jan 20, 2026", instituteId: "2", city: "Seattle" },
  { id: "S014", name: "Henry Brown", email: "henry@email.com", phone: "+1 234-567-8908", course: "Python for Data Science", batch: "Batch A", status: "active", progress: 73, joinDate: "Jan 15, 2026", instituteId: "2", city: "Boston" },
  { id: "S015", name: "Natalie Foster", email: "natalie@email.com", phone: "+1 234-567-8916", course: "Mobile App Development", batch: "Batch A", status: "active", progress: 62, joinDate: "Feb 1, 2026", instituteId: "2", city: "San Diego" },
  { id: "S016", name: "Oscar Gutierrez", email: "oscar@email.com", phone: "+1 234-567-8917", course: "Python for Data Science", batch: "Batch B", status: "active", progress: 77, joinDate: "Feb 5, 2026", instituteId: "2", city: "Phoenix" },
  { id: "S017", name: "Priya Sharma", email: "priya@email.com", phone: "+1 234-567-8918", course: "Mobile App Development", batch: "Batch A", status: "active", progress: 81, joinDate: "Jan 25, 2026", instituteId: "2", city: "Dallas" },
  { id: "S018", name: "Quinn Miller", email: "quinn@email.com", phone: "+1 234-567-8919", course: "Python for Data Science", batch: "Batch A", status: "suspended", progress: 22, joinDate: "Jan 20, 2026", instituteId: "2", city: "Atlanta" },
  { id: "S019", name: "Rachel Adams", email: "rachel@email.com", phone: "+1 234-567-8920", course: "Mobile App Development", batch: "Batch B", status: "active", progress: 59, joinDate: "Feb 10, 2026", instituteId: "2", city: "Nashville" },
  { id: "S020", name: "Sam Turner", email: "sam@email.com", phone: "+1 234-567-8921", course: "Python for Data Science", batch: "Batch B", status: "active", progress: 94, joinDate: "Feb 1, 2026", instituteId: "2", city: "Minneapolis" },
  // Institute 3 - Digital Skills Hub
  { id: "S021", name: "Tina Patel", email: "tina@email.com", phone: "+1 234-567-8922", course: "UI/UX Design Mastery", batch: "Batch A", status: "active", progress: 86, joinDate: "Jan 15, 2026", instituteId: "3", city: "San Jose" },
  { id: "S022", name: "Uma Nakamura", email: "uma@email.com", phone: "+1 234-567-8923", course: "UI/UX Design Mastery", batch: "Batch A", status: "active", progress: 72, joinDate: "Jan 20, 2026", instituteId: "3", city: "Oakland" },
  { id: "S023", name: "Victor Ruiz", email: "victor@email.com", phone: "+1 234-567-8924", course: "Digital Marketing", batch: "Batch A", status: "active", progress: 44, joinDate: "Feb 5, 2026", instituteId: "3", city: "Sacramento" },
  { id: "S024", name: "Wendy Liu", email: "wendy@email.com", phone: "+1 234-567-8925", course: "UI/UX Design Mastery", batch: "Batch B", status: "active", progress: 69, joinDate: "Feb 1, 2026", instituteId: "3", city: "Portland" },
  { id: "S025", name: "Xavier Jones", email: "xavier@email.com", phone: "+1 234-567-8926", course: "Digital Marketing", batch: "Batch A", status: "inactive", progress: 15, joinDate: "Feb 10, 2026", instituteId: "3", city: "Las Vegas" },
  // Institute 4 - FutureStack University
  { id: "S026", name: "Yara Hassan", email: "yara@email.com", phone: "+1 234-567-8927", course: "Cloud Architecture", batch: "Batch A", status: "active", progress: 79, joinDate: "Jan 18, 2026", instituteId: "4", city: "Chicago" },
  { id: "S027", name: "Zach Cooper", email: "zach@email.com", phone: "+1 234-567-8928", course: "Cloud Architecture", batch: "Batch A", status: "active", progress: 65, joinDate: "Jan 22, 2026", instituteId: "4", city: "Detroit" },
  { id: "S028", name: "Aisha Bello", email: "aisha@email.com", phone: "+1 234-567-8929", course: "Cybersecurity Basics", batch: "Batch A", status: "active", progress: 82, joinDate: "Feb 1, 2026", instituteId: "4", city: "Philadelphia" },
  { id: "S029", name: "Ben Crawford", email: "ben@email.com", phone: "+1 234-567-8930", course: "Cloud Architecture", batch: "Batch B", status: "active", progress: 53, joinDate: "Feb 5, 2026", instituteId: "4", city: "Charlotte" },
  { id: "S030", name: "Chloe Park", email: "chloe@email.com", phone: "+1 234-567-8931", course: "Cybersecurity Basics", batch: "Batch A", status: "active", progress: 91, joinDate: "Jan 25, 2026", instituteId: "4", city: "Tampa" },
  // Institute 5 - ByteForge Academy
  { id: "S031", name: "Derek Frost", email: "derek@email.com", phone: "+1 234-567-8932", course: "Rust Systems Programming", batch: "Batch A", status: "active", progress: 74, joinDate: "Jan 20, 2026", instituteId: "5", city: "Austin" },
  { id: "S032", name: "Elena Volkov", email: "elena@email.com", phone: "+1 234-567-8933", course: "Rust Systems Programming", batch: "Batch A", status: "active", progress: 88, joinDate: "Jan 18, 2026", instituteId: "5", city: "San Francisco" },
  { id: "S033", name: "Felix Romano", email: "felix@email.com", phone: "+1 234-567-8934", course: "Game Dev with Unity", batch: "Batch A", status: "active", progress: 57, joinDate: "Feb 1, 2026", instituteId: "5", city: "Los Angeles" },
  { id: "S034", name: "Gina Morales", email: "gina@email.com", phone: "+1 234-567-8935", course: "Game Dev with Unity", batch: "Batch B", status: "inactive", progress: 28, joinDate: "Feb 10, 2026", instituteId: "5", city: "San Diego" },
  { id: "S035", name: "Hugo Andersen", email: "hugo@email.com", phone: "+1 234-567-8936", course: "Rust Systems Programming", batch: "Batch B", status: "active", progress: 66, joinDate: "Feb 5, 2026", instituteId: "5", city: "Denver" },
];

export async function fetchStudents(params?: SearchParams): Promise<ApiResponse<Student[]>> {
  let filtered = [...mockStudents];

  if (params?.instituteId) {
    filtered = filtered.filter((s) => s.instituteId === params.instituteId);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || (s.city?.toLowerCase().includes(q))
    );
  }
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((s) => s.status === params.status);
  }
  if (params?.course && params.course !== "all") {
    filtered = filtered.filter((s) => s.course === params.course);
  }
  if (params?.batch && params.batch !== "all") {
    filtered = filtered.filter((s) => s.batch === params.batch);
  }
  if (params?.city) {
    const c = params.city.toLowerCase();
    filtered = filtered.filter((s) => s.city?.toLowerCase().includes(c));
  }

  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createStudent(student: Omit<Student, "id">): Promise<ApiResponse<Student>> {
  const newStudent: Student = { ...student, id: `S${String(mockStudents.length + 1).padStart(3, "0")}` };
  mockStudents.push(newStudent);
  return mockApiCall({ data: newStudent, message: "Student created successfully" });
}

export async function updateStudent(id: string, data: Partial<Student>): Promise<ApiResponse<Student>> {
  const idx = mockStudents.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Student not found");
  mockStudents[idx] = { ...mockStudents[idx], ...data };
  return mockApiCall({ data: mockStudents[idx], message: "Student updated successfully" });
}

export async function deleteStudent(id: string): Promise<ApiResponse<null>> {
  const idx = mockStudents.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error("Student not found");
  mockStudents.splice(idx, 1);
  return mockApiCall({ data: null, message: "Student deleted successfully" });
}
