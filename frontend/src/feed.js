// importing named exports we use brackets
import { createPostTile, uploadImage } from './helpers.js';
// when importing 'default' exports, use below syntax
import API from './api.js';


const api = new API();

// we can use this single api request multiple times
const feed = api.getFeed();


export function fetch_feed() {
    feed
        .then(posts => {
            const sorted_post = posts.sort((p1, p2) => (Date.parse(p1.meta.published) < Date.parse(p2.meta.published)));
            sorted_post.reduce((parent, post) => {
                parent.appendChild(createPostTile(post));
                // parent.appendChild()
                return parent;

            }, document.getElementById('large-feed'))
        });

    // Potential example to upload an image
    const input = document.querySelector('input[type="file"]');

    input.addEventListener('change', uploadImage);
}
