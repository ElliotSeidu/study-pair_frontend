import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, Phone, BookOpen, LogOut, Save, Loader2, Mail, ShieldCheck } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import FormField from "../components/FormField";
import SignOutConfirmModal from "../components/SignOutConfirmModal";
import { useAuth } from "../context/AuthContext";
import { useTutorMode } from "../context/TutorModeContext";
import { useNavigate } from "react-router-dom";

const LEVELS = ["100", "200", "300", "400"];

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { isTutorMode } = useTutorMode();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      course: user?.course || "",
      level: user?.level || "100",
    },
  });

  const selectedLevel = watch("level");
  const actualEmail = user?.email || "student@st.knust.edu.gh";

  const onSubmit = async (data) => {
    setSaved(false);
    await updateProfile(data);
    setSaved(true);
  };

  const handleConfirmSignOut = () => {
    setShowSignOutConfirm(false);
    logout();
    navigate("/");
  };

  return (
    <AppLayout>
      <div className="animate-fade-up pt-6 md:pt-8">
        <h1 className="mb-8 font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">
          Profile
        </h1>

        <div className="max-w-xl">
          {/* Avatar & Role Card */}
          <div className="mb-6 flex items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm ${
                isTutorMode ? "bg-tutor-purple" : "bg-student-teal"
              }`}
            >
              {user?.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "U"}
            </div>
            <div>
              <p className="font-semibold text-on-surface dark:text-white">{user?.fullName || "StudyPair User"}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    isTutorMode
                      ? "bg-tutor-purple/15 text-tutor-purple dark:bg-tutor-purple/25 dark:text-purple-300"
                      : "bg-student-teal/15 text-student-teal dark:bg-student-teal/25 dark:text-primary-fixed-dim"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {isTutorMode ? "Tutor" : "Student"}
                </span>
                <span className="text-xs text-on-surface-variant dark:text-white/40">KNUST Verified</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface"
          >
            <FormField
              id="fullName"
              label="Full Name"
              icon={User}
              error={errors.fullName}
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 2, message: "That name looks too short" },
              })}
            />

            {/* Email Field - displays the ACTUAL authenticated email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface dark:text-white/90">
                {isTutorMode ? "Tutor Email" : "Student Email"}
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-on-surface-variant dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                <Mail className="h-[18px] w-[18px] text-outline dark:text-white/50" />
                <span className="font-medium">{actualEmail}</span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-white/40">
                Your authenticated KNUST email address cannot be modified.
              </p>
            </div>

            <FormField
              id="phone"
              type="tel"
              label="Phone Number (WhatsApp Active)"
              icon={Phone}
              error={errors.phone}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^0\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
                  message: "Enter a valid Ghanaian number, e.g. 024 123 4567",
                },
              })}
            />

            <FormField
              id="course"
              label="Program of Study"
              icon={BookOpen}
              error={errors.course}
              {...register("course", {
                required: "Program of study is required",
                minLength: { value: 3, message: "Program name looks too short" },
              })}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface dark:text-white/90">Academic Year / Level</label>
              <div className="flex overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low p-1 dark:border-white/10 dark:bg-white/5">
                {LEVELS.map((lvl) => (
                  <label key={lvl} className="relative flex-1 cursor-pointer text-center">
                    <input type="radio" value={lvl} className="peer sr-only" {...register("level")} />
                    <div
                      className={`rounded-md py-2 text-sm font-medium transition-all duration-150 ${
                        selectedLevel === lvl
                          ? isTutorMode
                            ? "bg-white text-tutor-purple shadow-sm dark:bg-dark-surface dark:text-purple-300"
                            : "bg-white text-student-teal shadow-sm dark:bg-dark-surface dark:text-primary-fixed-dim"
                          : "text-on-surface-variant dark:text-white/50"
                      }`}
                    >
                      {lvl}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isDirty}
              className={`flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium text-white shadow-sm transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                isTutorMode
                  ? "bg-tutor-purple hover:bg-secondary"
                  : "bg-student-teal hover:bg-primary"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-[18px] w-[18px] animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-[18px] w-[18px]" /> Save Changes
                </>
              )}
            </button>
            {saved && (
              <p className="text-center text-sm font-medium text-status-confirmed">Profile updated successfully.</p>
            )}
          </form>

          {/* Sign Out Button - triggers confirmation modal */}
          <button
            onClick={() => setShowSignOutConfirm(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 px-6 py-3.5
              font-medium text-error transition-colors hover:bg-error/5 active:scale-95"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      <SignOutConfirmModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        onConfirm={handleConfirmSignOut}
      />
    </AppLayout>
  );
}