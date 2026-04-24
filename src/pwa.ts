export function registerPwa() {
  if (typeof window === 'undefined') {
    return;
  }

  // For the first MVP we prefer reliability over offline shell caching.
  // Old cached HTML/assets can leave the app appearing broken after deploys,
  // especially on iPad/Safari. Clean up any existing service workers/caches.
  if ('serviceWorker' in navigator) {
    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    });
  }

  if ('caches' in window) {
    void caches.keys().then((keys) => {
      keys.forEach((key) => {
        void caches.delete(key);
      });
    });
  }

  if (!import.meta.env.PROD) {
    return;
  }
}
