import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import RequestCard from "../components/RequestCard";
import SessionDetailsModal from "../components/SessionDetailsModal";
import { getRequests, updateRequestStatus } from "../lib/store";
import { useTutorMode } from "../context/TutorModeContext";
import { Inbox } from "lucide-react";

const TABS = [
  { key: "active", label: "Active Requests" },
  { key: "history", label: "History" },
];

export default function MyRequests() {
  const { isTutorMode } = useTutorMode();
  const navigate = useNavigate();

  useEffect(() => {
    if (isTutorMode) {
      navigate("/tutor/requests", { replace: true });
    }
  }, [isTutorMode, navigate]);

  const [activeTab, setActiveTab] = useState("active");
  const [requests, setRequests] = useState(() => getRequests());
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    const handleStoreUpdate = (e) => {
      if (!e.detail || e.detail.key === "studypair_requests_v2") {
        setRequests(getRequests());
      }
    };
    window.addEventListener("studypair_store_updated", handleStoreUpdate);
    return () => window.removeEventListener("studypair_store_updated", handleStoreUpdate);
  }, []);

  const handleCancel = (id) => {
    const updated = updateRequestStatus(id, "cancelled");
    if (updated) {
      setRequests(getRequests());
    }
  };

  const filtered = useMemo(() => {
    return requests.filter((r) =>
      activeTab === "active"
        ? r.status === "pending" || r.status === "confirmed" || r.status === "accepted"
        : r.status === "rejected" || r.status === "cancelled" || r.status === "completed"
    );
  }, [requests, activeTab]);

  return (
    <AppLayout>
      <div className="animate-fade-up pt-6 md:pt-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">
            My Requests
          </h1>

          {/* Tabs */}
          <div className="flex w-full gap-2 overflow-x-auto border-b border-outline-variant dark:border-white/10">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === key
                    ? "border-student-teal text-student-teal dark:border-primary-fixed-dim dark:text-primary-fixed-dim"
                    : "border-transparent text-on-surface-variant hover:text-on-surface dark:text-white/50 dark:hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Request list */}
        {filtered.length > 0 ? (
          <div className="flex w-full max-w-2xl flex-col gap-4 pb-8">
            {filtered.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onCancel={handleCancel}
                onViewDetails={(req) => setSelectedSession(req)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
            <Inbox className="h-8 w-8 text-outline dark:text-white/30" />
            <p className="font-medium text-on-surface dark:text-white">
              {activeTab === "active" ? "No active requests yet" : "No history yet"}
            </p>
            <p className="text-sm text-neutral-gray dark:text-white/50">
              {activeTab === "active"
                ? "Browse tutors and request a study session to see it here."
                : "Cancelled, rejected, or completed sessions will show up here."}
            </p>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      <SessionDetailsModal
        isOpen={!!selectedSession}
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </AppLayout>
  );
}