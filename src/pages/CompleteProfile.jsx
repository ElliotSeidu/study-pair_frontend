import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Phone, BookOpen, GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import FormField from "../components/FormField";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const LEVELS = ["100", "200", "300", "400"];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { level: "100" },
  });

  const selectedLevel = watch("level");

  const onSubmit = async (data) => {
    await updateProfile(data);
    navigate("/tutors");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-fixed p-4 text-on-surface transition-colors duration-300 dark:bg-dark-bg md:p-8">
      <ThemeToggle className="fixed right-4 top-4 md:right-8 md:top-8" />

      <div className="w-full max-w-lg animate-fade-up rounded-2xl border border-white/50 bg-white/85 p-8 shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-dark-surface/90">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <h1 className="font-display text-2xl font-bold text-student-teal dark:text-primary-fixed-dim md:text-3xl">
            Almost there, {user?.fullName?.split(" ")[0]}!
          </h1>
          <p className="text-on-surface-variant dark:text-white/60">
            Just a few more details to match you with the right tutors.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
          {/* Phone */}
          <FormField
            id="phone"
            type="tel"
            label="Phone Number"
            icon={Phone}
            placeholder="024 XXX XXXX"
            error={errors.phone}
            maxLength={10}
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^0\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
                message: "Enter a valid Ghanaian number, e.g. 024 123 4567",
              },
            })}
          />

          {/* Course + School */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              id="course"
              label="Course/Program"
              icon={BookOpen}
              placeholder="e.g. BSc Computer Science"
              error={errors.course}
              {...register("course", {
                required: "Course/Program is required",
                minLength: { value: 3, message: "That course name looks too short" },
              })}
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface dark:text-white/90">School</label>
              <div className="flex cursor-not-allowed items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 dark:border-white/10 dark:bg-white/5">
                <GraduationCap className="h-[18px] w-[18px] text-student-teal dark:text-primary-fixed-dim" />
                <span className="font-medium text-on-surface-variant dark:text-white/70">KNUST</span>
              </div>
            </div>
          </div>

          {/* Year/Level segmented control */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface dark:text-white/90">Year/Level</label>
            <div className="flex overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low p-1 dark:border-white/10 dark:bg-white/5">
              {LEVELS.map((lvl) => (
                <label key={lvl} className="relative flex-1 cursor-pointer text-center">
                  <input
                    type="radio"
                    value={lvl}
                    className="peer sr-only"
                    {...register("level", { required: "Select your year/level" })}
                  />
                  <div
                    className={`rounded-md py-2 text-sm font-medium transition-all duration-150 ${
                      selectedLevel === lvl
                        ? "bg-white text-student-teal shadow-sm dark:bg-dark-surface dark:text-primary-fixed-dim"
                        : "text-on-surface-variant dark:text-white/50"
                    }`}
                  >
                    {lvl}
                  </div>
                </label>
              ))}
            </div>
            {errors.level && <p className="text-xs text-error">{errors.level.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-student-teal px-6 py-3 font-medium text-white transition-all duration-150 hover:bg-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" /> Saving...
              </>
            ) : (
              <>
                Save &amp; Continue <ArrowRight className="h-[18px] w-[18px]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}