import { createElement, checkStore } from './helpers.js';
import { change_hash_location } from './main.js';
import { show_likes } from './feed.js';
import { BACKEND_URL } from './global_var.js';
import API from './api.js';

const api_backend = new API(BACKEND_URL);
let sum_likes = 0;
/**
 * get all the likes we get in our posts
 * @param {list} list 
 * @param {htmlNode} likes_box 
 */
const getLikes = (list, likes_box) => {
    sum_likes = 0;
    for (const element of list) {
        const post_url = `post/?id=${element}`;
        const results = api_backend.getData(post_url, window.localStorage.getItem('AUTH_KEY'));
        results
            .then(res => {
                sum_likes += res.meta.likes.length;
                likes_box.innerHTML = `<b>Likes</b><br>${sum_likes}`;
            })
    }
}
/**
 * update the user information send request to the backend 
 * @param {string} password 
 * @param {string} email 
 * @param {string} name 
 */
const submit_update = (password, email, name) => {
    const data = {password: password, email: email, name: name};
    const results = api_backend.putData('user', data, window.localStorage.getItem('AUTH_KEY'));
    const form = document.getElementById('profile-user-form');
    results
        .then(res => {
            if ('msg' in res) {
                if (res.msg === 'success') {
                    const error_message = createElement('h4', `Update ${res.msg}`, { style: 'color: red', id: 'signup-error-message' });
                    form.insertBefore(error_message, form.firstChild)
                    setTimeout(() => {
                        change_hash_location();
                    }, 1000);
                } else {
                    const error_message = createElement('h4', res.msg, { style: 'color: red', id: 'signup-error-message' });
                    form.insertBefore(error_message, form.firstChild)
                }
            }
        })
}
/**
 * User info update validation
 */
const update_profile = () => {
    const error_message = document.getElementById('signup-error-message');
    if (error_message) error_message.parentNode.removeChild(error_message);
    // password
    const pattern1 = /^(.{6,30})$/;
    // email
    const pattern2 = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const email_input = document.getElementById('email-input');
    const password = document.getElementById('password-input');
    const confirm_pass = document.getElementById('confirm-input');
    const name = document.getElementById('display-name-input');
    if (pattern1.test(password.value) && pattern2.test(email_input.value) && password.value === confirm_pass.value &&
    email_input.value && name.value) {
        password.style.borderColor = '#ccc';
        password.placeholder = 'Enter new password';
        confirm_pass.borderColor = '#ccc';
        confirm_pass.placeholder = 'Enter new password';
        email_input.style.borderColor = '#ccc';
        email_input.placeholder = 'Enter new email';
        name.style.borderColor = '#ccc';
        name.placeholder = 'Enter new name (display name)';
        submit_update(password.value, email_input.value, name.value);
    } else {
        if (!name.value) {
            name.style.borderColor = 'red';
            name.placeholder = 'Please enter display name';
        }
        if (!pattern1.test(password.value)) {
            password.style.borderColor = 'red';
            password.placeholder = 'Please enter password 6-30 characters';
        }
        if (confirm_pass.value !== password.value || pattern1.test(password.value)) {
            confirm_pass.style.borderColor = 'red';
            confirm_pass.placeholder = 'Please enter confirm password 6-30 characters';
        }
        if (!email_input.value || !pattern2.test(email_input.value)) {
            email_input.style.borderColor = 'red';
            email_input.placeholder = 'Please enter new email';
        }
    }

}

/**
 * render profile page
 */
export function show_profile() {
    const parent = document.getElementById('large-feed');
    const section = createElement('section', null, { id: 'profile-div' });
    const h2 = createElement('h2', 'Profile');
    section.appendChild(h2);
    section.appendChild(createElement('hr', null))
    const user_info = createElement('div', null, { id: 'user-profile-div' });
    section.appendChild(user_info);
    const update_profile_button = createElement('button', 'update profile', {id: 'update-button'});
    section.appendChild(update_profile_button);
    section.appendChild(createElement('hr', null, { style: 'color: rgba(145, 145, 145, 0.89);'}));
    fetch_my_info(user_info);
    const logout_button = createElement('button', 'Logout', {id: 'logout-button'})
    section.appendChild(logout_button);
    parent.appendChild(section);
    logout_button.addEventListener('click', () => {
        if (checkStore('AUTH_KEY') !== null) {
            localStorage.removeItem('AUTH_KEY');
        }
        window.location.hash = '#';
        change_hash_location();
    });
    update_profile_button.addEventListener('click', () => {
        const form = document.getElementById('profile-user-form');
        for (const child of form.childNodes) {
            if (child.tagName === 'INPUT' && child.id !== 'username-input') {
                child.disabled = false;
            }
            if (child.id === 'password-input') {
                child.value = '';
                const br_line = createElement('br', null);
                form.insertBefore(br_line, child.nextSibling);
                const confirm_text = createElement('label', 'Confirm password');
                form.insertBefore(confirm_text, br_line.nextSibling);
                const confirm_pass = createElement('input', null, {
                    type: 'password', placeholder: 'Enter new password again', id: 'confirm-input',
                    pattern: '^.{6,30}$', disabled: true
                });
                form.insertBefore(confirm_pass, confirm_text.nextSibling);
            }
        }
        const change_button = createElement('button', 'Change', {id: 'change-profile-button'});
        section.insertBefore(change_button, update_profile_button);
        change_button.addEventListener('click', update_profile);
        update_profile_button.style.display = 'none';
    })
}
/**
 * render user profile user info part
 * @param {html_object} div 
 */
const fetch_my_info = (div) => {
    const user_info = api_backend.getData('user/', window.localStorage.getItem('AUTH_KEY'));
    user_info
        .then(info => {
            if ('id' in info) {
                const name = createElement('div', info.name, { id:'user-profile-name' });
                const message_container = createElement('div', null, {id:'user-profile-container'});
                const post_num = createElement('div', null);
                post_num.innerHTML = `<b>Post</b><br>${info.posts.length}`
                const likes = createElement('div', null);
                likes.innerHTML = `<b>Likes</b><br>${sum_likes}`;
                getLikes(info.posts, likes)
                const following = createElement('div', null, {class: 'profile-following'});
                following.innerHTML = `<b>Following</b><br>${info.following.length}`
                following.addEventListener('click', () => {
                    show_likes(info.following);
                })
                const followed = createElement('div', null);
                followed.innerHTML = `<b>Followed</b><br>${info.followed_num}`
                message_container.appendChild(post_num);
                message_container.appendChild(likes);
                message_container.appendChild(following);
                message_container.appendChild(followed);
                const user_form = createElement('div', null, { id: 'profile-user-form'})
                const user_text = createElement('label', 'username ');
                const username = createElement('input', null, {type: 'text',id: 'username-input', disabled:true})
                username.value = info.username;
                const pass_text = createElement('label', 'password ');
                const password = createElement('input', null, {
                    type: 'password', placeholder: 'Enter new password', id: 'password-input',
                    pattern: '^.{6,30}$', disabled: true
                });
                password.value = '      ';
                const email_text = createElement('label', 'email ');
                const email_input = createElement('input', null, { type: 'email', placeholder: 'Enter new email',
                             id: 'email-input', disabled: true });
                email_input.value = info.email;
                const name_text = createElement('label', 'name ');
                const name_input = createElement('input', null, {
                    type: 'text', placeholder: 'Enter new name (display name)',
                    id: 'display-name-input', required: true, disabled: true
                });
                name_input.value = info.name;
                user_form.appendChild(user_text);
                user_form.appendChild(username);
                user_form.appendChild(createElement('br', null));
                user_form.appendChild(pass_text);
                user_form.appendChild(password);
                user_form.appendChild(createElement('br', null));
                user_form.appendChild(email_text);
                user_form.appendChild(email_input);
                user_form.appendChild(createElement('br', null));
                user_form.appendChild(name_text);
                user_form.appendChild(name_input);
                user_form.appendChild(createElement('br', null));
                div.appendChild(name);
                div.appendChild(message_container);
                div.appendChild(createElement('br', null));
                div.appendChild(createElement('br', null));
                div.appendChild(user_form);
            } else if ('message' in info) {
                if (info.message === 'Invalid Authorization Token') {
                    window.location.hash = '#expired';
                }
            }
    });
}