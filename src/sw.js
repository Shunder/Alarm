const CACHE = 'alarm-v1';
const ASSETS = [
  './', './index.html', './styles.css', './main.js', './manifest.webmanifest', './assets/icon.svg',
  './lib/storage.js', './lib/time.js', './lib/theme.js', './lib/audio.js', './lib/notifications.js', './lib/i18n.js',
  './features/clock/view.js', './features/alarm/view.js', './features/timer/view.js', './features/stopwatch/view.js', './features/settings/view.js'
];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS))));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))));
self.addEventListener('fetch', (e) => e.respondWith(caches.match(e.request).then((res) => res || fetch(e.request))));
