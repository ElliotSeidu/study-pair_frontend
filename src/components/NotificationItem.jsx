import { CheckCircle2, MessageCircle, Clock, Megaphone, Info, ExternalLink } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { formatWhatsAppGroupLink } from "../lib/whatsapp";

const TYPE_CONFIG = {
  accepted: { icon: CheckCircle2, bg: "bg-status-confirmed/10", color: "text-status-confirmed" },
  message: { icon: MessageCircle, bg: "bg-student-teal/10", color: "text-student-teal dark:text-primary-fixed-dim" },
  reminder: { icon: Clock, bg: "bg-status-pending/10", color: "text-status-pending" },
  system: { icon: Megaphone, bg: "bg-surface-container-highest dark:bg-white/10", color: "text-on-surface-variant dark:text-white/50" },
};

export default function NotificationItem({ notification, onRead, onViewDetails }) {
  const { type, title, message, time, unread, sessionDetails } = notification;
  const { icon: Icon, bg, color } = TYPE_CONFIG[type] || TYPE_CONFIG.system;

  const hasSessionDetails = !!sessionDetails || !!notification.course;
  const isAccepted = type === "accepted";
  const whatsappGroupLink = sessionDetails?.whatsappGroupLink;
  const isGroup = sessionDetails?.type === "group";

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    if (unread && onRead) onRead(notification.id);
    if (onViewDetails) {
      onViewDetails(sessionDetails ? { ...notification, ...sessionDetails } : notification);
    }
  };

  return (
    <div
      onClick={() => unread && onRead(notification.id)}
      className={`relative flex cursor-pointer gap-4 overflow-hidden rounded-2xl border border-outline-variant/50
        bg-surface-container-lowest p-5 shadow-sm transition-all duration-200 hover:shadow-md
        dark:border-white/10 dark:bg-dark-surface ${!unread ? "opacity-80" : ""}`}
    >
      {unread && (
        <div className="absolute bottom-0 left-0 top-0 w-1.5 bg-student-teal dark:bg-primary-fixed-dim" />
      )}

      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${bg} ${color}`}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-on-surface dark:text-white text-base">{title}</h3>
          <span className="whitespace-nowrap text-xs text-on-surface-variant dark:text-white/40">{time}</span>
        </div>

        <p
          className="text-sm text-on-surface-variant dark:text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {sessionDetails?.place && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-0.5 text-xs text-on-surface-variant dark:bg-white/5 dark:text-white/60">
            📍 {sessionDetails.place}
          </div>
        )}

        {/* Actions row: View Details and strictly ONLY ONE message button */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2.5 pt-1">
          {hasSessionDetails && (
            <button
              type="button"
              onClick={handleDetailsClick}
              className="inline-flex items-center gap-1.5 rounded-xl border border-student-teal/40 bg-student-teal/10 px-3.5 py-1.5 text-xs font-semibold text-student-teal transition-colors hover:bg-student-teal hover:text-white dark:border-primary-fixed-dim/40 dark:text-primary-fixed-dim"
            >
              <Info className="h-3.5 w-3.5" />
              View Details
            </button>
          )}

          {/* If accepted group session with WhatsApp group invite link */}
          {isAccepted && isGroup && whatsappGroupLink && (
            <a
              href={formatWhatsAppGroupLink(whatsappGroupLink)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-status-confirmed px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-status-confirmed/90"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Join WhatsApp Group
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {/* If accepted 1-on-1 session: ONLY ONE message button to tutor's WhatsApp number */}
          {isAccepted && (!isGroup || !whatsappGroupLink) && notification.tutorPhone && (
            <WhatsAppButton
              phone={notification.tutorPhone}
              message={`Hi ${notification.tutorName || "Tutor"}, this is regarding our accepted ${notification.course || "session"} on StudyPair.`}
              label="Message on WhatsApp"
              className="inline-flex items-center gap-1.5 rounded-xl bg-status-confirmed px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-status-confirmed/90"
            />
          )}
        </div>
      </div>
    </div>
  );
}