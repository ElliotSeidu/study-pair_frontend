import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // could swap for a spinner
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  return children;
}