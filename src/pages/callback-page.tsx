import UserHomeUrl from "@/domain/enums/UserHomeUrl";
import UserRole from "@/domain/enums/UserRoles";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const CallbackPage: React.FC = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      const redirectPath = localStorage.getItem("redirectPath");
      const userRoles = user?.profile?.realm_access?.roles;
      if (redirectPath) {
        localStorage.removeItem("redirectPath");
        navigate(redirectPath);
        return;
      }

      if (userRoles?.includes(UserRole.ORGANIZER)) {
        navigate(UserHomeUrl.ORGANIZER);
        return;
      }

      if (userRoles?.includes(UserRole.ATTENDEE)) {
        navigate(UserHomeUrl.ATTENDEE);
        return;
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <p>Processing login...</p>;
  }

  return <p>Completing login...</p>;
};

export default CallbackPage;
