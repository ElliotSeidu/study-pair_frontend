import { useState, useEffect } from "react";
import { Clock, MessageSquare, Check, X, Users, MapPin } from "lucide-react";
import AppLayout from "../../components/layout/AppLayout";
import WhatsAppButton from "../../components/WhatsAppButton";
import { getRequests, updateRequestStatus } from "../../lib/store";
import { sendDeviceNotification } from "../../lib/notifications";

export default function TutorIncomingRequests() {
  const [requests, setRequests] = useState(() => {
    return getRequests().filter((r) => r.status === "pending" || r.status === "confirmed" || r.status === "accepted");
  });

  useEffect(() => {
    const handleStoreUpdate = (e) => {
      if (!e.detail || e.detail.key === "studypair_requests_v2") {
        setRequests(
          getRequests().filter((r) => r.status === "pending" || r.status === "confirmed" || r.status === "accepted")
        );
      }
    };
    window.addEventListener("studypair_store_updated", handleStoreUpdate);
    return () => window.removeEventListener("studypair_store_updated", handleStoreUpdate);
  }, []);

  const newCount = requests.filter((r) => r.status === "pending").length;

  const respond = async (id, status) => {
    const updated = updateRequestStatus(id, status);
    if (updated) {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

      if (status === "accepted") {
        await sendDeviceNotification("Study Session Accepted!", {
          body: `You accepted ${updated.studentName || "a student"}'s request for ${updated.course}.`,
        });
      }
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-up pt-6 md:pt-8">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">
            Incoming Requests
          </h1>
          {newCount > 0 && (
            <span className="rounded-full bg-tutor-purple/10 px-3 py-1 text-sm font-semibold text-tutor-purple">
              {newCount} New
            </span>
          )}
        </div>
        <p className="mb-8 -mt-4 text-on-surface-variant dark:text-white/60">
          Review, accept, or decline study session bookings from KNUST students.
        </p>

        <div className="flex max-w-2xl flex-col gap-4 pb-8">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`rounded-2xl border-t-4 border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-opacity
                dark:border-white/10 dark:bg-dark-surface ${req.status !== "pending" ? "opacity-85" : ""}`}
              style={{ borderTopColor: req.status === "pending" ? "#8B5CF6" : undefined }}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full font-bold text-white shadow-xs"
                    style={{ backgroundColor: req.avatarColor || "#8B5CF6" }}
                  >
                    {req.studentName ? req.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2) : "S"}
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface dark:text-white">{req.studentName}</h3>
                    <p className="text-sm font-semibold text-tutor-purple">{req.course}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div className="mb-4 rounded-xl bg-surface-container-low p-4 dark:bg-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-on-surface dark:text-white">
                  <Clock className="h-4 w-4 text-tutor-purple" /> {req.when}
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-white/60">
                  <MapPin className="h-3.5 w-3.5 text-student-teal" />
                  <span>{req.place || req.location || "KNUST Campus"}</span>
                  <span>•</span>
                  <span>{req.type === "group" ? "Group Session" : "1-on-1 Individual"}</span>
                </div>
                {req.topic && (
                  <p className="text-xs text-on-surface dark:text-white/80 pt-1">
                    <span className="font-semibold">Requested Topic:</span> {req.topic}
                  </p>
                )}
                {req.message && (
                  <div className="mt-2 flex items-start gap-2 text-xs italic text-on-surface-variant dark:text-white/60">
                    <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    “{req.message}”
                  </div>
                )}
              </div>

              {req.status === "pending" ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => respond(req.id, "rejected")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant py-3 font-medium
                      text-on-surface-variant transition-colors hover:bg-error/5 hover:text-error dark:border-white/10 dark:text-white/60"
                  >
                    <X className="h-4 w-4" /> Decline
                  </button>
                  <button
                    onClick={() => respond(req.id, "accepted")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-status-confirmed py-3 font-medium
                      text-white shadow-sm transition-colors hover:bg-status-confirmed/90"
                  >
                    <Check className="h-4 w-4" /> Accept Session
                  </button>
                </div>
              ) : req.status === "accepted" || req.status === "confirmed" ? (
                <WhatsAppButton
                  phone={req.studentPhone}
                  message={`Hi ${req.studentName}, this is your tutor for ${req.course} on StudyPair regarding your accepted session (${req.when}).`}
                  label="Message Student on WhatsApp"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-status-confirmed py-3 font-medium text-white shadow-sm transition-colors hover:bg-status-confirmed/90"
                />
              ) : null}
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
            <Users className="h-8 w-8 text-outline dark:text-white/30" />
            <p className="font-medium text-on-surface dark:text-white">No incoming requests</p>
            <p className="text-sm text-neutral-gray dark:text-white/50">
              When students book sessions for your courses, they will appear here.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-status-pending/10 text-status-pending border-status-pending/20",
    accepted: "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
    confirmed: "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
    rejected: "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
  };
  const labels = { pending: "Pending", accepted: "Accepted", confirmed: "Accepted", rejected: "Declined" };
  return (
    <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${styles[status] || styles.pending}`}>
      {labels[status] || status}
    </span>
  );
}