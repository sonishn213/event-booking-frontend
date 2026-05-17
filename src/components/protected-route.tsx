import UserHomeUrl from "@/domain/enums/UserHomeUrl";
import UserRole from "@/domain/enums/UserRoles";
import { useRoles } from "@/hooks/use-roles";
import { ReactNode } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router";

interface ProtectedRouteProperties {
  role?: UserRole;
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProperties> = ({
  role,
  children,
}) => {
  const { isLoading, isAuthenticated } = useAuth();
  const { isOrganizer, isStaff, isAttendee, roles } = useRoles();
  const location = useLocation();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    localStorage.setItem(
      "redirectPath",
      globalThis.location.pathname + globalThis.location.search,
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!role || !roles || roles.includes(role)) {
    return children;
  }

  if (isOrganizer) {
    return (
      <Navigate to={UserHomeUrl.ORGANIZER} state={{ from: location }} replace />
    );
  }

  if (isAttendee) {
    return (
      <Navigate to={UserHomeUrl.ATTENDEE} state={{ from: location }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
