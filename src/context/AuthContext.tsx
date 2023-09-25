import { SessionUser, useSession } from "@/hooks/useSession";
import { ReactNode, createContext } from "react";

interface AuthContextValues {
  user: SessionUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setContextUser: (user: SessionUser) => void;
  removeContextUser: () => void;
}

const defaultValues: AuthContextValues = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  setContextUser: (_user: SessionUser) => {},
  removeContextUser: () => {}
};

export const AuthContext = createContext<AuthContextValues>(defaultValues);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { user, login, logout, isLoading, isLoggedIn } = useSession();

  return (
    <AuthContext.Provider
      value={{
        user,
        setContextUser: login,
        removeContextUser: logout,
        isLoading,
        isLoggedIn
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
