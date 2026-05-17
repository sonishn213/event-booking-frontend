import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import UserRole from "@/domain/enums/UserRoles";

interface UseRolesReturn {
  isLoading: boolean;
  roles: string[];
  isOrganizer: boolean;
  isAttendee: boolean;
  isStaff: boolean;
}

export const useRoles = (): UseRolesReturn => {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (isAuthLoading || !user?.access_token) {
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
      setIsLoading(isAuthLoading);
      return;
    }

    try {
      // const payload = jwtDecode<JwtPayload>(user?.access_token);
      const allRoles = user?.profile?.realm_access?.roles || [];
      // const allRoles = payload.realm_access?.roles || [];
      const filteredRoles = allRoles.filter((role) => role.startsWith("role_"));
      setRoles(filteredRoles);
      setIsOrganizer(allRoles.includes(UserRole.ORGANIZER));
      setIsStaff(allRoles.includes(UserRole.STAFF));
      setIsAttendee(allRoles.includes(UserRole.ATTENDEE));
    } catch (error) {
      console.error("Error parsing JWT: " + error);
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading, user?.access_token]);

  return {
    isLoading,
    roles,
    isOrganizer,
    isAttendee,
    isStaff,
  };
};
