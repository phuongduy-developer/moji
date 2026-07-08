import { navigation } from "@/navigations";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    return <Navigate to={navigation.signin} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
