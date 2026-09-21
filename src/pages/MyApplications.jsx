import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipboardList, Plus, X, Loader2, GraduationCap, ArrowRight } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import FormField from "../components/FormField";
import { useTutorMode } from "../context/TutorModeContext";

const STATUS_STYLES = {
  pending: "bg-status-pending/10 text-status-pending border-status-pending/20",
  approved: "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
  rejected: "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
};

const INITIAL_APPLICATIONS = [
  { id: "a1", course: "MATH 151 - Calculus I", appliedOn: "Aug 12, 2026", status: "pending" },
  { id: "a2", course: "CSM 251 - Data Structures", appliedOn: "Jul 30, 2026", status: "approved" },
  { id: "a3", course: "PHY 107 - Mechanics", appliedOn: "Jul 10, 2026", status: "rejected", reason: "Grade requirement not met for this course." },
];

export default function MyApplications() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [showForm, setShowForm] = useState(false);
  const { isTutorMode, switchToTutorMode } = useTutorMode();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 700));
    setApplications((prev) => [
      { id: `a${prev.length + 1}`, course: data.course, appliedOn: "Just now", status: "pending" },
      ...prev,
    ]);
    reset();
    setShowForm(false);
    // TODO: POST /api/tutor/applications
  };

  return (
    <AppLayout>
      <div className="animate-fade-up pt-6 md:pt-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">
              My Applications
            </h1>
            <p className="mt-2 text-on-surface-variant dark:text-white/60">
              Track your tutor applications for specific KNUST courses.
            </p>
          </div>

          {/* Only tutors can apply to teach */}
          {isTutorMode ? (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 self-start rounded-xl bg-tutor-purple px-5 py-2.5 text-sm font-medium
                text-white shadow-sm transition-all duration-150 hover:bg-secondary active:scale-95 sm:self-auto"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "Cancel" : "Apply to Teach a Course"}
            </button>
          ) : (
            <button
              onClick={switchToTutorMode}
              className="flex items-center gap-2 self-start rounded-xl border border-student-teal/40 bg-student-teal/10 px-5 py-2.5 text-sm font-semibold
                text-student-teal transition-all duration-150 hover:bg-student-teal hover:text-white dark:border-primary-fixed-dim/40 dark:text-primary-fixed-dim sm:self-auto"
            >
              <GraduationCap className="h-4 w-4" />
              Switch to Tutor Mode to Apply
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Student Mode Notice: Students cannot apply to teach in student mode */}
        {!isTutorMode && (
          <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-student-teal/20 bg-student-teal/5 p-5 dark:border-primary-fixed-dim/20 dark:bg-student-teal/10 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-student-teal/15 text-student-teal dark:text-primary-fixed-dim">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface dark:text-white">
                  Tutoring Applications are in Tutor Mode
                </h3>
                <p className="text-sm text-on-surface-variant dark:text-white/70">
                  In student mode, you can only view existing applications. Switch to Tutor Mode to apply to teach courses or manage your active teaching listings.
                </p>
              </div>
            </div>
            <button
              onClick={switchToTutorMode}
              className="whitespace-nowrap rounded-xl bg-student-teal px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary"
            >
              Switch to Tutor Mode
            </button>
          </div>
        )}

        {/* Application Form: Only available in Tutor Mode */}
        {isTutorMode && showForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mb-8 flex max-w-xl animate-fade-up flex-col gap-4 rounded-2xl border border-outline-variant
              bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface"
          >
            <FormField
              id="course"
              label="Course Code & Title"
              placeholder="e.g. MATH 251 - Linear Algebra"
              error={errors.course}
              {...register("course", {
                required: "Please enter the course you want to tutor",
                minLength: { value: 3, message: "That course name looks too short" },
              })}
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="reason" className="text-sm font-medium text-on-surface dark:text-white/90">
                Why are you qualified to teach this course?
              </label>
              <textarea
                id="reason"
                rows={3}
                placeholder="e.g. I scored an 'A' in this course, understand student stumbling blocks, and have assisted juniors informally."
                className={`w-full resize-none rounded-lg border py-3 px-4 outline-none transition-colors duration-150
                  bg-surface-container-lowest text-on-surface placeholder-outline-variant/70
                  dark:bg-white/5 dark:text-white dark:placeholder-white/30
                  ${
                    errors.reason
                      ? "border-error bg-error/5 focus:border-error focus:ring-1 focus:ring-error"
                      : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"
                  }`}
                {...register("reason", {
                  required: "Tell us a bit about why you'd be a good tutor",
                  minLength: { value: 10, message: "A bit more detail would help your application" },
                })}
              />
              {errors.reason && <p className="text-xs text-error">{errors.reason.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-tutor-purple px-6 py-3 font-medium
                text-white transition-all duration-150 hover:bg-secondary active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-[18px] w-[18px] animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Application to Teach"
              )}
            </button>
          </form>
        )}

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="flex max-w-2xl flex-col gap-4 pb-8">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm dark:border-white/10 dark:bg-dark-surface"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-on-surface dark:text-white">{app.course}</h3>
                    <p className="text-sm text-on-surface-variant dark:text-white/50">Applied {app.appliedOn}</p>
                  </div>
                  <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                {app.status === "rejected" && app.reason && (
                  <p className="border-t border-outline-variant/50 pt-3 text-xs italic text-on-surface-variant dark:border-white/10 dark:text-white/40">
                    {app.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
            <ClipboardList className="h-8 w-8 text-outline dark:text-white/30" />
            <p className="font-medium text-on-surface dark:text-white">No applications yet</p>
            <p className="text-sm text-neutral-gray dark:text-white/50">
              {isTutorMode ? "Apply to tutor a course you scored high in." : "Switch to Tutor Mode to apply to teach courses."}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}