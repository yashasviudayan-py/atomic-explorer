"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { Close, Menu } from "@/components/ui/Icon";

/**
 * Global navigation header.
 *
 * Sticky translucent-black bar with a bottom hairline, aligned to the shared
 * page shell. Nav links use quiet gray that lifts to white on hover/active;
 * the Launch action is a compact blue pill. On small screens the links
 * collapse behind a simple toggle.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <nav className="page-shell flex h-14 items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <LogoMark />
          <span className="text-[0.95rem] font-semibold tracking-tight text-foreground">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-active={active ? "true" : undefined}
                  className={`nav-underline rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors hover:text-white ${
                    active ? "text-white" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-3">
            <Link
              href="/elements"
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#2b95ff]"
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
          {open ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-black/90 px-4 py-3 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-white"
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

/** Small, sharp atom glyph used as the brand logo mark. */
function LogoMark() {
  return (
    <span className="relative flex h-7 w-7 items-center justify-center">
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-white/40">
        <span className="h-1 w-1 rounded-full bg-accent-cyan" />
        <span className="absolute inset-0 rounded-full border border-white/15 [transform:rotate(60deg)_scaleY(0.4)]" />
        <span className="absolute inset-0 rounded-full border border-white/15 [transform:rotate(-60deg)_scaleY(0.4)]" />
      </span>
    </span>
  );
}
