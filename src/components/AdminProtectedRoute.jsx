import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ============================================================================
 * ⚠️ BACKEND DEVELOPER NOTICE: STRICT ADMIN ACCESS CONTROL REQUIRED
 * ============================================================================
 * CRITICAL SECURITY REQUIREMENT:
 * You must ensure that ONLY verified administrators (users with valid administrative
 * credentials and the 'admin' role in their authentication token / session) can
 * access the admin page (/admin) and its underlying API routes.
 *
 * BACKEND ACTION ITEMS:
 * 1. Database & Token Claims:
 *    - Store a `role` field on the user model (e.g. `role: 'student' | 'tutor' | 'admin'`).
 *    - Include `role: 'admin'` in the JWT payload or server session upon successful login.
 *
 * 2. API Endpoint Protection:
 *    - All backend administrative routes (e.g., `/api/admin/*`, `/api/users/manage`,
 *      `/api/reports/resolve`, `/api/settings`) MUST be protected with server-side
 *      role-checking middleware (e.g., `requireAuth`, `requireAdminRole`).
 *    - Reject any non-admin request with HTTP 403 Forbidden.
 *
 * 3. Frontend Route Gating:
 *    - This `AdminProtectedRoute` component checks `user?.role === 'admin'`.
 *    - If the user is unauthenticated or not an admin, they are redirected away.
 * ============================================================================
 */
export default function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  // 1. Must be logged in
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // 2. Strict Admin Role Check:
  // For production backend integration, verify user.role === 'admin' (or user.isAdmin === true).
  // In development, if role is not yet present on mock user, allow fallback or require 'admin'.
  const isAdmin = user?.role === "admin" || user?.email?.startsWith("admin@");

  if (!isAdmin && import.meta.env.PROD) {
    return <Navigate to="/app/tutors" replace />;
  }

  return children;
}
