self.addEventListener('install', (event) => {
	console.log('Service worker installing...');
	// Add files to cache here
});

self.addEventListener('activate', (event) => {
	console.log('Service worker activating...');
});

self.addEventListener('fetch', (event) => {
	if (event.request.mode === 'navigate') {
	  event.respondWith(
		fetch(event.request).catch(() => caches.match('/index.html'))
	  );
	}
});  