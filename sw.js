// Duo (Sport Cockpit) – Offline-Cache. Bei jeder neuen Version VERSION erhöhen.
const VERSION = 'sc-v95';
const SHELL = ['./', 'index.html', 'style.css', 'js/data.js','js/training.js','js/cheer.js','js/nutrition.js','js/smart.js','js/sync.js','js/game.js','js/workout.js','js/moves.js','js/guide.js','js/share.js','js/weekly.js','js/board.js','js/rewards.js','js/home.js','js/onboarding.js','js/gym.js','js/coach.js','js/review.js','js/photo.js','js/voice.js','js/advent.js','js/main.js', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Open Food Facts & Home Assistant immer live
  if (u.hostname.includes('openfoodfacts')) return;
  const isShell = u.origin === location.origin;
  const isLib = /fonts\.(googleapis|gstatic)\.com|unpkg\.com/.test(u.hostname);
  if (!isShell && !isLib) return;
  // App-Dateien: erst Netz (für Updates), sonst Cache. Libs/Fonts: Cache zuerst.
  if (isShell) {
    e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(e.request, c)); return r; })));
  }
});
