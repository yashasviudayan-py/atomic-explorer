"use client";

import Link from "next/link";
import { useState } from "react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";

/**
 * Global navigation header.
 *
 * Sticky, glassmorphic bar with the wordmark logo and primary nav links.
 * On small screens the links collapse behind a simple toggle.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-space-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="ml-2">
            <Link
              href="/elements"
              className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent shadow-[0_0_20px_-6px_var(--color-accent)] transition-all hover:bg-accent/20"
            >
              Launch
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/5 hover:text-foreground md:hidden"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-space-900/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

/** Small glowing atom glyph used as the brand logo mark. */
function LogoMark() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center">
      <span className="absolute inset-0 rounded-full bg-accent/20 blur-md transition-all group-hover:bg-accent/40" />
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-accent/50">
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_var(--color-accent)]" />
        <span className="absolute inset-0 rounded-full border border-accent-violet/40 [transform:rotate(60deg)_scaleY(0.4)]" />
        <span className="absolute inset-0 rounded-full border border-accent-pink/30 [transform:rotate(-60deg)_scaleY(0.4)]" />
      </span>
    </span>
  );
}
