import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigation } from "@/hooks/useNavigation";
import { useBreadcrumbConfig } from "@/hooks/useBreadcrumbs";
import { useMemo } from "react";

export function Breadcrumbs() {
  const location = useLocation();
  const { user } = useAuth();
  const segments = location.pathname.split("/").filter(Boolean);

  const { data: navConfig, routeLabels } = useNavigation(user?.role, user?.instituteId, user?.assignedInstructorId);
  const { data: breadcrumbData } = useBreadcrumbConfig();

  // Build valid routes from navigation config
  const validRoutes = useMemo(() => {
    if (!navConfig?.groups) return new Set<string>();
    const routes = new Set<string>();
    navConfig.groups.forEach(group => {
      group.items.forEach(item => {
        routes.add(item.path);
      });
    });
    routes.add("/profile");
    routes.add("/help");
    return routes;
  }, [navConfig]);

  // Resolve label: first from nav route labels, then from breadcrumb segment config
  const getLabel = (segment: string, fullPath: string): string => {
    if (routeLabels[fullPath]) return routeLabels[fullPath];
    if (breadcrumbData?.segmentLabels[segment]) return breadcrumbData.segmentLabels[segment];
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {segments.map((segment, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const label = getLabel(segment, path);
        const isLast = i === segments.length - 1;
        const isValidRoute = validRoutes.has(path);

        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : isValidRoute ? (
              <Link to={path} className="hover:text-foreground transition-colors">{label}</Link>
            ) : (
              <span className="text-muted-foreground">{label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
