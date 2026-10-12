import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/60 cursor-pointer
        bg-surface-container-lowest text-on-surface-variant transition-all duration-300
        hover:bg-surface-container-low active:scale-90
        dark:border-white/10 dark:bg-dark-surface dark:text-surface-container-lowest dark:hover:bg-white/10
        ${className}`}
    >
      <Sun
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all duration-300 ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        }`}
      />
    </button>
  );
}