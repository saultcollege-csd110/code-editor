/* Minimal cross-origin isolation helper for static HTTPS hosting.
 * Registers a same-origin service worker and reloads once it controls the page.
 */
if (typeof ServiceWorkerGlobalScope !== 'undefined' && self instanceof ServiceWorkerGlobalScope) {
  self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
  self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate' || new URL(event.request.url).origin === self.location.origin) {
      event.respondWith((async () => {
        const response = await fetch(event.request);
        if (response.type === 'opaque' || response.type === 'opaqueredirect') return response;
        const headers = new Headers(response.headers);
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
        return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
      })());
    }
  });
} else if ('serviceWorker' in navigator && window.isSecureContext && !window.crossOriginIsolated) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!sessionStorage.getItem('coi-reloaded')) {
      sessionStorage.setItem('coi-reloaded', '1');
      location.reload();
    }
  });
  navigator.serviceWorker.register('./coi-serviceworker.js').catch(console.error);
} else if (window.crossOriginIsolated) {
  sessionStorage.removeItem('coi-reloaded');
}
