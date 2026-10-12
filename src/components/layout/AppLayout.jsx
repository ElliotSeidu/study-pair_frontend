import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, ListTodo, ClipboardCheck, Bell, User, Menu, X, BookMarked, CalendarClock, Inbox, Download, ShieldAlert } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useTutorMode } from "../../context/TutorModeContext";
import { useAuth } from "../../context/AuthContext";
import { usePwaInstall } from "../../lib/pwa";
import Logo from "../Logo";

const STUDENT_NAV = [
  { to: "/tutors", label: "Browse", icon: Search },
  { to: "/my-requests", label: "My Requests", icon: ListTodo },
  { to: "/my-applications", label: "My Applications", icon: ClipboardCheck },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

const TUTOR_NAV = [
  { to: "/tutor/requests", label: "Incoming Requests", icon: Inbox },
  { to: "/tutor/courses", label: "My Courses", icon: BookMarked },
  { to: "/tutor/availability", label: "My Availability", icon: CalendarClock },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuth();
  const { isTutorMode, toggleMode } = useTutorMode();
  const { canInstall, triggerInstall } = usePwaInstall();
  const isAdmin = user?.role === "admin" || user?.email?.startsWith("admin@");
  const navItems = isTutorMode ? TUTOR_NAV : STUDENT_NAV;
  const activeTextColor = isTutorMode ? "text-tutor-purple" : "text-student-teal";

  return (
    <div
      data-mode={isTutorMode ? "tutor" : "student"}
      className="flex h-screen w-full overflow-hidden bg-surface text-on-surface transition-colors duration-300 dark:bg-dark-bg dark:text-white flex-col md:flex-row"
    >
      {drawerOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Non-scrolling sidebar navbar */}
      <nav
        className={`fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-surface-container-highest
          bg-surface p-4 shadow-lg transition-transform duration-300 ease-in-out
          dark:border-white/10 dark:bg-dark-surface dark:shadow-none
          md:static md:z-auto md:h-screen md:translate-x-0 md:shadow-none flex-shrink-0
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Top-left: ONLY the logo and the name of the app */}
        <div className="mb-6 flex items-center justify-between px-2">
          <Logo clickable={false} />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation drawer"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high active:opacity-70 dark:text-white/60 dark:hover:bg-white/10 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 active:opacity-70 ${
                  isActive
                    ? isTutorMode
                      ? "border-l-4 border-tutor-purple bg-tutor-purple/15 font-semibold text-tutor-purple shadow-xs dark:border-tutor-purple dark:bg-tutor-purple/25 dark:text-purple-300"
                      : "border-l-4 border-student-teal bg-student-teal/15 font-semibold text-student-teal shadow-xs dark:border-primary-fixed-dim dark:bg-student-teal/25 dark:text-primary-fixed-dim"
                    : "text-on-surface-variant hover:bg-surface-container-high dark:text-white/70 dark:hover:bg-white/5"
                }`
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-base font-semibold">{label}</span>
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setDrawerOpen(false)}
              className="mt-2 flex items-center gap-4 rounded-xl border border-admin-blue/30 bg-admin-blue/10 px-4 py-3 text-sm font-semibold text-admin-blue transition-colors hover:bg-admin-blue hover:text-white dark:border-blue-400/30 dark:bg-admin-blue/20 dark:text-blue-300"
            >
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <span className="text-base font-semibold">Admin Portal</span>
            </NavLink>
          )}
        </div>

        {/* Bottom area: PWA Install & Active Mode Switcher at the bottom of the screen on both small and large screens */}
        <div className="mt-auto flex flex-col gap-3 pt-3 flex-shrink-0">
          {canInstall && (
            <button
              onClick={triggerInstall}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-outline-variant bg-surface-container-low px-4 py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high dark:border-white/20 dark:bg-white/5 dark:text-white"
            >
              <Download className="h-4 w-4" />
              Install App on Device
            </button>
          )}

          <div className="flex items-center justify-between border-t border-surface-container-highest px-2 pt-3 dark:border-white/10">
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-white/50">
                Active Mode
              </span>
              <span className={`text-sm font-bold ${activeTextColor} dark:text-white`}>
                {isTutorMode ? "Tutor" : "Student"}
              </span>
            </div>
            <button
              onClick={toggleMode}
              aria-label="Toggle student or tutor mode"
              className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-200 ${
                isTutorMode ? "justify-end bg-tutor-purple" : "justify-start bg-student-teal"
              }`}
            >
              <div className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        {/* Mobile Header: top-left has only the logo and name */}
        <header className="flex h-16 w-full items-center justify-between border-b border-surface-container-highest bg-surface px-4 dark:border-white/10 dark:bg-dark-surface md:hidden flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className={`rounded-full p-2 ${activeTextColor} transition-colors hover:bg-surface-container-low active:opacity-70 dark:text-primary-fixed-dim dark:hover:bg-white/5`}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo size="sm" clickable={false} />
          </div>

          <div className="flex items-center gap-2">
            {canInstall && (
              <button
                onClick={triggerInstall}
                aria-label="Install app"
                className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low dark:text-white/70"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop Header */}
        <div className="hidden h-14 items-center justify-end border-b border-outline-variant/30 px-8 md:flex flex-shrink-0">
          <div className="flex items-center gap-3">
            {canInstall && (
              <button
                onClick={triggerInstall}
                className="flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs font-medium text-on-surface shadow-xs transition-colors hover:bg-surface-container-low dark:border-white/10 dark:bg-dark-surface dark:text-white"
              >
                <Download className="h-3.5 w-3.5" />
                Install App
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Scrollable content container */}
        <main className="mx-auto w-full max-w-[1280px] flex-1 overflow-y-auto px-4 pb-12 pt-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}