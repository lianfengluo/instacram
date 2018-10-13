// importing named exports we use brackets
import { checkStore } from './helpers.js';
import { fetch_feed } from './feed.js';
import { login_form_show, register_form_show } from './user.js';


// routing function
const change_hash_location = () => {
    const new_hash_location = window.location.hash.substr(1);
    const parent = document.getElementById('large-feed');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    if (!new_hash_location) {
        fetch_feed();
    } else if (new_hash_location === 'login') {
        login_form_show();
    } else if (new_hash_location === 'signup') {
        register_form_show();
    }
}
change_hash_location();
window.onhashchange = change_hash_location;

// logo icon click event
document.getElementById("logo-icon").addEventListener("click", () => { window.location.hash = "";});
// login button event
document.getElementById("login-button").addEventListener("click", () => { if (window.location.hash.substr(1) !== "login") window.location.hash = "#login"; });

// show upload
if (checkStore("AUTH_KEY") !== null) {
    document.getElementById("upload-event").style.display = "block";
    document.getElementById("user-event-nav").style.display = 'none';
} else {
    document.getElementById("upload-event").style.display = "none";
    document.getElementById("user-event-nav").style.display = 'block';
}
