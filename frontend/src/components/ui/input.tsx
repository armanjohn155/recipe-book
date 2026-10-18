import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div>
      <input className={cn("glass-field h-12 w-full rounded-xl px-3 text-sm text-white placeholder:text-white/45 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/40", error && "border-error", className)} {...props} />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}