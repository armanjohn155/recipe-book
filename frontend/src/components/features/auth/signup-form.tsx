import { useNavigate, Link } from "react-router";
import { useState, type SubmitEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/components/context/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthField, PasswordField, authButtonClassName, authInputClassName } from "@/components/features/auth/auth-field";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return "Could not connect to the API. Check that the API server is running.";
}

export function SignupForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Keep field values in React state; the auth context calls the API service.
  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const currentUser = await signup(name, email, password);
      // Navigate after the context has received the authenticated user.
      const destination = currentUser.role === "ADMIN" ? "/admin" : "/user";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <AuthField id="auth-name" label="Name">
        <Input id="auth-name" autoComplete="name" required minLength={2} value={name} onChange={(event) => setName(event.target.value)} className={authInputClassName} />
      </AuthField>
      <AuthField id="auth-email" label="Email">
        <Input id="auth-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={authInputClassName} />
      </AuthField>
      <PasswordField
        id="auth-password"
        label="Password"
        hint="Use at least 8 characters, including one uppercase letter and one number."
        autoComplete={"new-password"}
        required
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      {error && <p role="alert" className="text-sm text-error">{error}</p>}

      <p className="text-sm text-text-muted">
        Already have an account?{" "}
        <Link className="font-medium text-accent underline-offset-4 hover:underline" to={"/auth/login"}>
          Sign in
        </Link>{" "}
        instead.
      </p>

      <Button type="submit" disabled={busy} className={authButtonClassName}>
        {busy ? "Please wait…" : "Sign up"}
        {!busy && <ArrowRight className="h-4 w-4" />}
      </Button>
    </form>
  );
}