import { AuthLayout } from "@/components/features/auth/auth-layout";
import { LoginForm } from "@/components/features/auth/login-form";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to find your next favorite meal.">
      {/* The page owns its presentation; the feature handles form state and submission. */}
      <LoginForm />
    </AuthLayout>
  );
}
