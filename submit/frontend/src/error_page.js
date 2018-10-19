import { createElement } from './helpers.js';
/**
 * show error function is redirect user to a error page
 */
export function show_error() {
    const parent = document.getElementById('large-feed');
    const error_message = createElement('div', null, {class:'error-message'});
    const error = createElement('h1', 'Invalid url')
    error_message.appendChild(error);
    parent.appendChild(error_message);
}
/**
 * show expired function is redirect user to a error page
 * and clear the localstorage to let user login again
 */
export function show_expired() {
    const parent = document.getElementById('large-feed');
    const error_message = createElement('div', null, { class: 'error-message' });
    const error = createElement('h1', 'Token expired. The page will be redirect in 3s')
    error_message.appendChild(error);
    parent.appendChild(error_message);
    setTimeout(() => {
        window.localStorage.clear();
        window.location.hash = '#';
    }, 3000);
}
/**
 * no user function is redirect user to a error page
 * it will happens when user input the invalid username in searching the user
 * it will redirect back to the previous page
 */
export function no_user_error() {
    const parent = document.getElementById('large-feed');
    const error_message = createElement('div', null, { class: 'error-message' });
    const error = createElement('h1', 'Invalid username. The page will be redirect in 2s')
    error_message.appendChild(error);
    parent.appendChild(error_message);
    setTimeout(() => {
        window.history.go(-2);
    }, 2000);
}