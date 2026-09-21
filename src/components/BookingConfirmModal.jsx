import { Link } from "react-router-dom";
import { Hourglass, CheckCircle2, BookOpen, CalendarDays, Clock, ArrowRight, X } from "lucide-react";

export default function BookingConfirmModal({ booking, onClose }) {
  if (!booking) return null;
  const { type, course, day, time } = booking; // type: "1-on-1" | "group"
  const isGroup = type === "group";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm animate-fade-up overflow-hidden rounded-2xl bg-surface-container-lowest shadow-xl dark:bg-dark-surface"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        {isGroup ? (
          <>
            {/* Success header */}
            <div className="flex flex-col items-center gap-3 bg-status-confirmed/10 px-6 pb-6 pt-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-confirmed text-white">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white">You're in!</h2>
              <p className="text-on-surface-variant dark:text-white/60">
                Your request to join the group session has been confirmed.
              </p>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-3 p-6">
              <h3 className="mb-1 font-semibold text-on-surface dark:text-white">Session Details</h3>
              <DetailRow icon={BookOpen} label="Course" value={course} />
              <DetailRow icon={CalendarDays} label="Day" value={day} />
              <DetailRow icon={Clock} label="Time" value={time} />

              <Link
                to="/my-requests"
                onClick={onClose}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-student-teal px-6 py-3.5 font-medium
                  text-white shadow-sm transition-all duration-150 hover:bg-primary active:scale-95"
              >
                View My Requests <ArrowRight className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 px-6 pb-8 pt-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-pending/15 text-status-pending">
              <Hourglass className="h-8 w-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white">Request Sent</h2>
            <p className="text-on-surface-variant dark:text-white/60">
              Awaiting tutor approval for your 1-on-1 session. We'll notify you once they respond.
            </p>

            <Link
              to="/my-requests"
              onClick={onClose}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-student-teal px-6 py-3.5 font-medium
                text-white shadow-sm transition-all duration-150 hover:bg-primary active:scale-95"
            >
              View My Requests
            </Link>
            <button
              onClick={onClose}
              className="text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface dark:text-white/50 dark:hover:text-white"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-4 dark:bg-white/5">
      <Icon className="h-5 w-5 text-student-teal dark:text-primary-fixed-dim" />
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant dark:text-white/40">
          {label}
        </span>
        <span className="font-medium text-on-surface dark:text-white">{value}</span>
      </div>
    </div>
  );
}