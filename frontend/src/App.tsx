import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import { navigation } from "./navigations";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignUpPage";

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
          <Route path={navigation.home} element={<ChatAppPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
