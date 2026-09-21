import { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, MapPin, MessageCircle, Send, CheckCircle2, HelpCircle, Loader2 } from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";
import FormField from "../components/FormField";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log("Contact submission:", data);
    setSubmitted(true);
    reset();
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-8 md:py-16 animate-fade-up">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-student-teal/30 bg-student-teal/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-student-teal dark:text-primary-fixed-dim">
            <Mail className="h-3.5 w-3.5" /> Support &amp; Feedback
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface dark:text-white md:text-5xl">
            We'd love to hear from you
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-surface-variant dark:text-white/70">
            Have a question, feedback, or need help with a tutor or study session? Our campus student support team is ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Details Column */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-xs dark:border-white/10 dark:bg-dark-surface">
              <h3 className="font-display text-xl font-bold text-on-surface dark:text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-student-teal/10 text-student-teal dark:text-primary-fixed-dim">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-white/50">
                      Email
                    </span>
                    <p className="mt-0.5 text-sm font-medium text-on-surface dark:text-white">
                      support@studypair.knust.edu.gh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-status-confirmed/10 text-status-confirmed">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-white/50">
                      WhatsApp Support Desk
                    </span>
                    <p className="mt-0.5 text-sm font-medium text-on-surface dark:text-white">
                      +233 (0) 24 123 4567
                    </p>
                    <p className="text-xs text-on-surface-variant dark:text-white/50">
                      Mon – Sat: 8:00 AM – 8:00 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-tutor-purple/10 text-tutor-purple">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-white/50">
                      Campus Base
                    </span>
                    <p className="mt-0.5 text-sm font-medium text-on-surface dark:text-white">
                      KNUST Campus, Kumasi, Ashanti Region, Ghana
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6 dark:border-white/5 dark:bg-white/5">
              <div className="flex items-center gap-2 font-semibold text-sm text-on-surface dark:text-white mb-2">
                <HelpCircle className="h-4 w-4 text-student-teal dark:text-primary-fixed-dim" />
                Frequently Asked
              </div>
              <p className="text-xs text-on-surface-variant dark:text-white/60 leading-relaxed">
                Tutor requests not answered within 48 hours are automatically refreshed. For urgent mid-semester review sessions, look for tutors with the "Open" availability badge.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-8 shadow-sm dark:border-white/10 dark:bg-dark-surface">
              <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white mb-2">
                Send a Message
              </h2>
              <p className="text-sm text-on-surface-variant dark:text-white/60 mb-6">
                Fill out this quick form and our campus coordinators will reply within 24 hours.
              </p>

              {submitted ? (
                <div className="rounded-2xl border border-status-confirmed/30 bg-status-confirmed/10 p-6 text-center animate-fade-up">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-status-confirmed text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg text-on-surface dark:text-white">Message Sent Successfully</h3>
                  <p className="mt-1 text-sm text-on-surface-variant dark:text-white/70">
                    Thank you for reaching out! We will review your message and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-5 rounded-xl bg-student-teal px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      id="name"
                      label="Your Name"
                      placeholder="e.g. Ama Osei"
                      error={errors.name}
                      {...register("name", { required: "Name is required" })}
                    />
                    <FormField
                      id="email"
                      type="email"
                      label="KNUST Student Email"
                      placeholder="name@st.knust.edu.gh"
                      error={errors.email}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@st\.knust\.edu\.gh$/i,
                          message: "Use your @st.knust.edu.gh email",
                        },
                      })}
                    />
                  </div>

                  <FormField
                    id="subject"
                    label="Subject"
                    placeholder="e.g. Question about MATH 151 study session"
                    error={errors.subject}
                    {...register("subject", { required: "Subject is required" })}
                  />

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-on-surface dark:text-white/90">
                      Message Details
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="How can we help you?"
                      className={`w-full resize-none rounded-lg border py-3 px-4 outline-none transition-colors
                        bg-surface-container-lowest text-on-surface placeholder-outline-variant/70
                        dark:bg-white/5 dark:text-white dark:placeholder-white/30
                        ${
                          errors.message
                            ? "border-error"
                            : "border-outline-variant focus:border-student-teal focus:ring-1 focus:ring-student-teal dark:border-white/10"
                        }`}
                      {...register("message", {
                        required: "Please enter your message",
                        minLength: { value: 10, message: "Please provide a bit more detail" },
                      })}
                    />
                    {errors.message && <p className="text-xs text-error">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-student-teal px-6 py-3.5 font-semibold text-white shadow-sm transition-all hover:bg-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
