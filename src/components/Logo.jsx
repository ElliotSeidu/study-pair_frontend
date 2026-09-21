import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ size = "md", to = "/", clickable = true }) {
  const sizes = {
    sm: { box: "h-8 w-8", icon: "h-4 w-4", text: "text-lg" },
    md: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-xl" },
    lg: { box: "h-14 w-14", icon: "h-7 w-7", text: "text-2xl" },
  };
  const s = sizes[size];

  const content = (
    <>
      <div
        className={`${s.box} flex items-center justify-center rounded-xl bg-gradient-to-br 
          from-student-teal to-primary text-white shadow-sm transition-transform duration-300 ${clickable ? "group-hover:scale-105" : ""}`}
      >
        <BookOpen className={s.icon} strokeWidth={2.25} />
      </div>
      <span className={`font-display ${s.text} font-bold text-on-surface dark:text-white`}>
        StudyPair
      </span>
    </>
  );

  if (!clickable || to === null) {
    return <div className="flex items-center gap-2.5 select-none">{content}</div>;
  }

  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      {content}
    </Link>
  );
}