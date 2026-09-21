import { Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-[900px] px-4 py-12 md:px-8 md:py-16 animate-fade-up">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-student-teal/30 bg-student-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-student-teal dark:text-primary-fixed-dim">
            <Shield className="h-3.5 w-3.5" /> Privacy &amp; Data Security
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface dark:text-white md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-on-surface-variant dark:text-white/60">
            Last Updated: September 2026 • Effective for all KNUST StudyPair users
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-on-surface dark:text-white/90">
          <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-xs dark:border-white/10 dark:bg-dark-surface">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-on-surface dark:text-white mb-3">
              <FileText className="h-5 w-5 text-student-teal dark:text-primary-fixed-dim" />
              1. Information We Collect
            </h2>
            <p className="text-sm leading-relaxed text-on-surface-variant dark:text-white/70">
              To guarantee that StudyPair remains a safe and authentic peer tutoring ecosystem for Kwame Nkrumah University of Science and Technology, we collect:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant dark:text-white/70 list-disc list-inside">
              <li><strong>KNUST Student Email:</strong> Used for account creation and student identity verification (@st.knust.edu.gh).</li>
              <li><strong>Student Profile Details:</strong> Full name, reference/index number, academic program, and level (100–400).</li>
              <li><strong>Phone Number:</strong> Used exclusively for WhatsApp coordination once study requests are mutually accepted.</li>
              <li><strong>Academic Courses:</strong> Subject codes and session requests you configure as a student or tutor.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-xs dark:border-white/10 dark:bg-dark-surface">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-on-surface dark:text-white mb-3">
              <Eye className="h-5 w-5 text-tutor-purple" />
              2. How We Use and Share Information
            </h2>
            <p className="text-sm leading-relaxed text-on-surface-variant dark:text-white/70">
              We only use your information to operate and improve peer tutoring matching:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant dark:text-white/70 list-disc list-inside">
              <li><strong>WhatsApp Contact Privacy:</strong> Phone numbers are never shown publicly to unverified visitors. A tutor's phone number is only shared with a student after their session request has been accepted.</li>
              <li><strong>WhatsApp Group Invite Links:</strong> Group invite links provided by tutors are accessible only to students whose requests to join the group have been accepted.</li>
              <li><strong>No Data Brokering:</strong> We do not sell, rent, or commercialize your personal information to third-party marketing companies.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-xs dark:border-white/10 dark:bg-dark-surface">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-on-surface dark:text-white mb-3">
              <Lock className="h-5 w-5 text-status-confirmed" />
              3. Device Notifications &amp; PWA Data
            </h2>
            <p className="text-sm leading-relaxed text-on-surface-variant dark:text-white/70">
              When you download StudyPair as a Progressive Web App (PWA) and enable device notifications:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-on-surface-variant dark:text-white/70 list-disc list-inside">
              <li>Notification permissions are controlled entirely through your device's operating system or browser settings and can be revoked at any time.</li>
              <li>Notifications are triggered strictly for study request updates, session reminders, and important academic announcements.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-xs dark:border-white/10 dark:bg-dark-surface">
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-on-surface dark:text-white mb-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              4. Contact Our Privacy Team
            </h2>
            <p className="text-sm leading-relaxed text-on-surface-variant dark:text-white/70">
              For any questions regarding your data, account deactivation, or privacy requests, please contact us at{" "}
              <a href="mailto:privacy@studypair.knust.edu.gh" className="font-semibold text-student-teal underline dark:text-primary-fixed-dim">
                privacy@studypair.knust.edu.gh
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
}
