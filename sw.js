const CACHE_NAME = "webflow-cache-v1";
const urlsToCache = ["/", "/script.js"];
// Listen for install event, set callback
self.addEventListener("install", function (event) {
  // Perform some task
});

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches
//       .match(event.request)
//       .then((response) => response || fetch(event.request))
//   );
// });

// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );
// });

// self.addEventListener("push", function (event) {
//   const data = event.data ? event.data.json() : {};
//   const title = data.title || "New Notification";
//   const options = {
//     body: data.body,
//     icon: "path/to/icon.png", // Optional: Add your icon here
//     badge: "path/to/badge.png", // Optional: Add a badge icon here
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });
