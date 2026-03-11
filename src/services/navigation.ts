// ============= Navigation Service =============
// All sidebar navigation config comes from here (simulating backend API)
import { mockApiCall } from "./api";
import type { AppRole, Permission } from "@/config/roles";
import { getEffectivePermissions } from "@/config/roles";
import type { ApiResponse } from "@/types";
import {
  LayoutDashboard, Users, FileText, BarChart3, BookOpen,
  Settings, GraduationCap, Video, Shield, ShieldOff, Briefcase,
  Building2, CalendarCheck, CreditCard, Megaphone, Globe,
  Plane, University, Languages, UserCheck, UserPlus, Star, HelpCircle, User
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  iconName: string;
  permission?: Permission;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavigationConfig {
  groups: NavGroup[];
}

// Icon registry — maps string names to Lucide icons
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  LayoutDashboard, Users, FileText, BarChart3, BookOpen,
  Settings, GraduationCap, Video, Shield, ShieldOff, Briefcase,
  Building2, CalendarCheck, CreditCard, Megaphone, Globe,
  Plane, University, Languages, UserCheck, UserPlus, Star, HelpCircle, User,
};

export function getIcon(name: string): LucideIcon {
  return ICON_REGISTRY[name] ?? LayoutDashboard;
}

// ─── Navigation JSON data (simulating backend config) ───

const STUDENT_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", iconName: "LayoutDashboard" },
      { path: "/announcements", label: "Announcements", iconName: "Megaphone" },
    ],
  },
  {
    label: "Institutes",
    items: [
      { path: "/my/institutes", label: "Registered Institutes", iconName: "Building2" },
      { path: "/my/institutes/courses", label: "My Courses", iconName: "GraduationCap" },
      { path: "/my/institutes/lectures", label: "My Lectures", iconName: "Video" },
      { path: "/my/institutes/tests", label: "My Tests", iconName: "FileText" },
      { path: "/my/institutes/progress", label: "Progress Reports", iconName: "BarChart3" },
      { path: "/my/institutes/attendance", label: "Attendance", iconName: "CalendarCheck" },
      { path: "/my/institutes/library", label: "Library", iconName: "BookOpen" },
      { path: "/my/institutes/fees", label: "Fees", iconName: "CreditCard" },
    ],
  },
  {
    label: "Consultancies",
    items: [
      { path: "/my/consultancies", label: "Registered Consultancies", iconName: "Globe" },
      { path: "/my/consultancies/visa", label: "Visa Status", iconName: "Plane" },
      { path: "/my/consultancies/university", label: "University Apps", iconName: "University" },
      { path: "/my/consultancies/language", label: "Language Courses", iconName: "Languages" },
    ],
  },
  {
    label: "Companies",
    items: [
      { path: "/my/companies", label: "Applied Jobs", iconName: "Briefcase" },
      { path: "/my/companies/placements", label: "Placements", iconName: "Megaphone" },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/profile", label: "My Profile", iconName: "User" },
      { path: "/help", label: "Help & Support", iconName: "HelpCircle" },
    ],
  },
];

const PLATFORM_OWNER_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", iconName: "LayoutDashboard" },
      { path: "/announcements", label: "Announcements", iconName: "Megaphone" },
    ],
  },
  {
    label: "Institutes",
    items: [
      { path: "/institutes", label: "Browse Institutes", iconName: "Globe" },
      { path: "/institutes/manage", label: "Manage Institutes", iconName: "Building2" },
      { path: "/students", label: "Students", iconName: "Users" },
      { path: "/enrollment", label: "Enrollment", iconName: "UserPlus" },
      { path: "/courses", label: "Courses", iconName: "GraduationCap" },
      { path: "/lectures", label: "Lectures", iconName: "Video" },
      { path: "/tests", label: "Tests & Exams", iconName: "FileText" },
      { path: "/progress", label: "Progress", iconName: "BarChart3" },
      { path: "/attendance", label: "Attendance", iconName: "CalendarCheck" },
      { path: "/library", label: "Library", iconName: "BookOpen" },
      { path: "/fees", label: "Fees & Billing", iconName: "CreditCard" },
      { path: "/analytics/institutes", label: "Institute Analytics", iconName: "BarChart3" },
    ],
  },
  {
    label: "Consultancies",
    items: [
      { path: "/consultancies/browse", label: "Browse Consultancies", iconName: "Globe" },
      { path: "/consultancies/manage", label: "Manage Consultancies", iconName: "Building2" },
      { path: "/consultancy/visa", label: "Visa Tracking", iconName: "Plane" },
      { path: "/consultancy/university", label: "University Apps", iconName: "University" },
      { path: "/consultancy/language", label: "Language Courses", iconName: "Languages" },
      { path: "/consultancy/counselors", label: "Counselors", iconName: "UserCheck" },
      { path: "/analytics/consultancies", label: "Consultancy Analytics", iconName: "BarChart3" },
    ],
  },
  {
    label: "Companies",
    items: [
      { path: "/companies", label: "Browse Companies", iconName: "Briefcase" },
      { path: "/companies/manage", label: "Manage Companies", iconName: "Building2" },
      { path: "/companies/applications", label: "Applications", iconName: "Users" },
      { path: "/placements", label: "Placements", iconName: "Briefcase" },
      { path: "/vacancies", label: "Job Board", iconName: "Megaphone" },
      { path: "/analytics/companies", label: "Company Analytics", iconName: "BarChart3" },
    ],
  },
  {
    label: "Platform",
    items: [
      { path: "/featured", label: "Featured", iconName: "Star" },
      { path: "/roles", label: "Roles & Permissions", iconName: "Shield" },
      { path: "/permissions", label: "Permission Management", iconName: "ShieldOff" },
      { path: "/settings", label: "Settings", iconName: "Settings" },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/profile", label: "My Profile", iconName: "User" },
      { path: "/help", label: "Help & Support", iconName: "HelpCircle" },
    ],
  },
];

const ALL_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", iconName: "LayoutDashboard", permission: "dashboard" },
      { path: "/announcements", label: "Announcements", iconName: "Megaphone", permission: "announcements" },
    ],
  },
  {
    label: "Academic",
    items: [
      { path: "/students", label: "Students", iconName: "Users", permission: "students" },
      { path: "/enrollment", label: "Enrollment", iconName: "UserPlus", permission: "enrollment" },
      { path: "/courses", label: "Courses", iconName: "GraduationCap", permission: "courses" },
      { path: "/lectures", label: "Lectures", iconName: "Video", permission: "lectures" },
      { path: "/tests", label: "Tests & Exams", iconName: "FileText", permission: "tests" },
      { path: "/progress", label: "Progress", iconName: "BarChart3", permission: "progress" },
      { path: "/attendance", label: "Attendance", iconName: "CalendarCheck", permission: "attendance" },
    ],
  },
  {
    label: "Resources",
    items: [
      { path: "/library", label: "Library", iconName: "BookOpen", permission: "library" },
    ],
  },
  {
    label: "Consultancy",
    items: [
      { path: "/consultancy/visa", label: "Visa Tracking", iconName: "Plane", permission: "visa_tracking" },
      { path: "/consultancy/university", label: "University Apps", iconName: "University", permission: "university_applications" },
      { path: "/consultancy/language", label: "Language Courses", iconName: "Languages", permission: "language_courses" },
      { path: "/consultancy/counselors", label: "Counselors", iconName: "UserCheck", permission: "counselor_management" },
    ],
  },
  {
    label: "Career",
    items: [
      { path: "/placements", label: "Placements", iconName: "Briefcase", permission: "placements" },
      { path: "/vacancies", label: "Job Board", iconName: "Megaphone", permission: "company_vacancies" },
    ],
  },
  {
    label: "Finance",
    items: [
      { path: "/fees", label: "Fees & Billing", iconName: "CreditCard", permission: "fees" },
    ],
  },
  {
    label: "Administration",
    items: [
      { path: "/roles", label: "Roles & Permissions", iconName: "Shield", permission: "roles" },
      { path: "/permissions", label: "Permission Management", iconName: "ShieldOff", permission: "roles" },
      { path: "/settings", label: "Settings", iconName: "Settings", permission: "settings" },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/profile", label: "My Profile", iconName: "User", permission: "dashboard" },
      { path: "/help", label: "Help & Support", iconName: "HelpCircle", permission: "dashboard" },
    ],
  },
];

// ─── Service functions (simulate backend API) ───

export async function fetchNavigation(
  role: AppRole,
  instituteId?: string,
  instructorId?: string,
): Promise<ApiResponse<NavigationConfig>> {
  let groups: NavGroup[];

  if (role === "student") {
    groups = STUDENT_NAV;
  } else if (role === "platform_owner") {
    groups = PLATFORM_OWNER_NAV;
  } else {
    const effective = getEffectivePermissions(role, instituteId, instructorId);
    groups = ALL_NAV
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) => !item.permission || effective.includes(item.permission)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }

  return mockApiCall({ data: { groups } });
}

// Build route label map from navigation data
export function buildRouteLabelMap(groups: NavGroup[]): Record<string, string> {
  const map: Record<string, string> = {};
  groups.forEach(group => {
    group.items.forEach(item => {
      map[item.path] = item.label;
    });
  });
  return map;
}
