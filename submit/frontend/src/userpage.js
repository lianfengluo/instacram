// importing named exports we use brackets
import { createElement } from './helpers.js';
// when importing 'default' exports, use below syntax
import API from './api.js';
import { BACKEND_URL } from './global_var.js';

const api_backend = new API(BACKEND_URL);

/**
 * Getting the use image
 * @param {htmlNode} parent 
 * @param {number} posts 
 */
const fetch_user_feed = (parent, posts) => {
    for(const post_id of posts) {
        const user_info = api_backend.getData(`post/?id=${post_id}`, window.localStorage.getItem('AUTH_KEY'));
        const img = createElement('img', null, { alt: `img ${post_id}`, id: `img-${post_id}`, 
            class: 'post-image', src: '../data/blank.png' });
        user_info
            .then(info => { img.src = 'data:image/png;base64,' + info.src})
        img.addEventListener('click', () => {
            window.location.hash = `#post=${post_id}`;
        });
        parent.appendChild(img);
    }
}
let is_following = false;
let followed_num = null;
/**
 * fetch the user page information
 * @param {htmlNode} parent 
 * @param {string} username 
 * @param {number} id 
 * @param {list} following_list 
 */
const fetch_user_info = (parent, username, id,  following_list) => {
    let user_info = null;
    if (username) {
        user_info = api_backend.getData(`user?username=${username}`, window.localStorage.getItem('AUTH_KEY'));
    }
    else if (id) {
        user_info = api_backend.getData(`user?id=${id}`, window.localStorage.getItem('AUTH_KEY'));
    }
    user_info
        .then(info => {
        if ('id' in info) {
            const name = createElement('div', info.name, { id: 'user-info-name' });
            const message_container = createElement('div', null, { id: 'user-info-container' });
            const post_num = createElement('div', null);
            post_num.innerHTML = `<b>Post</b><br>${info.posts.length}`
            const following = createElement('div', null);
            following.innerHTML = `<b>Following</b><br>${info.following.length}`
            const followed = createElement('div', null);
            followed_num = info.followed_num;
            followed.innerHTML = `<b>Followed</b><br>${info.followed_num}`;
            message_container.appendChild(post_num);
            message_container.appendChild(following);
            message_container.appendChild(followed);
            const follow_button = createElement('button', 'follow', { id: 'follow-button', class: 'not-follow' })
            if (info.username === window.localStorage.getItem('username')) {
                follow_button.style.display = 'none';
            } else if (following_list.includes(info.id)) {
                follow_button.className = 'following';
                follow_button.innerText = 'following';
                is_following = true;
            } else {
                is_following = false;
            }
            follow_button.addEventListener('click', () => {
                follow_event(info.username, follow_button, followed);
            });
            message_container.appendChild(follow_button);
            parent.appendChild(name);
            parent.appendChild(message_container);
            parent.appendChild(createElement('hr', null));
            const img_container = createElement('div', null, {id: 'img-container'});
            fetch_user_feed(img_container, info.posts.reverse());
            parent.appendChild(img_container);
        } else if ('message' in info) {
            if (info.message === 'User Not Found') {
                window.location.hash = '#nouser';
            }
        }
    });
}
/**
 * render the user page
 * @param {htmlNode} user_info 
 * @param {string} username 
 * @param {number} id 
 */
const fetch_all = (user_info, username, id) => {
    const my_user_info = api_backend.getData('user', window.localStorage.getItem('AUTH_KEY'));
    my_user_info
        .then(info => {
            if ('id' in info) {
                fetch_user_info(user_info, username, id, info.following);
            } else if ('message' in info) {
                if (info.message === 'Malformed Request') {
                    window.location.hash = '#expired';
                }
            }
        })
}
/**
 * upload the following event
 * @param {string} username 
 * @param {htmlNode} follow_button 
 * @param {htmlNode} followed 
 */
const follow_event = (username, follow_button, followed) => {
    if (is_following === true) {
        // do the unfollow operation
        const results = api_backend.putData(`user/unfollow?username=${username}`, {}, window.localStorage.getItem('AUTH_KEY'));
        results
            .then(info => {
                if ('message' in info && info.message === 'success') {
                    follow_button.className = 'not-follow';
                    follow_button.innerText = 'follow';
                    is_following = false;
                    followed.innerHTML = `<b>Followed</b><br>${--followed_num}`
                }
            })
    } else {
        // do the follow operation
        const results = api_backend.putData(`user/follow?username=${username}`, {}, window.localStorage.getItem('AUTH_KEY'));
        results
            .then(info => {
                if ('message' in info && info.message === 'success') {
                    follow_button.className = 'following';
                    follow_button.innerText = 'following';
                    is_following = true;
                    followed.innerHTML = `<b>Followed</b><br>${++followed_num}`
                }
            })
    }
}
/**
 * search user page by username
 * @param {string} username 
 */
export function show_user_page(username) {
    const parent = document.getElementById('large-feed');
    const section = createElement('section', null,{id : 'user-page-section'})
    const title = createElement('h2', 'User Page', {id:'user-page-title'});
    section.appendChild(title);
    section.appendChild(createElement('hr', null))
    const user_info = createElement('div', null, { id: 'user-info-div' });
    fetch_all(user_info, username, null);
    section.appendChild(user_info);
    parent.appendChild(section)
}
/**
 * search user page by user id
 * @param {number} id post id 
 */
export function show_user_page_id(id) {
    const parent = document.getElementById('large-feed');
    const section = createElement('section', null, { id: 'user-page-section' })
    const title = createElement('h2', 'User Page', { id: 'user-page-title' });
    section.appendChild(title);
    section.appendChild(createElement('hr', null))
    const user_info = createElement('div', null, { id: 'user-info-div' });
    fetch_all(user_info, null, id);
    section.appendChild(user_info);
    parent.appendChild(section)
}
/**
 * render the search box on the navigator
 */
export function search_tool() {
    const search_box = document.getElementById('user-search-box');
    const search_input = createElement('input', null, {id:'search-input', placeholder:'Search user (username)'})
    search_box.append(search_input);
    search_input.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            window.location.href = `#user=${search_input.value}`
            search_input.value = '';
        }
    })
}