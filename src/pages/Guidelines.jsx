import { BookCheck, ShieldAlert, Users, Clock, MapPin, MessageSquare, AlertCircle } from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";

export default function Guidelines() {
  const guidelines = [
    {
      icon: BookCheck,
      title: "1. Academic Integrity First",
      desc: "StudyPair is designed for collaborative learning, concept revision, and peer problem-solving. Tutors must guide students to understand concepts—never complete graded assignments, tests, or quizzes on behalf of another student.",
      color: "text-student-teal",
      bg: "bg-student-teal/10",
    },
    {
      icon: Clock,
      title: "2. Punctuality and Reliability",
      desc: "Respect each other's time. Arrive on time for scheduled 1-on-1 or group sessions. If you cannot make a session due to unexpected campus conflicts, provide at least 2 hours advance notice via WhatsApp.",
      color: "text-tutor-purple",
      bg: "bg-tutor-purple/10",
    },
    {
      icon: MapPin,
      title: "3. Safe Campus Venues",
      desc: "For in-person study sessions, always meet in well-lit, public academic venues across KNUST, such as the Main Library, College Study Wings, faculty lounges, or departmental study halls.",
      color: "text-status-confirmed",
      bg: "bg-status-confirmed/10",
    },
    {
      icon: MessageSquare,
      title: "4. WhatsApp Study Group Etiquette",
      desc: "Group study WhatsApp links are strictly for academic discussions, session materials, and schedule announcements. Spreading spam, unauthorized advertisements, or off-topic media is prohibited.",
      color: "text-status-pending",
      bg: "bg-status-pending/10",
    },
    {
      icon: Users,
      title: "5. Mutual Respect and Inclusivity",
      desc: "Treat every peer with dignity regardless of year, program, or academic starting level. Constructive, encouraging feedback fosters an open environment where students feel safe asking questions.",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: ShieldAlert,
      title: "6. Zero Tolerance for Misconduct",
      desc: "Harassment, discrimination, unsolicited contact, or fraudulent behavior will result in immediate suspension of account privileges and report to KNUST student authorities.",
      color: "text-error",
      bg: "bg-error/10",
    },
  ];

  return (
    <PublicLayout>
      <div className="mx-auto max-w-[960px] px-4 py-12 md:px-8 md:py-16 animate-fade-up">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-student-teal/30 bg-student-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-student-teal dark:text-primary-fixed-dim">
            <BookCheck className="h-3.5 w-3.5" /> Community Standards
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface dark:text-white md:text-5xl">
            Community Guidelines
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant dark:text-white/70">
            Our guidelines ensure StudyPair remains a safe, respectful, and academically sound environment for all KNUST students.
          </p>
        </div>

        {/* Guidelines List */}
        <div className="space-y-6">
          {guidelines.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-xs transition-shadow hover:shadow-md dark:border-white/10 dark:bg-dark-surface sm:flex-row sm:items-start"
            >
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-on-surface dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant dark:text-white/70">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Reporting callout */}
        <div className="mt-12 flex items-start gap-4 rounded-2xl border border-status-pending/30 bg-status-pending/10 p-6">
          <AlertCircle className="h-6 w-6 flex-shrink-0 text-status-pending mt-0.5" />
          <div>
            <h4 className="font-bold text-on-surface dark:text-white">Need to report a guideline violation?</h4>
            <p className="mt-1 text-sm text-on-surface-variant dark:text-white/70">
              If you experience or witness behavior that violates these guidelines, please contact our support team immediately at{" "}
              <a href="mailto:support@studypair.knust.edu.gh" className="font-semibold text-student-teal underline dark:text-primary-fixed-dim">
                support@studypair.knust.edu.gh
              </a>
              . All reports are handled confidentially.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
