import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import { navigation } from "./navigations";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/auth/protected-route";
import GuestRoute from "./components/auth/guest-route";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";
import { cn } from "./lib/utils";

function App() {
  const refresh = useAuthStore((state) => state.refresh);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    refresh(true);
  }, [refresh]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderIcon
          role="status"
          aria-label="Loading"
          className={cn("size-10 animate-spin")}
        />
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<GuestRoute />}>
            <Route path={navigation.signin} element={<SignInPage />} />
            <Route path={navigation.signup} element={<SignupPage />} />
          </Route>
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={navigation.home} element={<ChatAppPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
