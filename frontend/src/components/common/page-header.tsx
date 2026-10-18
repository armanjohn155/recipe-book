import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

// Shared page heading. Optional children provide actions such as Sign out.
export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="glass relative mb-8 flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-2xl p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full border border-white/10"
      />
      <div className="relative">
        <p className="text-xs font-medium tracking-[0.14em] text-white/60 uppercase">{eyebrow}</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">{description}</p>
      </div>
      {children}
    </header>
  );
}