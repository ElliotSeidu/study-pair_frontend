/**
 * ============================================================================
 * ⚠️ BACKEND DEVELOPER NOTICE: STRICT ADMIN ACCESS CONTROL REQUIRED
 * ============================================================================
 * CRITICAL SECURITY REQUIREMENT:
 * Ensure that ONLY authenticated administrators (users with valid administrative
 * credentials and the 'admin' role in their authentication token / session) can
 * log into or view this admin page and make calls to administrative API endpoints.
 *
 * Requirements for Backend Implementation:
 * 1. Authenticate user credentials and verify role === 'admin' before granting access.
 * 2. Protect all administrative REST API endpoints (/api/admin/*, /api/users/*, etc.)
 *    with backend authorization middleware (reject unauthorized with 403 Forbidden).
 * 3. Restrict frontend route in App.jsx using <AdminProtectedRoute>.
 * ============================================================================
 */
import { useState, useEffect } from "react";
import {
    GraduationCap,
    Award,
    CalendarCheck,
    TrendingUp,
    CheckCircle2,
    Flag,
    Search,
    Check,
    X,
    Save,
    Shield,
    Filter,
    ClipboardCheck,
} from "lucide-react";
import AdminLayout from "../components/layout/AdminLayout";
import { getApplications, updateApplicationStatus } from "../lib/store";

const INITIAL_STATS = [
    {
        label: "Total Students",
        value: "1,240",
        change: "+5.2%",
        icon: GraduationCap,
        color: "text-student-teal",
        bg: "bg-student-teal/10",
    },
    {
        label: "Active Tutors",
        value: "85",
        change: "+2.1%",
        icon: Award,
        color: "text-tutor-purple",
        bg: "bg-tutor-purple/10",
    },
    {
        label: "Sessions Today",
        value: "12",
        change: "+15%",
        icon: CalendarCheck,
        color: "text-status-pending",
        bg: "bg-status-pending/10",
    },
];

const INITIAL_USERS = [
    {
        id: "u1",
        name: "Ama Serwaa",
        email: "aserwaa@st.knust.edu.gh",
        role: "Tutor",
        course: "MATH 151",
        status: "Active",
        rating: "4.9",
    },
    {
        id: "u2",
        name: "Kwame Osei",
        email: "kosei@st.knust.edu.gh",
        role: "Student",
        course: "COE 251",
        status: "Active",
        rating: "N/A",
    },
    {
        id: "u3",
        name: "Kofi Mensah",
        email: "kmensah@st.knust.edu.gh",
        role: "Student",
        course: "ECON 101",
        status: "Active",
        rating: "N/A",
    },
    {
        id: "u4",
        name: "Abena Darko",
        email: "adarko@st.knust.edu.gh",
        role: "Tutor",
        course: "CS 101",
        status: "Pending Verification",
        rating: "5.0",
    },
    {
        id: "u5",
        name: "Emmanuel Antwi",
        email: "eantwi@st.knust.edu.gh",
        role: "Tutor",
        course: "PHYS 151",
        status: "Active",
        rating: "4.8",
    },
    {
        id: "u6",
        name: "Yaa Asantewaa",
        email: "yasantewaa@st.knust.edu.gh",
        role: "Student",
        course: "MATH 151",
        status: "Suspended",
        rating: "N/A",
    },
];

const INITIAL_REPORTS = [
    {
        id: "r1",
        title: "Inappropriate Conduct",
        time: "10m ago",
        desc: "User reported a tutor for unprofessional behavior during a calculus session in the library.",
        priority: "high",
        reporter: "Kwame Osei",
        target: "Emmanuel Antwi",
        status: "Pending",
    },
    {
        id: "r2",
        title: "Payment Issue / Misunderstanding",
        time: "2h ago",
        desc: "Student claims tutor requested payment for peer session which is designated free under campus rules.",
        priority: "medium",
        reporter: "Kofi Mensah",
        target: "Ama Serwaa",
        status: "Pending",
    },
    {
        id: "r3",
        title: "Technical Glitch / Dead Link",
        time: "Yesterday",
        desc: "WhatsApp invite link was invalid and student was unable to enter the study group.",
        priority: "low",
        reporter: "Yaa Asantewaa",
        target: "System",
        status: "Pending",
    },
];

const PRIORITY_STYLES = {
    high: "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
    medium: "bg-status-pending/10 text-status-pending border-status-pending/20",
    low: "bg-surface-container-high text-on-surface-variant dark:bg-white/10 dark:text-white/50 border-outline-variant/30",
};

const APPLICATION_STATUS_STYLES = {
    pending:
        "bg-status-pending/10 text-status-pending border-status-pending/20",
    approved:
        "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20",
    rejected:
        "bg-status-rejected/10 text-status-rejected border-status-rejected/20",
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [activityRange, setActivityRange] = useState("7d");
    const [users, setUsers] = useState(INITIAL_USERS);
    const [reports, setReports] = useState(INITIAL_REPORTS);
    const [userSearch, setUserSearch] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState("all");
    const [selectedReport, setSelectedReport] = useState(null);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
    const [applications, setApplications] = useState(() => getApplications());
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectNote, setRejectNote] = useState("");

    useEffect(() => {
        const refresh = () => setApplications(getApplications());
        window.addEventListener("studypair_store_updated", refresh);
        return () =>
            window.removeEventListener("studypair_store_updated", refresh);
    }, []);

    const pendingApplications = applications.filter(
        (a) => a.status === "pending"
    );
    const pendingReports = reports.filter((r) => r.status === "Pending");

    const handleApproveApplication = (id) => {
        updateApplicationStatus(id, "approved");
    };

    const handleConfirmReject = (id) => {
        updateApplicationStatus(id, "rejected", rejectNote.trim());
        setRejectingId(null);
        setRejectNote("");
    };

    const alerts = [
        ...(pendingApplications.length > 0
            ? [
                  {
                      id: "applications",
                      title: `${pendingApplications.length} Pending Application${pendingApplications.length > 1 ? "s" : ""}`,
                      body: "Tutor applications are waiting for review.",
                      tab: "applications",
                  },
              ]
            : []),
        ...(pendingReports.length > 0
            ? [
                  {
                      id: "reports",
                      title: `${pendingReports.length} Pending Report${pendingReports.length > 1 ? "s" : ""}`,
                      body: "New reports require admin review.",
                      tab: "reports",
                  },
              ]
            : []),
    ];

    // System settings state
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        publicRegistration: true,
        requireKnustEmail: true,
        whatsappIntegration: true,
        pushNotifications: true,
    });

    const handleResolveReport = (reportId) => {
        setReports((prev) =>
            prev.map((r) =>
                r.id === reportId ? { ...r, status: "Resolved" } : r
            )
        );
        if (selectedReport?.id === reportId) {
            setSelectedReport((prev) =>
                prev ? { ...prev, status: "Resolved" } : null
            );
        }
    };

    const handleDismissReport = (reportId) => {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        if (selectedReport?.id === reportId) {
            setSelectedReport(null);
        }
    };

    const toggleUserStatus = (userId) => {
        setUsers((prev) =>
            prev.map((u) => {
                if (u.id === userId) {
                    const nextStatus =
                        u.status === "Active" ? "Suspended" : "Active";
                    return { ...u, status: nextStatus };
                }
                return u;
            })
        );
    };

    const verifyTutor = (userId) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, status: "Active" } : u))
        );
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        setSaveSuccessMsg("System configuration saved successfully!");
        setTimeout(() => setSaveSuccessMsg(""), 4000);
    };

    // Filtered users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
            u.course.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole =
            userRoleFilter === "all" ||
            (userRoleFilter === "tutors" && u.role === "Tutor") ||
            (userRoleFilter === "students" && u.role === "Student");
        return matchesSearch && matchesRole;
    });

    const activityData =
        activityRange === "7d"
            ? [
                  { day: "Mon", count: 32 },
                  { day: "Tue", count: 54 },
                  { day: "Wed", count: 42 },
                  { day: "Thu", count: 78 },
                  { day: "Fri", count: 65 },
                  { day: "Sat", count: 96 },
                  { day: "Sun", count: 82 },
              ]
            : [
                  { day: "Wk 1", count: 210 },
                  { day: "Wk 2", count: 340 },
                  { day: "Wk 3", count: 480 },
                  { day: "Wk 4", count: 590 },
              ];

    const maxActivity = Math.max(...activityData.map((d) => d.count), 1);

    return (
        <AdminLayout
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            badges={{
                applications: pendingApplications.length,
                reports: pendingReports.length,
            }}
            alerts={alerts}
        >
            <div className="animate-fade-up flex flex-col gap-6">
                {/* ===================== TAB: DASHBOARD ===================== */}
                {activeTab === "dashboard" && (
                    <>
                        <div>
                            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
                                System Overview
                            </h2>
                            <p className="mt-1 text-sm text-on-surface-variant dark:text-white/60">
                                Real-time metrics, system health, and moderation
                                alerts for StudyPair.
                            </p>
                        </div>

                        {/* Stat cards */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {INITIAL_STATS.map(
                                ({
                                    label,
                                    value,
                                    change,
                                    icon: Icon,
                                    color,
                                    bg,
                                }) => (
                                    <div
                                        key={label}
                                        className="flex flex-col justify-between rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color}`}
                                            >
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            {change && (
                                                <span className="flex items-center gap-1 text-xs font-semibold text-status-confirmed">
                                                    <TrendingUp className="h-3.5 w-3.5" />{" "}
                                                    {change}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant dark:text-white/50">
                                                {label}
                                            </p>
                                            <p className="mt-1 font-display text-3xl font-bold text-on-surface dark:text-white">
                                                {value}
                                            </p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Main grid */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="flex flex-col gap-6 lg:col-span-2">
                                {/* System Health */}
                                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface md:flex-row">
                                    <div className="flex w-full items-center gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-status-confirmed/10 text-status-confirmed">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-on-surface dark:text-white">
                                                All Systems Operational
                                            </h3>
                                            <p className="text-xs text-on-surface-variant dark:text-white/60">
                                                KNUST authentication, database
                                                sync, and PWA push workers
                                                active.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex w-full gap-6 border-t border-outline-variant/50 pt-4 md:w-auto md:border-l md:border-t-0 md:pl-6 md:pt-0 dark:border-white/10">
                                        <div>
                                            <span className="text-xs text-on-surface-variant dark:text-white/40">
                                                Uptime
                                            </span>
                                            <p className="font-bold text-on-surface dark:text-white">
                                                99.9%
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-on-surface-variant dark:text-white/40">
                                                API Latency
                                            </span>
                                            <p className="font-bold text-on-surface dark:text-white">
                                                38ms
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity chart with functional filters */}
                                <div className="flex flex-col rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-on-surface dark:text-white">
                                                Active Study Sessions
                                            </h3>
                                            <p className="text-xs text-on-surface-variant dark:text-white/50">
                                                Peer tutoring frequency over
                                                time
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-xl border border-outline-variant/60 bg-surface-container-low p-1 dark:border-white/10 dark:bg-white/5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActivityRange("7d")
                                                }
                                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                                                    activityRange === "7d"
                                                        ? "bg-admin-blue text-white shadow-xs"
                                                        : "text-on-surface-variant hover:text-on-surface dark:text-white/60"
                                                }`}
                                            >
                                                7 Days
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActivityRange("30d")
                                                }
                                                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                                                    activityRange === "30d"
                                                        ? "bg-admin-blue text-white shadow-xs"
                                                        : "text-on-surface-variant hover:text-on-surface dark:text-white/60"
                                                }`}
                                            >
                                                30 Days
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex h-56 items-end justify-between gap-3 pt-4">
                                        {activityData.map(({ day, count }) => {
                                            const pct = Math.round(
                                                (count / maxActivity) * 100
                                            );
                                            return (
                                                <div
                                                    key={day}
                                                    className="flex flex-1 flex-col items-center gap-2"
                                                >
                                                    <span className="text-[10px] font-semibold text-on-surface-variant dark:text-white/50">
                                                        {count}
                                                    </span>
                                                    <div className="w-full rounded-t-lg bg-surface-container-high dark:bg-white/10 h-40 flex items-end">
                                                        <div
                                                            className="w-full rounded-t-lg bg-admin-blue transition-all duration-500 hover:bg-admin-blue/80"
                                                            style={{
                                                                height: `${pct}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-on-surface-variant dark:text-white/60">
                                                        {day}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Reports panel with interactive actions */}
                            <div className="flex flex-col rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm dark:border-white/10 dark:bg-dark-surface">
                                <div className="flex items-center justify-between border-b border-outline-variant/50 p-6 dark:border-white/10">
                                    <h3 className="flex items-center gap-2 font-semibold text-on-surface dark:text-white">
                                        <Flag className="h-5 w-5 text-status-rejected" />{" "}
                                        Moderation Queue
                                    </h3>
                                    <span className="rounded-full bg-status-rejected/10 px-2.5 py-0.5 text-xs font-bold text-status-rejected">
                                        {
                                            reports.filter(
                                                (r) => r.status === "Pending"
                                            ).length
                                        }{" "}
                                        Pending
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 p-4">
                                    {reports.slice(0, 3).map((r) => (
                                        <div
                                            key={r.id}
                                            className="rounded-xl border border-outline-variant/40 bg-surface-container-low/40 p-4 transition-all hover:bg-surface-container-high dark:border-white/5 dark:bg-white/5"
                                        >
                                            <div className="mb-1 flex items-start justify-between">
                                                <span className="text-sm font-semibold text-on-surface dark:text-white">
                                                    {r.title}
                                                </span>
                                                <span className="text-xs text-on-surface-variant dark:text-white/40">
                                                    {r.time}
                                                </span>
                                            </div>
                                            <p className="mb-3 line-clamp-2 text-xs text-on-surface-variant dark:text-white/60">
                                                {r.desc}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${PRIORITY_STYLES[r.priority]}`}
                                                >
                                                    {r.priority}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedReport(r)
                                                    }
                                                    className="rounded-lg bg-admin-blue/10 px-3 py-1 text-xs font-semibold text-admin-blue hover:bg-admin-blue hover:text-white transition-colors dark:text-blue-300"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto border-t border-outline-variant/50 p-4 dark:border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("reports")}
                                        className="w-full rounded-xl border border-admin-blue/40 bg-admin-blue/5 py-2.5 text-xs font-bold uppercase tracking-wider text-admin-blue transition-colors hover:bg-admin-blue hover:text-white dark:border-blue-400/30 dark:text-blue-300"
                                    >
                                        View All Reports &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ===================== TAB: USERS ===================== */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
                                    User Directory
                                </h2>
                                <p className="mt-1 text-sm text-on-surface-variant dark:text-white/60">
                                    Manage registered students, tutor
                                    verifications, and account statuses.
                                </p>
                            </div>
                            <span className="self-start rounded-full bg-admin-blue/10 px-3.5 py-1 text-xs font-bold text-admin-blue dark:text-blue-300 sm:self-auto">
                                {filteredUsers.length} Users Listed
                            </span>
                        </div>

                        {/* Filter controls */}
                        <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4 dark:border-white/10 dark:bg-dark-surface sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant dark:text-white/40" />
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) =>
                                        setUserSearch(e.target.value)
                                    }
                                    placeholder="Search by name, email, or course..."
                                    className="w-full rounded-xl border border-outline-variant/50 bg-surface py-2 pl-10 pr-4 text-sm outline-none transition-colors focus:border-admin-blue dark:border-white/10 dark:bg-white/5 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-on-surface-variant dark:text-white/40" />
                                <div className="flex rounded-xl border border-outline-variant/60 bg-surface p-1 dark:border-white/10 dark:bg-white/5">
                                    {["all", "students", "tutors"].map(
                                        (role) => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() =>
                                                    setUserRoleFilter(role)
                                                }
                                                className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-colors ${
                                                    userRoleFilter === role
                                                        ? "bg-admin-blue text-white shadow-xs"
                                                        : "text-on-surface-variant hover:text-on-surface dark:text-white/60"
                                                }`}
                                            >
                                                {role}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-lowest shadow-sm dark:border-white/10 dark:bg-dark-surface">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-outline-variant/50 bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                                        <tr>
                                            <th className="px-6 py-4">
                                                Name & Email
                                            </th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">
                                                Primary Subject
                                            </th>
                                            <th className="px-6 py-4">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-right">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/30 dark:divide-white/5">
                                        {filteredUsers.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="hover:bg-surface-container-high/40 dark:hover:bg-white/5"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-on-surface dark:text-white">
                                                        {u.name}
                                                    </p>
                                                    <p className="text-xs text-on-surface-variant dark:text-white/50">
                                                        {u.email}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                            u.role === "Tutor"
                                                                ? "bg-tutor-purple/15 text-tutor-purple dark:bg-tutor-purple/25 dark:text-purple-300"
                                                                : "bg-student-teal/15 text-student-teal dark:bg-student-teal/25 dark:text-primary-fixed-dim"
                                                        }`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-on-surface dark:text-white/80">
                                                    {u.course}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                            u.status ===
                                                            "Active"
                                                                ? "bg-status-confirmed/10 text-status-confirmed"
                                                                : u.status ===
                                                                    "Pending Verification"
                                                                  ? "bg-status-pending/10 text-status-pending"
                                                                  : "bg-status-rejected/10 text-status-rejected"
                                                        }`}
                                                    >
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {u.status ===
                                                            "Pending Verification" && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    verifyTutor(
                                                                        u.id
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg bg-status-confirmed px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-status-confirmed/90"
                                                            >
                                                                <Check className="h-3.5 w-3.5" />{" "}
                                                                Verify
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                toggleUserStatus(
                                                                    u.id
                                                                )
                                                            }
                                                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                                u.status ===
                                                                "Active"
                                                                    ? "border-status-rejected/30 text-status-rejected hover:bg-status-rejected/10"
                                                                    : "border-status-confirmed/30 text-status-confirmed hover:bg-status-confirmed/10"
                                                            }`}
                                                        >
                                                            {u.status ===
                                                            "Active"
                                                                ? "Suspend"
                                                                : "Activate"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===================== TAB: APPLICATIONS ===================== */}
                {activeTab === "applications" && (
                    <div className="space-y-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
                                    Tutor Applications
                                </h2>
                                <p className="mt-1 text-sm text-on-surface-variant dark:text-white/60">
                                    Review requests from students who want to
                                    teach a course.
                                </p>
                            </div>
                            <span className="self-start rounded-full bg-admin-blue/10 px-3.5 py-1 text-xs font-bold text-admin-blue dark:text-blue-300 sm:self-auto">
                                {pendingApplications.length} Pending
                            </span>
                        </div>

                        {applications.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant py-16 text-center dark:border-white/10">
                                <ClipboardCheck className="h-8 w-8 text-outline dark:text-white/30" />
                                <p className="font-medium text-on-surface dark:text-white">
                                    No applications yet
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {[...applications]
                                    .sort(
                                        (a, b) =>
                                            (a.status === "pending" ? 0 : 1) -
                                            (b.status === "pending" ? 0 : 1)
                                    )
                                    .map((app) => (
                                        <div
                                            key={app.id}
                                            className="flex flex-col gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-sm dark:border-white/10 dark:bg-dark-surface sm:p-6"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-on-surface dark:text-white">
                                                        {app.code} - {app.title}
                                                    </h3>
                                                    <p className="mt-0.5 text-xs text-on-surface-variant dark:text-white/50">
                                                        {app.applicantName ||
                                                            "Tutor applicant"}{" "}
                                                        · Applied{" "}
                                                        {app.appliedOn}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold capitalize ${APPLICATION_STATUS_STYLES[app.status]}`}
                                                >
                                                    {app.status}
                                                </span>
                                            </div>

                                            {app.justification && (
                                                <div className="rounded-xl bg-surface-container-low p-4 dark:bg-white/5">
                                                    <p className="mb-1 text-xs uppercase tracking-wider text-on-surface-variant dark:text-white/50">
                                                        Why they're qualified
                                                    </p>
                                                    <p className="text-sm leading-relaxed text-on-surface dark:text-white/90">
                                                        {app.justification}
                                                    </p>
                                                </div>
                                            )}

                                            {app.status === "rejected" &&
                                                app.reviewNote && (
                                                    <p className="text-xs italic text-on-surface-variant dark:text-white/40">
                                                        Note: {app.reviewNote}
                                                    </p>
                                                )}

                                            {app.status === "pending" &&
                                                (rejectingId === app.id ? (
                                                    <div className="flex flex-col gap-3 border-t border-outline-variant/40 pt-4 dark:border-white/10">
                                                        <label
                                                            htmlFor={`reject-${app.id}`}
                                                            className="text-xs font-semibold text-on-surface dark:text-white/90"
                                                        >
                                                            Reason for rejection
                                                            (shown to the tutor)
                                                        </label>
                                                        <textarea
                                                            id={`reject-${app.id}`}
                                                            rows={2}
                                                            value={rejectNote}
                                                            onChange={(e) =>
                                                                setRejectNote(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="e.g. Grade requirement not met for this course."
                                                            className="w-full resize-none rounded-lg border border-outline-variant/60 bg-surface px-3 py-2 text-sm outline-none focus:border-admin-blue dark:border-white/10 dark:bg-white/5 dark:text-white"
                                                        />
                                                        <div className="flex flex-wrap justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setRejectingId(
                                                                        null
                                                                    );
                                                                    setRejectNote(
                                                                        ""
                                                                    );
                                                                }}
                                                                className="rounded-xl border border-outline-variant px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high dark:border-white/10 dark:text-white"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleConfirmReject(
                                                                        app.id
                                                                    )
                                                                }
                                                                className="rounded-xl bg-status-rejected px-4 py-2 text-xs font-semibold text-white hover:bg-status-rejected/90"
                                                            >
                                                                Confirm Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap justify-end gap-2 border-t border-outline-variant/40 pt-4 dark:border-white/10">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setRejectingId(
                                                                    app.id
                                                                );
                                                                setRejectNote(
                                                                    ""
                                                                );
                                                            }}
                                                            className="rounded-xl border border-status-rejected/30 px-4 py-2 text-xs font-semibold text-status-rejected hover:bg-status-rejected/10"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleApproveApplication(
                                                                    app.id
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 rounded-xl bg-status-confirmed px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-status-confirmed/90"
                                                        >
                                                            <Check className="h-3.5 w-3.5" />{" "}
                                                            Approve
                                                        </button>
                                                    </div>
                                                ))}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===================== TAB: REPORTS ===================== */}
                {activeTab === "reports" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
                                Flagged Moderation Reports
                            </h2>
                            <p className="mt-1 text-sm text-on-surface-variant dark:text-white/60">
                                Review grievances, conduct violations, and
                                technical reports submitted by students and
                                tutors.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {reports.map((r) => (
                                <div
                                    key={r.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface sm:flex-row sm:items-center"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${PRIORITY_STYLES[r.priority]}`}
                                            >
                                                {r.priority} Priority
                                            </span>
                                            <span className="text-xs text-on-surface-variant dark:text-white/50">
                                                {r.time}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    r.status === "Resolved"
                                                        ? "bg-status-confirmed/10 text-status-confirmed"
                                                        : "bg-status-pending/10 text-status-pending"
                                                }`}
                                            >
                                                {r.status}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-on-surface dark:text-white">
                                            {r.title}
                                        </h3>
                                        <p className="text-sm text-on-surface-variant dark:text-white/70">
                                            {r.desc}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant dark:text-white/50">
                                            <span>
                                                Reporter:{" "}
                                                <strong className="text-on-surface dark:text-white">
                                                    {r.reporter}
                                                </strong>
                                            </span>
                                            <span>
                                                Target:{" "}
                                                <strong className="text-on-surface dark:text-white">
                                                    {r.target}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedReport(r)}
                                            className="rounded-xl border border-outline-variant px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high dark:border-white/10 dark:text-white"
                                        >
                                            Review
                                        </button>
                                        {r.status !== "Resolved" ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleResolveReport(r.id)
                                                }
                                                className="rounded-xl bg-status-confirmed px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-status-confirmed/90"
                                            >
                                                Resolve
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-status-confirmed">
                                                <Check className="h-4 w-4" />{" "}
                                                Resolved
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDismissReport(r.id)
                                            }
                                            className="rounded-xl border border-outline-variant/60 p-2 text-on-surface-variant hover:bg-surface-container-high dark:border-white/10 dark:text-white/50"
                                            title="Dismiss Report"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ===================== TAB: SETTINGS ===================== */}
                {activeTab === "settings" && (
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div>
                            <h2 className="font-display text-2xl font-bold text-on-surface dark:text-white md:text-3xl">
                                System Configuration
                            </h2>
                            <p className="mt-1 text-sm text-on-surface-variant dark:text-white/60">
                                Adjust campus policies, authentication
                                requirements, and real-time service
                                integrations.
                            </p>
                        </div>

                        {saveSuccessMsg && (
                            <div className="flex items-center gap-2 rounded-xl border border-status-confirmed/30 bg-status-confirmed/10 p-4 text-sm font-semibold text-status-confirmed animate-fade-up">
                                <Check className="h-5 w-5" />
                                {saveSuccessMsg}
                            </div>
                        )}

                        <div className="rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-sm dark:border-white/10 dark:bg-dark-surface space-y-5">
                            <h3 className="font-semibold text-on-surface dark:text-white flex items-center gap-2">
                                <Shield className="h-4 w-4 text-admin-blue" />{" "}
                                Access & Authentication Policies
                            </h3>

                            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-on-surface dark:text-white">
                                        KNUST Email Verification Required
                                    </p>
                                    <p className="text-xs text-on-surface-variant dark:text-white/50">
                                        Restrict registrations strictly to valid
                                        @st.knust.edu.gh student emails.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.requireKnustEmail}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            requireKnustEmail: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5 rounded border-outline-variant text-admin-blue accent-admin-blue"
                                />
                            </div>

                            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-on-surface dark:text-white">
                                        Allow Public Student Registration
                                    </p>
                                    <p className="text-xs text-on-surface-variant dark:text-white/50">
                                        Permit new students to sign up without
                                        prior administrative invitation.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.publicRegistration}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            publicRegistration:
                                                e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5 rounded border-outline-variant text-admin-blue accent-admin-blue"
                                />
                            </div>

                            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-on-surface dark:text-white">
                                        WhatsApp Study Group Integration
                                    </p>
                                    <p className="text-xs text-on-surface-variant dark:text-white/50">
                                        Enable tutors to add WhatsApp group
                                        links to group courses and reveal to
                                        accepted students.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.whatsappIntegration}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            whatsappIntegration:
                                                e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5 rounded border-outline-variant text-admin-blue accent-admin-blue"
                                />
                            </div>

                            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4 dark:border-white/5">
                                <div>
                                    <p className="text-sm font-semibold text-on-surface dark:text-white">
                                        Progressive Web App Push Notifications
                                    </p>
                                    <p className="text-xs text-on-surface-variant dark:text-white/50">
                                        Send real-time alerts to students when
                                        tutors accept or reschedule study
                                        sessions.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.pushNotifications}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            pushNotifications: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5 rounded border-outline-variant text-admin-blue accent-admin-blue"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-status-rejected">
                                        System Maintenance Mode
                                    </p>
                                    <p className="text-xs text-on-surface-variant dark:text-white/50">
                                        Temporarily pause new booking requests
                                        while campus schedule is updated.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            maintenanceMode: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5 rounded border-outline-variant text-status-rejected accent-status-rejected"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 rounded-xl bg-admin-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-admin-blue/90 active:scale-95"
                            >
                                <Save className="h-4 w-4" /> Save System
                                Settings
                            </button>
                        </div>
                    </form>
                )}

                {/* Modal: Review Report */}
                {selectedReport && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-up"
                        onClick={() => setSelectedReport(null)}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl dark:border-white/10 dark:bg-dark-surface"
                        >
                            <div className="flex items-start justify-between border-b border-outline-variant/40 pb-4 dark:border-white/10">
                                <div>
                                    <span
                                        className={`rounded-md border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${PRIORITY_STYLES[selectedReport.priority]}`}
                                    >
                                        {selectedReport.priority} Priority
                                    </span>
                                    <h3 className="mt-2 text-lg font-bold text-on-surface dark:text-white">
                                        {selectedReport.title}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedReport(null)}
                                    className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high dark:text-white/60"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-4 text-sm">
                                <div className="rounded-xl bg-surface-container-low p-4 dark:bg-white/5">
                                    <p className="text-xs uppercase tracking-wider text-on-surface-variant dark:text-white/50 mb-1">
                                        Grievance Description
                                    </p>
                                    <p className="leading-relaxed text-on-surface dark:text-white/90">
                                        {selectedReport.desc}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="rounded-xl border border-outline-variant/30 p-3">
                                        <span className="text-on-surface-variant dark:text-white/40">
                                            Filed By
                                        </span>
                                        <p className="font-semibold text-on-surface dark:text-white mt-0.5">
                                            {selectedReport.reporter}
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-outline-variant/30 p-3">
                                        <span className="text-on-surface-variant dark:text-white/40">
                                            Subject / Target
                                        </span>
                                        <p className="font-semibold text-on-surface dark:text-white mt-0.5">
                                            {selectedReport.target}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3 border-t border-outline-variant/40 pt-4 dark:border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setSelectedReport(null)}
                                    className="rounded-xl border border-outline-variant px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high dark:border-white/10 dark:text-white"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleDismissReport(selectedReport.id);
                                    }}
                                    className="rounded-xl border border-error/30 px-4 py-2 text-xs font-semibold text-error hover:bg-error/10"
                                >
                                    Dismiss Report
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleResolveReport(selectedReport.id);
                                    }}
                                    className="rounded-xl bg-status-confirmed px-4 py-2 text-xs font-semibold text-white hover:bg-status-confirmed/90"
                                >
                                    Mark as Resolved
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
