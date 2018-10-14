// importing named exports we use brackets
import { checkStore } from './helpers.js';
import { fetch_feed, show_post_box } from './feed.js';
import { login_form_show, register_form_show } from './user.js';
const STATIC_URL = 'http://localhost:8080/data'
// show upload
const is_login = () => {
    if (checkStore("AUTH_KEY") !== null) {
        document.getElementById("login-logout-button").innerText = "Logout";
        document.getElementById("profile-button").style.display = 'inline-block';
    } else {
        document.getElementById("login-logout-button").innerText = "Login";
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
    if (!new_hash_location && checkStore("AUTH_KEY") !== null) {
        is_login()
        fetch_feed();
        show_post_box()
    } else if (!new_hash_location) {
        login_form_show();
        is_login()
    } else if (new_hash_location === 'signup') {
        register_form_show();
    }
}
change_hash_location();
window.onhashchange = change_hash_location;

// logo icon click event
document.getElementById("logo-icon").addEventListener("click", () => { if (checkStore("AUTH_KEY") !== null) window.location.hash = "";});
// login button event
document.getElementById("login-logout-button").addEventListener("click", () => { 
    if(checkStore("AUTH_KEY") !== null) {
        localStorage.removeItem("AUTH_KEY");
    }
    window.location.hash = "#";
    change_hash_location();
});

is_login()
