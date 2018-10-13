import { createElement } from './helpers.js';
import API from './api.js';
const api = new API("http://127.0.0.1:5000");
export function login_form_show()  {
    const parent = document.getElementById('large-feed');
    const login_form = createElement("div", null, {id: "login_form"});
    const login_form_title = createElement("h1", "Login");
    const input_div = createElement("div", null);
    const username_input = createElement("input", null, {type: "text", placeholder: "Enter username", id:"username-input"});
    const br_line = createElement("br", null);
    const password_input = createElement("input", null, { type: "password", placeholder: "Enter password", id: "password-input"});
    input_div.appendChild(username_input);
    input_div.appendChild(br_line);
    input_div.appendChild(password_input);
    const login_button = createElement("button", "submit", {type: "submit", id:"login-submit-button"});
    const br_line1 = createElement("br", null);
    const br_line2 = br_line1;
    const word_about_register = createElement("p", "Did not have an account yet? ");
    const register_link = createElement("a", "Sign up here", {id: "register_link"});
    login_form.appendChild(login_form_title);
    login_form.appendChild(input_div);
    login_form.appendChild(login_button);
    login_form.appendChild(br_line1);
    login_form.appendChild(br_line2);
    login_form.appendChild(word_about_register);
    word_about_register.appendChild(register_link);
    // register link event
    register_link.addEventListener("click", () => { if (window.location.hash.substr(1) !== "signup") window.location.hash = "#signup"; });
    parent.appendChild(login_form);
    show_login_button();
    login_form.addEventListener("keydown", (e) => { 
        if (e.keyCode === 13) 
            if (username_input.value && password_input.value) {
                username_input.style.borderColor = '#ccc';
                password_input.style.borderColor = '#ccc';
                login_submit();
            }
            else {
                if (!username_input.value)
                    username_input.style.borderColor = 'red';
                if (!password_input.value)
                    password_input.style.borderColor = 'red';
            }
    });
}

export function register_form_show() {
    // const parent = document.getElementById('large-feed');
    // const signup_form = createElement("div", null, { id: "reigster_form" });
    // const signup_form_title = createElement("h1", "signup");
    // const input_div = createElement("div", null);
    // const username_input = createElement("input", null, { type: "text", placeholder: "Enter username", id: "username-input" });
    // const br_line = createElement("br", null);
    // const password_input = createElement("input", null, { type: "password", placeholder: "Enter password", id: "password-input" });
    // input_div.appendChild(username_input);
    // input_div.appendChild(br_line);
    // input_div.appendChild(password_input);
    // const signup_button = createElement("button", "submit", { type: "submit", id: "signup-submit-button" });
    // const br_line1 = createElement("br", null);
    // const br_line2 = br_line1;
    // const word_about_register = createElement("p", "Did not have an account yet? ");
    // signup_form.appendChild(signup_form_title);
    // signup_form.appendChild(input_div);
    // signup_form.appendChild(signup_button);
    // signup_form.appendChild(br_line1);
    // signup_form.appendChild(br_line2);
    // signup_form.appendChild(word_about_register);
}


const login_submit = () => {
    const form = document.getElementById("login_form");
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;
    const error_message = document.getElementById("login-error-message");
    if (error_message)
    form.removeChild(error_message);
    const login_url = "auth/login";
    const data = {username:username, password:password};
    const results = api.postData(login_url, data);
    results.then(result => {
        // incorrect username or password
        if ("token" in result) {
            // set the token
            window.localStorage.setItem('AUTH_KEY', result.token);
            // rerender the posts page
            const feed_div = document.getElementById('large-feed');
            const login_form = document.getElementById("login_form");
            feed_div.removeChild(login_form);
            // fetch the info
        } else {
            const div = form.firstChild.nextSibling;
            const error_message = createElement("h4", result.message, { style: "color: red", id: "login-error-message" });
            form.insertBefore(error_message, div);
        }
    });
}

const register_submit = () => {
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;
    const register_url = "auth/signup";
    const data = { username: username, password: password };
    const result = api.postData(register_url, data);
}

function show_login_button() {
    const submit_login_button = document.getElementById("login-submit-button");
    submit_login_button.addEventListener("click", login_submit);
}
function show_register_button() {
    const submit_register_button = document.getElementById("register-submit-button");
    submit_register_button.addEventListener("click", register_submit);
}