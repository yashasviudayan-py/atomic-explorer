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
        <footer className="border-t border-white/10 py-8">
          <div className="page-shell text-center text-sm text-muted">
            {APP_NAME} · An interactive journey into the structure of matter.
          </div>
        </footer>
      </body>
    </html>
  );
}
