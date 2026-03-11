// ============= Attendance Service =============
import { mockApiCall } from "./api";
import type { ApiResponse, SearchParams } from "@/types";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  courseId: string;
  courseName: string;
  checkInTime?: string;
  checkOutTime?: string;
  instituteId: string;
}

export interface AttendanceSummary {
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

const mockAttendance: AttendanceRecord[] = [
  { id: "A001", studentId: "S001", studentName: "Alice Johnson", date: "2026-03-03", status: "present", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "09:00", checkOutTime: "17:00", instituteId: "1" },
  { id: "A002", studentId: "S002", studentName: "Bob Smith", date: "2026-03-03", status: "present", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "09:05", checkOutTime: "17:00", instituteId: "1" },
  { id: "A003", studentId: "S003", studentName: "Carol Davis", date: "2026-03-03", status: "absent", courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1" },
  { id: "A004", studentId: "S004", studentName: "David Lee", date: "2026-03-03", status: "late", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "09:45", checkOutTime: "17:00", instituteId: "1" },
  { id: "A005", studentId: "S005", studentName: "Eva Martinez", date: "2026-03-03", status: "present", courseId: "C002", courseName: "Frontend Bootcamp", checkInTime: "09:00", checkOutTime: "13:00", instituteId: "1" },
  { id: "A006", studentId: "S006", studentName: "Frank Wilson", date: "2026-03-03", status: "excused", courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1" },
  { id: "A007", studentId: "S007", studentName: "Grace Kim", date: "2026-03-03", status: "present", courseId: "C003", courseName: "Backend Mastery", checkInTime: "09:00", checkOutTime: "17:00", instituteId: "2" },
  { id: "A008", studentId: "S008", studentName: "Henry Brown", date: "2026-03-03", status: "present", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "08:55", checkOutTime: "17:00", instituteId: "2" },
  // Historical data
  { id: "A009", studentId: "S001", studentName: "Alice Johnson", date: "2026-03-02", status: "present", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "09:00", checkOutTime: "17:00", instituteId: "1" },
  { id: "A010", studentId: "S002", studentName: "Bob Smith", date: "2026-03-02", status: "late", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "09:30", checkOutTime: "17:00", instituteId: "1" },
  { id: "A011", studentId: "S003", studentName: "Carol Davis", date: "2026-03-02", status: "present", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "08:50", checkOutTime: "17:00", instituteId: "1" },
  { id: "A012", studentId: "S004", studentName: "David Lee", date: "2026-03-02", status: "present", courseId: "C001", courseName: "Full-Stack 2026", checkInTime: "09:00", checkOutTime: "17:00", instituteId: "1" },
];

export async function fetchAttendance(params?: SearchParams & { date?: string }): Promise<ApiResponse<AttendanceRecord[]>> {
  let filtered = [...mockAttendance];
  if (params?.instituteId) filtered = filtered.filter((a) => a.instituteId === params.instituteId);
  if (params?.date) filtered = filtered.filter((a) => a.date === params.date);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((a) => a.studentName.toLowerCase().includes(q) || a.studentId.toLowerCase().includes(q));
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((a) => a.status === params.status);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function markAttendance(record: Omit<AttendanceRecord, "id">): Promise<ApiResponse<AttendanceRecord>> {
  const newRecord: AttendanceRecord = { ...record, id: `A${String(mockAttendance.length + 1).padStart(3, "0")}` };
  mockAttendance.push(newRecord);
  return mockApiCall({ data: newRecord, message: "Attendance marked successfully" });
}

export async function updateAttendance(id: string, data: Partial<AttendanceRecord>): Promise<ApiResponse<AttendanceRecord>> {
  const idx = mockAttendance.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Attendance record not found");
  mockAttendance[idx] = { ...mockAttendance[idx], ...data };
  return mockApiCall({ data: mockAttendance[idx], message: "Attendance updated successfully" });
}

export async function fetchAttendanceSummary(studentId?: string, instituteId?: string): Promise<ApiResponse<AttendanceSummary>> {
  let records = [...mockAttendance];
  if (studentId) records = records.filter((a) => a.studentId === studentId);
  if (instituteId) records = records.filter((a) => a.instituteId === instituteId);
  
  const summary: AttendanceSummary = {
    totalDays: records.length,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
    excused: records.filter((r) => r.status === "excused").length,
    percentage: records.length > 0
      ? Math.round((records.filter((r) => r.status === "present" || r.status === "late").length / records.length) * 100)
      : 0,
  };
  return mockApiCall({ data: summary });
}
