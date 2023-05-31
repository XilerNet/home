// Service Worker Version: 1.0
// Copyright (c) 2023 Xiler
const CACHE_VERSION = 1;
const CACHE_PREFIX = "static-cache";
const CACHE_NAME = `${CACHE_PREFIX}-v${CACHE_VERSION}`;

const FILES_TO_CACHE = [
    "/",
    "manifest.json",
    "assets/icons/favicon.ico",
    "assets/icons/favicon-16x16.png",
    "assets/icons/favicon-32x32.png",
    "assets/icons/android-chrome-192x192.png",
    "assets/icons/android-chrome-512x512.png",
    "assets/icons/apple-touch-icon.png",
    "assets/icons/slide.svg",
    "assets/icons/icon.svg",

    "assets/css/reset.css",
    "assets/css/style.css",

    "assets/fonts/Quicksand-Bold.ttf",
    "assets/fonts/Quicksand-SemiBold.ttf",
];

const populateCache = async () => {
    console.log("[SW] Caching pages statically.")
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll(FILES_TO_CACHE);
}

self.addEventListener("install", (e) => {
    console.log("[SW] Installing service worker.")
    e.waitUntil(populateCache());
});


const offlineFetch = async (request) => {
   if (request.method !== "GET") return await fetch(request);

    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        console.log(`[SW] Fetched cached file. (${request.url})`)
        return cachedResponse;
    }

    return await fetch(request);
}

self.addEventListener("fetch", (e) => {
    e.respondWith(offlineFetch(e.request));
});

const clearCaches = async () => {
    const cacheNames = await caches.keys();
    for (let cacheName of cacheNames) {
        if (CACHE_NAME !== cacheName && cacheName.startsWith(CACHE_PREFIX))
            await caches.delete(cacheName);
    }
}

self.addEventListener("activate", (e) => {
    e.waitUntil(clearCaches())
});
