import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
    Plus,
    Trash2,
    Users,
    History,
    Loader2,
    MapPin,
    Clock,
    MessageCircle,
    Globe,
    Sparkles,
    BookOpen,
} from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import FormField from "../../components/FormField";
import {
    getCourses,
    addCourse,
    deleteCourse,
    getApplications,
} from "../../lib/store";
import { formatWhatsAppGroupLink } from "../../lib/whatsapp";

export default function TutorMyCourses() {
    const [courses, setCourses] = useState(() => getCourses());
    const [applications, setApplications] = useState(() => getApplications());
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const handleStoreUpdate = () => {
            setCourses(getCourses());
            setApplications(getApplications());
        };
        window.addEventListener("studypair_store_updated", handleStoreUpdate);
        return () =>
            window.removeEventListener(
                "studypair_store_updated",
                handleStoreUpdate
            );
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            applicationId: "",
            format: "in-person",
            type: "1-on-1",
            maxSpots: "5",
        },
    });

    const selectedFormat = watch("format");
    const selectedType = watch("type");

    // Only approved applications that don't already have a listed course
    const approvedAvailable = applications.filter(
        (a) =>
            a.status === "approved" &&
            !courses.some(
                (c) =>
                    c.code.trim().toUpperCase() === a.code.trim().toUpperCase()
            )
    );

    const onAddCourse = async (data) => {
        const application = applications.find(
            (a) => a.id === data.applicationId
        );
        if (!application || application.status !== "approved") return;

        await new Promise((r) => setTimeout(r, 400));

        const newEntry = {
            code: application.code,
            title: application.title,
            description:
                data.description?.trim() ||
                "Peer tutoring session for this course.",
            format: data.format,
            place:
                data.format === "in-person"
                    ? data.place?.trim() || "KNUST Campus"
                    : "Virtual Meeting",
            time: data.time?.trim() || "To be arranged",
            type: data.type,
            maxSpots: data.type === "group" ? Number(data.maxSpots) || 5 : 1,
            whatsappGroupLink:
                data.type === "group"
                    ? formatWhatsAppGroupLink(
                          data.whatsappGroupLink?.trim() || ""
                      )
                    : "",
        };

        addCourse(newEntry);
        reset({
            applicationId: "",
            description: "",
            format: "in-person",
            place: "",
            time: "",
            type: "1-on-1",
            maxSpots: "5",
            whatsappGroupLink: "",
        });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        const updated = deleteCourse(id);
        setCourses(updated);
    };

    return (
        <AppLayout>
            <div className="animate-fade-up pt-6 md:pt-8">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">
                            My Courses
                        </h1>
                        <p className="mt-2 text-on-surface-variant dark:text-white/60">
                            Manage courses you teach, session venues, times, and
                            group WhatsApp links.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="flex items-center gap-2 self-start rounded-xl bg-tutor-purple px-5 py-2.5 text-sm font-medium
              text-white shadow-sm transition-all duration-150 hover:bg-secondary active:scale-95 sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        {showForm ? "Close Form" : "Add Course to Teach"}
                    </button>
                </div>

                {/* Add Course Form */}
                {showForm && (
                    <div className="mb-8 max-w-2xl animate-fade-up rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-md dark:border-white/10 dark:bg-dark-surface">
                        <div className="mb-6 flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-tutor-purple" />
                            <h2 className="font-display text-xl font-bold text-on-surface dark:text-white">
                                Configure New Course Offering
                            </h2>
                        </div>

                        <form
                            onSubmit={handleSubmit(onAddCourse)}
                            noValidate
                            className="flex flex-col gap-5"
                        >
                            {/* Course: picked from approved applications */}
                            {approvedAvailable.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="applicationId"
                                        className="text-sm font-medium text-on-surface dark:text-white/90"
                                    >
                                        Course
                                    </label>
                                    <select
                                        id="applicationId"
                                        className={`w-full rounded-lg border py-3 px-4 outline-none transition-colors
                      bg-surface-container-lowest text-on-surface
                      dark:bg-white/5 dark:text-white
                      ${
                          errors.applicationId
                              ? "border-error"
                              : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"
                      }`}
                                        {...register("applicationId", {
                                            required:
                                                "Select an approved course",
                                        })}
                                    >
                                        <option value="">
                                            Select an approved course
                                        </option>
                                        {approvedAvailable.map((a) => (
                                            <option
                                                key={a.id}
                                                value={a.id}
                                                className="text-black"
                                            >
                                                {a.code} - {a.title}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.applicationId && (
                                        <p className="text-xs text-error">
                                            {errors.applicationId.message}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-xl border border-dashed border-outline-variant p-4 text-sm text-on-surface-variant dark:border-white/10 dark:text-white/60">
                                    No approved courses available to set up.{" "}
                                    <Link
                                        to="/app/tutor/applications"
                                        className="font-semibold text-tutor-purple underline dark:text-purple-300"
                                    >
                                        Apply to teach a course
                                    </Link>{" "}
                                    or wait for a pending application to be
                                    approved.
                                </div>
                            )}

                            {/* Description / What the study session is about */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="description"
                                    className="text-sm font-medium text-on-surface dark:text-white/90"
                                >
                                    What will you be teaching in this course?
                                </label>
                                <textarea
                                    id="description"
                                    rows={2}
                                    placeholder="e.g. Fundamental calculus concepts, differentiation rules, integration, and past examination questions."
                                    className={`w-full resize-none rounded-lg border py-3 px-4 outline-none transition-colors
                    bg-surface-container-lowest text-on-surface placeholder-outline-variant/70
                    dark:bg-white/5 dark:text-white dark:placeholder-white/30
                    ${
                        errors.description
                            ? "border-error"
                            : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"
                    }`}
                                    {...register("description", {
                                        required:
                                            "Please describe what the sessions will cover",
                                        minLength: {
                                            value: 10,
                                            message:
                                                "Add a brief description of what you'll teach",
                                        },
                                    })}
                                />
                                {errors.description && (
                                    <p className="text-xs text-error">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>

                            {/* In-Person vs Virtual Segmented Control */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-on-surface dark:text-white/90">
                                    Session Format
                                </label>
                                <div className="flex overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low p-1 dark:border-white/10 dark:bg-white/5">
                                    {[
                                        {
                                            key: "in-person",
                                            label: "In-Person",
                                            icon: MapPin,
                                        },
                                        {
                                            key: "virtual",
                                            label: "Virtual / Online",
                                            icon: Globe,
                                        },
                                    ].map(({ key, label, icon: Icon }) => (
                                        <label
                                            key={key}
                                            className="relative flex-1 cursor-pointer text-center"
                                        >
                                            <input
                                                type="radio"
                                                value={key}
                                                className="peer sr-only"
                                                {...register("format")}
                                            />
                                            <div
                                                className={`flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all ${
                                                    selectedFormat === key
                                                        ? "bg-white text-tutor-purple shadow-sm dark:bg-dark-surface dark:text-purple-300"
                                                        : "text-on-surface-variant dark:text-white/50"
                                                }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Time & Place Details */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {selectedFormat === "in-person" ? (
                                    <FormField
                                        id="place"
                                        label="Place / Venue (In-Person)"
                                        icon={MapPin}
                                        placeholder="e.g. Library Wing B, Room 402"
                                        error={errors.place}
                                        {...register("place", {
                                            required:
                                                "Please specify the venue/place for in-person sessions",
                                        })}
                                    />
                                ) : (
                                    <FormField
                                        id="place"
                                        label="Virtual Meeting Platform"
                                        icon={Globe}
                                        placeholder="e.g. Google Meet / Zoom"
                                        error={errors.place}
                                        {...register("place", {
                                            required:
                                                "Specify platform (e.g. Google Meet)",
                                        })}
                                    />
                                )}

                                <FormField
                                    id="time"
                                    label="Time & Schedule"
                                    icon={Clock}
                                    placeholder="e.g. Fridays, 3:00 PM - 5:00 PM"
                                    error={errors.time}
                                    {...register("time", {
                                        required:
                                            "Please specify your regular teaching time/slot",
                                    })}
                                />
                            </div>

                            {/* Group vs 1-on-1 */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-on-surface dark:text-white/90">
                                    Session Type
                                </label>
                                <div className="flex overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low p-1 dark:border-white/10 dark:bg-white/5">
                                    {[
                                        {
                                            key: "1-on-1",
                                            label: "1-on-1 Individual Session",
                                        },
                                        {
                                            key: "group",
                                            label: "Group Teaching Session",
                                        },
                                    ].map(({ key, label }) => (
                                        <label
                                            key={key}
                                            className="relative flex-1 cursor-pointer text-center"
                                        >
                                            <input
                                                type="radio"
                                                value={key}
                                                className="peer sr-only"
                                                {...register("type")}
                                            />
                                            <div
                                                className={`rounded-md py-2.5 text-sm font-medium transition-all ${
                                                    selectedType === key
                                                        ? "bg-white text-tutor-purple shadow-sm dark:bg-dark-surface dark:text-purple-300"
                                                        : "text-on-surface-variant dark:text-white/50"
                                                }`}
                                            >
                                                {label}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Group Specific Fields: Max spots & WhatsApp Group Link */}
                            {selectedType === "group" && (
                                <div className="space-y-4 rounded-xl border border-tutor-purple/20 bg-tutor-purple/5 p-4 animate-fade-up">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-tutor-purple">
                                        <Users className="h-4 w-4" /> Group
                                        Session Settings
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <FormField
                                            id="maxSpots"
                                            type="number"
                                            label="Maximum Students"
                                            placeholder="e.g. 6"
                                            error={errors.maxSpots}
                                            {...register("maxSpots", {
                                                required:
                                                    "Set group size limit",
                                                min: {
                                                    value: 2,
                                                    message:
                                                        "Min 2 students for a group",
                                                },
                                            })}
                                        />

                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="whatsappGroupLink"
                                                className="text-sm font-medium text-on-surface dark:text-white/90"
                                            >
                                                WhatsApp Group Invite Link
                                            </label>
                                            <div className="relative">
                                                <MessageCircle className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-status-confirmed" />
                                                <input
                                                    id="whatsappGroupLink"
                                                    placeholder="https://chat.whatsapp.com/..."
                                                    className={`w-full rounded-lg border py-3 pl-10 pr-4 outline-none transition-colors
                            bg-surface-container-lowest text-on-surface placeholder-outline-variant/70
                            dark:bg-white/5 dark:text-white dark:placeholder-white/30
                            ${
                                errors.whatsappGroupLink
                                    ? "border-error"
                                    : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"
                            }`}
                                                    {...register(
                                                        "whatsappGroupLink",
                                                        {
                                                            required:
                                                                "Provide a WhatsApp group link for the group",
                                                            pattern: {
                                                                value: /^(https?:\/\/)?(chat\.whatsapp\.com\/)?[A-Za-z0-9_-]+(\?.*)?$/,
                                                                message:
                                                                    "Enter a valid WhatsApp group link (e.g. https://chat.whatsapp.com/...)",
                                                            },
                                                        }
                                                    )}
                                                />
                                            </div>
                                            {errors.whatsappGroupLink && (
                                                <p className="text-xs text-error">
                                                    {
                                                        errors.whatsappGroupLink
                                                            .message
                                                    }
                                                </p>
                                            )}
                                            <p className="text-xs text-on-surface-variant dark:text-white/60">
                                                When a student's request is
                                                accepted, they will be given a
                                                button to join this WhatsApp
                                                group.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || approvedAvailable.length === 0}
                                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-tutor-purple px-6 py-3.5 font-medium
                  text-white shadow-sm transition-all duration-150 hover:bg-secondary active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-[18px] w-[18px] animate-spin" />{" "}
                                        Saving Course...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-[18px] w-[18px]" />{" "}
                                        Publish Course
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Course Cards List */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 pb-8">
                    {courses.map((course) => {
                        const isGroup = course.type === "group";
                        const isVirtual = course.format === "virtual";

                        return (
                            <div
                                key={course.id}
                                className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-dark-surface"
                            >
                                <div>
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-status-confirmed/10 px-3 py-1 text-xs font-semibold text-status-confirmed">
                                                Active Offering
                                            </span>
                                            <span
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                                    isGroup
                                                        ? "bg-tutor-purple/10 text-tutor-purple"
                                                        : "bg-surface-container-high text-on-surface-variant dark:bg-white/10 dark:text-white/70"
                                                }`}
                                            >
                                                {isGroup
                                                    ? `Group (max ${course.maxSpots || 5})`
                                                    : "1-on-1"}
                                            </span>
                                            <span className="rounded-full bg-student-teal/10 px-2.5 py-0.5 text-xs font-medium text-student-teal dark:text-primary-fixed-dim">
                                                {isVirtual
                                                    ? "Virtual"
                                                    : "In-Person"}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleDelete(course.id)
                                            }
                                            aria-label="Delete course"
                                            className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error dark:text-white/40"
                                        >
                                            <Trash2 className="h-[18px] w-[18px]" />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-on-surface dark:text-white">
                                        {course.code}
                                    </h3>
                                    {course.title && (
                                        <p className="font-medium text-sm text-tutor-purple mb-1">
                                            {course.title}
                                        </p>
                                    )}
                                    <p className="mb-4 text-sm text-on-surface-variant dark:text-white/70 leading-relaxed">
                                        {course.description}
                                    </p>

                                    {/* Schedule & Location Details */}
                                    <div className="mb-4 space-y-2 rounded-xl bg-surface-container-low p-3.5 text-xs text-on-surface-variant dark:bg-white/5 dark:text-white/70">
                                        <div className="flex items-center gap-2 font-medium text-on-surface dark:text-white">
                                            <Clock className="h-3.5 w-3.5 text-tutor-purple flex-shrink-0" />
                                            <span>
                                                {course.time ||
                                                    "Schedule by appointment"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5 text-student-teal flex-shrink-0" />
                                            <span>
                                                {isVirtual
                                                    ? "Virtual Session"
                                                    : course.place ||
                                                      "KNUST Campus"}
                                            </span>
                                        </div>
                                        {isGroup &&
                                            course.whatsappGroupLink && (
                                                <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/30 text-status-confirmed">
                                                    <MessageCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="truncate">
                                                        Group Link:{" "}
                                                        {
                                                            course.whatsappGroupLink
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-outline-variant/50 pt-4 text-sm text-on-surface-variant dark:border-white/10 dark:text-white/50">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="h-4 w-4" />{" "}
                                        {course.students || 0} Students Tutored
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <History className="h-4 w-4" />{" "}
                                        {course.sessions || 0} Sessions
                                        Completed
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {courses.length === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
                        <BookOpen className="h-8 w-8 text-outline dark:text-white/30" />
                        <p className="font-medium text-on-surface dark:text-white">
                            No courses listed yet
                        </p>
                        <p className="text-sm text-neutral-gray dark:text-white/50">
                            Click "Add Course to Teach" above to set up your
                            first tutoring subject.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
