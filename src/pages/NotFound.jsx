import { Link, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Home } from "lucide-react";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-surface p-4 text-on-surface transition-colors duration-300 dark:bg-dark-bg dark:text-white md:p-8">
      {/* Header */}
      <header className="flex w-full max-w-[1280px] items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>

      {/* Main 404 container */}
      <main className="my-auto flex flex-col items-center gap-6 text-center animate-fade-up max-w-md px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-student-teal/15 text-student-teal dark:bg-student-teal/25 dark:text-primary-fixed-dim shadow-sm">
          <Compass className="h-10 w-10 animate-float" />
        </div>

        <div>
          <span className="font-display text-6xl font-extrabold text-student-teal dark:text-primary-fixed-dim">
            404
          </span>
          <h1 className="mt-2 font-display text-2xl font-bold text-on-surface dark:text-white sm:text-3xl">
            Page Not Found
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant dark:text-white/60">
            The page you're looking for doesn't exist, has been moved, or the URL may be mistyped.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface shadow-xs transition-colors hover:bg-surface-container-low active:scale-95 dark:border-white/10 dark:bg-dark-surface dark:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
          <Link
            to={isAuthenticated ? "/tutors" : "/"}
            className="flex items-center gap-2 rounded-xl bg-student-teal px-5 py-3 text-sm font-semibold text-white shadow-xs transition-transform hover:bg-primary active:scale-95"
          >
            <Home className="h-4 w-4" /> {isAuthenticated ? "Go to Workspace" : "Return Home"}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-xs text-on-surface-variant/60 dark:text-white/40 pb-2">
        © 2026 StudyPair KNUST. All rights reserved.
      </footer>
    </div>
  );
}
