// ============= Managed Consultancies Service (Platform Owner) =============
import { mockApiCall } from "./api";
import type { ApiResponse, SearchParams } from "@/types";
import type { AppRole } from "@/config/roles";
import { ROLE_HIERARCHY } from "@/config/roles";

export interface ManagedConsultancy {
  id: string;
  name: string;
  logo: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  status: "active" | "suspended" | "pending";
  studentCount: number;
  counselorCount: number;
  visaSuccessRate: number;
  createdDate: string;
  plan: "free" | "basic" | "premium";
  countries: string[];
}

const mockConsultancies: ManagedConsultancy[] = [
  { id: "CON1", name: "Global Consultancy", logo: "GC", city: "New Delhi", email: "info@globalconsultancy.com", phone: "+91 98765 43210", website: "globalconsultancy.com", status: "active", studentCount: 245, counselorCount: 12, visaSuccessRate: 96, createdDate: "2024-03-01", plan: "premium", countries: ["UK", "US", "Canada", "Australia"] },
  { id: "CON2", name: "StudyAbroad Pro", logo: "SA", city: "Mumbai", email: "hello@studyabroadpro.in", phone: "+91 98765 43211", website: "studyabroadpro.in", status: "active", studentCount: 180, counselorCount: 8, visaSuccessRate: 94, createdDate: "2024-05-15", plan: "basic", countries: ["US", "Canada", "UK"] },
  { id: "CON3", name: "EuroPath Consultants", logo: "EP", city: "Bangalore", email: "support@europath.io", phone: "+91 98765 43212", website: "europath.io", status: "active", studentCount: 120, counselorCount: 5, visaSuccessRate: 91, createdDate: "2024-08-20", plan: "basic", countries: ["Germany", "France", "Netherlands"] },
  { id: "CON4", name: "Pacific Immigration", logo: "PI", city: "Hyderabad", email: "apply@pacificimmigration.co", phone: "+91 98765 43213", website: "pacificimmigration.co", status: "suspended", studentCount: 90, counselorCount: 4, visaSuccessRate: 93, createdDate: "2024-10-01", plan: "premium", countries: ["Australia", "Canada", "NZ"] },
  { id: "CON5", name: "Ivy League Advisors", logo: "IL", city: "Pune", email: "apply@ivyleague.com", phone: "+91 98765 43214", website: "ivyleagueadvisors.com", status: "active", studentCount: 85, counselorCount: 6, visaSuccessRate: 97, createdDate: "2024-06-10", plan: "premium", countries: ["US", "UK"] },
  { id: "CON6", name: "NorthStar Migration", logo: "NS", city: "Chennai", email: "info@northstar.ca", phone: "+91 98765 43215", website: "northstarmigration.ca", status: "pending", studentCount: 0, counselorCount: 0, visaSuccessRate: 0, createdDate: "2026-03-01", plan: "free", countries: ["Canada"] },
];

export async function fetchManagedConsultancies(params?: SearchParams & { role?: AppRole }): Promise<ApiResponse<ManagedConsultancy[]>> {
  let filtered = [...mockConsultancies];

  const role = params?.role;
  if (role && ROLE_HIERARCHY[role] > 0) {
    filtered = filtered.filter((c) => c.status === "active");
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function createManagedConsultancy(data: Partial<ManagedConsultancy>): Promise<ApiResponse<ManagedConsultancy>> {
  const newItem: ManagedConsultancy = {
    id: `CON${Date.now()}`,
    name: data.name ?? "",
    logo: (data.name ?? "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    city: data.city ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    website: data.website ?? "",
    status: "pending",
    studentCount: 0,
    counselorCount: 0,
    visaSuccessRate: 0,
    createdDate: new Date().toISOString().split("T")[0],
    plan: "free",
    countries: data.countries ?? [],
  };
  mockConsultancies.push(newItem);
  return mockApiCall({ data: newItem, message: "Consultancy registered successfully. Pending platform approval." });
}

export async function updateManagedConsultancy(id: string, data: Partial<ManagedConsultancy>, callerRole?: AppRole): Promise<ApiResponse<ManagedConsultancy>> {
  const idx = mockConsultancies.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Consultancy not found");

  if (data.status && callerRole && ROLE_HIERARCHY[callerRole] > 0) {
    throw new Error("Insufficient permissions to change status");
  }

  mockConsultancies[idx] = { ...mockConsultancies[idx], ...data };
  return mockApiCall({ data: mockConsultancies[idx], message: "Consultancy updated" });
}

export async function deleteManagedConsultancy(id: string): Promise<ApiResponse<null>> {
  const idx = mockConsultancies.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Consultancy not found");
  mockConsultancies.splice(idx, 1);
  return mockApiCall({ data: null, message: "Consultancy deleted" });
}