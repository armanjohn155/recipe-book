import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

// Shared field styling so login and signup stay visually identical.
export const authInputClassName =
  "glass-field h-12 rounded-xl px-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-accent focus:ring-2 focus:ring-accent/40";

export const authButtonClassName = "inline-flex h-12 w-full items-center justify-center gap-2";

type AuthFieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
};

export function AuthField({ id, label, hint, children }: AuthFieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-white/60">{hint}</p>}
    </div>
  );
}

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: string;
  hint?: string;
};

// Password input with a show/hide eye toggle pinned inside the field.
export function PasswordField({ id, label, hint, className, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField id={id} label={label} hint={hint}>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          className={cn(authInputClassName, "pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((currentlyVisible) => !currentlyVisible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/60 hover:text-white"
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
              <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
              <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
              <path d="m2 2 20 20" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </AuthField>
  );
}
