// ============= Route Protection / Proxy Logic =============
// Centralized routing logic based on user roles and permissions.

import type { Permission, AppRole } from "@/config/roles";
import { getEffectivePermissions } from "@/config/roles";

// Map routes to required permissions
const ROUTE_PERMISSION_MAP: Record<string, Permission> = {
  "/dashboard": "dashboard",
  "/students": "students",
  "/enrollment": "enrollment",
  "/courses": "courses",
  "/lectures": "lectures",
  "/tests": "tests",
  "/progress": "progress",
  "/attendance": "attendance",
  "/library": "library",
  "/placements": "placements",
  "/roles": "roles",
  "/settings": "settings",
  "/fees": "fees",
  "/vacancies": "company_vacancies",
  "/institutes": "institutes_view",
  "/institutes/manage": "institutes_manage",
  "/companies": "institutes_view",
  "/companies/manage": "institutes_manage",
  "/consultancies/browse": "consultancy_manage",
  "/consultancies/manage": "consultancy_manage",
  "/announcements": "announcements",
  "/consultancy/visa": "visa_tracking",
  "/consultancy/university": "university_applications",
  "/consultancy/language": "language_courses",
  "/consultancy/counselors": "counselor_management",
  "/featured": "featured_management",
  "/permissions": "roles",
  "/profile": "dashboard",
  "/help": "dashboard",
  "/analytics/institutes": "institutes_view",
  "/analytics/consultancies": "consultancy_manage",
  "/analytics/companies": "institutes_view",
};

// Student-specific allowed routes (students cannot access admin pages)
const STUDENT_ALLOWED_ROUTES = new Set([
  "/dashboard",
  "/announcements",
  "/profile",
  "/help",
  "/my/institutes",
  "/my/institutes/courses",
  "/my/institutes/lectures",
  "/my/institutes/tests",
  "/my/institutes/progress",
  "/my/institutes/attendance",
  "/my/institutes/library",
  "/my/institutes/fees",
  "/my/consultancies",
  "/my/consultancies/visa",
  "/my/consultancies/university",
  "/my/consultancies/language",
  "/my/companies",
  "/my/companies/placements",
]);

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/explore",
  "/pricing",
  "/browse/institutes",
  "/browse/consultancies",
  "/browse/jobs",
];

// Routes with dynamic segments
const DYNAMIC_PUBLIC_ROUTES = [
  /^\/institutes\/[^/]+$/,
  /^\/consultancies\/[^/]+$/,
];

export function isPublicRoute(path: string): boolean {
  if (PUBLIC_ROUTES.includes(path)) return true;
  return DYNAMIC_PUBLIC_ROUTES.some((r) => r.test(path));
}

export function isRouteAllowed(
  path: string,
  role: AppRole,
  instituteId?: string,
  instructorId?: string,
  userId?: string,
): boolean {
  if (isPublicRoute(path)) return true;

  // Students can only access their specific routes
  if (role === "student") {
    return STUDENT_ALLOWED_ROUTES.has(path);
  }

  const requiredPermission = ROUTE_PERMISSION_MAP[path];
  if (!requiredPermission) return true; // unknown routes are allowed (will 404)

  const effective = getEffectivePermissions(role, instituteId, instructorId, userId);
  return effective.includes(requiredPermission);
}

export function getFirstAllowedRoute(
  role: AppRole,
  instituteId?: string,
  instructorId?: string,
  userId?: string,
): string {
  // Students always go to dashboard
  if (role === "student") return "/dashboard";

  const effective = getEffectivePermissions(role, instituteId, instructorId, userId);

  // Priority order for redirect
  const priorityRoutes: { path: string; permission: Permission }[] = [
    { path: "/dashboard", permission: "dashboard" },
    { path: "/courses", permission: "courses" },
    { path: "/library", permission: "library" },
    { path: "/vacancies", permission: "company_vacancies" },
    { path: "/placements", permission: "placements" },
    { path: "/institutes", permission: "institutes_view" },
  ];

  for (const route of priorityRoutes) {
    if (effective.includes(route.permission)) return route.path;
  }

  return "/"; // fallback to landing
}

export function getRedirectForUnauthorized(
  currentPath: string,
  role: AppRole,
  instituteId?: string,
  instructorId?: string,
  userId?: string,
): string | null {
  if (isPublicRoute(currentPath)) return null;
  if (isRouteAllowed(currentPath, role, instituteId, instructorId, userId)) return null;
  return getFirstAllowedRoute(role, instituteId, instructorId, userId);
}
