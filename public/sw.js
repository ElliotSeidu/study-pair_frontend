/**
 * StudyPair Progressive Web App Service Worker
 * Handles offline caching, push notifications, and background notification clicks.
 */

const CACHE_NAME = "studypair-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.svg",
  "/icon.svg",
  "/manifest.webmanifest"
];

// Install: Cache core assets and activate immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches and take control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate strategy for navigation and assets
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and skip chrome-extension requests
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  const url = new URL(event.request.url);
  // Never intercept Vite dev server requests, source code modules, or dev endpoints
  if (
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.includes("node_modules") ||
    (url.hostname === "localhost" && url.port === "5173")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Push Event: Handle server push notifications sent to student's device
self.addEventListener("push", (event) => {
  let data = {
    title: "StudyPair Notification",
    body: "You have an update regarding your study sessions.",
    icon: "/icon.svg",
    badge: "/favicon.svg",
    data: { url: "/notifications" },
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon.svg",
    badge: data.badge || "/favicon.svg",
    vibrate: [100, 50, 100],
    data: data.data || { url: "/notifications" },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click: Navigate to target page when clicked
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/notifications";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Message listener from React client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TRIGGER_NOTIFICATION") {
    const { title, options } = event.data.payload;
    self.registration.showNotification(title, {
      icon: "/icon.svg",
      badge: "/favicon.svg",
      ...options,
    });
  }
});
