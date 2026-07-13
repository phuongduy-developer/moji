import { navigation } from "@/navigations";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

const GuestRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (accessToken) {
    return <Navigate to={navigation.home} replace />;
  }
  return <Outlet />;
};

export default GuestRoute;
