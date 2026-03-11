// ============= Public Institutes Service =============
// Only ACTIVE institutes are returned to public/student/non-admin users
import { mockApiCall } from "./api";
import type { ApiResponse } from "@/types";

export interface PublicInstitute {
  id: string;
  name: string;
  logo: string;
  city: string;
  state: string;
  description: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  courseCount: number;
  placementRate: number;
  avgPackage: string;
  teachingMode: "online" | "offline" | "hybrid";
  established: string;
  website: string;
  courses: string[];
  isPublic: boolean;
  showPlacementData: boolean;
  showFeeData: boolean;
  showStudentReviews: boolean;
  registrationOpen: boolean;
  registrationFee: number;
  features: string[];
  isFeatured?: boolean;
  status: "active" | "suspended" | "pending";
}

const mockPublicInstitutes: PublicInstitute[] = [
  {
    id: "1", name: "TechVerse Academy", logo: "TV", city: "San Francisco", state: "CA",
    description: "Premier technology education institute offering comprehensive full-stack development programs with industry-leading placement support.",
    rating: 4.8, reviewCount: 256, studentCount: 1284, courseCount: 24, placementRate: 92, avgPackage: "$145,000",
    teachingMode: "hybrid", established: "2020", website: "https://techverse.academy",
    courses: ["Full-Stack Development", "Frontend Bootcamp", "Backend Mastery", "DevOps"],
    isPublic: true, showPlacementData: true, showFeeData: true, showStudentReviews: true,
    registrationOpen: true, registrationFee: 500,
    features: ["Live classes", "1:1 Mentorship", "Job guarantee", "Industry projects", "Career support"],
    isFeatured: true, status: "active",
  },
  {
    id: "2", name: "CodeCraft Institute", logo: "CC", city: "New York", state: "NY",
    description: "Hands-on coding bootcamp focused on practical skills and real-world project experience.",
    rating: 4.6, reviewCount: 180, studentCount: 856, courseCount: 18, placementRate: 88, avgPackage: "$128,000",
    teachingMode: "offline", established: "2019", website: "https://codecraft.io",
    courses: ["Web Development", "Data Science", "Mobile App Dev"],
    isPublic: true, showPlacementData: true, showFeeData: false, showStudentReviews: true,
    registrationOpen: true, registrationFee: 350,
    features: ["Small batch size", "Weekend classes", "Portfolio building", "Mock interviews"],
    isFeatured: true, status: "active",
  },
  {
    id: "3", name: "DigitalMinds School", logo: "DM", city: "Austin", state: "TX",
    description: "Online-first coding school with flexible schedules and self-paced learning options.",
    rating: 4.4, reviewCount: 142, studentCount: 2100, courseCount: 32, placementRate: 78, avgPackage: "$110,000",
    teachingMode: "online", established: "2021", website: "https://digitalminds.school",
    courses: ["Python Programming", "Cloud Computing", "Cybersecurity", "AI/ML"],
    isPublic: true, showPlacementData: false, showFeeData: true, showStudentReviews: false,
    registrationOpen: false, registrationFee: 200,
    features: ["Self-paced", "24/7 support", "Certificate programs", "Free trial"],
    status: "active",
  },
  {
    id: "4", name: "ByteForge Labs", logo: "BF", city: "Seattle", state: "WA",
    description: "Research-driven institute focusing on cutting-edge technologies and advanced computing.",
    rating: 4.7, reviewCount: 98, studentCount: 540, courseCount: 12, placementRate: 95, avgPackage: "$162,000",
    teachingMode: "hybrid", established: "2022", website: "https://byteforge.labs",
    courses: ["Systems Programming", "Distributed Systems", "Blockchain Dev"],
    isPublic: true, showPlacementData: true, showFeeData: true, showStudentReviews: true,
    registrationOpen: true, registrationFee: 600,
    features: ["Research projects", "Industry partnerships", "Hackathons", "Advanced labs"],
    isFeatured: true, status: "active",
  },
  {
    id: "5", name: "CloudNine Academy", logo: "CN", city: "Denver", state: "CO",
    description: "Specializing in cloud infrastructure, AWS, Azure, and GCP certifications with hands-on lab environments.",
    rating: 4.5, reviewCount: 210, studentCount: 780, courseCount: 15, placementRate: 89, avgPackage: "$135,000",
    teachingMode: "online", established: "2021", website: "https://cloudnine.academy",
    courses: ["AWS Solutions Architect", "Azure DevOps", "GCP Engineering", "Kubernetes"],
    isPublic: true, showPlacementData: true, showFeeData: true, showStudentReviews: true,
    registrationOpen: true, registrationFee: 450,
    features: ["Cloud labs", "Certification prep", "Live projects", "24/7 mentor access"],
    isFeatured: true, status: "active",
  },
  {
    id: "6", name: "DataPulse Institute", logo: "DP", city: "Chicago", state: "IL",
    description: "Data science and machine learning institute with research-grade curriculum and Kaggle competitions.",
    rating: 4.9, reviewCount: 320, studentCount: 620, courseCount: 20, placementRate: 94, avgPackage: "$155,000",
    teachingMode: "hybrid", established: "2019", website: "https://datapulse.edu",
    courses: ["Machine Learning", "Deep Learning", "NLP", "Data Engineering", "MLOps"],
    isPublic: true, showPlacementData: true, showFeeData: false, showStudentReviews: true,
    registrationOpen: true, registrationFee: 700,
    features: ["Kaggle competitions", "Research papers", "GPU clusters", "Industry datasets"],
    isFeatured: true, status: "active",
  },
  {
    id: "7", name: "FullStack Forge", logo: "FF", city: "Boston", state: "MA",
    description: "Intensive 12-week bootcamp turning beginners into job-ready full-stack developers.",
    rating: 4.3, reviewCount: 165, studentCount: 450, courseCount: 8, placementRate: 82, avgPackage: "$118,000",
    teachingMode: "offline", established: "2020", website: "https://fullstackforge.io",
    courses: ["MERN Stack", "Django & React", "Ruby on Rails"],
    isPublic: true, showPlacementData: true, showFeeData: true, showStudentReviews: true,
    registrationOpen: true, registrationFee: 300,
    features: ["12-week intensive", "Career coaching", "Demo day", "Alumni network"],
    isFeatured: true, status: "active",
  },
  {
    id: "8", name: "CyberShield Academy", logo: "CS", city: "Washington", state: "DC",
    description: "Premier cybersecurity training with ethical hacking labs and SOC operations.",
    rating: 4.6, reviewCount: 88, studentCount: 320, courseCount: 10, placementRate: 91, avgPackage: "$142,000",
    teachingMode: "hybrid", established: "2022", website: "https://cybershield.academy",
    courses: ["Ethical Hacking", "SOC Operations", "Cloud Security", "Pen Testing"],
    isPublic: true, showPlacementData: true, showFeeData: true, showStudentReviews: false,
    registrationOpen: true, registrationFee: 550,
    features: ["Virtual labs", "CTF competitions", "Industry certs", "Red team exercises"],
    status: "active",
  },
  {
    // Suspended institute — should NOT appear in public/student views
    id: "9", name: "SuspendedTech School", logo: "ST", city: "Detroit", state: "MI",
    description: "Suspended for policy violations.",
    rating: 3.0, reviewCount: 10, studentCount: 50, courseCount: 2, placementRate: 30, avgPackage: "$60,000",
    teachingMode: "online", established: "2023", website: "https://suspendedtech.fake",
    courses: ["Basic Web"],
    isPublic: true, showPlacementData: false, showFeeData: false, showStudentReviews: false,
    registrationOpen: false, registrationFee: 0,
    features: [],
    status: "suspended",
  },
];

// PUBLIC fetch — only returns ACTIVE institutes (suspended/pending are never sent to frontend)
export async function fetchPublicInstitutes(params?: {
  search?: string;
  city?: string;
  teachingMode?: string;
}): Promise<ApiResponse<PublicInstitute[]>> {
  // Backend filtering: only active & public
  let filtered = mockPublicInstitutes.filter((i) => i.isPublic && i.status === "active");
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter((i) =>
      i.name.toLowerCase().includes(q) || i.city.toLowerCase().includes(q) ||
      i.courses.some((c) => c.toLowerCase().includes(q))
    );
  }
  if (params?.city) {
    const c = params.city.toLowerCase();
    filtered = filtered.filter((i) => i.city.toLowerCase().includes(c));
  }
  if (params?.teachingMode && params.teachingMode !== "all") {
    filtered = filtered.filter((i) => i.teachingMode === params.teachingMode);
  }
  filtered.sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.rating - a.rating;
  });
  return mockApiCall({ data: filtered, total: filtered.length });
}

export async function fetchPublicInstituteById(id: string): Promise<ApiResponse<PublicInstitute | null>> {
  // Only return if active
  const inst = mockPublicInstitutes.find((i) => i.id === id && i.isPublic && i.status === "active");
  return mockApiCall({ data: inst ?? null });
}

export async function registerForInstitute(instituteId: string, studentData: {
  name: string;
  email: string;
  phone: string;
  course: string;
}): Promise<ApiResponse<{ registrationId: string; paymentUrl: string }>> {
  return mockApiCall({
    data: {
      registrationId: `REG${Date.now()}`,
      paymentUrl: `/payment?institute=${instituteId}&amount=${mockPublicInstitutes.find((i) => i.id === instituteId)?.registrationFee ?? 0}`,
    },
    message: "Registration initiated. Redirecting to payment...",
  });
}