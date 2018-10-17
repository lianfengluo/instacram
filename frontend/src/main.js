// importing named exports we use brackets
import { checkStore } from './helpers.js';
import { fetch_feed, show_post_box } from './feed.js';
import { login_form_show, register_form_show } from './user.js';
import { show_profile } from "./profile.js";
import { show_error, show_expired } from "./error_page.js"
// const STATIC_URL = 'http://localhost:8080/data'
// show upload

const is_login = () => {
    if (checkStore("AUTH_KEY") !== null) {
        document.getElementById("login-button").style.display = 'none';
        const profile_button = document.getElementById("profile-button");
        if (window.location.hash !== "#profile") {
            profile_button.style.display = 'inline-block';
        } else {
            profile_button.style.display = "none";
        }
        profile_button.addEventListener("click", (e) => {e.preventDefault(); window.location.hash = "#profile";});
    } else {
        document.getElementById("login-button").style.display = 'inline-block';
        // document.getElementById("login-button").innerText = "Login";
        document.getElementById("profile-button").style.display = 'none';
    }
}
// routing function
export function change_hash_location() {
    const new_hash_location = window.location.hash.substr(1);
    const parent = document.getElementById('large-feed');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    is_login();
    if (!new_hash_location && checkStore("AUTH_KEY") !== null) {
        fetch_feed();
        show_post_box()
    } else if (!new_hash_location) {
        login_form_show();
    } else if (new_hash_location === 'signup') {
        register_form_show();
    } else if (new_hash_location === 'profile' && checkStore("AUTH_KEY") !== null) {
        show_profile();
    } else if (new_hash_location === "expired") {
        show_expired()
    } else {
        show_error();
    }
}
change_hash_location();
window.onhashchange = change_hash_location;

// logo icon click event
document.getElementById("logo-icon").addEventListener("click", () => { if (checkStore("AUTH_KEY") !== null) window.location.hash = "#";});
document.getElementById("login-button").addEventListener("click", () => {window.location.hash = "#"})

is_login()
