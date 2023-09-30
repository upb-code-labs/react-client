import { AuthContext } from "@/context/AuthContext";
import { logoutService } from "@/services/session/logout.service";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export const Logout = () => {
  const { removeContextUser } = useContext(AuthContext);

  const logout = async () => {
    const { success } = await logoutService();

    if (success) {
      removeContextUser();
    } else {
      toast.error("There was an error while logging out");
      return <Navigate to="/" />;
    }
  };

  logout();
  return (
    <div className="p-4">
      <p className="text-center">👋 Logging out...</p>
    </div>
  );
};
