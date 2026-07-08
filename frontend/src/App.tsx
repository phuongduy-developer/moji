import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import { navigation } from "./navigations";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/auth/protected-route";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path={navigation.signin} element={<SignInPage />} />
          <Route path={navigation.signup} element={<SignupPage />} />
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
