import { navigation } from "@/navigations";
import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();

  // Vì App đã initialized xong ở ngoài App.tsx, ta chỉ cần check trực tiếp:
  if (!accessToken) {
    return <Navigate to={navigation.signin} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
