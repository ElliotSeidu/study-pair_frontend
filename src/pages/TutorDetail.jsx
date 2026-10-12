import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Share2, Star, Users, Check } from "lucide-react";
import { MOCK_TUTORS } from "../data/tutors";
import ThemeToggle from "../components/ThemeToggle";
import BookingConfirmModal from "../components/BookingConfirmModal";
import { addRequest } from "../lib/store";
import { useAuth } from "../context/AuthContext";

export default function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tutor = MOCK_TUTORS.find((t) => t.id === id);
  const [requestedSlots, setRequestedSlots] = useState(new Set());
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!tutor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface text-on-surface dark:bg-dark-bg dark:text-white">
        <p className="text-lg font-medium">Tutor not found.</p>
        <Link to="/tutors" className="text-student-teal hover:underline dark:text-primary-fixed-dim">
          Back to Browse
        </Link>
      </div>
    );
  }

  const handleBook = (day, slot) => {
    setRequestedSlots((prev) => new Set(prev).add(slot.id));
    setConfirmedBooking({
      type: slot.type,
      course: tutor.tags[0] || tutor.program,
      day,
      time: slot.time,
    });
    addRequest({
      course: tutor.tags[0] || tutor.program,
      when: `${day}, ${slot.time}`,
      tutorName: tutor.name,
      tutorPhone: tutor.phone || "0244123456",
      tutorColor: tutor.avatarColor,
      studentName: user?.fullName || "KNUST Student",
      studentPhone: user?.phone || "0241234567",
      type: slot.type,
      status: "pending",
      format: "in-person",
      place: "KNUST Library Study Room",
      topic: `Tutoring and revision session for ${tutor.tags[0] || tutor.program}`,
      whatsappGroupLink: slot.type === "group" ? "https://chat.whatsapp.com/KNUSTStudyGroup" : "",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${tutor.name} - StudyPair Tutor`,
          text: `Check out ${tutor.name}'s peer tutoring sessions on StudyPair KNUST:`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface transition-colors duration-300 dark:bg-dark-bg dark:text-white">
      {/* Top bar */}
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface px-4 shadow-sm dark:border-white/10 dark:bg-dark-surface md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors duration-150 hover:bg-surface-container active:scale-95 dark:text-white/60 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-student-teal dark:text-primary-fixed-dim">Tutor Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={handleShare}
            aria-label="Share tutor profile"
            title={copiedLink ? "Link copied!" : "Share profile"}
            className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors duration-150 hover:bg-surface-container active:scale-95 dark:text-white/60 dark:hover:bg-white/10"
          >
            {copiedLink ? <Check className="h-5 w-5 text-status-confirmed" /> : <Share2 className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[800px] px-4 pb-24 pt-24 md:px-8">
        {/* Profile header */}
        <section className="mb-6 flex flex-col items-center gap-6 rounded-2xl border border-surface-variant bg-surface-container-lowest p-6 text-center shadow-sm animate-fade-up dark:border-white/10 dark:bg-dark-surface md:flex-row md:items-start md:text-left">
          <div className="relative flex-shrink-0">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface text-3xl font-bold text-white shadow-sm dark:border-dark-bg"
              style={{ backgroundColor: tutor.avatarColor }}
            >
              {tutor.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="absolute bottom-0 right-0 rounded-full border-2 border-surface bg-status-confirmed px-2 py-0.5 text-xs font-semibold text-white dark:border-dark-surface">
              Tutor
            </span>
          </div>

          <div className="flex-1">
            <h2 className="mb-1 text-2xl font-bold text-on-surface dark:text-white md:text-3xl font-display">
              {tutor.name}
            </h2>
            <p className="mb-4 flex items-center justify-center gap-1.5 text-sm text-neutral-gray dark:text-white/50 md:justify-start">
              {tutor.year} <span className="text-outline-variant">•</span> {tutor.rating}{" "}
              <Star className="h-4 w-4 fill-knust-gold text-knust-gold" /> ({tutor.reviewCount} reviews)
            </p>
            <p className="mb-4 text-on-surface-variant dark:text-white/70">{tutor.bio}</p>
            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {tutor.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-outline-variant px-3 py-1 text-sm text-on-surface-variant dark:border-white/10 dark:text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Availability */}
        <section className="animate-fade-up" style={{ animationDelay: "100ms" }}>
          <h3 className="mb-4 text-lg font-semibold text-on-surface dark:text-white">Weekly Availability</h3>
          <div className="space-y-6">
            {tutor.availability.map(({ day, slots }) => (
              <div key={day}>
                <h4 className="mb-3 border-l-2 border-student-teal pl-2 text-xs font-semibold uppercase tracking-wider text-neutral-gray dark:border-primary-fixed-dim dark:text-white/40">
                  {day}
                </h4>
                <div className="space-y-3">
                  {slots.map((slot) => {
                    const isFull = slot.state === "full";
                    const isRequested = requestedSlots.has(slot.id);
                    const isGroup = slot.type === "group";

                    return (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between rounded-xl border p-4 transition-opacity ${
                          isFull
                            ? "border-outline-variant/50 bg-surface-container-high opacity-75 dark:border-white/5 dark:bg-white/5"
                            : "border-surface-variant bg-surface-container-lowest shadow-sm dark:border-white/10 dark:bg-dark-surface"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span
                            className={`text-lg font-semibold ${
                              isFull ? "text-on-surface-variant dark:text-white/40" : "text-on-surface dark:text-white"
                            }`}
                          >
                            {slot.time}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                                isFull
                                  ? "border-outline-variant bg-surface-dim text-on-surface-variant dark:border-white/10 dark:bg-white/10 dark:text-white/40"
                                  : isGroup
                                  ? "border-tutor-purple/20 bg-tutor-purple/10 text-tutor-purple"
                                  : "border-student-teal/20 bg-student-teal/10 text-student-teal dark:text-primary-fixed-dim"
                              }`}
                            >
                              {isGroup ? "Group Session" : "1-on-1"}
                            </span>
                            {isGroup && !isFull && (
                              <span className="flex items-center gap-1 text-xs text-neutral-gray dark:text-white/40">
                                <Users className="h-3.5 w-3.5" />
                                {slot.spotsFilled}/{slot.spotsTotal} spots filled
                              </span>
                            )}
                          </div>
                        </div>

                        {isFull ? (
                          <span className="rounded-lg border border-outline-variant bg-surface-container px-4 py-2 text-sm font-medium text-neutral-gray dark:border-white/10 dark:bg-white/5 dark:text-white/40">
                            Full
                          </span>
                        ) : (
                          <button
                            onClick={() => handleBook(day, slot)}
                            disabled={isRequested}
                            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-150 active:scale-95 ${
                              isRequested
                                ? "cursor-default bg-status-confirmed text-white"
                                : "bg-student-teal text-white hover:bg-primary"
                            }`}
                          >
                            {isRequested ? (
                              <>
                                <Check className="h-4 w-4" /> Requested
                              </>
                            ) : isGroup ? (
                              "Join Group"
                            ) : (
                              "Book Slot"
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <BookingConfirmModal booking={confirmedBooking} onClose={() => setConfirmedBooking(null)} />
    </div>
  );
}