import { navigation } from "@/navigations";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, refresh, loading, fetchMe, user } = useAuthStore();
  const [starting, setStarting] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!accessToken) {
        await refresh();
      }
      if (accessToken && !user) {
        console.log("ádasd");
        await fetchMe();
      }
      setStarting(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (starting || loading) {
    return <div className="">Đang load trang</div>;
  }

  if (!accessToken) {
    return <Navigate to={navigation.signin} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
