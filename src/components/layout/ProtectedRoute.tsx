import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { isRouteAllowed, getFirstAllowedRoute } from "@/services/proxy";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Check if user has permission for this route
  const allowed = isRouteAllowed(
    location.pathname,
    user.role,
    user.instituteId,
    user.assignedInstructorId,
    user.id
  );

  if (!allowed) {
    const redirectTo = getFirstAllowedRoute(
      user.role,
      user.instituteId,
      user.assignedInstructorId,
      user.id
    );
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
