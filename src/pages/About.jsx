import { BookOpen, Users, ShieldCheck, Award, Sparkles, HeartHandshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-8 md:py-16 animate-fade-up">
        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-student-teal/30 bg-student-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-student-teal dark:text-primary-fixed-dim">
            <Sparkles className="h-3.5 w-3.5" /> Built for KNUST
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface dark:text-white md:text-5xl">
            Empowering Peer Learning at KNUST
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant dark:text-white/70">
            StudyPair connects students who have mastered their courses with peers seeking guidance, fostering a culture of collaborative academic excellence.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-sm dark:border-white/10 dark:bg-dark-surface">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-student-teal/15 text-student-teal dark:text-primary-fixed-dim">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white">
              Our Mission
            </h2>
            <p className="mt-3 leading-relaxed text-on-surface-variant dark:text-white/70">
              To make high-quality academic support accessible to every student at Kwame Nkrumah University of Science and Technology, eliminating learning barriers through verified, community-driven peer tutoring.
            </p>
          </div>

          <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-sm dark:border-white/10 dark:bg-dark-surface">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-tutor-purple/15 text-tutor-purple">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white">
              Our Vision
            </h2>
            <p className="mt-3 leading-relaxed text-on-surface-variant dark:text-white/70">
              A university community where no student struggles in silence. By rewarding peer mentors and enabling collaborative study groups, we build confidence, deepen understanding, and elevate graduation outcomes.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="mb-16">
          <h2 className="text-center font-display text-3xl font-bold text-on-surface dark:text-white mb-10">
            Why StudyPair Works
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 dark:border-white/5 dark:bg-white/5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-student-teal text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-on-surface dark:text-white">Verified Peer Tutors</h3>
              <p className="mt-2 text-sm text-on-surface-variant dark:text-white/60">
                All tutors are authenticated KNUST students with proven competence in the specific subjects they teach.
              </p>
            </div>

            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 dark:border-white/5 dark:bg-white/5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-tutor-purple text-white">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-on-surface dark:text-white">1-on-1 & Group Circles</h3>
              <p className="mt-2 text-sm text-on-surface-variant dark:text-white/60">
                Whether you prefer personal pacing or group problem solving with integrated WhatsApp study circles, you have full flexibility.
              </p>
            </div>

            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 dark:border-white/5 dark:bg-white/5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-status-confirmed text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg text-on-surface dark:text-white">Direct Course Matching</h3>
              <p className="mt-2 text-sm text-on-surface-variant dark:text-white/60">
                Find assistance mapped precisely to your KNUST course codes (e.g. MATH 151, CSM 251, COE 157, PHY 107).
              </p>
            </div>
          </div>
        </div>

        {/* CTA Card */}
        <div className="rounded-3xl bg-gradient-to-br from-student-teal to-primary p-8 text-center text-white shadow-lg md:p-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to boost your grades this semester?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 md:text-base">
            Join hundreds of KNUST students already studying smarter together.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/sign-in"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-student-teal shadow-xs transition-transform hover:scale-105 active:scale-95"
            >
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/guidelines"
              className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Read Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
