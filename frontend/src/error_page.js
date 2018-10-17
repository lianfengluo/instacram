import { createElement } from './helpers.js';
export function show_error() {
    const parent = document.getElementById("large-feed");
    const error_message = createElement("div", null, {class:"error-message"});
    const error = createElement("h1", "Invalid url")
    error_message.appendChild(error);
    parent.appendChild(error_message);
}
export function show_expired() {
    const parent = document.getElementById("large-feed");
    const error_message = createElement("div", null, { class: "error-message" });
    const error = createElement("h1", "Token expired. The page will be redirect in 3s")
    error_message.appendChild(error);
    parent.appendChild(error_message);
    setTimeout(() => {
        window.localStorage.clear();
        window.location.hash = "#";
    }, 3000);
}
export function no_user_error() {
    const parent = document.getElementById("large-feed");
    const error_message = createElement("div", null, { class: "error-message" });
    const error = createElement("h1", "Invalid username. The page will be redirect in 2s")
    error_message.appendChild(error);
    parent.appendChild(error_message);
    setTimeout(() => {
        window.location.hash = "#";
    }, 2000);
}