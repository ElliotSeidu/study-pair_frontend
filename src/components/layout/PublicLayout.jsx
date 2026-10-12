import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../Logo";
import ThemeToggle from "../ThemeToggle";
import { Menu, X, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PUBLIC_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/guidelines", label: "Guidelines" },
  { to: "/privacy", label: "Privacy" },
];

export default function PublicLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.email?.startsWith("admin@");
  const isTutor = user?.role === "tutor";
  const workspacePath = isAdmin ? "/admin" : isTutor ? "/tutor/requests" : "/tutors";

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface transition-colors duration-300 dark:bg-dark-bg dark:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-surface/80 backdrop-blur-md dark:border-white/10 dark:bg-dark-surface/80">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 md:px-8">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {PUBLIC_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `transition-colors hover:text-student-teal dark:hover:text-primary-fixed-dim ${
                    isActive
                      ? "font-semibold text-student-teal dark:text-primary-fixed-dim"
                      : "text-on-surface-variant dark:text-white/60"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link
                to={workspacePath}
                className="flex items-center gap-2 rounded-xl bg-student-teal px-5 py-2 text-sm font-semibold text-white shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                Go to Workspace <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center gap-2 rounded-xl bg-student-teal px-5 py-2 text-sm font-semibold text-white shadow-xs transition-transform hover:scale-105 active:scale-95"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low dark:text-white/70"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-outline-variant/40 bg-surface px-4 py-4 shadow-lg dark:border-white/10 dark:bg-dark-surface md:hidden">
            <div className="flex flex-col gap-3">
              {PUBLIC_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-student-teal/10 font-semibold text-student-teal dark:text-primary-fixed-dim"
                        : "text-on-surface-variant hover:bg-surface-container-low dark:text-white/70"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="mt-2 border-t border-outline-variant/30 pt-3">
                <Link
                  to={isAuthenticated ? workspacePath : "/sign-in"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-student-teal py-2.5 text-sm font-semibold text-white shadow-xs"
                >
                  {isAuthenticated ? "Go to Workspace" : "Sign In to StudyPair"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page Body */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="mt-auto border-t border-outline-variant/50 bg-surface-container-lowest px-4 py-10 dark:border-white/10 dark:bg-dark-surface/50 md:px-8">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-xs text-on-surface-variant dark:text-white/40">
              © 2026 StudyPair KNUST. All rights reserved.
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {PUBLIC_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-on-surface-variant transition-colors hover:text-student-teal dark:text-white/60 dark:hover:text-primary-fixed-dim"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
