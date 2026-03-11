import { mockApiCall } from "./api";
import type { Institute, ApiResponse } from "@/types";

const mockInstitutes: Institute[] = [
  { id: "1", name: "TechVerse Academy", logo: "TV", role: "Owner", city: "San Francisco", email: "admin@techverse.academy", phone: "+1 234-567-8900", address: "123 Tech Street, Silicon Valley, CA 94000", website: "https://techverse.academy", studentCount: 1284, courseCount: 24 },
  { id: "2", name: "CodeCraft Institute", logo: "CC", role: "Manager", city: "New York", email: "info@codecraft.edu", phone: "+1 234-567-8901", address: "456 Code Ave, Manhattan, NY 10001", website: "https://codecraft.edu", studentCount: 856, courseCount: 18 },
  { id: "3", name: "DigitalMinds School", logo: "DM", role: "Instructor", city: "Austin", email: "contact@digitalminds.org", phone: "+1 234-567-8902", address: "789 Digital Blvd, Austin, TX 73301", website: "https://digitalminds.org", studentCount: 542, courseCount: 12 },
  { id: "4", name: "ByteForge Academy", logo: "BF", role: "Owner", city: "Seattle", email: "hello@byteforge.io", phone: "+1 234-567-8903", website: "https://byteforge.io", studentCount: 320, courseCount: 8 },
  { id: "5", name: "DevHub Institute", logo: "DH", role: "Manager", city: "Chicago", email: "info@devhub.edu", phone: "+1 234-567-8904", website: "https://devhub.edu", studentCount: 650, courseCount: 15 },
];

export async function fetchInstitutes(params?: { search?: string; city?: string }): Promise<ApiResponse<Institute[]>> {
  let filtered = [...mockInstitutes];
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((i) => i.name.toLowerCase().includes(q) || i.city?.toLowerCase().includes(q) || i.email?.toLowerCase().includes(q));
  }
  if (params?.city) {
    const c = params.city.toLowerCase();
    filtered = filtered.filter((i) => i.city?.toLowerCase().includes(c));
  }
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchInstituteById(id: string): Promise<ApiResponse<Institute>> {
  const institute = mockInstitutes.find((i) => i.id === id);
  if (!institute) throw new Error("Institute not found");
  return mockApiCall({ data: institute });
}

export async function updateInstitute(id: string, data: Partial<Institute>): Promise<ApiResponse<Institute>> {
  const idx = mockInstitutes.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Institute not found");
  mockInstitutes[idx] = { ...mockInstitutes[idx], ...data };
  return mockApiCall({ data: mockInstitutes[idx], message: "Institute updated successfully" });
}
