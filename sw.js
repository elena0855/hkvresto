// Service Worker pour HKV Resto Vitrine PWA
const CACHE_NAME = 'hkv-vitrine-orig-v6';
const ASSETS = [
    './index.html',
    './styles.css',
    './script.js',
    './manifest.json',
    './images/plat1.jpg',
    './images/plat2.jpg',
    './images/plat3.jpg',
    './images/plat4.jpg',
    './images/plat5.jpg',
    './images/plat6.jpg',
    './images/plat7.jpg',
    './images/plat8.jpg',
    './images/plat9.jpg',
    './images/plat10.jpg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Stratégie : Network First falling back to Cache
    e.respondWith(
        fetch(e.request).then((response) => {
            // Mettre à jour le cache si la réponse est valide
            if (response && response.status === 200 && response.type === 'basic') {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(e.request, responseClone);
                });
            }
            return response;
        }).catch(() => {
            return caches.match(e.request);
        })
    );
});
