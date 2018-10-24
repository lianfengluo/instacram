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

let CURRENT_CACHES = {
    all: mycache
};


self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches.open(mycache)
            .then(cache => (cache.addAll(cacheFiles)))
    );
});

self.addEventListener('activate', (event) => {
    // Delete all caches that aren't named in CURRENT_CACHES.
    // While there is only one cache in this example, the same logic will handle the case where
    // there are multiple versioned caches.
    const expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        // If this cache name isn't present in the array of "expected" cache names, then delete it.
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest)
                    .then((real_response) => {
                        // Check if we received a valid response
                        if (!real_response || real_response.status !== 200 || fetchRequest.method !== 'GET') {
                            return real_response;
                        }
                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = real_response.clone();
                        caches.open(mycache)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                            
                        return response;
                    }
                ).catch(() => {
                    // offline than return cache response
                    if (response)
                        return response;
                });
            })
    );
}); 

