import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TutorModeContext = createContext(null);

export function TutorModeProvider({ children }) {
  const [isTutorMode, setIsTutorMode] = useState(() => {
    return localStorage.getItem("studypair-mode") === "tutor";
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("studypair-mode", isTutorMode ? "tutor" : "student");
    document.documentElement.setAttribute("data-mode", isTutorMode ? "tutor" : "student");
  }, [isTutorMode]);

  // If navigating into any tutor route, automatically synchronize mode to tutor
  useEffect(() => {
    if (location.pathname.startsWith("/tutor")) {
      if (!isTutorMode) {
        setIsTutorMode(true);
      }
    }
  }, [location.pathname, isTutorMode]);

  const toggleMode = useCallback(() => {
    setIsTutorMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        navigate("/tutor/requests");
      } else {
        navigate("/tutors");
      }
      return nextMode;
    });
  }, [navigate]);

  const switchToTutorMode = useCallback(() => {
    setIsTutorMode(true);
    navigate("/tutor/requests");
  }, [navigate]);

  const switchToStudentMode = useCallback(() => {
    setIsTutorMode(false);
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