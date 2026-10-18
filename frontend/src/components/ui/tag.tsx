import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
type TagProps = { children: ReactNode; className?: string };
export function Tag({ children, className }: TagProps) {
  return <span className={cn("glass rounded-full px-2.5 py-1 text-xs font-medium text-white", className)}>{children}</span>;
}