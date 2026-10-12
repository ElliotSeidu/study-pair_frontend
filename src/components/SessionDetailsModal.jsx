import { useEffect } from "react";
import { X, MapPin, Clock, Users, User, MessageCircle, ExternalLink, BookOpen, AlertCircle } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { formatWhatsAppGroupLink } from "../lib/whatsapp";

export default function SessionDetailsModal({ session, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !session) return null;

  const {
    course,
    tutorName,
    tutorPhone,
    when,
    time,
    place,
    location,
    format = "in-person",
    type = "1-on-1",
    topic,
    description,
    message,
    whatsappGroupLink,
    status,
  } = session;

  const sessionTopic = topic || description || message || "Peer tutoring and course revision session.";
  const sessionVenue = place || location || (format === "virtual" ? "Online Virtual Session" : "KNUST Campus");
  const sessionTime = when || time || "Time to be confirmed with tutor";
  const isGroup = type === "group";
  const isAccepted = status === "accepted" || status === "confirmed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overscroll-contain animate-fade-up"
      onClick={onClose}
      onTouchMove={(e) => e.target === e.currentTarget && e.preventDefault()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl dark:border-white/10 dark:bg-dark-surface"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4 dark:border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-student-teal dark:text-primary-fixed-dim">
              Session Overview
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-on-surface dark:text-white">
              {course}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high dark:text-white/60 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* What the session is about */}
          <div className="rounded-xl border border-outline-variant/50 bg-surface-container-low p-4 dark:border-white/5 dark:bg-white/5">
            <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-white/60">
              <BookOpen className="h-4 w-4 text-student-teal dark:text-primary-fixed-dim" />
              What this session is about
            </div>
            <p className="text-sm leading-relaxed text-on-surface dark:text-white/90">
              {sessionTopic}
            </p>
          </div>

          {/* Key Session Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-outline-variant/30 bg-surface p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-white/50">
                <Clock className="h-3.5 w-3.5" /> Schedule & Time
              </div>
              <p className="mt-1 text-sm font-semibold text-on-surface dark:text-white">
                {sessionTime}
              </p>
            </div>

            <div className="rounded-xl border border-outline-variant/30 bg-surface p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-white/50">
                <MapPin className="h-3.5 w-3.5" /> Format & Venue
              </div>
              <p className="mt-1 text-sm font-semibold text-on-surface dark:text-white">
                {format === "virtual" ? "💻 Virtual Meeting" : `📍 ${sessionVenue}`}
              </p>
            </div>

            <div className="rounded-xl border border-outline-variant/30 bg-surface p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-white/50">
                {isGroup ? <Users className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />} Session Type
              </div>
              <p className="mt-1 text-sm font-semibold text-on-surface dark:text-white">
                {isGroup ? "Group Tutoring Session" : "1-on-1 Tutoring Session"}
              </p>
            </div>

            {tutorName && (
              <div className="rounded-xl border border-outline-variant/30 bg-surface p-3.5 dark:border-white/5 dark:bg-white/[0.02]">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-white/50">
                  <User className="h-3.5 w-3.5" /> Tutor
                </div>
                <p className="mt-1 text-sm font-semibold text-on-surface dark:text-white">
                  {tutorName}
                </p>
              </div>
            )}
          </div>

          {/* Group WhatsApp Notice / Action */}
          {isGroup && whatsappGroupLink && isAccepted && (
            <div className="rounded-xl border border-status-confirmed/30 bg-status-confirmed/10 p-4">
              <h4 className="text-sm font-bold text-status-confirmed">
                WhatsApp Study Group Available
              </h4>
              <p className="mt-1 text-xs text-on-surface-variant dark:text-white/70">
                Your request has been accepted! Click below to join the tutor's official WhatsApp study group.
              </p>
              <a
                href={formatWhatsAppGroupLink(whatsappGroupLink)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-status-confirmed px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-status-confirmed/90"
              >
                <MessageCircle className="h-4 w-4" />
                Join WhatsApp Group
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          {/* If request is pending */}
          {status === "pending" && (
            <div className="flex items-start gap-2 rounded-xl border border-status-pending/20 bg-status-pending/10 p-3.5 text-xs text-status-pending">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>
                This session request is awaiting tutor acceptance. Direct messaging and group links become active once the tutor accepts your request.
              </span>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-outline-variant/40 pt-4 dark:border-white/10">
          <button
            onClick={onClose}
            className="rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-high dark:border-white/10 dark:text-white"
          >
            Close
          </button>

          {/* Only 1 message button when accepted */}
          {isAccepted && !isGroup && tutorPhone && (
            <WhatsAppButton
              phone={tutorPhone}
              message={`Hi ${tutorName || "Tutor"}, this is regarding our accepted ${course} session on StudyPair.`}
              label="Message on WhatsApp"
              className="flex items-center gap-2 rounded-xl bg-status-confirmed px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-status-confirmed/90"
            />
          )}

          {isAccepted && isGroup && whatsappGroupLink && (
            <a
              href={formatWhatsAppGroupLink(whatsappGroupLink)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-status-confirmed px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-status-confirmed/90"
            >
              <MessageCircle className="h-4 w-4" />
              Join WhatsApp Group
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
