import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  ShieldAlert,
  Settings,
  Menu,
  X,
  Bell,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import SignOutConfirmModal from "../SignOutConfirmModal";
import { useAuth } from "../../context/AuthContext";

const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "applications", label: "Applications", icon: ClipboardCheck },
  { id: "reports", label: "Reports", icon: ShieldAlert },
  { id: "settings", label: "Settings", icon: Settings },
];

const TAB_TITLES = {
  dashboard: "Dashboard Overview",
  users: "User Directory & Management",
  applications: "Tutor Applications",
  reports: "Flagged Reports & Moderation",
  settings: "Platform Configuration",
};

/**
 * badges: { [tabId]: number }  -> counts shown next to sidebar items
 * alerts: [{ id, title, body, tab }] -> items shown in the bell dropdown
 */
export default function AdminLayout({ children, activeTab = "dashboard", onSelectTab, badges = {}, alerts = [] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userInitials = user?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "AD";
  const userName = user?.fullName || "Admin System";

  const handleSignOut = () => {
    setShowSignOutConfirm(false);
    logout(); // logout() now navigates to /sign-in automatically
  };

  const handleTabClick = (tabId) => {
    if (onSelectTab) {
      onSelectTab(tabId);
    }
    setDrawerOpen(false);
    setNotifOpen(false);
  };

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-surface text-on-surface transition-colors duration-300 dark:bg-dark-bg dark:text-white flex-col md:flex-row">
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      {/* Non-scrolling Admin Sidebar */}
      <nav
        className={`fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-surface-container-highest
          bg-surface p-4 shadow-lg transition-transform duration-300 ease-in-out
          dark:border-white/10 dark:bg-dark-surface dark:shadow-none
          md:static md:z-auto md:h-dvh md:translate-x-0 md:shadow-none flex-shrink-0
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Top-left: ONLY Logo & Name */}
        <div className="mb-4 flex items-center justify-between px-2">
          <Logo clickable={false} />
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation drawer"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high active:opacity-70 dark:text-white/60 dark:hover:bg-white/10 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin Portal Header Badge */}
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-admin-blue/20 bg-admin-blue/10 px-3.5 py-2 text-admin-blue dark:bg-admin-blue/15 dark:text-blue-300">
          <ShieldAlert className="h-4 w-4 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider">Admin Portal</span>
            <span className="text-[11px] text-on-surface-variant/80 dark:text-white/50">Campus Operations</span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
          {ADMIN_NAV.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const count = badges[id] || 0;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabClick(id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 active:opacity-70 ${
                  isActive
                    ? "border-l-4 border-admin-blue bg-admin-blue/15 font-semibold text-admin-blue shadow-xs dark:border-admin-blue dark:bg-admin-blue/25 dark:text-blue-300"
                    : "text-on-surface-variant hover:bg-surface-container-high dark:text-white/70 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-base font-semibold">{label}</span>
                </div>
                {count > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-status-rejected/15 px-2 text-xs font-bold text-status-rejected">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Area: Back to Main Application & Sign Out */}
        <div className="mt-auto flex flex-col gap-2 border-t border-surface-container-highest pt-3 dark:border-white/10 flex-shrink-0">
          <Link
            to="/app/tutors"
            className="flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to StudyPair App
          </Link>

          <button
            type="button"
            onClick={() => setShowSignOutConfirm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-error/30 bg-error/5 px-4 py-2 text-xs font-semibold text-error transition-colors hover:bg-error hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>

          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-admin-blue/20 font-bold text-xs text-admin-blue">
                {userInitials}
              </div>
              <span className="text-xs text-on-surface-variant dark:text-white/50 truncate">{userName}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-status-confirmed flex-shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-status-confirmed animate-pulse" /> Live
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-surface-container-highest bg-surface px-4 dark:border-white/10 dark:bg-dark-surface md:px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-full p-2 text-admin-blue hover:bg-surface-container-low active:opacity-70 dark:text-blue-300 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="md:hidden">
              <Logo size="sm" clickable={false} />
            </div>
            <span className="hidden font-display text-lg font-bold text-on-surface dark:text-white md:block">
              {TAB_TITLES[activeTab]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notification bell with dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="Admin alerts"
                aria-expanded={notifOpen}
                className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container dark:text-white/60"
              >
                <Bell className="h-5 w-5" />
                {alerts.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-status-rejected ring-2 ring-surface dark:ring-dark-surface" />
                )}
              </button>

              {notifOpen && (
                <>
                  {/* Click-outside catcher */}
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} aria-hidden="true" />

                  {/* Mobile: pinned under the header and inset from both screen edges.
                      Desktop: anchored to the bell. */}
                  <div
                    className="fixed inset-x-3 top-[4.25rem] z-50 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl border border-outline-variant
                      bg-surface-container-lowest p-4 shadow-xl animate-fade-up dark:border-white/10 dark:bg-dark-surface
                      md:absolute md:inset-x-auto md:right-0 md:top-12 md:max-h-96 md:w-80"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-on-surface dark:text-white">
                        System Alerts
                      </span>
                      <button
                        type="button"
                        onClick={() => setNotifOpen(false)}
                        className="text-[11px] font-semibold text-admin-blue dark:text-blue-300"
                      >
                        Dismiss
                      </button>
                    </div>

                    {alerts.length > 0 ? (
                      <div className="space-y-2 text-xs">
                        {alerts.map((alert) => (
                          <button
                            key={alert.id}
                            type="button"
                            onClick={() => handleTabClick(alert.tab)}
                            className="block w-full rounded-lg bg-surface-container-low p-3 text-left transition-colors hover:bg-surface-container-high dark:bg-white/5 dark:hover:bg-white/10"
                          >
                            <p className="font-semibold text-on-surface dark:text-white">{alert.title}</p>
                            <p className="mt-0.5 text-on-surface-variant dark:text-white/60">{alert.body}</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="py-4 text-center text-xs text-on-surface-variant dark:text-white/50">
                        You're all caught up.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-admin-blue text-sm font-bold text-white shadow-xs">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="mx-auto w-full max-w-[1280px] flex-1 overflow-y-auto px-4 pb-12 pt-6 md:px-8">
          {children}
        </main>
      </div>

      <SignOutConfirmModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />
    </div>
  );
}