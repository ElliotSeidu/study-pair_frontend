import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TutorModeProvider } from "./context/TutorModeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import CompleteProfile from "./pages/CompleteProfile";
import BrowseTutors from "./pages/BrowseTutors";
import TutorDetail from "./pages/TutorDetail";
import MyRequests from "./pages/MyRequests";
import TutorMyApplications from "./pages/tutor/TutorMyApplications";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Guidelines from "./pages/Guidelines";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import TutorMyCourses from "./pages/tutor/TutorMyCourses";
import TutorMyAvailability from "./pages/tutor/TutorMyAvailability";
import TutorIncomingRequests from "./pages/tutor/TutorIncomingRequests";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";

/**
 * Smart root redirect:
 * - Installed PWA (standalone) always goes to /sign-in
 * - Browser: authenticated users go to their /app dashboard, unauthenticated to /sign-in
 * The landing page remains accessible at /landing for marketing purposes.
 */
function RootRedirect() {
    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;
    const { isAuthenticated, user } = useAuth();

    if (isStandalone) {
        if (!isAuthenticated || !user) {
            return <Navigate to="/sign-in" replace />;
        }
        const isAdmin = user?.role === "admin" || user?.email?.startsWith("admin@");
        const isTutor = user?.role === "tutor";
        return (
            <Navigate
                to={isAdmin ? "/app/admin" : isTutor ? "/app/tutor/requests" : "/app/tutors"}
                replace
            />
        );
    }

    // In normal web browser, show the marketing landing page
    return <Landing />;
}

/**
 * Redirects to the correct dashboard inside /app based on the user's role.
 */
function AppIndexRedirect() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const isTutor = user?.role === "tutor";
    return (
        <Navigate
            to={isAdmin ? "/app/admin" : isTutor ? "/app/tutor/requests" : "/app/tutors"}
            replace
        />
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <ScrollToTop />
                <AuthProvider>
                    <TutorModeProvider>
                        <Routes>
                            {/* ── Public / marketing routes ────────────────── */}
                            <Route path="/" element={<RootRedirect />} />
                            <Route path="/landing" element={<Landing />} />
                            <Route path="/sign-in" element={<SignIn />} />
                            <Route path="/app/sign-in" element={<SignIn />} />
                            <Route path="/app/login" element={<Navigate to="/sign-in" replace />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/guidelines" element={<Guidelines />} />
                            <Route path="/privacy" element={<Privacy />} />

                            {/* ── Protected app shell — all under /app/* ────── */}
                            <Route
                                path="/app"
                                element={
                                    <ProtectedRoute>
                                        <AppIndexRedirect />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/app/complete-profile"
                                element={
                                    <ProtectedRoute>
                                        <CompleteProfile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/tutors"
                                element={
                                    <ProtectedRoute>
                                        <BrowseTutors />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/tutors/:id"
                                element={
                                    <ProtectedRoute>
                                        <TutorDetail />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/my-requests"
                                element={
                                    <ProtectedRoute>
                                        <MyRequests />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Legacy redirect for old bookmarks */}
                            <Route
                                path="/app/my-applications"
                                element={<Navigate to="/app/tutor/applications" replace />}
                            />
                            <Route
                                path="/app/tutor"
                                element={<Navigate to="/app/tutor/requests" replace />}
                            />

                            <Route
                                path="/app/tutor/applications"
                                element={
                                    <ProtectedRoute>
                                        <TutorMyApplications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/notifications"
                                element={
                                    <ProtectedRoute>
                                        <Notifications />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/tutor/courses"
                                element={
                                    <ProtectedRoute>
                                        <TutorMyCourses />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/tutor/availability"
                                element={
                                    <ProtectedRoute>
                                        <TutorMyAvailability />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/app/tutor/requests"
                                element={
                                    <ProtectedRoute>
                                        <TutorIncomingRequests />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Admin control plane */}
                            <Route
                                path="/app/admin"
                                element={
                                    <AdminProtectedRoute>
                                        <AdminDashboard />
                                    </AdminProtectedRoute>
                                }
                            />

                            {/* ── Legacy bare routes → redirect into /app ───── */}
                            <Route path="/complete-profile" element={<Navigate to="/app/complete-profile" replace />} />
                            <Route path="/tutors" element={<Navigate to="/app/tutors" replace />} />
                            <Route path="/tutors/:id" element={<Navigate to="/app/tutors/:id" replace />} />
                            <Route path="/my-requests" element={<Navigate to="/app/my-requests" replace />} />
                            <Route path="/my-applications" element={<Navigate to="/app/tutor/applications" replace />} />
                            <Route path="/tutor" element={<Navigate to="/app/tutor/requests" replace />} />
                            <Route path="/tutor/applications" element={<Navigate to="/app/tutor/applications" replace />} />
                            <Route path="/tutor/courses" element={<Navigate to="/app/tutor/courses" replace />} />
                            <Route path="/tutor/availability" element={<Navigate to="/app/tutor/availability" replace />} />
                            <Route path="/tutor/requests" element={<Navigate to="/app/tutor/requests" replace />} />
                            <Route path="/notifications" element={<Navigate to="/app/notifications" replace />} />
                            <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
                            <Route path="/admin" element={<Navigate to="/app/admin" replace />} />

                            {/* 404 Catch-All */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </TutorModeProvider>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}
