// importing named exports we use brackets
import { checkStore } from './helpers.js';
import { fetch_feed, show_post_box } from './feed.js';
import { login_form_show, register_form_show } from './user.js';
import { show_profile } from "./profile.js";
import { show_error, show_expired, no_user_error } from "./error_page.js"
import { show_user_page, search_tool, show_user_page_id } from "./userpage.js"
// const STATIC_URL = 'http://localhost:8080/data'
// show upload

// nav tool event and check login
const is_login = () => {
    const profile_button = document.getElementById("profile-button");
    const my_post_button = document.getElementById("my-post-button");
    if (checkStore("AUTH_KEY") !== null) {
        document.getElementById("login-button").style.display = 'none';
        if (window.location.hash !== "#profile") {
            profile_button.style.display = 'inline-block';
        } else {
            profile_button.style.display = "none";
        }
        if (window.location.hash !== `#user=${window.localStorage.getItem("username")}`) {
            my_post_button.style.display = 'inline-block';
        } else {
            my_post_button.style.display = "none";
        }
        profile_button.addEventListener("click", () => {window.location.hash = "#profile";});
        my_post_button.addEventListener("click", () => { 
            window.location.hash = `#user=${window.localStorage.getItem("username")}`
        });
        document.getElementById("user-search-box").style.display = "inline-block";
    } else {
        document.getElementById("login-button").style.display = 'inline-block';
        // document.getElementById("login-button").innerText = "Login";
        profile_button.style.display = 'none';
        my_post_button.style.display = 'none';
        document.getElementById("user-search-box").style.display = "none";
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
        show_post_box();
        fetch_feed();
    } else if (!new_hash_location) {
        login_form_show();
    } else if (new_hash_location === 'signup') {
        register_form_show();
    } else if (new_hash_location === 'profile' && checkStore("AUTH_KEY") !== null) {
        show_profile();
    } else if (new_hash_location === "expired") {
        show_expired()
    } else if (new_hash_location.startsWith("userid=") && checkStore("AUTH_KEY") !== null) {
        const user_id = new_hash_location.match("userid=([0-9]+)")[1];
        show_user_page_id(user_id);
    } else if (new_hash_location.startsWith("user=") && checkStore("AUTH_KEY") !== null) {
        const username = new_hash_location.match("user=(.+)")[1];
        if (username.length > 30)
            window.location.hash = "#nouser";
        else
            show_user_page(username);
    } else if (new_hash_location === "nouser") {
        no_user_error();
    } else {
        show_error();
    }
}
change_hash_location();
window.onhashchange = change_hash_location;
const modal = document.getElementById('myModal');
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// logo icon click event
document.getElementById("logo-icon").addEventListener("click", () => { if (checkStore("AUTH_KEY") !== null) window.location.hash = "#";});
document.getElementById("login-button").addEventListener("click", () => {window.location.hash = "#"})
search_tool();