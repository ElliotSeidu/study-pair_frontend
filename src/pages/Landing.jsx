import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import { Search, CalendarDays, Users, GraduationCap, LogIn, ArrowRight, Mail, ShieldCheck, Sparkles, TrendingUp, Clock } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "1. Find a course",
    desc: "Search for specific KNUST courses you need help with or want to collaborate on.",
    bg: "bg-primary-fixed text-on-primary-fixed dark:bg-student-teal/20 dark:text-primary-fixed-dim",
  },
  {
    icon: CalendarDays,
    title: "2. Book a slot",
    desc: "Schedule a 1-on-1 session or join an upcoming group study slot that fits your timetable.",
    bg: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    icon: Users,
    title: "3. Learn together",
    desc: "Meet on campus or virtually to master concepts with peers who understand the material.",
    bg: "bg-secondary-fixed text-secondary dark:bg-tutor-purple/15 dark:text-tutor-purple",
  },
];

const whyUs = [
  {
    icon: ShieldCheck,
    title: "KNUST Students Only",
    desc: "Every account is verified with a @st.knust.edu.gh email, so you're always learning with real peers, not strangers.",
    bg: "bg-primary-fixed text-on-primary-fixed dark:bg-student-teal/20 dark:text-primary-fixed-dim",
  },
  {
    icon: Sparkles,
    title: "Peer-to-Peer, Not Paid Tuition",
    desc: "Get help from students who've already aced the course, without the cost of a private tutoring service.",
    bg: "bg-secondary-fixed text-secondary dark:bg-tutor-purple/15 dark:text-tutor-purple",
  },
  {
    icon: Clock,
    title: "Fits Your Timetable",
    desc: "Book a 1-on-1 slot or drop into a group session, on campus or virtual, whenever it works for you.",
    bg: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    icon: TrendingUp,
    title: "Build Real Experience",
    desc: "Strong in a course? Tutor it, strengthen your own understanding, and build a track record you can point to.",
    bg: "bg-green-100 text-green-700 dark:bg-status-confirmed/15 dark:text-status-confirmed",
  },
];

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface w-full overflow-x-hidden transition-colors duration-300 dark:bg-dark-bg dark:text-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-6 md:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/sign-in"
            className="flex items-center gap-2 rounded-full border border-outline-variant/70 bg-surface-container-lowest
              px-5 py-2.5 text-sm font-medium text-primary shadow-sm transition-all duration-150
              hover:bg-surface-container-low active:scale-95
              dark:border-white/10 dark:bg-dark-surface dark:text-primary-fixed-dim dark:hover:bg-white/5"
          >
            Sign In <LogIn className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-16 px-4 py-8 md:gap-24 md:px-8 md:py-12">
        {/* Hero */}
        <section className="flex flex-col items-center gap-12 md:flex-row md:justify-between">
          <div className="flex max-w-2xl flex-1 flex-col gap-6 animate-fade-up">
            <div className="flex w-fit items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-low px-4 py-1.5 dark:border-white/10 dark:bg-white/5">
              <span className="h-2 w-2 rounded-full bg-student-teal" />
              <span className="text-sm font-medium text-on-surface-variant dark:text-white/70">
                Academic Synergy at KNUST
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-on-surface dark:text-white md:text-5xl md:leading-[1.1]">
              Find a study partner,
              <br />
              <span className="text-student-teal dark:text-primary-fixed-dim">master your courses.</span>
            </h1>

            <p className="text-lg leading-relaxed text-on-surface-variant dark:text-white/70">
              Get 1-on-1 help or join group sessions with peers who have been there before.
              Exclusive to KNUST students.
            </p>

            <div className="pt-2">
              <Link
                to="/sign-in"
                className="group flex w-full sm:w-fit items-center justify-center gap-3 rounded-xl bg-student-teal px-8 py-4 text-lg
                  font-medium text-white shadow-sm transition-all duration-150 hover:bg-primary active:scale-95"
              >
                <Mail className="h-5 w-5" />
                Sign In with KNUST Email
                <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <p className="ml-2 mt-3 text-xs font-semibold uppercase tracking-wide text-outline dark:text-white/40">
                Requires @st.knust.edu.gh
              </p>
            </div>
          </div>

          {/* Floating cards visual */}
          <div className="relative flex h-[360px] w-full flex-1 items-center justify-center overflow-hidden md:h-[480px]">
            <div className="absolute inset-0 z-[-1] rounded-full bg-student-teal/5 blur-3xl dark:bg-tutor-purple/10" />

            <div className="relative aspect-square w-full max-w-sm">
              <div
                className="absolute right-0 top-[5%] z-10 w-52 sm:w-60 rotate-3 rounded-2xl border border-white/60 bg-white/70
                  p-4 shadow-lg backdrop-blur-md transition-transform duration-300 hover:rotate-0 animate-float
                  dark:border-white/10 dark:bg-dark-surface/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface dark:text-white">CS 311 Tutoring</p>
                    <p className="text-xs text-on-surface-variant dark:text-white/50">Today, 2:00 PM</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-full bg-status-confirmed/10 px-2 py-1 text-xs font-semibold text-status-confirmed">
                    Confirmed
                  </span>
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-student-teal dark:border-dark-surface" />
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-tutor-purple dark:border-dark-surface" />
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-[10%] left-0 z-20 w-48 sm:w-52 -rotate-2 rounded-2xl border border-white/60 bg-white/70
                  p-4 shadow-lg backdrop-blur-md transition-transform duration-300 hover:rotate-0 animate-float
                  dark:border-white/10 dark:bg-dark-surface/80"
                style={{ animationDelay: "1s" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-high text-primary dark:bg-white/10 dark:text-primary-fixed-dim">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-outline dark:text-white/40">Just now</span>
                </div>
                <p className="mt-2 text-sm font-medium text-on-surface dark:text-white">Math 251 Request</p>
                <p className="text-xs text-on-surface-variant dark:text-white/50">Looking for study partner</p>
              </div>

              <div
                className="absolute left-[30%] top-[35%] z-0 flex h-24 w-24 sm:h-28 sm:w-28 rotate-6 flex-col items-center justify-center
                  gap-2 rounded-2xl border border-white/60 bg-white/70 shadow-lg backdrop-blur-md
                  transition-transform duration-300 hover:rotate-0 animate-float
                  dark:border-white/10 dark:bg-dark-surface/80"
                style={{ animationDelay: "2s" }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-fixed text-secondary dark:bg-tutor-purple/20 dark:text-tutor-purple">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-xs text-on-surface dark:text-white/70">Peer Chat</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why StudyPair */}
        <section className="flex flex-col gap-10">
          <div className="mx-auto flex max-w-xl flex-col gap-3 text-center">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-outline-variant/60 bg-surface-container-low px-4 py-1.5 dark:border-white/10 dark:bg-white/5">
              <span className="h-2 w-2 rounded-full bg-tutor-purple" />
              <span className="text-sm font-medium text-on-surface-variant dark:text-white/70">Why StudyPair</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
              Built for how KNUST students actually study
            </h2>
            <p className="text-on-surface-variant dark:text-white/60">
              Not a generic tutoring app — a platform made specifically for your courses, your campus, and your peers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {whyUs.map(({ icon: Icon, title, desc, bg }) => (
              <div
                key={title}
                className="flex gap-5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6
                  shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                  dark:border-white/10 dark:bg-dark-surface"
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-lg font-semibold text-on-surface dark:text-white">{title}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-white/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="flex flex-col gap-8">
          <div className="mx-auto flex max-w-xl flex-col gap-3 text-center">
            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
              How StudyPair Works
            </h2>
            <p className="text-on-surface-variant dark:text-white/60">
              Three simple steps to elevate your academic journey through collaborative learning.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, desc, bg }, i) => (
              <div
                key={title}
                className="flex flex-col gap-5 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest
                  p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md
                  dark:border-white/10 dark:bg-dark-surface"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${bg}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-semibold text-on-surface dark:text-white">{title}</h3>
                  <p className="text-sm text-on-surface-variant dark:text-white/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Become a tutor banner */}
        <section
          className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl border
            border-outline-variant/60 bg-surface-container p-8 dark:border-white/10 dark:bg-dark-surface md:flex-row md:p-12"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-tutor-purple/10 blur-2xl" />
          <div className="relative z-10 flex max-w-lg flex-col gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-tutor-purple" />
              <span className="text-sm font-semibold uppercase tracking-wider text-tutor-purple">For Tutors</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
              Become a Tutor
            </h2>
            <p className="text-on-surface-variant dark:text-white/60">
              Strong in a course? Help your peers and earn experience. Build your resume while
              strengthening your own understanding.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <Link
              to="/sign-in"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-tutor-purple
                px-8 py-4 font-medium text-tutor-purple transition-all duration-150 hover:bg-tutor-purple/10
                active:scale-95 md:w-auto"
            >
              Apply to Tutor
            </Link>
          </div>
        </section>
      </main>

      <footer
        className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-4 border-t
          border-outline-variant/60 bg-surface-container px-4 py-8 dark:border-white/10 dark:bg-dark-surface md:flex-row md:px-8"
      >
        <span className="font-display text-lg font-semibold text-on-surface dark:text-white">StudyPair</span>
        <p className="text-sm text-on-surface-variant dark:text-white/50">
          © 2026 StudyPair KNUST. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          {[
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
            { to: "/privacy", label: "Privacy" },
            { to: "/guidelines", label: "Guidelines" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-on-surface-variant transition-colors hover:text-student-teal dark:text-white/60 dark:hover:text-primary-fixed-dim"
            >
              {label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}