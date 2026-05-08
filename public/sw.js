/* =============================================
   🔄 SERVICE WORKER — Magic Pencil PWA
   
   Fitur:
   - Cache static assets (offline fallback)
   - Push notification handler
   - Install event
   ============================================= */

const CACHE_NAME = "magic-pencil-v1";
const STATIC_ASSETS = [
  "/",
  "/favicon.jpg",
  "/logo-magicpencil.jpg",
  "/manifest.json",
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — bersihin cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — coba network dulu, fallback ke cache
self.addEventListener("fetch", (event) => {
  // Skip API calls
  if (event.request.url.includes("/api/")) return;
  // Skip non-GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Push notification handler
self.addEventListener("push", (event) => {
  let data = { title: "Magic Pencil", body: "Ada update terbaru!", icon: "/favicon.jpg" };

  if (event.data) {
    try {
      const parsed = JSON.parse(event.data.text());
      data = { ...data, ...parsed };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/favicon.jpg",
    badge: "/favicon.jpg",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click — buka URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((c) => c.url.includes(urlToOpen));
      if (matchingClient) {
        return matchingClient.focus();
      }
      return clients.openWindow(urlToOpen);
    })
  );
});
