import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2, Clock, Users, X, Loader2 } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import { INITIAL_SLOTS } from "../../data/tutorData";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TutorMyAvailability() {
  const [slots, setSlots] = useState(INITIAL_SLOTS);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { type: "1-on-1" },
  });

  const type = watch("type");

  const onAddSlot = async (data) => {
    await new Promise((r) => setTimeout(r, 400));
    setSlots((prev) => [
      ...prev,
      {
        id: `s${prev.length + 1}`,
        day: data.day,
        start: data.start,
        end: data.end,
        type: data.type,
        maxSpots: data.type === "group" ? Number(data.maxSpots) : undefined,
      },
    ]);
    reset();
    setShowForm(false);
    // TODO: POST /tutor/availability
  };

  const handleDelete = (id) => {
    setSlots((prev) => prev.filter((s) => s.id !== id));
    // TODO: DELETE /tutor/availability/:id
  };

  return (
    <AppLayout>
      <div className="animate-fade-up pt-6 md:pt-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">My Availability</h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 self-start rounded-xl bg-tutor-purple px-5 py-2.5 text-sm font-medium
              text-white shadow-sm transition-all duration-150 hover:bg-secondary active:scale-95 sm:self-auto"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add Slot"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit(onAddSlot)}
            noValidate
            className="mb-8 flex max-w-xl animate-fade-up flex-col gap-4 rounded-2xl border border-outline-variant
              bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface dark:text-white/90">Day</label>
              <select
                className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 outline-none
                  focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10 dark:bg-white/5 dark:text-white"
                {...register("day", { required: true })}
              >
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface dark:text-white/90">Start Time</label>
                <input
                  placeholder="e.g. 10:00 AM"
                  className={`rounded-lg border px-4 py-3 outline-none bg-surface-container-lowest text-on-surface
                    dark:bg-white/5 dark:text-white ${errors.start ? "border-error" : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"}`}
                  {...register("start", { required: "Required" })}
                />
                {errors.start && <p className="text-xs text-error">{errors.start.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface dark:text-white/90">End Time</label>
                <input
                  placeholder="e.g. 12:00 PM"
                  className={`rounded-lg border px-4 py-3 outline-none bg-surface-container-lowest text-on-surface
                    dark:bg-white/5 dark:text-white ${errors.end ? "border-error" : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"}`}
                  {...register("end", { required: "Required" })}
                />
                {errors.end && <p className="text-xs text-error">{errors.end.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface dark:text-white/90">Session Type</label>
              <div className="flex overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low p-1 dark:border-white/10 dark:bg-white/5">
                {["1-on-1", "group"].map((t) => (
                  <label key={t} className="relative flex-1 cursor-pointer text-center">
                    <input type="radio" value={t} className="peer sr-only" {...register("type")} />
                    <div className={`rounded-md py-2 text-sm font-medium capitalize transition-all duration-150 ${
                      type === t ? "bg-white text-tutor-purple shadow-sm dark:bg-dark-surface" : "text-on-surface-variant dark:text-white/50"
                    }`}>
                      {t}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {type === "group" && (
              <div className="flex flex-col gap-2 animate-fade-up">
                <label className="text-sm font-medium text-on-surface dark:text-white/90">Max Spots</label>
                <input
                  type="number"
                  min={2}
                  placeholder="e.g. 5"
                  className={`rounded-lg border px-4 py-3 outline-none bg-surface-container-lowest text-on-surface
                    dark:bg-white/5 dark:text-white ${errors.maxSpots ? "border-error" : "border-outline-variant focus:border-tutor-purple focus:ring-1 focus:ring-tutor-purple dark:border-white/10"}`}
                  {...register("maxSpots", {
                    required: "Set a max group size",
                    min: { value: 2, message: "Must be at least 2" },
                  })}
                />
                {errors.maxSpots && <p className="text-xs text-error">{errors.maxSpots.message}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-tutor-purple px-6 py-3 font-medium
                text-white transition-all duration-150 hover:bg-secondary active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Plus className="h-[18px] w-[18px]" />}
              Save Slot
            </button>
          </form>
        )}

        <div className="flex max-w-xl flex-col gap-4 pb-8">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-on-surface dark:text-white">{slot.day}</h3>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="rounded-lg p-1.5 text-error/70 transition-colors hover:bg-error/10 hover:text-error"
                >
                  <Trash2 className="h-[18px] w-[18px]" />
                </button>
              </div>
              <div className="mb-3 flex items-center gap-2 text-on-surface-variant dark:text-white/50">
                <Clock className="h-4 w-4" />
                {slot.start} - {slot.end}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    slot.type === "group"
                      ? "bg-tutor-purple/10 text-tutor-purple"
                      : "bg-surface-container-high text-on-surface-variant dark:bg-white/10 dark:text-white/60"
                  }`}
                >
                  {slot.type}
                </span>
                {slot.type === "group" && (
                  <span className="flex items-center gap-1 text-xs text-on-surface-variant dark:text-white/40">
                    <Users className="h-3.5 w-3.5" /> {slot.maxSpots} spots max
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}