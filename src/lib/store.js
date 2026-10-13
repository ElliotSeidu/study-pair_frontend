/**
 * StudyPair Centralized Storage & Mock API Service
 * ================================================
 * For the Backend Developer:
 * This file acts as the client-side data layer. Each function corresponds directly to
 * a backend REST API endpoint. When connecting to your real backend, simply replace
 * the localStorage operations with your HTTP fetch/axios requests to the endpoints
 * noted in the comments below.
 */
import { INITIAL_SLOTS } from "../data/tutorData";

const STORAGE_KEYS = {
    COURSES: "studypair_courses_v2",
    REQUESTS: "studypair_requests_v2",
    NOTIFICATIONS: "studypair_notifications_v2",
    APPLICATIONS: "studypair_applications_v1",
    AVAILABILITY: "studypair_availability_v1",
};

const escapeHtml = (s = "") =>
    String(s).replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c]
    );

// Initial Seed Data with full session details
const DEFAULT_COURSES = [
    {
        id: "c1",
        code: "MATH 151",
        title: "Calculus & Linear Algebra I",
        description:
            "Fundamental calculus concepts, limit theorems, derivatives, and applications for engineering students.",
        format: "in-person",
        place: "Library Wing B, Room 402",
        time: "Fridays, 3:00 PM - 5:00 PM",
        type: "group",
        maxSpots: 6,
        whatsappGroupLink: "https://chat.whatsapp.com/KNUST-MATH151-Study",
        students: 12,
        sessions: 24,
    },
    {
        id: "c2",
        code: "COE 157",
        title: "Introduction to IT & Computing",
        description:
            "Basic computing architecture, logic gates, and introductory C++ programming.",
        format: "virtual",
        place: "Google Meet",
        time: "Wednesdays, 5:00 PM - 7:00 PM",
        type: "1-on-1",
        maxSpots: 1,
        whatsappGroupLink: "",
        students: 8,
        sessions: 16,
    },
];

const DEFAULT_APPLICATIONS = [
    {
        id: "a1",
        code: "MATH 151",
        title: "Calculus & Linear Algebra I",
        justification: "Scored an A and have tutored juniors informally.",
        appliedOn: "2 Jul 2026",
        status: "approved",
    },
    {
        id: "a2",
        code: "COE 157",
        title: "Introduction to IT & Computing",
        justification: "Strong C++ background and TA experience.",
        appliedOn: "10 Jul 2026",
        status: "approved",
    },
    {
        id: "a3",
        code: "CSM 251",
        title: "Data Structures",
        justification: "Top of my class in Data Structures.",
        appliedOn: "12 Aug 2026",
        status: "pending",
    },
    {
        id: "a4",
        code: "PHY 107",
        title: "Mechanics",
        justification: "Interested in teaching mechanics.",
        appliedOn: "10 Jul 2026",
        status: "rejected",
        reviewNote: "Grade requirement not met for this course.",
    },
];

const DEFAULT_REQUESTS = [
    {
        id: "r1",
        course: "CSM 251: Data Structures",
        courseId: "c3",
        tutorName: "Michael Osei",
        tutorPhone: "0201987654",
        tutorColor: "#0E7490",
        studentName: "Kofi Mensah",
        studentPhone: "0241234567",
        when: "Tomorrow, 2:00 PM",
        type: "1-on-1",
        format: "virtual",
        place: "Google Meet",
        status: "pending",
        topic: "Binary Search Trees and Algorithmic Complexity revision before mid-semesters.",
        whatsappGroupLink: "",
    },
    {
        id: "r2",
        course: "MATH 151: Calculus I",
        courseId: "c1",
        tutorName: "Ama Serwaa",
        tutorPhone: "0244998877",
        tutorColor: "#8B5CF6",
        studentName: "Kofi Mensah",
        studentPhone: "0241234567",
        when: "Friday, 3:00 PM - 5:00 PM",
        type: "group",
        format: "in-person",
        place: "Library Wing B, Room 402",
        status: "confirmed",
        topic: "Calculus integration techniques & practice questions review.",
        whatsappGroupLink: "https://chat.whatsapp.com/KNUST-MATH151-Study",
    },
    {
        id: "r3",
        course: "ECON 101: Intro to Economics",
        courseId: "c4",
        tutorName: "John Doe",
        tutorPhone: "0277654321",
        tutorColor: "#6B7280",
        studentName: "Kofi Mensah",
        studentPhone: "0241234567",
        when: "Today, 4:00 PM",
        type: "1-on-1",
        format: "in-person",
        place: "Great Hall Lawns",
        status: "rejected",
        reason: "Time conflict with another student session.",
        topic: "Microeconomics elasticity and market equilibrium.",
        whatsappGroupLink: "",
    },
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: "n1",
        type: "accepted",
        title: "Request Accepted!",
        message:
            "Your study request for <strong>MATH 151: Calculus I</strong> has been accepted by Ama Serwaa.",
        time: "Just now",
        unread: true,
        tutorName: "Ama Serwaa",
        tutorPhone: "0244998877",
        course: "MATH 151: Calculus I",
        sessionDetails: {
            topic: "Calculus integration techniques & practice questions review.",
            format: "in-person",
            place: "Library Wing B, Room 402",
            time: "Friday, 3:00 PM - 5:00 PM",
            type: "group",
            whatsappGroupLink: "https://chat.whatsapp.com/KNUST-MATH151-Study",
            notes: "Please arrive 5 minutes early with your tutorial worksheet.",
        },
    },
    {
        id: "n2",
        type: "reminder",
        title: "Upcoming Session Reminder",
        message:
            "Reminder: Session for <strong>MATH 151</strong> is scheduled for Friday at 3:00 PM.",
        time: "2 hours ago",
        unread: false,
        tutorName: "Ama Serwaa",
        tutorPhone: "0244998877",
        course: "MATH 151: Calculus I",
        sessionDetails: {
            topic: "Review session & problem set solving.",
            format: "in-person",
            place: "Library Wing B, Room 402",
            time: "Friday, 3:00 PM - 5:00 PM",
            type: "group",
            whatsappGroupLink: "https://chat.whatsapp.com/KNUST-MATH151-Study",
        },
    },
    {
        id: "n3",
        type: "system",
        title: "StudyPair App Update",
        message:
            "You can now download the StudyPair progressive web app to receive session notifications on your device!",
        time: "1 day ago",
        unread: false,
    },
];

function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            localStorage.setItem(key, JSON.stringify(fallback));
            return fallback;
        }
        return JSON.parse(raw);
    } catch (err) {
        console.error(`Error reading ${key} from storage:`, err);
        return fallback;
    }
}

function writeStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        window.dispatchEvent(
            new CustomEvent("studypair_store_updated", { detail: { key } })
        );
    } catch (err) {
        console.error(`Error writing ${key} to storage:`, err);
    }
}

// -------------------------------------------------------------
// Tutor Availability Service
// -------------------------------------------------------------
/**
 * GET /api/tutor/availability
 */
export function getAvailability() {
  return readStorage(STORAGE_KEYS.AVAILABILITY, INITIAL_SLOTS);
}

/**
 * POST /api/tutor/availability
 */
export function addAvailabilitySlot(slot) {
  const created = { id: `s_${Date.now()}`, ...slot };
  writeStorage(STORAGE_KEYS.AVAILABILITY, [...getAvailability(), created]);
  return created;
}

/**
 * DELETE /api/tutor/availability/:id
 */
export function deleteAvailabilitySlot(id) {
  const updated = getAvailability().filter((s) => s.id !== id);
  writeStorage(STORAGE_KEYS.AVAILABILITY, updated);
  return updated;
}

// -------------------------------------------------------------
// Tutor Applications Service
// -------------------------------------------------------------
/**
 * GET /api/tutor/applications
 */
export function getApplications() {
    return readStorage(STORAGE_KEYS.APPLICATIONS, DEFAULT_APPLICATIONS);
}

/**
 * POST /api/tutor/applications
 */
export function addApplication(data) {
    const created = {
        id: `a_${Date.now()}`,
        status: "pending",
        appliedOn: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        ...data,
    };
    writeStorage(STORAGE_KEYS.APPLICATIONS, [created, ...getApplications()]);
    return created;
}

/**
 * PATCH /api/tutor/applications/:id/status  (admin review)
 */
export function updateApplicationStatus(id, status, reviewNote = "") {
    let updatedApp = null;
    const updated = getApplications().map((a) => {
        if (a.id !== id) return a;
        updatedApp = { ...a, status, ...(reviewNote ? { reviewNote } : {}) };
        return updatedApp;
    });
    if (!updatedApp) return null;
    writeStorage(STORAGE_KEYS.APPLICATIONS, updated);

    if (status === "approved" || status === "rejected") {
        const label = `${escapeHtml(updatedApp.code)} - ${escapeHtml(updatedApp.title)}`;
        addNotification({
            type: status === "approved" ? "accepted" : "rejected",
            audience: "tutor", // only shown in tutor mode
            title:
                status === "approved"
                    ? "Application Approved!"
                    : "Application Not Approved",
            message:
                status === "approved"
                    ? `You're approved to teach <strong>${label}</strong>. Set up your sessions in My Courses.`
                    : `Your application for <strong>${label}</strong> wasn't approved.${
                          reviewNote ? ` Reason: ${escapeHtml(reviewNote)}` : ""
                      }`,
        });
    }

    return updatedApp;
}

/**
 * DELETE /api/tutor/applications/:id
 */
export function deleteApplication(id) {
    const updated = getApplications().filter((a) => a.id !== id);
    writeStorage(STORAGE_KEYS.APPLICATIONS, updated);
    return updated;
}

// -------------------------------------------------------------
// Courses Service
// -------------------------------------------------------------
/**
 * GET /api/tutor/courses
 */
export function getCourses() {
    return readStorage(STORAGE_KEYS.COURSES, DEFAULT_COURSES);
}

/**
 * POST /api/tutor/courses
 */
export function addCourse(newCourse) {
    const courses = getCourses();
    const created = {
        id: `c_${Date.now()}`,
        students: 0,
        sessions: 0,
        ...newCourse,
    };
    const updated = [created, ...courses];
    writeStorage(STORAGE_KEYS.COURSES, updated);
    return created;
}

/**
 * DELETE /api/tutor/courses/:id
 */
export function deleteCourse(courseId) {
    const courses = getCourses();
    const updated = courses.filter((c) => c.id !== courseId);
    writeStorage(STORAGE_KEYS.COURSES, updated);
    return updated;
}

// -------------------------------------------------------------
// Requests Service (Student & Tutor)
// -------------------------------------------------------------
/**
 * GET /api/requests
 */
export function getRequests() {
    return readStorage(STORAGE_KEYS.REQUESTS, DEFAULT_REQUESTS);
}

/**
 * POST /api/requests
 */
export function addRequest(requestData) {
    const requests = getRequests();
    const newReq = {
        id: `r_${Date.now()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
        ...requestData,
    };
    const updated = [newReq, ...requests];
    writeStorage(STORAGE_KEYS.REQUESTS, updated);
    return newReq;
}

/**
 * PATCH /api/requests/:id/status
 */
export function updateRequestStatus(requestId, status, optionalReason = "") {
    const requests = getRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) return null;

    const targetReq = requests[reqIndex];
    const updatedReq = {
        ...targetReq,
        status,
        ...(optionalReason ? { reason: optionalReason } : {}),
    };
    requests[reqIndex] = updatedReq;
    writeStorage(STORAGE_KEYS.REQUESTS, requests);

    // If accepted, also automatically generate a notification for the student
    if (status === "accepted" || status === "confirmed") {
        addNotification({
            type: "accepted",
            title: "Request Accepted!",
            message: `Your request for <strong>${targetReq.course}</strong> has been accepted by ${targetReq.tutorName || "your tutor"}.`,
            tutorName: targetReq.tutorName,
            tutorPhone: targetReq.tutorPhone,
            course: targetReq.course,
            sessionDetails: {
                topic: targetReq.topic || `Session for ${targetReq.course}`,
                format: targetReq.format || "in-person",
                place: targetReq.place || "Library",
                time: targetReq.when || "As scheduled",
                type: targetReq.type || "1-on-1",
                whatsappGroupLink: targetReq.whatsappGroupLink || "",
            },
        });
    }

    return updatedReq;
}

// -------------------------------------------------------------
// Notifications Service
// -------------------------------------------------------------
/**
 * GET /api/notifications
 */
export function getNotifications() {
    return readStorage(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
}

/**
 * POST /api/notifications
 */
export function addNotification(notificationData) {
    const notifications = getNotifications();
    const created = {
        id: `n_${Date.now()}`,
        time: "Just now",
        unread: true,
        ...notificationData,
    };
    const updated = [created, ...notifications];
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, updated);

    // Dispatch browser notification if permitted
    if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
    ) {
        try {
            if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then((reg) => {
                    reg.showNotification(created.title, {
                        body: created.message.replace(/<[^>]*>/g, ""),
                        icon: "/favicon.svg",
                        badge: "/favicon.svg",
                        data: { url: "/notifications" },
                    });
                });
            } else {
                new Notification(created.title, {
                    body: created.message.replace(/<[^>]*>/g, ""),
                    icon: "/favicon.svg",
                });
            }
        } catch {
            // Ignore background notification failure
        }
    }

    return created;
}

/**
 * PATCH /api/notifications/:id/read
 */
export function markNotificationAsRead(id) {
    const notifications = getNotifications();
    const updated = notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
    );
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
    return updated;
}

/**
 * POST /api/notifications/clear-all
 */
export function clearAllNotifications() {
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, []);
    return [];
}
