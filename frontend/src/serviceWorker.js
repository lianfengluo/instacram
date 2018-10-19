const BACKEND_URL = 'http://127.0.0.1:5000';
const mycache = 'v1';
const cacheFiles = [
    // frontend url
    './',
    './api.js',
    './error_page.js',
    './feed.js',
    './global_var.js',
    './helpers.js',
    './main.js',
    './posts.js',
    './profile.js',
    './user.js',
    './userpage.js',
    '../data/blank.png',
    '../data/like.png',
    '../data/liked.png',
    '../data/upload-button.svg',
    '../data/upload.png',
    '../data/blogging.svg',
    '../styles/provided.css',
    '../index.html',
]
const backendURL = [
    // backend url
    `${BACKEND_URL}/post/`,
    `${BACKEND_URL}/post/comment`,
    `${BACKEND_URL}/post/like`,
    `${BACKEND_URL}/post/unlike`,
    `${BACKEND_URL}/auth/login`,
    `${BACKEND_URL}/auth/signup`,
    `${BACKEND_URL}/user/`,
    `${BACKEND_URL}/user/feed`,
    `${BACKEND_URL}/user/follow`,
    `${BACKEND_URL}/user/unfollow`,
]
/**
 * initialize the service
  */
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(mycache)
            .then((cache) => {
                return cache.addAll(cacheFiles);
            })
    )
})
/**
 * remove action
  */
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((cacheName) => {
                if (cacheName !== mycache) {
                    // remove cache in the my cache name
                    return caches.delete(cacheName);
                }
            }))
        })
    )
})
/**
 * fetch action
 * from cache
  */
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) {
                return response;
            }
            let requestClone = e.request.clone();
            fetch(requestClone).
                then((myResponse) => {
                    if (!myResponse) {
                        return myResponse
                    }
                    let responseClone = myResponse.clone();
                    caches.open(mycache)
                        .then((cache) => {
                            cache.put(e.request, responseClone)
                            return myResponse;
                        })
                })
                .catch((err) => {
                    console.warn(err);
                })
        })
    )
})
// remove all the cache from backend
export function clearAllCaches() {
    caches.open(mycache).then(function (cache) {
        for (const url of BACKEND_URL) {
            cache.delete(url).then(()=>{});
        }
    })
}