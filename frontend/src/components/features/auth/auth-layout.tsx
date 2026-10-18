import type { ReactNode } from "react";
import heroImage from "@/assets/hero.jpg";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

// Shared two-column shell for the auth pages: decorative brand panel on the
// left, scrollable form panel on the right.
export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      {/* Decorative panel — hidden on mobile so the form takes the full width. */}
      <aside className="relative hidden overflow-hidden md:flex md:items-center md:justify-center">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Dark green tint keeps the white title readable over the photo. */}
        <div className="absolute inset-0 bg-[rgba(7,22,9,0.55)]" aria-hidden="true" />

        {/* Faint oversized line-art accent. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full border border-white/10"
        />

        {/* Brand sits above the image and overlay. */}
        <div className="relative z-10 flex items-center gap-3 px-6 text-white">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white">
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8 7.5c-.8 0-1.4.7-1.4 1.5v2.6c0 .6.4 1 1 1v4.4c0 .6.4 1 1 1h4.8c.6 0 1-.4 1-1v-4.4c.6 0 1-.4 1-1V9c0-.8-.6-1.5-1.4-1.5H8Zm.4 1.5h7.2v1.6H8.4V9Z"
            />
          </svg>
          <span className="font-display text-[clamp(40px,6vw,72px)] leading-[1.05] font-semibold tracking-tight text-white [text-shadow:0_1px_3px_rgba(7,22,9,0.6)]">
            Recipe Book
          </span>
        </div>
      </aside>

      {/* Form panel — vertically centered, scrolls on short viewports. */}
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(120,200,120,0.10),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full border border-white/10"
        />

        <div className="relative mx-auto w-full max-w-[400px]">
          <header>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">{subtitle}</p>
          </header>

          <div className="mt-6">{children}</div>

          {footer && <div>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
