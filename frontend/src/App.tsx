import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "@/components/context/auth-context";
import { ProtectedRoute, HomeRedirect } from "@/components/context/protected-route";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import UserHomePage from "@/pages/user/home";
import RecipePage from "@/pages/user/recipe";
import AdminPage from "@/pages/admin/home";
import NotFoundPage from "@/pages/not-found";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute role="USER" />}>
            <Route path="/user" element={<UserHomePage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
          </Route>

          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
