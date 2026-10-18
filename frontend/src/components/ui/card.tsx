import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
type CardProps = { children: ReactNode; className?: string };
export function Card({ children, className }: CardProps) {
    return <div className={cn("glass glass-elevated overflow-hidden rounded-2xl", className)}>{children}</div>;
}