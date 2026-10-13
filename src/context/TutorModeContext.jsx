import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TutorModeContext = createContext(null);

// Returns "tutor" | "student" for mode-specific routes, or null for neutral
// routes (/profile, /notifications) that should follow the saved preference.
// NOTE: "/tutors" (student browse) must NOT match the tutor branch.
function getRouteMode(pathname) {
    if (pathname === "/tutor" || pathname.startsWith("/tutor/")) return "tutor";

    if (
        pathname === "/tutors" ||
        pathname.startsWith("/tutors/") ||
        pathname.startsWith("/my-requests")
    ) {
        return "student";
    }

    return null;
}

export function TutorModeProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    const routeMode = getRouteMode(location.pathname);
    const [preferredMode, setPreferredMode] = useState(() => {
        if (routeMode) return routeMode === "tutor";
        return localStorage.getItem("studypair-mode") === "tutor";
    });

    const [prevRouteMode, setPrevRouteMode] = useState(routeMode);
    if (routeMode !== prevRouteMode) {
        setPrevRouteMode(routeMode);
        if (routeMode !== null) {
            setPreferredMode(routeMode === "tutor");
        }
    }

    const isTutorMode = routeMode ? routeMode === "tutor" : preferredMode;

    useEffect(() => {
        localStorage.setItem(
            "studypair-mode",
            isTutorMode ? "tutor" : "student"
        );
        document.documentElement.setAttribute(
            "data-mode",
            isTutorMode ? "tutor" : "student"
        );
    }, [isTutorMode]);

    const switchToTutorMode = useCallback(() => {
        setPreferredMode(true);
        navigate("/tutor/requests");
    }, [navigate]);

    const switchToStudentMode = useCallback(() => {
        setPreferredMode(false);
        navigate("/tutors");
    }, [navigate]);

    const toggleMode = useCallback(() => {
        if (routeMode) {
            // On a mode-specific page: go to the other mode's home
            if (isTutorMode) switchToStudentMode();
            else switchToTutorMode();
        } else {
            // On a neutral page (/profile, /notifications): flip in place
            setPreferredMode((prev) => !prev);
        }
    }, [routeMode, isTutorMode, switchToStudentMode, switchToTutorMode]);

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
    if (!ctx)
        throw new Error("useTutorMode must be used inside a TutorModeProvider");
    return ctx;
}
