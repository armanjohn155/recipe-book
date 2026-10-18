import { AuthLayout } from "@/components/features/auth/auth-layout";
import { SignupForm } from "@/components/features/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="A little inspiration for your everyday cooking.">
      {/* The page owns its presentation; the feature handles form state and submission. */}
      <SignupForm />
    </AuthLayout>
  );
}
