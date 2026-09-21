/**
 * Device Push & Local Notification Utilities
 */

export function isNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission() {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) {
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error("Error requesting notification permission:", err);
    return "denied";
  }
}

export async function sendDeviceNotification(title, options = {}) {
  if (!isNotificationSupported()) return false;

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await requestNotificationPermission();
  }

  if (permission !== "granted") {
    return false;
  }

  const notificationOptions = {
    body: options.body || "You have an update on StudyPair.",
    icon: options.icon || "/icon.svg",
    badge: options.badge || "/favicon.svg",
    vibrate: [100, 50, 100],
    data: options.data || { url: "/notifications" },
    ...options,
  };

  // Try service worker registration first (preferred on mobile/PWA)
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions);
        return true;
      }
    } catch {
      // Fall through to Desktop Notification
    }
  }

  // Fallback to standard window Notification
  try {
    new Notification(title, notificationOptions);
    return true;
  } catch (err) {
    console.warn("Direct Notification constructor failed:", err);
    return false;
  }
}
