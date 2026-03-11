// ============= Managed Institutes Service (Platform Owner) =============
import { mockApiCall } from "./api";
import type { ApiResponse, SearchParams } from "@/types";
import type { AppRole } from "@/config/roles";
import { ROLE_HIERARCHY } from "@/config/roles";

export interface ManagedInstitute {
  id: string;
  name: string;
  logo: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  status: "active" | "suspended" | "pending";
  studentCount: number;
  courseCount: number;
  instructorCount: number;
  createdDate: string;
  plan: "free" | "basic" | "premium";
}

const mockInstitutes: ManagedInstitute[] = [
  { id: "1", name: "TechVerse Academy", logo: "TV", city: "San Francisco", email: "admin@techverse.academy", phone: "+1 234-567-8900", website: "techverse.academy", status: "active", studentCount: 1284, courseCount: 24, instructorCount: 18, createdDate: "2024-01-15", plan: "premium" },
  { id: "2", name: "CodeCraft Institute", logo: "CC", city: "New York", email: "info@codecraft.edu", phone: "+1 234-567-8901", website: "codecraft.edu", status: "active", studentCount: 856, courseCount: 18, instructorCount: 12, createdDate: "2024-03-20", plan: "basic" },
  { id: "3", name: "DigitalMinds School", logo: "DM", city: "Austin", email: "contact@digitalminds.org", phone: "+1 234-567-8902", website: "digitalminds.org", status: "active", studentCount: 542, courseCount: 12, instructorCount: 8, createdDate: "2024-06-10", plan: "basic" },
  { id: "4", name: "ByteForge Academy", logo: "BF", city: "Seattle", email: "hello@byteforge.io", phone: "+1 234-567-8903", website: "byteforge.io", status: "pending", studentCount: 0, courseCount: 0, instructorCount: 0, createdDate: "2026-02-28", plan: "free" },
  { id: "5", name: "DevHub Institute", logo: "DH", city: "Chicago", email: "info@devhub.edu", phone: "+1 234-567-8904", website: "devhub.edu", status: "suspended", studentCount: 650, courseCount: 15, instructorCount: 10, createdDate: "2024-09-01", plan: "premium" },
];

// Fetch institutes — role determines visibility
// Platform owner sees all; other roles only see active entities
export async function fetchManagedInstitutes(params?: SearchParams & { role?: AppRole }): Promise<ApiResponse<ManagedInstitute[]>> {
  let filtered = [...mockInstitutes];

  // Non-admin roles only see active institutes
  const role = params?.role;
  if (role && ROLE_HIERARCHY[role] > 0) {
    filtered = filtered.filter((i) => i.status === "active");
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((i) => i.name.toLowerCase().includes(q) || i.city.toLowerCase().includes(q) || i.email.toLowerCase().includes(q));
  }
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function createManagedInstitute(data: Partial<ManagedInstitute>): Promise<ApiResponse<ManagedInstitute>> {
  const newItem: ManagedInstitute = {
    id: String(Date.now()),
    name: data.name ?? "",
    logo: (data.name ?? "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    city: data.city ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    website: data.website ?? "",
    status: "pending",
    studentCount: 0,
    courseCount: 0,
    instructorCount: 0,
    createdDate: new Date().toISOString().split("T")[0],
    plan: "free",
  };
  mockInstitutes.push(newItem);
  return mockApiCall({ data: newItem, message: "Institute registered successfully. Pending platform approval." });
}

// Hierarchical status update — callerRole must outrank the target entity's level
export async function updateManagedInstitute(id: string, data: Partial<ManagedInstitute>, callerRole?: AppRole): Promise<ApiResponse<ManagedInstitute>> {
  const idx = mockInstitutes.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Institute not found");

  // If trying to change status, check hierarchy
  if (data.status && callerRole) {
    // Only platform_owner (level 0) can suspend/activate institute_owner-level entities (level 1)
    if (ROLE_HIERARCHY[callerRole] > 0) {
      throw new Error("Insufficient permissions to change status");
    }
  }

  mockInstitutes[idx] = { ...mockInstitutes[idx], ...data };
  return mockApiCall({ data: mockInstitutes[idx], message: "Institute updated" });
}

export async function deleteManagedInstitute(id: string): Promise<ApiResponse<null>> {
  const idx = mockInstitutes.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Institute not found");
  mockInstitutes.splice(idx, 1);
  return mockApiCall({ data: null, message: "Institute deleted" });
}