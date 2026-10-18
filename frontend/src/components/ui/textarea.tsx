import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea className={cn("glass-field w-full rounded-xl px-3 py-3 text-sm text-white placeholder:text-white/45 outline-none focus:border-accent focus:ring-2 focus:ring-accent/40", error && "border-error", className)} {...props} />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}