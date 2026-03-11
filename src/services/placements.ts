import { mockApiCall } from "./api";
import type { Placement, PlacementDrive, ApiResponse, SearchParams } from "@/types";

const mockPlacements: Placement[] = [
  // Company: Google (C001)
  { id: "P1", studentName: "David Lee", studentId: "S004", company: "Google", position: "Frontend Engineer", package: "$145,000", date: "Feb 20, 2026", status: "placed", city: "Mountain View", instituteId: "1", companyId: "C001" },
  { id: "P8", studentName: "Marco Rivera", studentId: "S012", company: "Google", position: "SRE", package: "$150,000", date: "Feb 22, 2026", status: "placed", city: "New York", instituteId: "1", companyId: "C001" },
  { id: "P9", studentName: "Sam Turner", studentId: "S020", company: "Google", position: "Data Engineer", package: "$148,000", date: "Feb 25, 2026", status: "offered", city: "Mountain View", instituteId: "2", companyId: "C001" },
  // Company: Microsoft (C002)
  { id: "P2", studentName: "Grace Kim", studentId: "S013", company: "Microsoft", position: "Full-Stack Developer", package: "$138,000", date: "Feb 18, 2026", status: "placed", city: "Seattle", instituteId: "2", companyId: "C002" },
  { id: "P10", studentName: "Zach Cooper", studentId: "S027", company: "Microsoft", position: "Cloud Engineer", package: "$142,000", date: "Mar 1, 2026", status: "offered", city: "Seattle", instituteId: "4", companyId: "C002" },
  { id: "P11", studentName: "Kevin O'Brien", studentId: "S010", company: "Microsoft", position: "Frontend Engineer", package: "$135,000", date: "Feb 28, 2026", status: "interviewing", city: "Redmond", instituteId: "1", companyId: "C002" },
  // Company: Amazon (C004)
  { id: "P3", studentName: "Bob Smith", studentId: "S002", company: "Amazon", position: "SDE-1", package: "$152,000", date: "Feb 25, 2026", status: "offered", city: "San Francisco", instituteId: "1", companyId: "C004" },
  { id: "P12", studentName: "Aisha Bello", studentId: "S028", company: "Amazon", position: "Security Engineer", package: "$155,000", date: "Mar 2, 2026", status: "interviewing", city: "Seattle", instituteId: "4", companyId: "C004" },
  // Company: Meta (C006)
  { id: "P4", studentName: "Alice Johnson", studentId: "S001", company: "Meta", position: "React Developer", package: "$160,000", date: "Mar 1, 2026", status: "interviewing", city: "Menlo Park", instituteId: "1", companyId: "C006" },
  { id: "P13", studentName: "Natalie Foster", studentId: "S015", company: "Meta", position: "Mobile Engineer", package: "$158,000", date: "Mar 3, 2026", status: "offered", city: "Menlo Park", instituteId: "2", companyId: "C006" },
  // Company: Netflix (C005)
  { id: "P5", studentName: "Henry Brown", studentId: "S014", company: "Netflix", position: "UI Engineer", package: "$155,000", date: "Feb 28, 2026", status: "offered", city: "Los Gatos", instituteId: "2", companyId: "C005" },
  // Company: Stripe (C003)
  { id: "P6", studentName: "Eva Martinez", studentId: "S005", company: "Stripe", position: "Frontend Engineer", package: "$140,000", date: "Mar 2, 2026", status: "interviewing", city: "San Francisco", instituteId: "1", companyId: "C003" },
  { id: "P14", studentName: "Elena Volkov", studentId: "S032", company: "Stripe", position: "Backend Engineer", package: "$145,000", date: "Mar 5, 2026", status: "offered", city: "San Francisco", instituteId: "5", companyId: "C003" },
  // Company: Apple
  { id: "P7", studentName: "Carol Davis", studentId: "S003", company: "Apple", position: "Web Developer", package: "$135,000", date: "Feb 15, 2026", status: "rejected", city: "Cupertino", instituteId: "1", companyId: "C009" },
  // Company: Spotify (C007)
  { id: "P15", studentName: "Oscar Gutierrez", studentId: "S016", company: "Spotify", position: "Data Engineer", package: "$130,000", date: "Mar 4, 2026", status: "placed", city: "Stockholm", instituteId: "2", companyId: "C007" },
  // Company: Airbnb (C008)
  { id: "P16", studentName: "Tina Patel", studentId: "S021", company: "Airbnb", position: "Product Designer", package: "$128,000", date: "Mar 3, 2026", status: "offered", city: "San Francisco", instituteId: "3", companyId: "C008" },
  { id: "P17", studentName: "Uma Nakamura", studentId: "S022", company: "Airbnb", position: "UX Researcher", package: "$125,000", date: "Mar 5, 2026", status: "interviewing", city: "San Francisco", instituteId: "3", companyId: "C008" },
  // More placements for data density
  { id: "P18", studentName: "Priya Sharma", studentId: "S017", company: "Google", position: "Mobile Developer", package: "$147,000", date: "Mar 6, 2026", status: "interviewing", city: "Mountain View", instituteId: "2", companyId: "C001" },
  { id: "P19", studentName: "Yara Hassan", studentId: "S026", company: "Amazon", position: "Cloud Solutions Architect", package: "$165,000", date: "Mar 4, 2026", status: "placed", city: "Seattle", instituteId: "4", companyId: "C004" },
  { id: "P20", studentName: "Derek Frost", studentId: "S031", company: "Microsoft", position: "Systems Engineer", package: "$140,000", date: "Mar 7, 2026", status: "interviewing", city: "Redmond", instituteId: "5", companyId: "C002" },
  { id: "P21", studentName: "Hugo Andersen", studentId: "S035", company: "Stripe", position: "Infrastructure Engineer", package: "$148,000", date: "Mar 8, 2026", status: "offered", city: "San Francisco", instituteId: "5", companyId: "C003" },
  { id: "P22", studentName: "Chloe Park", studentId: "S030", company: "Netflix", position: "Security Engineer", package: "$162,000", date: "Mar 6, 2026", status: "interviewing", city: "Los Gatos", instituteId: "4", companyId: "C005" },
];

const mockDrives: PlacementDrive[] = [
  { id: "PD1", company: "Google", positions: ["Frontend Engineer", "SRE", "Data Analyst"], date: "Mar 10, 2026", registeredStudents: 85, status: "upcoming", packageRange: "$130K - $180K", city: "Mountain View", instituteId: "1" },
  { id: "PD2", company: "Amazon", positions: ["SDE-1", "DevOps Engineer"], date: "Mar 15, 2026", registeredStudents: 92, status: "upcoming", packageRange: "$140K - $170K", city: "Seattle", instituteId: "1" },
  { id: "PD3", company: "Microsoft", positions: ["Full-Stack Developer", "Cloud Engineer"], date: "Feb 18, 2026", registeredStudents: 78, status: "completed", packageRange: "$125K - $160K", city: "Redmond", instituteId: "1" },
  { id: "PD4", company: "Stripe", positions: ["Frontend Engineer", "Backend Engineer"], date: "Mar 5, 2026", registeredStudents: 45, status: "ongoing", packageRange: "$135K - $165K", city: "San Francisco", instituteId: "1" },
  { id: "PD5", company: "Meta", positions: ["React Developer", "Mobile Engineer"], date: "Mar 20, 2026", registeredStudents: 68, status: "upcoming", packageRange: "$140K - $175K", city: "Menlo Park", instituteId: "2" },
  { id: "PD6", company: "Spotify", positions: ["Data Engineer", "ML Engineer"], date: "Mar 25, 2026", registeredStudents: 55, status: "upcoming", packageRange: "$120K - $160K", city: "Stockholm", instituteId: "2" },
];

export async function fetchPlacements(params?: SearchParams): Promise<ApiResponse<Placement[]>> {
  let filtered = [...mockPlacements];
  if (params?.instituteId) filtered = filtered.filter((p) => p.instituteId === params.instituteId);
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((p) => p.studentName.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.position.toLowerCase().includes(q));
  }
  if (params?.status && params.status !== "all") filtered = filtered.filter((p) => p.status === params.status);
  if (params?.city) {
    const c = params.city.toLowerCase();
    filtered = filtered.filter((p) => p.city.toLowerCase().includes(c));
  }
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchPlacementDrives(instituteId?: string): Promise<ApiResponse<PlacementDrive[]>> {
  const filtered = instituteId ? mockDrives.filter((d) => d.instituteId === instituteId) : mockDrives;
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function createPlacement(placement: Omit<Placement, "id">): Promise<ApiResponse<Placement>> {
  const newPlacement: Placement = { ...placement, id: `P${mockPlacements.length + 1}` };
  mockPlacements.push(newPlacement);
  return mockApiCall({ data: newPlacement, message: "Placement recorded successfully" });
}

export async function createPlacementDrive(drive: Omit<PlacementDrive, "id">): Promise<ApiResponse<PlacementDrive>> {
  const newDrive: PlacementDrive = { ...drive, id: `PD${mockDrives.length + 1}` };
  mockDrives.push(newDrive);
  return mockApiCall({ data: newDrive, message: "Placement drive created successfully" });
}

export async function updatePlacement(id: string, data: Partial<Placement>): Promise<ApiResponse<Placement>> {
  const idx = mockPlacements.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Placement not found");
  mockPlacements[idx] = { ...mockPlacements[idx], ...data };
  return mockApiCall({ data: mockPlacements[idx], message: "Placement updated successfully" });
}
