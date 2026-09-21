import { Clock, User, Users, XCircle, CheckCircle2, MessageCircle, ExternalLink, Info, MapPin } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { formatWhatsAppGroupLink } from "../lib/whatsapp";

const STATUS_STYLES = {
  pending: "bg-status-pending/10 text-status-pending border-status-pending/20",
  confirmed: "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
  rejected: "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
  completed: "bg-neutral-gray/10 text-neutral-gray border-neutral-gray/20 dark:text-white/50",
  cancelled: "bg-neutral-gray/10 text-neutral-gray border-neutral-gray/20 dark:text-white/50",
};

const STATUS_LABELS = {
  pending: "Pending Tutor Acceptance",
  confirmed: "Accepted & Confirmed",
  rejected: "Declined",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function RequestCard({ request, onCancel, onViewDetails }) {
  const { course, when, tutorName, tutorColor, tutorPhone, type, status, reason, format, place, whatsappGroupLink } = request;
  const isDimmed = status === "rejected" || status === "cancelled";
  const isPending = status === "pending";
  const isAccepted = status === "confirmed" || status === "accepted";
  const isGroup = type === "group";
  const TypeIcon = isGroup ? Users : User;

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-all duration-300
        dark:border-white/10 dark:bg-dark-surface ${isDimmed ? "opacity-70" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className={`text-lg font-bold text-on-surface dark:text-white ${isDimmed ? "line-through decoration-outline-variant" : ""}`}>
            {course}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant dark:text-white/60">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {when}
            </span>
            {place && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-student-teal" />
                {format === "virtual" ? "Virtual Meeting" : place}
              </span>
            )}
          </div>
        </div>
        <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white shadow-xs"
            style={{ backgroundColor: tutorColor || "#0E7490" }}
          >
            {tutorName ? tutorName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "T"}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-on-surface dark:text-white">{tutorName}</span>
            <span className="text-xs text-on-surface-variant dark:text-white/50">Tutor</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-surface-container-low px-2.5 py-1 text-on-surface-variant dark:bg-white/5 dark:text-white/70">
          <TypeIcon className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{isGroup ? "Group Session" : "1-on-1"}</span>
        </div>
      </div>

      {/* Pending status guidance */}
      {isPending && (
        <div className="rounded-xl border border-status-pending/20 bg-status-pending/5 p-3 text-xs text-status-pending">
          ⏳ Tutor has not accepted yet. Messaging will unlock automatically once your request is accepted.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/50 pt-3 dark:border-white/10">
        {status === "rejected" && reason ? (
          <span className="text-xs italic text-on-surface-variant dark:text-white/50">{reason}</span>
        ) : status === "completed" ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-status-confirmed">
            <CheckCircle2 className="h-4 w-4" /> Session completed
          </span>
        ) : (
          <span />
        )}

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* View Details button */}
          <button
            onClick={() => onViewDetails && onViewDetails(request)}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant px-3 py-2 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high dark:border-white/10 dark:text-white"
          >
            <Info className="h-3.5 w-3.5" />
            View Details
          </button>

          {/* Students can only message once accepted */}
          {isAccepted && isGroup && whatsappGroupLink && (
            <a
              href={formatWhatsAppGroupLink(whatsappGroupLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-status-confirmed px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-status-confirmed/90"
            >
              <MessageCircle className="h-4 w-4" />
              Join WhatsApp Group
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {isAccepted && (!isGroup || !whatsappGroupLink) && tutorPhone && (
            <WhatsAppButton
              phone={tutorPhone}
              message={`Hi ${tutorName}, this is regarding our accepted ${course} session on StudyPair.`}
              label="Message on WhatsApp"
              className="flex items-center gap-1.5 rounded-xl bg-status-confirmed px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-status-confirmed/90"
            />
          )}

          {/* Cancel button if pending */}
          {isPending && (
            <button
              onClick={() => onCancel(request.id)}
              className="flex items-center gap-1.5 rounded-xl border border-error/30 px-3 py-2 text-xs font-medium text-error transition-colors hover:bg-error/10"
            >
              <XCircle className="h-4 w-4" />
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}