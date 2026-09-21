import { Link } from "react-router-dom";
import { Star, CalendarCheck, Clock, CalendarX } from "lucide-react";

export default function TutorCard({ tutor }) {
  const { id, name, program, level, rating, tags, avatarColor, slotsLabel, slotsState } = tutor;

  const slotsStyles = {
    open: "text-student-teal dark:text-primary-fixed-dim",
    limited: "text-status-pending",
    full: "text-neutral-gray dark:text-white/40",
  };
  const SlotIcon = slotsState === "full" ? CalendarX : slotsState === "limited" ? Clock : CalendarCheck;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-surface-container-highest bg-surface-container-lowest
        shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-white/10 dark:bg-dark-surface"
    >
      <Link to={`/tutors/${id}`} className="flex flex-grow flex-col items-center p-6">
        <div className="relative mb-4 h-24 w-24">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface text-2xl
              font-bold text-white shadow-sm dark:border-dark-bg"
            style={{ backgroundColor: avatarColor }}
          >
            {name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="absolute -bottom-1.5 right-1 flex items-center gap-1 rounded-full border-2 border-surface bg-status-confirmed px-2 py-1 text-xs font-bold text-white dark:border-dark-surface">
            <Star className="h-2.5 w-2.5 fill-white" /> {rating}
          </div>
        </div>

        <h3 className="mb-1 text-center text-lg font-semibold text-on-surface dark:text-white">{name}</h3>
        <p className="mb-4 text-center text-sm text-neutral-gray dark:text-white/50">
          {program}, Lvl {level}
        </p>

        <div className="mb-2 flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-surface-container-low px-2.5 py-1 text-xs font-medium text-on-surface-variant dark:bg-white/5 dark:text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between border-t border-surface-container-highest bg-surface-container-low p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div className={`flex items-center gap-1.5 text-sm font-medium ${slotsStyles[slotsState]}`}>
          <SlotIcon className="h-4 w-4" />
          {slotsLabel}
        </div>
        <Link
          to={`/tutors/${id}`}
          className={
            slotsState === "full"
              ? "rounded-lg border border-student-teal px-4 py-2 text-sm font-semibold text-student-teal transition-colors hover:bg-surface-container-low dark:border-primary-fixed-dim dark:text-primary-fixed-dim dark:hover:bg-white/5"
              : "rounded-lg bg-student-teal px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary"
          }
        >
          {slotsState === "full" ? "Waitlist" : "View"}
        </Link>
      </div>
    </div>
  );
}