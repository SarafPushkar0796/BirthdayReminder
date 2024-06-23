self.addEventListener('install', (event) => {
	console.log('Service worker installing...');
	// Add files to cache here
});

self.addEventListener('activate', (event) => {
	console.log('Service worker activating...');
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
	  caches.match(event.request).then((response) => {
		return response || fetch(event.request).then((response) => {
		  return caches.open(CACHE_NAME).then((cache) => {
			cache.put(event.request, response.clone());
			return response;
		  });
		});
	  }).catch(() => {
		return caches.match('/BirthdayReminder/index.html');
	  })
	);
  });  