// ============= Featured Management Service =============
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface FeaturedEntity {
  id: string;
  entityId: string;
  entityType: "institute" | "consultancy" | "company";
  name: string;
  description: string;
  logo: string;
  featured: boolean;
  featuredAt?: string;
  featuredBy?: string;
  order: number;
  badge?: string;
}

const mockFeaturedEntities: FeaturedEntity[] = [
  { id: "F1", entityId: "1", entityType: "institute", name: "TechVerse Academy", description: "Leading technology education with 1000+ students", logo: "TV", featured: true, featuredAt: "2026-02-01", featuredBy: "platform_owner", order: 1, badge: "Top Rated" },
  { id: "F2", entityId: "2", entityType: "institute", name: "CodeCraft Institute", description: "Specializing in full-stack development bootcamps", logo: "CC", featured: true, featuredAt: "2026-02-05", featuredBy: "platform_owner", order: 2, badge: "Rising Star" },
  { id: "F3", entityId: "3", entityType: "institute", name: "DigitalMinds School", description: "AI and Data Science programs", logo: "DM", featured: false, order: 3 },
  { id: "F4", entityId: "CON1", entityType: "consultancy", name: "Global Consultancy", description: "Visa, university admissions & career counseling", logo: "GC", featured: true, featuredAt: "2026-02-10", featuredBy: "platform_owner", order: 1, badge: "Trusted Partner" },
  { id: "F5", entityId: "CON2", entityType: "consultancy", name: "VisaPath Advisors", description: "Expert immigration and visa services", logo: "VP", featured: false, order: 2 },
  { id: "F6", entityId: "C001", entityType: "company", name: "TechCorp", description: "Leading tech employer with 500+ annual hires", logo: "TC", featured: true, featuredAt: "2026-02-15", featuredBy: "platform_owner", order: 1, badge: "Top Employer" },
  { id: "F7", entityId: "C002", entityType: "company", name: "InnovateTech", description: "Startup focused on AI and cloud solutions", logo: "IT", featured: false, order: 2 },
  { id: "F8", entityId: "C003", entityType: "company", name: "DataDriven Inc", description: "Big data analytics and consulting", logo: "DD", featured: false, order: 3 },
];

export async function fetchFeaturedEntities(entityType?: string): Promise<ApiResponse<FeaturedEntity[]>> {
  let filtered = [...mockFeaturedEntities];
  if (entityType && entityType !== "all") filtered = filtered.filter((e) => e.entityType === entityType);
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function toggleFeatured(id: string, featured: boolean, badge?: string): Promise<ApiResponse<FeaturedEntity>> {
  const idx = mockFeaturedEntities.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Entity not found");
  mockFeaturedEntities[idx] = {
    ...mockFeaturedEntities[idx],
    featured,
    featuredAt: featured ? new Date().toISOString().split("T")[0] : undefined,
    featuredBy: featured ? "platform_owner" : undefined,
    badge: featured ? badge || mockFeaturedEntities[idx].badge : undefined,
  };
  return mockApiCall({ data: mockFeaturedEntities[idx], message: featured ? "Entity featured successfully" : "Entity unfeatured" });
}

export async function updateFeaturedOrder(id: string, order: number): Promise<ApiResponse<FeaturedEntity>> {
  const idx = mockFeaturedEntities.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Entity not found");
  mockFeaturedEntities[idx].order = order;
  return mockApiCall({ data: mockFeaturedEntities[idx], message: "Order updated" });
}

export async function updateFeaturedBadge(id: string, badge: string): Promise<ApiResponse<FeaturedEntity>> {
  const idx = mockFeaturedEntities.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Entity not found");
  mockFeaturedEntities[idx].badge = badge;
  return mockApiCall({ data: mockFeaturedEntities[idx], message: "Badge updated" });
}
