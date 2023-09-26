import { AuthContext } from "@/context/AuthContext";
import { SessionRole } from "@/hooks/useSession";
import { Loader2 } from "lucide-react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthMiddlewareProps {
  children: React.ReactNode;
  mustBeLoggedIn?: boolean;
  roles?: SessionRole[];
}

export const AuthMiddleware = ({
  roles,
  mustBeLoggedIn,
  children
}: AuthMiddlewareProps) => {
  const { isLoading, isLoggedIn, user } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="p-4">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  }

  if (mustBeLoggedIn) {
    // Prevent access to logged-out users
    if (!isLoggedIn || !user) {
      toast.error("You must be logged in to access this page");
      return <Navigate to="/login" />;
    }

    // Prevent access to users without the required role (if needed)
    if (roles && !roles.includes(user.role)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/" />;
    }
  } else {
    // Prevent access to logged-in users
    if (isLoggedIn && user) {
      toast("You are already logged in");
      return <Navigate to="/" />;
    }
  }

  return children;
};
