import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, IdCard, ArrowRight, Loader2 } from "lucide-react";
import Logo from "../components/Logo";
import FormField from "../components/FormField";
import PasswordField from "../components/PasswordField";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

const KNUST_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@st\.knust\.edu\.gh$/i;

// export default function SignIn() {
//   const [activeTab, setActiveTab] = useState("signin"); // "signin" | "signup"
//   const navigate = useNavigate();

//   const signInForm = useForm({ mode: "onBlur" });
//   const signUpForm = useForm({ mode: "onBlur" });

//   const onSignIn = async (data) => {
//     await new Promise((r) => setTimeout(r, 800));
//     console.log("Sign in:", data);
//     // TODO: POST to your /auth/login endpoint, then navigate on success
//     navigate("/tutors");
//   };

//   const onSignUp = async (data) => {
//     await new Promise((r) => setTimeout(r, 800));
//     console.log("Create account:", data);
//     // TODO: POST to your /auth/register endpoint, then send them to finish their profile
//     navigate("/complete-profile");
//   };

export default function SignIn() {
  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const signInForm = useForm({ mode: "onBlur" });
  const signUpForm = useForm({ mode: "onBlur" });

  const onSignIn = async (data) => {
    try {
      await login(data);
      navigate("/tutors");
    } catch (err) {
      signInForm.setError(err.field || "email", { type: "manual", message: err.message });
    }
  };

  const onSignUp = async (data) => {
    try {
      await signup(data);
      navigate("/complete-profile");
    } catch (err) {
      signUpForm.setError(err.field || "email", { type: "manual", message: err.message });
    }
  };

  const fillDemoData = () => {
    signUpForm.setValue("fullName", "Kofi Mensah", { shouldValidate: true });
    signUpForm.setValue("email", `test${Date.now()}@st.knust.edu.gh`, { shouldValidate: true });
    signUpForm.setValue("referenceId", String(1000000 + Math.floor(Math.random() * 8999999)), { shouldValidate: true });
    signUpForm.setValue("password", "Password123", { shouldValidate: true });
    signUpForm.setValue("confirmPassword", "Password123", { shouldValidate: true });
  };

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-primary-fixed to-surface
        p-4 antialiased transition-colors duration-300 dark:from-on-primary-fixed dark:to-dark-bg md:p-8"
    >
      <ThemeToggle className="fixed top-0 md:top-0 mb-5" />

      <main className="w-full max-w-md animate-fade-up">
        <div
          className="relative flex flex-col items-center space-y-6 overflow-hidden rounded-2xl border
            border-outline-variant/30 bg-surface-container-lowest p-8 shadow-lg dark:border-white/10 dark:bg-dark-surface md:p-10"
        >
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-student-teal/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-tutor-purple/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-3 text-center">
            <Logo size="lg" />
            <p className="text-on-surface-variant dark:text-white/60">
              {activeTab === "signin"
                ? "Sign in to find or become a tutor at KNUST"
                : "Create your account to get started"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="relative z-10 flex w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low p-1 dark:border-white/10 dark:bg-white/5">
            {[
              { key: "signin", label: "Sign In" },
              { key: "signup", label: "Create Account" },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition-all duration-150 ${
                  activeTab === key
                    ? "bg-white text-student-teal shadow-sm dark:bg-dark-surface dark:text-primary-fixed-dim"
                    : "text-on-surface-variant dark:text-white/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sign In form */}
          {activeTab === "signin" && (
            <form
              onSubmit={signInForm.handleSubmit(onSignIn)}
              noValidate
              className="relative z-10 flex w-full flex-col gap-5"
            >
              <FormField
                id="signin-email"
                type="email"
                label="Student Email"
                icon={Mail}
                placeholder="yourname@st.knust.edu.gh"
                error={signInForm.formState.errors.email}
                {...signInForm.register("email", {
                  required: "Student email is required",
                  pattern: { value: KNUST_EMAIL_PATTERN, message: "Please enter a valid @st.knust.edu.gh email" },
                })}
              />
              <PasswordField
                id="signin-password"
                label="Password"
                placeholder="Enter your password"
                error={signInForm.formState.errors.password}
                {...signInForm.register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                })}
              />
              <div className="-mt-2 flex justify-end">
                <a href="#" className="text-xs font-medium text-student-teal hover:underline dark:text-primary-fixed-dim">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={signInForm.formState.isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-student-teal px-6 py-3.5 font-medium
                  text-white shadow-sm transition-all duration-150 hover:bg-primary active:scale-95
                  disabled:cursor-not-allowed disabled:opacity-70"
              >
                {signInForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-[18px] w-[18px] animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-[18px] w-[18px]" />
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === "signup" && (
            <button
              type="button"
              onClick={fillDemoData}
              className="relative z-10 -mt-2 text-xs font-medium text-tutor-purple hover:underline"
            >
              ⚡ Fill demo data (dev only)
            </button>
          )}

          {/* Create Account form */}
          {activeTab === "signup" && (
            <form
              onSubmit={signUpForm.handleSubmit(onSignUp)}
              noValidate
              className="relative z-10 flex w-full flex-col gap-5"
            >
              <FormField
                id="signup-name"
                label="Full Name"
                icon={User}
                placeholder="e.g. Kofi Mensah"
                error={signUpForm.formState.errors.fullName}
                {...signUpForm.register("fullName", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "That name looks too short" },
                })}
              />
              <FormField
                id="signup-email"
                type="email"
                label="Student Email"
                icon={Mail}
                placeholder="yourname@st.knust.edu.gh"
                error={signUpForm.formState.errors.email}
                hint="Must be your KNUST email, e.g. yourname@st.knust.edu.gh"
                {...signUpForm.register("email", {
                  required: "Student email is required",
                  pattern: { value: KNUST_EMAIL_PATTERN, message: "Please enter a valid @st.knust.edu.gh email" },
                })}
              />
              <FormField
                id="signup-refId"
                label="Reference ID (Index Number)"
                icon={IdCard}
                placeholder="Enter your KNUST index number"
                error={signUpForm.formState.errors.referenceId}
                hint="Your official KNUST student index number"
                {...signUpForm.register("referenceId", {
                  required: "Reference ID is required",
                  pattern: { value: /^\d{6,10}$/, message: "Numbers only, 6–10 digits" },
                })}
              />
              <PasswordField
                id="signup-password"
                label="Password"
                placeholder="Create a password"
                error={signUpForm.formState.errors.password}
                {...signUpForm.register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message: "Include an uppercase letter, lowercase letter, and a number",
                  },
                })}
              />
              <PasswordField
                id="signup-confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                error={signUpForm.formState.errors.confirmPassword}
                {...signUpForm.register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === signUpForm.getValues("password") || "Passwords do not match",
                })}
              />
              <button
                type="submit"
                disabled={signUpForm.formState.isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-student-teal px-6 py-3.5 font-medium
                  text-white shadow-sm transition-all duration-150 hover:bg-primary active:scale-95
                  disabled:cursor-not-allowed disabled:opacity-70"
              >
                {signUpForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-[18px] w-[18px] animate-spin" /> Creating account...
                  </>
                ) : (
                  <>
                    Create Account <ArrowRight className="h-[18px] w-[18px]" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="relative z-10 w-full border-t border-outline-variant/30 pt-6 dark:border-white/10">
            <p className="text-center text-xs text-on-surface-variant dark:text-white/40">
              By continuing you agree to our{" "}
              <Link to="/guidelines" className="text-student-teal hover:underline dark:text-primary-fixed-dim">
                Community Guidelines
              </Link>{" "}
              &amp;{" "}
              <Link to="/privacy" className="text-student-teal hover:underline dark:text-primary-fixed-dim">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-on-surface-variant dark:text-white/50">
          <Link to="/" className="font-medium text-student-teal hover:underline dark:text-primary-fixed-dim">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}