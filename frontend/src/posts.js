// importing named exports we use brackets
import { createFeed } from './helpers.js';
import { BACKEND_URL } from './global_var.js';
// when importing 'default' exports, use below syntax
import API from './api.js';

const api_backend = new API(BACKEND_URL);
export function show_post_detail(post_id) {
    const post = api_backend.getData(`post?id=${post_id}`, window.localStorage.getItem('AUTH_KEY'));
    post
        .then(res => {
            if ('id' in res) {
                const parent = document.getElementById('large-feed');
                const feed = createFeed(res);
                parent.append(feed);
            }
        })
}