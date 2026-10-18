import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary";
  children: ReactNode;
};

const variants = {
  primary:
    "bg-white text-ink shadow-[0_10px_24px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 hover:bg-white/90",
  secondary: "glass glass-hover text-white",
  tertiary: "text-white/80 hover:text-white",
};

export function Button({ variant = "primary", className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={cn("cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60", variants[variant], className)} {...props}>
      {children}
    </button>
  );
}