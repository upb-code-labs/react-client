import { whoamiService } from "@/services/session/session.services";
import { useEffect, useState } from "react";

export type SessionRole = "admin" | "student" | "teacher";

export type SessionUser = {
  uuid: string;
  role: SessionRole;
  full_name: string;
};

export const useSession = () => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = !isLoading && !!user;

  useEffect(() => {
    recoverSession();
  }, []);

  const recoverSession = async () => {
    setIsLoading(true);

    const { success, user } = await whoamiService();
    if (success && user) setUser(user);

    setIsLoading(false);
  };

  const login = (user: SessionUser) => {
    setIsLoading(true);
    setUser(user);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    isLoading,
    isLoggedIn
  };
};
