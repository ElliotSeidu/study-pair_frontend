import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TutorModeContext = createContext(null);

export function TutorModeProvider({ children }) {
  const [preferredMode, setPreferredMode] = useState(() => {
    return localStorage.getItem("studypair-mode") === "tutor";
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Route-derived active mode:
  // If navigating into any tutor route, active mode is tutor mode.
  // If navigating into any student-specific route, active mode is student mode.
  // Otherwise (neutral pages like /profile, /notifications), follow the user's preference.
  const isTutorMode = location.pathname.startsWith("/tutor")
    ? true
    : location.pathname.startsWith("/tutors") ||
      location.pathname.startsWith("/my-requests") ||
      location.pathname.startsWith("/my-applications")
    ? false
    : preferredMode;

  useEffect(() => {
    localStorage.setItem("studypair-mode", isTutorMode ? "tutor" : "student");
    document.documentElement.setAttribute("data-mode", isTutorMode ? "tutor" : "student");
  }, [isTutorMode]);

  const toggleMode = useCallback(() => {
    if (isTutorMode) {
      setPreferredMode(false);
      navigate("/tutors");
    } else {
      setPreferredMode(true);
      navigate("/tutor/requests");
    }
  }, [isTutorMode, navigate]);

  const switchToTutorMode = useCallback(() => {
    setPreferredMode(true);
    navigate("/tutor/requests");
  }, [navigate]);

  const switchToStudentMode = useCallback(() => {
    setPreferredMode(false);
    navigate("/tutors");
  }, [navigate]);

  return (
    <TutorModeContext.Provider
      value={{
        isTutorMode,
        toggleMode,
        switchToTutorMode,
        switchToStudentMode,
      }}
    >
      {children}
    </TutorModeContext.Provider>
  );
}

export function useTutorMode() {
  const ctx = useContext(TutorModeContext);
  if (!ctx) throw new Error("useTutorMode must be used inside a TutorModeProvider");
  return ctx;
}