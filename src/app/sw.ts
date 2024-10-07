/// <reference lib="webworker" />

export default null;

declare let self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
    console.log('Service worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activated');
});

self.addEventListener('fetch', (event) => {
    // Add custom caching strategy here if needed
});