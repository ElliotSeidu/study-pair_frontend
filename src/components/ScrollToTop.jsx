import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls the browser window and main application scroll containers
 * to the top whenever navigation occurs (e.g. clicking about, contact, guidelines,
 * privacy, navbar tabs, or any internal link).
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll global window to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Also reset scroll on any scrollable container (e.g. main content area in AppLayout)
    const mainContainers = document.querySelectorAll("main, [data-scroll-container]");
    mainContainers.forEach((el) => {
      el.scrollTop = 0;
    });
  }, [pathname, search]);

  return null;
}
