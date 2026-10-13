import { useState, useEffect } from "react";
import {
    Bell as BellIcon,
    X,
    Smartphone,
    Check,
    Send,
    AlertCircle,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import NotificationItem from "../components/NotificationItem";
import SessionDetailsModal from "../components/SessionDetailsModal";
import {
    getNotifications,
    markNotificationAsRead,
    clearAllNotifications,
} from "../lib/store";
import {
    getNotificationPermission,
    requestNotificationPermission,
    sendDeviceNotification,
} from "../lib/notifications";
import { useTutorMode } from "../context/TutorModeContext";

export default function Notifications() {
    const [notifications, setNotifications] = useState(() =>
        getNotifications()
    );
    const [selectedSession, setSelectedSession] = useState(null);
    const [permission, setPermission] = useState(() =>
        getNotificationPermission()
    );
    const [testSent, setTestSent] = useState(false);
    const { isTutorMode } = useTutorMode();
    const visibleNotifications = notifications.filter(
        (n) => n.audience !== "tutor" || isTutorMode
    );

    useEffect(() => {
        const handleStoreUpdate = (e) => {
            if (!e.detail || e.detail.key === "studypair_notifications_v2") {
                setNotifications(getNotifications());
            }
        };
        window.addEventListener("studypair_store_updated", handleStoreUpdate);
        return () =>
            window.removeEventListener(
                "studypair_store_updated",
                handleStoreUpdate
            );
    }, []);

    const handleMarkRead = (id) => {
        const updated = markNotificationAsRead(id);
        setNotifications(updated);
    };

    const handleClearAll = () => {
        const updated = clearAllNotifications();
        setNotifications(updated);
    };

    const handleEnableDeviceNotifications = async () => {
        const res = await requestNotificationPermission();
        setPermission(res);
        if (res === "granted") {
            await sendDeviceNotification("StudyPair Notifications Enabled", {
                body: "You will now receive alerts for tutoring requests and accepted sessions.",
            });
        }
    };

    const handleSendTestNotification = async () => {
        setTestSent(true);
        const sent = await sendDeviceNotification("StudyPair Test Alert", {
            body: "Device notification test succeeded! You are ready to receive real-time study updates.",
        });
        setTimeout(() => setTestSent(false), 3000);
        if (!sent && permission !== "granted") {
            await handleEnableDeviceNotifications();
        }
    };

    return (
        <AppLayout>
            <div className="animate-fade-up pt-6 md:pt-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-on-surface dark:text-white md:text-4xl">
                            Notifications
                        </h1>
                        <p className="mt-2 text-on-surface-variant dark:text-white/60">
                            Stay updated with your study session requests,
                            acceptances, and schedules.
                        </p>
                    </div>
                    {visibleNotifications.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-medium text-student-teal transition-colors hover:bg-surface-container-low dark:text-primary-fixed-dim dark:hover:bg-white/5 sm:self-auto"
                        >
                            <X className="h-4 w-4" />
                            Clear All
                        </button>
                    )}
                </div>

                {/* Device Notifications Banner */}
                <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs dark:border-white/10 dark:bg-dark-surface sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-student-teal/15 text-student-teal dark:text-primary-fixed-dim">
                            <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-on-surface dark:text-white text-sm sm:text-base">
                                Device Notifications
                            </h3>
                            <p className="text-xs text-on-surface-variant dark:text-white/60">
                                {permission === "granted"
                                    ? "Device notifications are active. You'll receive alerts even when the browser is closed."
                                    : permission === "denied"
                                      ? "Notifications are blocked by your browser settings. Please enable them in site settings."
                                      : "Enable system notifications to receive instant updates on your phone or computer."}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {permission === "granted" ? (
                            <button
                                onClick={handleSendTestNotification}
                                className="flex items-center gap-1.5 rounded-xl border border-status-confirmed/40 bg-status-confirmed/10 px-4 py-2 text-xs font-semibold text-status-confirmed transition-colors hover:bg-status-confirmed hover:text-white"
                            >
                                {testSent ? (
                                    <Check className="h-3.5 w-3.5" />
                                ) : (
                                    <Send className="h-3.5 w-3.5" />
                                )}
                                {testSent ? "Alert Sent!" : "Test Notification"}
                            </button>
                        ) : permission === "denied" ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-error">
                                <AlertCircle className="h-4 w-4" /> Blocked in
                                browser
                            </span>
                        ) : (
                            <button
                                onClick={handleEnableDeviceNotifications}
                                className="rounded-xl bg-student-teal px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-primary"
                            >
                                Enable Notifications
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                {visibleNotifications.length > 0 ? (
                    <div className="flex max-w-2xl flex-col gap-3.5 pb-8">
                        {visibleNotifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                onRead={handleMarkRead}
                                onViewDetails={(details) =>
                                    setSelectedSession(details)
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
                        <BellIcon className="h-8 w-8 text-outline dark:text-white/30" />
                        <p className="font-medium text-on-surface dark:text-white">
                            You're all caught up
                        </p>
                        <p className="text-sm text-neutral-gray dark:text-white/50">
                            No new notifications right now.
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
