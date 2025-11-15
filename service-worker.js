// This is the service worker script, which executes in the background.

// On install, activate immediately.
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting();
});

// On activation, take control of all clients.
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the main application to show a notification.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data.payload;
    // The service worker shows the notification on behalf of the app.
    event.waitUntil(self.registration.showNotification(title, options));
  }
});

// Handle the user clicking on a notification.
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');
  event.notification.close(); // Close the notification

  // This logic attempts to focus an existing window/tab of the app.
  // If one doesn't exist, it opens a new one.
  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's a focused client and focus it.
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise, open a new window.
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});
