// ============= Grouped Navigation Configuration =============
import {
  LayoutDashboard, Users, FileText, BarChart3, BookOpen,
  Settings, GraduationCap, Video, Shield, ShieldOff, Briefcase,
  Building2, CalendarCheck, CreditCard, Megaphone, Globe,
  Plane, University, Languages, UserCheck, UserPlus, Star, HelpCircle, User
} from "lucide-react";
import type { Permission, AppRole } from "./roles";
import { getEffectivePermissions } from "./roles";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
  badge?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// Student gets separate navigation — grouped by entity type
const STUDENT_NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    label: "Institutes",
    items: [
      { path: "/my/institutes", label: "Registered Institutes", icon: Building2 },
      { path: "/my/institutes/courses", label: "My Courses", icon: GraduationCap },
      { path: "/my/institutes/lectures", label: "My Lectures", icon: Video },
      { path: "/my/institutes/tests", label: "My Tests", icon: FileText },
      { path: "/my/institutes/progress", label: "Progress Reports", icon: BarChart3 },
      { path: "/my/institutes/attendance", label: "Attendance", icon: CalendarCheck },
      { path: "/my/institutes/library", label: "Library", icon: BookOpen },
      { path: "/my/institutes/fees", label: "Fees", icon: CreditCard },
    ],
  },
  {
    label: "Consultancies",
    items: [
      { path: "/my/consultancies", label: "Registered Consultancies", icon: Globe },
      { path: "/my/consultancies/visa", label: "Visa Status", icon: Plane },
      { path: "/my/consultancies/university", label: "University Apps", icon: University },
      { path: "/my/consultancies/language", label: "Language Courses", icon: Languages },
    ],
  },
  {
    label: "Companies",
    items: [
      { path: "/my/companies", label: "Applied Jobs", icon: Briefcase },
      { path: "/my/companies/placements", label: "Placements", icon: Megaphone },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/profile", label: "My Profile", icon: User },
      { path: "/help", label: "Help & Support", icon: HelpCircle },
    ],
  },
];

// Platform Owner — entity-grouped VIEW-ONLY navigation
const PLATFORM_OWNER_NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    label: "Institutes",
    items: [
      { path: "/institutes", label: "Browse Institutes", icon: Globe },
      { path: "/institutes/manage", label: "Manage Institutes", icon: Building2 },
      { path: "/students", label: "Students", icon: Users },
      { path: "/enrollment", label: "Enrollment", icon: UserPlus },
      { path: "/courses", label: "Courses", icon: GraduationCap },
      { path: "/lectures", label: "Lectures", icon: Video },
      { path: "/tests", label: "Tests & Exams", icon: FileText },
      { path: "/progress", label: "Progress", icon: BarChart3 },
      { path: "/attendance", label: "Attendance", icon: CalendarCheck },
      { path: "/library", label: "Library", icon: BookOpen },
      { path: "/fees", label: "Fees & Billing", icon: CreditCard },
      { path: "/analytics/institutes", label: "Institute Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Consultancies",
    items: [
      { path: "/consultancies/browse", label: "Browse Consultancies", icon: Globe },
      { path: "/consultancies/manage", label: "Manage Consultancies", icon: Building2 },
      { path: "/consultancy/visa", label: "Visa Tracking", icon: Plane },
      { path: "/consultancy/university", label: "University Apps", icon: University },
      { path: "/consultancy/language", label: "Language Courses", icon: Languages },
      { path: "/consultancy/counselors", label: "Counselors", icon: UserCheck },
      { path: "/analytics/consultancies", label: "Consultancy Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Companies",
    items: [
      { path: "/companies", label: "Browse Companies", icon: Briefcase },
      { path: "/companies/manage", label: "Manage Companies", icon: Building2 },
      { path: "/placements", label: "Placements", icon: Briefcase },
      { path: "/vacancies", label: "Job Board", icon: Megaphone },
      { path: "/analytics/companies", label: "Company Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Platform",
    items: [
      { path: "/registrations", label: "Registration Approvals", icon: UserPlus },
      { path: "/featured", label: "Featured", icon: Star },
      { path: "/roles", label: "Roles & Permissions", icon: Shield },
      { path: "/permissions", label: "Permission Management", icon: ShieldOff },
      { path: "/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/profile", label: "My Profile", icon: User },
      { path: "/help", label: "Help & Support", icon: HelpCircle },
    ],
  },
];

const ALL_NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
      { path: "/announcements", label: "Announcements", icon: Megaphone, permission: "announcements" },
    ],
  },
  {
    label: "Academic",
    items: [
      { path: "/students", label: "Students", icon: Users, permission: "students" },
      { path: "/enrollment", label: "Enrollment", icon: UserPlus, permission: "enrollment" },
      { path: "/courses", label: "Courses", icon: GraduationCap, permission: "courses" },
      { path: "/lectures", label: "Lectures", icon: Video, permission: "lectures" },
      { path: "/tests", label: "Tests & Exams", icon: FileText, permission: "tests" },
      { path: "/progress", label: "Progress", icon: BarChart3, permission: "progress" },
      { path: "/attendance", label: "Attendance", icon: CalendarCheck, permission: "attendance" },
    ],
  },
  {
    label: "Resources",
    items: [
      { path: "/library", label: "Library", icon: BookOpen, permission: "library" },
    ],
  },
  {
    label: "Consultancy",
    items: [
      { path: "/consultancy/visa", label: "Visa Tracking", icon: Plane, permission: "visa_tracking" },
      { path: "/consultancy/university", label: "University Apps", icon: University, permission: "university_applications" },
      { path: "/consultancy/language", label: "Language Courses", icon: Languages, permission: "language_courses" },
      { path: "/consultancy/counselors", label: "Counselors", icon: UserCheck, permission: "counselor_management" },
    ],
  },
  {
    label: "Career",
    items: [
      { path: "/placements", label: "Placements", icon: Briefcase, permission: "placements" },
      { path: "/vacancies", label: "Job Board", icon: Megaphone, permission: "company_vacancies" },
    ],
  },
  {
    label: "Finance",
    items: [
      { path: "/fees", label: "Fees & Billing", icon: CreditCard, permission: "fees" },
    ],
  },
  {
    label: "Administration",
    items: [
      { path: "/roles", label: "Roles & Permissions", icon: Shield, permission: "roles" },
      { path: "/permissions", label: "Permission Management", icon: ShieldOff, permission: "roles" },
      { path: "/settings", label: "Settings", icon: Settings, permission: "settings" },
    ],
  },
  {
    label: "Support",
    items: [
      { path: "/profile", label: "My Profile", icon: User, permission: "dashboard" },
      { path: "/help", label: "Help & Support", icon: HelpCircle, permission: "dashboard" },
    ],
  },
];

export function getNavigationForRole(
  role: AppRole,
  instituteId?: string,
  instructorId?: string,
): NavGroup[] {
  if (role === "student") return STUDENT_NAV_GROUPS;
  if (role === "platform_owner") return PLATFORM_OWNER_NAV_GROUPS;

  const effective = getEffectivePermissions(role, instituteId, instructorId);
  
  return ALL_NAV_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || effective.includes(item.permission)
      ),
    }))
    .filter((group) => group.items.length > 0);
}
