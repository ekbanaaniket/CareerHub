// ============= Self-Registration Service =============
// Handles registration for institutes, consultancies, and companies
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";
import type { AppRole } from "@/config/roles";

export interface RegistrationRequest {
  id: string;
  entityType: "institute" | "consultancy" | "company";
  name: string;
  email: string;
  phone: string;
  city: string;
  website: string;
  description: string;
  ownerName: string;
  ownerEmail: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  // Type-specific fields
  industry?: string; // company
  countries?: string[]; // consultancy
  specializations?: string[]; // consultancy
  teachingMode?: string; // institute
  courses?: string[]; // institute
}

const mockRegistrations: RegistrationRequest[] = [
  {
    id: "REG001", entityType: "institute", name: "ByteForge Academy", email: "hello@byteforge.io",
    phone: "+1 234-567-8903", city: "Seattle", website: "byteforge.io",
    description: "Research-driven coding academy", ownerName: "Alex Chen", ownerEmail: "alex@byteforge.io",
    status: "pending", submittedDate: "2026-02-28", teachingMode: "hybrid", courses: ["Systems Programming"],
  },
  {
    id: "REG002", entityType: "company", name: "Airbnb", email: "talent@airbnb.com",
    phone: "+1 415-800-5959", city: "San Francisco, CA", website: "airbnb.com",
    description: "Travel and hospitality platform", ownerName: "HR Team", ownerEmail: "hr@airbnb.com",
    status: "pending", submittedDate: "2026-02-28", industry: "Travel",
  },
  {
    id: "REG003", entityType: "consultancy", name: "NorthStar Migration", email: "info@northstar.ca",
    phone: "+91 98765 43215", city: "Chennai", website: "northstarmigration.ca",
    description: "Canada immigration experts", ownerName: "Rahul Sharma", ownerEmail: "rahul@northstar.ca",
    status: "pending", submittedDate: "2026-03-01", countries: ["Canada"], specializations: ["Express Entry"],
  },
];

// Roles that can self-register
export const REGISTRABLE_ROLES: { role: AppRole; entityType: RegistrationRequest["entityType"]; label: string }[] = [
  { role: "institute_owner", entityType: "institute", label: "Institute" },
  { role: "consultancy_owner", entityType: "consultancy", label: "Consultancy" },
  { role: "company", entityType: "company", label: "Company" },
];

export function canSelfRegister(role: AppRole): boolean {
  return REGISTRABLE_ROLES.some((r) => r.role === role);
}

export async function submitRegistration(data: Omit<RegistrationRequest, "id" | "status" | "submittedDate">): Promise<ApiResponse<RegistrationRequest>> {
  const newReg: RegistrationRequest = {
    ...data,
    id: `REG${Date.now()}`,
    status: "pending",
    submittedDate: new Date().toISOString().split("T")[0],
  };
  mockRegistrations.push(newReg);
  return mockApiCall({
    data: newReg,
    message: `Your ${data.entityType} registration has been submitted. You will be notified once approved by the platform.`,
  });
}

// Platform owner can view all registrations
export async function fetchRegistrations(params?: { status?: string }): Promise<ApiResponse<RegistrationRequest[]>> {
  let filtered = [...mockRegistrations];
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((r) => r.status === params.status);
  }
  return mockApiCall({ data: filtered, total: filtered.length });
}

// Platform owner approves/rejects
export async function updateRegistrationStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<ApiResponse<RegistrationRequest>> {
  const idx = mockRegistrations.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Registration not found");
  mockRegistrations[idx].status = status;
  return mockApiCall({
    data: mockRegistrations[idx],
    message: `Registration ${status}`,
  });
}