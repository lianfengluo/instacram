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
// // const backendURL = [
// //     // backend url
// //     `${BACKEND_URL}/post/`,
// //     `${BACKEND_URL}/post/comment`,
// //     `${BACKEND_URL}/post/like`,
// //     `${BACKEND_URL}/post/unlike`,
// //     `${BACKEND_URL}/auth/login`,
// //     `${BACKEND_URL}/auth/signup`,
// //     `${BACKEND_URL}/user/`,
// //     `${BACKEND_URL}/user/feed`,
// //     `${BACKEND_URL}/user/follow`,
// //     `${BACKEND_URL}/user/unfollow`,
// // ]
// /**
//  * initialize the service
//   */
// self.addEventListener('install', (e) => {
//     e.waitUntil(
//         caches.open(mycache)
//             .then((cache) => {
//                 return cache.addAll(cacheFiles)
//                 // return cache;
//             })
//     )
// })
// /**
//  * remove action
//   */
// self.addEventListener('activate', (e) => {
//     e.waitUntil(
//         caches.keys().then((cacheNames) => {
//             return Promise.all(cacheNames.map((cacheName) => {
//                 if (cacheName !== mycache) {
//                     // remove cache in the my cache name
//                     return caches.delete(cacheName);
//                 }
//             }))
//         })
//     )
// })
// /**
//  * fetch action
//  * from cache
//   */
// // self.addEventListener('fetch', (e) => {
// //     e.respondWith(
// //         caches.match(e.request).then((response) => {
// //             // if (response) {
// //             //     return response;
// //             // }
// //             let requestClone = e.request.clone();
// //             fetch(requestClone)
// //                 .then((myResponse) => {
// //                     if (!myResponse) {
// //                         return myResponse
// //                     }
// //                     let responseClone = myResponse.clone();
// //                     caches.open(mycache)
// //                         .then((cache) => {
// //                             cache.put(e.request, responseClone)
// //                             return myResponse;
// //                         })
// //                 })
// //         })
// //             .catch(() => {
// //                 return caches.match(e.request);
// //                 // if (response) return response;
// //             })
// //     )
// // })

// self.addEventListener('fetch', function (event) {
//     event.respondWith(
//         caches.match(event.request).then(function (resp) {
//             let requestClone = event.request.clone();
//             return fetch(requestClone).then(function (response) {
//                 let responseClone = response.clone();
//                 caches.open(mycache).then(function (cache) {
//                     cache.put(requestClone, responseClone);
//                     return responseClone;
//                 });

//             });
//         }).catch(function () {
//             return caches.match(event.request);
//         })
//     );
// });


var CURRENT_CACHES = {
    all: mycache
};


self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(mycache)
            .then(function (cache) {
                return cache.addAll(cacheFiles);
            })
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

self.addEventListener('fetch', function (event) {
    // console.log(event);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                const fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    (real_response) => {
                        // Check if we received a valid response
                        if (!real_response || real_response.status !== 200) {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        const responseToCache = real_response.clone();

                        caches.open(mycache)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return real_response;
                    }
                ).catch(() => {
                    if (response) return response;
                });
            })
    );
}); 

