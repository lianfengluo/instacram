const mycache = 'v2';
const cacheFiles = [
    // frontend url
    '/',
    // '../favicon.ico',
    // './src/api.js',
    // './src/error_page.js',
    // './src/feed.js',
    // './src/global_var.js',
    // './src/helpers.js',
    // './src/main.js',
    // './src/posts.js',
    // './src/profile.js',
    // './src/user.js',
    // './src/userpage.js',
    // './data/blank.png',
    // './data/like.png',
    // './data/liked.png',
    // './data/upload-button.svg',
    // './data/upload.png',
    // './data/blogging.svg',
    // './styles/provided.css',
    // './index.html',
]



self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(mycache)
            .then(cache => (cache.addAll(cacheFiles)))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                return fetch(event.request)
                    .then((real_response) => {
                        // Check if we received a valid response
                        if (!real_response || real_response.status !== 200 || event.request.method !== 'GET') {
                            return real_response;
                        }
                        const fetchRequest = event.request.clone();
                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const cached_response = real_response.clone();
                        caches.open(mycache)
                            .then((cache) => {
                                cache.put(fetchRequest, cached_response);
                            });
                        return real_response;
                        }
                ).catch(() => {
                    // offline than return cache response
                    if (response)
                        return response;
                });
            })
            .catch(() => {
                return fetch(event.request);
            })
    );
}); 
self.addEventListener('message', () => {
    self.postMessage('notification')
});


