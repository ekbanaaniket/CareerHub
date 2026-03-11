// ============= Managed Companies Service (Platform Owner) =============
import { mockApiCall } from "./api";
import type { ApiResponse, SearchParams } from "@/types";
import type { AppRole } from "@/config/roles";
import { ROLE_HIERARCHY } from "@/config/roles";

export interface ManagedCompany {
  id: string;
  name: string;
  logo: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  status: "active" | "suspended" | "pending";
  vacancyCount: number;
  applicantCount: number;
  hiredCount: number;
  createdDate: string;
  plan: "free" | "basic" | "premium";
  industry: string;
}

const mockCompanies: ManagedCompany[] = [
  { id: "C001", name: "Google", logo: "GO", city: "Mountain View, CA", email: "careers@google.com", phone: "+1 650-253-0000", website: "google.com", status: "active", vacancyCount: 12, applicantCount: 450, hiredCount: 28, createdDate: "2024-01-10", plan: "premium", industry: "Technology" },
  { id: "C002", name: "Microsoft", logo: "MS", city: "Seattle, WA", email: "careers@microsoft.com", phone: "+1 425-882-8080", website: "microsoft.com", status: "active", vacancyCount: 8, applicantCount: 320, hiredCount: 22, createdDate: "2024-02-15", plan: "premium", industry: "Technology" },
  { id: "C003", name: "Stripe", logo: "ST", city: "San Francisco, CA", email: "jobs@stripe.com", phone: "+1 415-222-3333", website: "stripe.com", status: "active", vacancyCount: 15, applicantCount: 280, hiredCount: 18, createdDate: "2024-03-20", plan: "basic", industry: "Fintech" },
  { id: "C004", name: "Amazon", logo: "AM", city: "Seattle, WA", email: "hiring@amazon.com", phone: "+1 206-266-1000", website: "amazon.com", status: "active", vacancyCount: 25, applicantCount: 850, hiredCount: 45, createdDate: "2024-01-05", plan: "premium", industry: "E-Commerce" },
  { id: "C005", name: "Netflix", logo: "NF", city: "Los Gatos, CA", email: "talent@netflix.com", phone: "+1 408-540-3700", website: "netflix.com", status: "active", vacancyCount: 5, applicantCount: 200, hiredCount: 10, createdDate: "2024-04-01", plan: "basic", industry: "Entertainment" },
  { id: "C006", name: "Meta", logo: "ME", city: "Menlo Park, CA", email: "careers@meta.com", phone: "+1 650-543-4800", website: "meta.com", status: "suspended", vacancyCount: 0, applicantCount: 150, hiredCount: 12, createdDate: "2024-02-28", plan: "premium", industry: "Technology" },
  { id: "C007", name: "Spotify", logo: "SP", city: "Stockholm, Sweden", email: "jobs@spotify.com", phone: "+46 8-545-200-00", website: "spotify.com", status: "active", vacancyCount: 6, applicantCount: 180, hiredCount: 8, createdDate: "2024-06-15", plan: "basic", industry: "Music/Tech" },
  { id: "C008", name: "Airbnb", logo: "AB", city: "San Francisco, CA", email: "talent@airbnb.com", phone: "+1 415-800-5959", website: "airbnb.com", status: "pending", vacancyCount: 0, applicantCount: 0, hiredCount: 0, createdDate: "2026-02-28", plan: "free", industry: "Travel" },
];

export async function fetchManagedCompanies(params?: SearchParams & { role?: AppRole }): Promise<ApiResponse<ManagedCompany[]>> {
  let filtered = [...mockCompanies];

  const role = params?.role;
  if (role && ROLE_HIERARCHY[role] > 0) {
    filtered = filtered.filter((c) => c.status === "active");
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
  }
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const total = filtered.length;
  const start = (page - 1) * limit;
  filtered = filtered.slice(start, start + limit);
  return mockApiCall({ data: filtered, total });
}

export async function createManagedCompany(data: Partial<ManagedCompany>): Promise<ApiResponse<ManagedCompany>> {
  const newItem: ManagedCompany = {
    id: `C${Date.now()}`,
    name: data.name ?? "",
    logo: (data.name ?? "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    city: data.city ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    website: data.website ?? "",
    status: "pending",
    vacancyCount: 0,
    applicantCount: 0,
    hiredCount: 0,
    createdDate: new Date().toISOString().split("T")[0],
    plan: "free",
    industry: data.industry ?? "",
  };
  mockCompanies.push(newItem);
  return mockApiCall({ data: newItem, message: "Company registered successfully. Pending platform approval." });
}

export async function updateManagedCompany(id: string, data: Partial<ManagedCompany>, callerRole?: AppRole): Promise<ApiResponse<ManagedCompany>> {
  const idx = mockCompanies.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Company not found");

  if (data.status && callerRole && ROLE_HIERARCHY[callerRole] > 0) {
    throw new Error("Insufficient permissions to change status");
  }

  mockCompanies[idx] = { ...mockCompanies[idx], ...data };
  return mockApiCall({ data: mockCompanies[idx], message: "Company updated" });
}

export async function deleteManagedCompany(id: string): Promise<ApiResponse<null>> {
  const idx = mockCompanies.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Company not found");
  mockCompanies.splice(idx, 1);
  return mockApiCall({ data: null, message: "Company deleted" });
}