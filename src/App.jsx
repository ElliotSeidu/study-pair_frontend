import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TutorModeProvider } from "./context/TutorModeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import CompleteProfile from "./pages/CompleteProfile";
import BrowseTutors from "./pages/BrowseTutors";
import TutorDetail from "./pages/TutorDetail";
import MyRequests from "./pages/MyRequests";
import MyApplications from "./pages/MyApplications";
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

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <TutorModeProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/privacy" element={<Privacy />} />

              <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
              <Route path="/tutors" element={<ProtectedRoute><BrowseTutors /></ProtectedRoute>} />
              <Route path="/tutors/:id" element={<ProtectedRoute><TutorDetail /></ProtectedRoute>} />
              <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
              <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route path="/tutor" element={<Navigate to="/tutor/requests" replace />} />
              <Route path="/tutor/courses" element={<ProtectedRoute><TutorMyCourses /></ProtectedRoute>} />
              <Route path="/tutor/availability" element={<ProtectedRoute><TutorMyAvailability /></ProtectedRoute>} />
              <Route path="/tutor/requests" element={<ProtectedRoute><TutorIncomingRequests /></ProtectedRoute>} />

              {/* Protected administrative control plane */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />

              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TutorModeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}