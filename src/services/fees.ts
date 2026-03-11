// ============= Fees & Billing Service =============
import { mockApiCall } from "./api";
import type { ApiResponse, SearchParams } from "@/types";

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  type: "tuition" | "registration" | "exam" | "library" | "lab" | "other";
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "pending" | "overdue" | "partial";
  paidAmount: number;
  courseId: string;
  courseName: string;
  instituteId: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface BillingSummary {
  totalRevenue: number;
  totalPending: number;
  totalOverdue: number;
  collectionRate: number;
  totalStudents: number;
}

const mockFees: FeeRecord[] = [
  { id: "F001", studentId: "S001", studentName: "Alice Johnson", type: "tuition", amount: 5000, dueDate: "2026-03-15", paidDate: "2026-03-01", status: "paid", paidAmount: 5000, courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1", paymentMethod: "Card", transactionId: "TXN001" },
  { id: "F002", studentId: "S002", studentName: "Bob Smith", type: "tuition", amount: 5000, dueDate: "2026-03-15", status: "pending", paidAmount: 0, courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1" },
  { id: "F003", studentId: "S003", studentName: "Carol Davis", type: "tuition", amount: 5000, dueDate: "2026-02-15", status: "overdue", paidAmount: 0, courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1" },
  { id: "F004", studentId: "S004", studentName: "David Lee", type: "tuition", amount: 5000, dueDate: "2026-03-15", paidDate: "2026-02-28", status: "paid", paidAmount: 5000, courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1", paymentMethod: "UPI", transactionId: "TXN004" },
  { id: "F005", studentId: "S005", studentName: "Eva Martinez", type: "tuition", amount: 3000, dueDate: "2026-03-15", status: "partial", paidAmount: 1500, courseId: "C002", courseName: "Frontend Bootcamp", instituteId: "1", paymentMethod: "Card", transactionId: "TXN005" },
  { id: "F006", studentId: "S001", studentName: "Alice Johnson", type: "exam", amount: 200, dueDate: "2026-03-10", paidDate: "2026-03-02", status: "paid", paidAmount: 200, courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1", paymentMethod: "Card", transactionId: "TXN006" },
  { id: "F007", studentId: "S006", studentName: "Frank Wilson", type: "registration", amount: 500, dueDate: "2026-02-01", status: "overdue", paidAmount: 0, courseId: "C001", courseName: "Full-Stack 2026", instituteId: "1" },
  { id: "F008", studentId: "S007", studentName: "Grace Kim", type: "tuition", amount: 4500, dueDate: "2026-03-15", paidDate: "2026-03-01", status: "paid", paidAmount: 4500, courseId: "C003", courseName: "Backend Mastery", instituteId: "2", paymentMethod: "Bank Transfer", transactionId: "TXN008" },
];

export async function fetchFees(params?: SearchParams & { type?: string }): Promise<ApiResponse<FeeRecord[]>> {
  let filtered = [...mockFees];
  if (params?.instituteId) filtered = filtered.filter((f) => f.instituteId === params.instituteId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((f) => f.studentName.toLowerCase().includes(q) || f.studentId.toLowerCase().includes(q) || f.transactionId?.toLowerCase().includes(q));
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((f) => f.status === params.status);
  if (params?.type && params.type !== "all") filtered = filtered.filter((f) => f.type === params.type);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createFee(fee: Omit<FeeRecord, "id">): Promise<ApiResponse<FeeRecord>> {
  const newFee: FeeRecord = { ...fee, id: `F${String(mockFees.length + 1).padStart(3, "0")}` };
  mockFees.push(newFee);
  return mockApiCall({ data: newFee, message: "Fee record created" });
}

export async function updateFee(id: string, data: Partial<FeeRecord>): Promise<ApiResponse<FeeRecord>> {
  const idx = mockFees.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Fee record not found");
  mockFees[idx] = { ...mockFees[idx], ...data };
  return mockApiCall({ data: mockFees[idx], message: "Fee updated" });
}

export async function recordPayment(feeId: string, amount: number, method: string): Promise<ApiResponse<FeeRecord>> {
  const idx = mockFees.findIndex((f) => f.id === feeId);
  if (idx === -1) throw new Error("Fee not found");
  const fee = mockFees[idx];
  const newPaidAmount = fee.paidAmount + amount;
  const newStatus = newPaidAmount >= fee.amount ? "paid" : "partial";
  mockFees[idx] = {
    ...fee,
    paidAmount: newPaidAmount,
    status: newStatus,
    paidDate: new Date().toISOString().split("T")[0],
    paymentMethod: method,
    transactionId: `TXN${Date.now()}`,
  };
  return mockApiCall({ data: mockFees[idx], message: "Payment recorded" });
}

export async function fetchBillingSummary(instituteId?: string): Promise<ApiResponse<BillingSummary>> {
  const fees = instituteId ? mockFees.filter((f) => f.instituteId === instituteId) : mockFees;
  const summary: BillingSummary = {
    totalRevenue: fees.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.paidAmount, 0),
    totalPending: fees.filter((f) => f.status === "pending" || f.status === "partial").reduce((sum, f) => sum + (f.amount - f.paidAmount), 0),
    totalOverdue: fees.filter((f) => f.status === "overdue").reduce((sum, f) => sum + f.amount, 0),
    collectionRate: fees.length > 0 ? Math.round((fees.filter((f) => f.status === "paid").length / fees.length) * 100) : 0,
    totalStudents: new Set(fees.map((f) => f.studentId)).size,
  };
  return mockApiCall({ data: summary });
}

export async function deleteFee(id: string): Promise<ApiResponse<null>> {
  const idx = mockFees.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Fee not found");
  mockFees.splice(idx, 1);
  return mockApiCall({ data: null, message: "Fee record deleted" });
}
