import { LogOut, AlertTriangle, X } from "lucide-react";

export default function SignOutConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-up"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl dark:border-white/10 dark:bg-dark-surface"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high dark:text-white/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold text-on-surface dark:text-white">
            Sign Out of StudyPair?
          </h3>
          <p className="mt-2 text-sm text-on-surface-variant dark:text-white/70">
            Are you sure you want to sign out? You will need to sign back in with your KNUST student email to view your study sessions and notifications.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-outline-variant/40 pt-4 dark:border-white/10">
          <button
            onClick={onClose}
            type="button"
            className="rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-high dark:border-white/10 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            type="button"
            className="flex items-center gap-2 rounded-xl bg-error px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-error/90 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
