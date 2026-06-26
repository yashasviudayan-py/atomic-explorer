import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="app-backdrop" aria-hidden="true" />
        <Header />
        <main className="relative">{children}</main>
        <footer className="border-t border-white/5 py-8">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted sm:px-6 lg:px-8">
            {APP_NAME} · An interactive journey into the structure of matter.
          </div>
        </footer>
      </body>
    </html>
  );
}
