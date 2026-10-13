import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ClipboardList, Plus, X, Loader2, ArrowRight, Trash2 } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import FormField from "../../components/FormField";
import {
  getApplications,
  addApplication,
  getCourses,
  updateApplicationStatus,
  deleteApplication,
} from "../../lib/store";
import { useAuth } from "../../context/AuthContext";

const STATUS_STYLES = {
  pending: "bg-status-pending/10 text-status-pending border-status-pending/20",
  approved: "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
  rejected: "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
};

const normalize = (code) => code.trim().toUpperCase();

export default function TutorMyApplications() {
  const [applications, setApplications] = useState(() => getApplications());
  const [courses, setCourses] = useState(() => getCourses());
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const handleWithdraw = (id) => {
    deleteApplication(id);
    setApplications(getApplications());
  };

  useEffect(() => {
    const refresh = () => {
      setApplications(getApplications());
      setCourses(getCourses());
    };
    window.addEventListener("studypair_store_updated", refresh);
    return () => window.removeEventListener("studypair_store_updated", refresh);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const listedCodes = new Set(courses.map((c) => normalize(c.code)));

  const onSubmit = async (data) => {
    const code = normalize(data.code);

    const duplicate = applications.find(
      (a) => normalize(a.code) === code && (a.status === "pending" || a.status === "approved")
    );
    if (duplicate) {
      setError("code", {
        type: "manual",
        message:
          duplicate.status === "pending"
            ? "You already have a pending application for this course"
            : "You're already approved to teach this course",
      });
      return;
    }

    await new Promise((r) => setTimeout(r, 700));
    addApplication({
      code,
      title: data.title.trim(),
      justification: data.justification.trim(),
      applicantName: user?.fullName || "Tutor applicant",

    });
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
              Get approved to teach a course, then set up your sessions in My Courses.
            </p>
          </div>

          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 self-start rounded-xl bg-tutor-purple px-5 py-2.5 text-sm font-medium
              text-white shadow-sm transition-all duration-150 hover:bg-secondary active:scale-95 sm:self-auto"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Apply to Teach a Course"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mb-8 flex max-w-xl animate-fade-up flex-col gap-4 rounded-2xl border border-outline-variant
              bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                id="code"
                label="Course Code"
                placeholder="e.g. MATH 251"
                error={errors.code}
                {...register("code", {
                  required: "Course code is required",
                  minLength: { value: 3, message: "Code looks too short" },
                })}
              />
              <FormField
                id="title"
                label="Course Title"
                placeholder="e.g. Linear Algebra"
                error={errors.title}
                {...register("title", { required: "Course title is required" })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="justification" className="text-sm font-medium text-on-surface dark:text-white/90">
                Why are you qualified to teach this course?
              </label>
              <textarea
                id="justification"
                rows={3}
                placeholder="e.g. I scored an 'A' in this course, understand student stumbling blocks, and have assisted juniors informally."
                className={`w-full resize-none rounded-lg border py-3 px-4 outline-none transition-colors duration-150
                  bg-surface-container-lowest text-on-surface placeholder-outline-variant/70
                  dark:bg-white/5 dark:text-white dark:placeholder-white/30
                  ${
                    errors.justification
                      ? "border-error bg-error/5 focus:border-error focus:ring-1 focus:ring-error"
                      : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"
                  }`}
                {...register("justification", {
                  required: "Tell us a bit about why you'd be a good tutor",
                  minLength: { value: 10, message: "A bit more detail would help your application" },
                })}
              />
              {errors.justification && (
                <p className="text-xs text-error">{errors.justification.message}</p>
              )}
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

        {applications.length > 0 ? (
          <div className="flex max-w-2xl flex-col gap-4 pb-8">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm dark:border-white/10 dark:bg-dark-surface"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-on-surface dark:text-white">
                      {app.code} - {app.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant dark:text-white/50">
                      Applied {app.appliedOn}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[app.status]}`}
                    >
                      {app.status}
                    </span>
                    {app.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app.id)}
                        title="Withdraw application"
                        aria-label="Withdraw application"
                        className="flex items-center gap-1 rounded-lg border border-outline-variant/60 px-2.5 py-1 text-xs font-semibold text-error hover:bg-error/10 hover:border-error transition-colors dark:border-white/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Withdraw</span>
                      </button>
                    )}
                  </div>
                </div>

                {app.status === "rejected" && app.reviewNote && (
                  <p className="border-t border-outline-variant/50 pt-3 text-xs italic text-on-surface-variant dark:border-white/10 dark:text-white/40">
                    {app.reviewNote}
                  </p>
                )}

                {app.status === "approved" && !listedCodes.has(normalize(app.code)) && (
                  <Link
                    to="/tutor/courses"
                    className="flex items-center gap-1.5 self-start border-t border-outline-variant/50 pt-3 text-sm font-semibold text-tutor-purple hover:underline dark:border-white/10 dark:text-purple-300"
                  >
                    Set up this course <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                {/* DEV ONLY: stands in for the admin review screen until it exists */}
                {import.meta.env.DEV && app.status === "pending" && (
                  <div className="flex items-center gap-2 border-t border-dashed border-outline-variant/50 pt-3 dark:border-white/10">
                    <span className="text-xs text-on-surface-variant dark:text-white/40">
                      Dev only, simulate review:
                    </span>
                    <button
                      onClick={() => updateApplicationStatus(app.id, "approved")}
                      className="rounded-lg bg-status-confirmed/10 px-3 py-1 text-xs font-semibold text-status-confirmed hover:bg-status-confirmed/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, "rejected", "Rejected during review.")}
                      className="rounded-lg bg-status-rejected/10 px-3 py-1 text-xs font-semibold text-status-rejected hover:bg-status-rejected/20"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
            <ClipboardList className="h-8 w-8 text-outline dark:text-white/30" />
            <p className="font-medium text-on-surface dark:text-white">No applications yet</p>
            <p className="text-sm text-neutral-gray dark:text-white/50">
              Apply to tutor a course you scored high in.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}