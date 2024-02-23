import { whoamiService } from "@/services/session/whoami.service";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type SessionRole = "admin" | "student" | "teacher";

export type SessionUser = {
  uuid: string;
  role: SessionRole;
  full_name: string;
};

export const useSession = () => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = !isLoading && !!user;

  useEffect(() => {
    recoverSession();
  }, []);

  useEffect(() => {
    if (user) setIsLoading(false);
  }, [user]);

  const recoverSession = async () => {
    setIsLoading(true);

    const { success, user } = await whoamiService();

    if (success && user) {
      setUser(user);
    } else {
      setIsLoading(false);
    }
  };

  const login = (user: SessionUser) => {
    setIsLoading(true);
    setUser(user);
  };

  const queryClient = useQueryClient();
  const logout = () => {
    // Remove user from state
    setUser(null);

    // Clear the cache to prevent showing other user's data
    queryClient.clear();
  };

  return {
    user,
    login,
    logout,
    isLoading,
    isLoggedIn
  };
};
