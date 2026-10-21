import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Search, ArrowRight, Filter } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import TutorCard from "../components/TutorCard";
import { MOCK_TUTORS } from "../data/tutors";
import { useTutorMode } from "../context/TutorModeContext";

const LEVELS = ["100", "200", "300", "400"];

export default function BrowseTutors() {
  const { isTutorMode } = useTutorMode();
  const [query, setQuery] = useState("");
  const [activeLevels, setActiveLevels] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");

  // Extract all unique course tags from tutors
  const availableCourses = useMemo(() => {
    const set = new Set();
    MOCK_TUTORS.forEach((t) => t.tags?.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, []);

  const toggleLevel = (lvl) => {
    setActiveLevels((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const handleResetFilters = () => {
    setQuery("");
    setActiveLevels([]);
    setSelectedCourse("all");
  };

  const filteredTutors = useMemo(() => {
    return MOCK_TUTORS.filter((t) => {
      const matchesLevel = activeLevels.length === 0 || activeLevels.includes(String(t.level));
      const matchesCourse = selectedCourse === "all" || t.tags.includes(selectedCourse);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.program.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesLevel && matchesCourse && matchesQuery;
    });
  }, [query, activeLevels, selectedCourse]);

  if (isTutorMode) {
    return <Navigate to="/app/tutor/requests" replace />;
  }

  return (
    <AppLayout>
      <div className="animate-fade-up pt-6 md:pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">
              Find a Tutor
            </h1>
            <p className="mt-2 text-lg text-neutral-gray dark:text-white/60">
              Connect with peers to boost your academic performance.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-gray dark:text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search for courses, subjects, or tutor names..."
              className="w-full rounded-2xl border border-surface-container-highest bg-surface-container-lowest py-4 pl-12 pr-14
                text-on-surface shadow-sm outline-none transition-all placeholder:text-neutral-gray
                focus:border-transparent focus:ring-2 focus:ring-student-teal
                dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-12 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant hover:text-on-surface dark:text-white/50"
              >
                Clear
              </button>
            )}
            <button
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-student-teal p-2.5 text-white shadow-sm transition-colors hover:bg-primary"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="mr-1 text-sm font-medium text-neutral-gray dark:text-white/50">Filters:</span>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((lvl) => {
                const active = activeLevels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    onClick={() => toggleLevel(lvl)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? "border-student-teal bg-student-teal/10 text-student-teal dark:border-primary-fixed-dim dark:bg-primary-fixed-dim/10 dark:text-primary-fixed-dim"
                        : "border-surface-container-highest bg-surface-container-lowest text-neutral-gray hover:border-student-teal hover:text-student-teal dark:border-white/10 dark:bg-white/5 dark:text-white/50 dark:hover:border-primary-fixed-dim dark:hover:text-primary-fixed-dim"
                    }`}
                  >
                    {lvl} Level
                  </button>
                );
              })}
            </div>

            {/* Course Filter Dropdown */}
            <div className="relative ml-auto flex items-center">
              <div className="flex items-center gap-2 rounded-xl border border-surface-container-highest bg-surface-container-lowest px-3 py-2 text-sm font-medium text-on-surface shadow-xs transition-colors hover:border-student-teal focus-within:border-student-teal focus-within:ring-1 focus-within:ring-student-teal dark:border-white/10 dark:bg-dark-surface dark:text-white dark:hover:border-primary-fixed-dim">
                <Filter className="h-4 w-4 text-student-teal dark:text-primary-fixed-dim flex-shrink-0" />
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="bg-transparent text-sm font-medium outline-none cursor-pointer pr-3 text-on-surface dark:text-white dark:bg-dark-surface appearance-none"
                  aria-label="Filter by course"
                >
                  <option value="all" className="bg-surface text-on-surface dark:bg-dark-surface dark:text-white">
                    All Courses
                  </option>
                  {availableCourses.map((c) => (
                    <option key={c} value={c} className="bg-surface text-on-surface dark:bg-dark-surface dark:text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tutor grid */}
        {filteredTutors.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
            <p className="font-medium text-on-surface dark:text-white">No tutors match your filters</p>
            <p className="text-sm text-neutral-gray dark:text-white/50">Try clearing level, course filters, or search terms.</p>
            <button
              onClick={handleResetFilters}
              className="mt-2 rounded-xl bg-student-teal px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {filteredTutors.length > 0 && (
          <div className="mt-8 flex flex-col items-center gap-2 justify-center pb-4 text-center">
            <p className="text-xs text-neutral-gray dark:text-white/40">
              Showing {filteredTutors.length} verified KNUST peer tutor{filteredTutors.length === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}