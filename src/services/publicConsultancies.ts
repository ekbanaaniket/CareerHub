// ============= Public Consultancies Service =============
// Only ACTIVE consultancies are returned to public/student/non-admin users
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface PublicConsultancy {
  id: string;
  name: string;
  logo: string;
  city: string;
  state: string;
  description: string;
  rating: number;
  reviewCount: number;
  activeStudents: number;
  totalPlacements: number;
  successRate: number;
  established: string;
  website: string;
  specializations: string[];
  countries: string[];
  services: string[];
  features: string[];
  isPublic: boolean;
  contactEmail: string;
  contactPhone: string;
  isFeatured?: boolean;
  status: "active" | "suspended" | "pending";
}

const mockConsultancies: PublicConsultancy[] = [
  {
    id: "CON1", name: "Global Consultancy", logo: "GC", city: "New Delhi", state: "DL",
    description: "Leading education & immigration consultancy specializing in UK, US, Canada, and Australia. Over 5000 successful visa applications.",
    rating: 4.9, reviewCount: 380, activeStudents: 245, totalPlacements: 5200, successRate: 96,
    established: "2015", website: "https://globalconsultancy.com",
    specializations: ["Student Visa", "PR Applications", "University Admissions"],
    countries: ["United Kingdom", "United States", "Canada", "Australia", "Germany"],
    services: ["Visa Processing", "University Selection", "SOP Writing", "IELTS Coaching", "Scholarship Guidance", "Pre-departure Briefing"],
    features: ["Free initial consultation", "98% visa success rate", "Partnered with 200+ universities", "IELTS/TOEFL coaching"],
    isPublic: true, contactEmail: "info@globalconsultancy.com", contactPhone: "+91 98765 43210",
    isFeatured: true, status: "active",
  },
  {
    id: "CON2", name: "StudyAbroad Pro", logo: "SA", city: "Mumbai", state: "MH",
    description: "Premium study abroad consultancy with personalized counseling for top-tier university admissions worldwide.",
    rating: 4.7, reviewCount: 220, activeStudents: 180, totalPlacements: 3800, successRate: 94,
    established: "2018", website: "https://studyabroadpro.in",
    specializations: ["University Admissions", "Test Preparation", "Career Counseling"],
    countries: ["United States", "Canada", "United Kingdom", "Ireland", "New Zealand"],
    services: ["University Shortlisting", "Application Filing", "Visa Assistance", "Test Prep", "Interview Coaching"],
    features: ["1-on-1 counseling", "AI-powered university matching", "Post-landing support", "Alumni network"],
    isPublic: true, contactEmail: "hello@studyabroadpro.in", contactPhone: "+91 98765 43211",
    isFeatured: true, status: "active",
  },
  {
    id: "CON3", name: "EuroPath Consultants", logo: "EP", city: "Bangalore", state: "KA",
    description: "Specialists in European education pathways — Germany, France, Netherlands.",
    rating: 4.5, reviewCount: 145, activeStudents: 120, totalPlacements: 1800, successRate: 91,
    established: "2020", website: "https://europath.io",
    specializations: ["European Education", "German Language", "Blocked Account"],
    countries: ["Germany", "France", "Netherlands", "Sweden", "Switzerland"],
    services: ["Uni-Assist Filing", "Blocked Account Setup", "German A1-B2 Courses", "Accommodation Help"],
    features: ["In-house German teachers", "Direct university tie-ups", "Affordable packages", "Student housing support"],
    isPublic: true, contactEmail: "support@europath.io", contactPhone: "+91 98765 43212",
    isFeatured: true, status: "active",
  },
  {
    id: "CON4", name: "Pacific Immigration Services", logo: "PI", city: "Hyderabad", state: "TS",
    description: "Full-service immigration consultancy covering PR, work visas, and dependent visas.",
    rating: 4.6, reviewCount: 190, activeStudents: 90, totalPlacements: 2400, successRate: 93,
    established: "2017", website: "https://pacificimmigration.co",
    specializations: ["PR Applications", "Work Visas", "Dependent Visas"],
    countries: ["Australia", "Canada", "New Zealand"],
    services: ["Skills Assessment", "EOI Filing", "PR Processing", "Work Permit", "Spouse Visa"],
    features: ["MARA registered agents", "Express entry specialists", "Free eligibility check", "Money-back guarantee"],
    isPublic: true, contactEmail: "apply@pacificimmigration.co", contactPhone: "+91 98765 43213",
    status: "suspended", // Will NOT appear in public view
  },
  {
    id: "CON5", name: "Ivy League Advisors", logo: "IL", city: "Pune", state: "MH",
    description: "Exclusive consultancy for Ivy League and top-50 US university admissions.",
    rating: 4.8, reviewCount: 310, activeStudents: 85, totalPlacements: 1200, successRate: 97,
    established: "2016", website: "https://ivyleagueadvisors.com",
    specializations: ["Ivy League Admissions", "MBA Applications", "PhD Programs"],
    countries: ["United States", "United Kingdom"],
    services: ["SOP Review", "LOR Coaching", "Interview Prep", "Profile Building", "Scholarship Strategy"],
    features: ["Ex-admissions officers", "95% admit rate", "Personalized roadmap", "Mock interviews"],
    isPublic: true, contactEmail: "apply@ivyleague.com", contactPhone: "+91 98765 43214",
    isFeatured: true, status: "active",
  },
  {
    id: "CON6", name: "NorthStar Migration", logo: "NS", city: "Chennai", state: "TN",
    description: "Canada immigration experts — Express Entry, PNP, LMIA, and family sponsorship.",
    rating: 4.4, reviewCount: 275, activeStudents: 150, totalPlacements: 3100, successRate: 92,
    established: "2019", website: "https://northstarmigration.ca",
    specializations: ["Express Entry", "PNP Programs", "LMIA"],
    countries: ["Canada"],
    services: ["Express Entry Filing", "PNP Application", "LMIA Processing", "Family Sponsorship", "Citizenship"],
    features: ["RCIC licensed", "Free CRS evaluation", "14-day processing start", "Refund policy"],
    isPublic: true, contactEmail: "info@northstar.ca", contactPhone: "+91 98765 43215",
    isFeatured: true, status: "active",
  },
  {
    id: "CON7", name: "AussieDreams Education", logo: "AD", city: "Kolkata", state: "WB",
    description: "Australia-focused education and migration consultancy.",
    rating: 4.3, reviewCount: 130, activeStudents: 110, totalPlacements: 1600, successRate: 90,
    established: "2021", website: "https://aussiedreams.edu.au",
    specializations: ["Australian Student Visa", "Graduate Visa", "Skilled Migration"],
    countries: ["Australia"],
    services: ["CoE Processing", "Visa Filing", "OSHC Enrollment", "Airport Pickup", "Accommodation"],
    features: ["University partners", "Pre-departure sessions", "Student community", "Job assistance"],
    isPublic: true, contactEmail: "study@aussiedreams.edu.au", contactPhone: "+91 98765 43216",
    isFeatured: true, status: "active",
  },
];

// Only returns ACTIVE consultancies — suspended ones never reach the frontend
export async function fetchPublicConsultancies(params?: {
  search?: string;
  country?: string;
  specialization?: string;
  city?: string;
  minRating?: number;
}): Promise<ApiResponse<PublicConsultancy[]>> {
  let filtered = mockConsultancies.filter((c) => c.isPublic && c.status === "active");
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((c) =>
      c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) ||
      c.specializations.some((s) => s.toLowerCase().includes(q)) ||
      c.countries.some((co) => co.toLowerCase().includes(q)) ||
      c.services.some((s) => s.toLowerCase().includes(q))
    );
  }
  if (params?.country && params.country !== "all") {
    const co = params.country.toLowerCase();
    filtered = filtered.filter((c) => c.countries.some((cn) => cn.toLowerCase().includes(co)));
  }
  if (params?.specialization && params.specialization !== "all") {
    const sp = params.specialization.toLowerCase();
    filtered = filtered.filter((c) => c.specializations.some((s) => s.toLowerCase().includes(sp)));
  }
  if (params?.city && params.city !== "all") {
    filtered = filtered.filter((c) => c.city.toLowerCase().includes(params.city!.toLowerCase()));
  }
  if (params?.minRating) {
    filtered = filtered.filter((c) => c.rating >= params.minRating!);
  }
  filtered.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.rating - a.rating;
  });
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchPublicConsultancyById(id: string): Promise<ApiResponse<PublicConsultancy | null>> {
  const c = mockConsultancies.find((c) => c.id === id && c.isPublic && c.status === "active");
  return mockApiCall({ data: c ?? null });
}

export function getConsultancyFilterOptions() {
  const allPublic = mockConsultancies.filter((c) => c.isPublic && c.status === "active");
  const countries = [...new Set(allPublic.flatMap((c) => c.countries))].sort();
  const specializations = [...new Set(allPublic.flatMap((c) => c.specializations))].sort();
  const cities = [...new Set(allPublic.map((c) => c.city))].sort();
  return { countries, specializations, cities };
}