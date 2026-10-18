import { clearCsrfToken, ensureCsrfToken, http } from "@/lib/axios";

export type User = { id: string; name: string; email: string; role: string; emailVerified: boolean };

// Get Session Service
async function getSessionService() {
  const response = await http.get("/auth/v1/session");
  return response.data.data.user as User;
}

// User Login Service
export async function loginService(email: string, password: string) {
  await ensureCsrfToken();
  await http.post("/auth/v1/login", { email, password });
  await ensureCsrfToken();
  return getSessionService();
}

// Create an Account - Signup Service
export async function signupService(name: string, email: string, password: string) {
  await ensureCsrfToken();
  await http.post("/auth/v1/signup", { name, email, password });
  return loginService(email, password);
}

// Logout to the app
export async function logoutService() {
  await http.post("/auth/v1/logout", {});
  clearCsrfToken();
}

// Refresh Token Service
// Refresh tokens are single-use (rotation), so concurrent session restores
// must share one request. React StrictMode runs the provider effect twice in
// development; without this guard the second refresh consumes an already
// rotated token and the visitor is treated as signed out.
let restoreSessionInFlight: Promise<User> | null = null;

export async function restoreSessionService() {
  if (restoreSessionInFlight) return restoreSessionInFlight;

  restoreSessionInFlight = (async () => {
    await ensureCsrfToken();
    await http.post("/auth/v1/refresh-token", {});
    await ensureCsrfToken();
    return getSessionService();
  })().finally(() => {
    restoreSessionInFlight = null;
  });

  return restoreSessionInFlight;
}