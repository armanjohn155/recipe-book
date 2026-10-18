import type { TableHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
export function Table({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return <div className="glass overflow-x-auto rounded-2xl"><table className={cn("w-full text-left text-sm [&_th]:px-5 [&_th]:py-4 [&_th]:font-semibold [&_td]:px-5 [&_td]:py-4 [&_thead]:bg-white/[0.04] [&_tbody_tr]:border-t [&_tbody_tr]:border-white/10", className)} {...props} /></div>;
}