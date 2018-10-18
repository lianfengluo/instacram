import { createElement } from './helpers.js';
import { change_hash_location } from './main.js';
import { BACKEND_URL } from './global_var.js';
import API from './api.js';
const api = new API(BACKEND_URL);
const login_check = (username_input, password_input) => {
    // username
    const pattern1 = /^([A-Za-z0-9-_+]{6,30})$/
    // password
    const pattern2 = /^(.{6,30})$/
    if (pattern1.test(username_input.value) && pattern2.test(password_input.value)) {
        username_input.style.borderColor = '#ccc';
        username_input.placeholder = 'Enter username';
        password_input.style.borderColor = '#ccc';
        password_input.placeholder = 'Enter password';
        login_submit();
    } else {
        // show the error messages
        if (!pattern1.test(username_input.value)) {
            username_input.style.borderColor = 'red';
            username_input.placeholder = 'Please enter username 6-30 alphabet or numbers';
        }
        if (!pattern2.test(password_input.value)) {
            password_input.style.borderColor = 'red';
            password_input.placeholder = 'Please enter password 6-30 characters';
        }
    }
}

export function login_form_show()  {
    const parent = document.getElementById('large-feed');
    const login_form = createElement('div', null, {id: 'login_form'});
    const login_form_title = createElement('h1', 'Login');
    const input_div = createElement('div', null);
    const username_input = createElement('input', null, {type: 'text', placeholder: 'Enter username', id:'username-input',
                                                    pattern: '^[A-Za-z0-9]{6,30}$'});
    const password_input = createElement('input', null, { type: 'password', placeholder: 'Enter password', id: 'password-input',
                                                    pattern: '^.{6,30}$'});
    let br_line = createElement('br', null);
    input_div.appendChild(username_input);
    input_div.appendChild(br_line);
    input_div.appendChild(password_input);
    const login_button = createElement('button', 'submit', {type: 'submit', id:'login-submit-button'});
    const word_about_register = createElement('p', 'Did not have an account yet? ');
    const register_link = createElement('a', 'Sign up here', {id: 'register_link'});
    br_line = createElement('br', null);
    login_form.appendChild(login_form_title);
    login_form.appendChild(createElement('hr', null));
    login_form.appendChild(input_div);
    login_form.appendChild(login_button);
    login_form.appendChild(br_line);
    word_about_register.appendChild(register_link);
    login_form.appendChild(word_about_register);
    // register link event
    register_link.addEventListener('click', () => { if (window.location.hash.substr(1) !== 'signup') window.location.hash = '#signup'; });
    parent.appendChild(login_form);
    login_button.addEventListener('click', () => {
        login_check(username_input, password_input);
    });
    login_form.addEventListener('keydown', (e) => { 
        if (e.keyCode === 13) {
            login_check(username_input, password_input);
        }
    });
}

const register_check = (username_input, password_input, confirm_password_input, email_input, name_input) => {
    // username
    const pattern1 = /^([A-Za-z0-9-_+]{6,30})$/
    // password
    const pattern2 = /^(.{6,30})$/
    // email
    const pattern3 = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (pattern1.test(username_input.value) && pattern2.test(password_input.value) && password_input.value === confirm_password_input.value
        && pattern3.test(email_input.value) && email_input.value && name_input.value) {
        username_input.style.borderColor = '#ccc';
        username_input.placeholder = 'Enter username';
        password_input.style.borderColor = '#ccc';
        password_input.placeholder = 'Enter password';
        confirm_password_input.style.borderColor = '#ccc';
        confirm_password_input.placeholder = 'Confirm password';
        email_input.style.borderColor = '#ccc';
        email_input.placeholder = 'Enter email';
        name_input.style.borderColor = '#ccc';
        name_input.placeholder = 'Enter name (display name)';
        signup_submit();
    } else {
        // show error messages
        if (!pattern1.test(username_input.value)) {
            username_input.style.borderColor = 'red';
            username_input.placeholder = 'Please enter username 6-30 alphabet or numbers';
        }
        if (!pattern2.test(password_input.value)) {
            password_input.style.borderColor = 'red';
            password_input.placeholder = 'Please enter password 6-30 characters';
        }
        if (password_input.value !== confirm_password_input.value || !pattern2.test(password_input.value)) {
            confirm_password_input.style.borderColor = 'red';
            confirm_password_input.placeholder = 'Please enter the same password';
        }
        if (pattern3.test(email_input.value) || !email_input.value) {
            email_input.style.borderColor = 'red';
            email_input.placeholder = 'Please enter email';
        }
        if (!name_input.value) {
            name_input.style.borderColor = 'red';
            name_input.placeholder = 'Please enter display name';
        }
    }
}

export function register_form_show() {
    const parent = document.getElementById('large-feed');
    const signup_form = createElement('div', null, { id: 'register_form' });
    const signup_form_title = createElement('h1', 'Signup');
    const input_div = createElement('div', null);
    const username_input = createElement('input', null, { type: 'text', placeholder: 'Enter username',
                                                         id: 'username-input', pattern:'^[A-Za-z0-9]{6,30}$' });
    const password_input = createElement('input', null, { type: 'password', placeholder: 'Enter password',
                                                id: 'password-input', pattern: '^.{6,30}$' });
    const confirm_password_input = createElement('input', null, { type: 'password', placeholder: 'Confirm password',
        id: 'confirm-password-input', pattern: '^[A-Za-z0-9]{6,30}$' });
    const email_input = createElement('input', null, { type: 'email', placeholder: 'Enter email', id: 'email-input' });
    const name_input = createElement('input', null, { type: 'text', placeholder: 'Enter name (display name)', 
                                                        id: 'display-name-input', required: true });
    input_div.appendChild(username_input);
    input_div.appendChild(createElement('br', null));
    input_div.appendChild(password_input);
    input_div.appendChild(createElement('br', null));
    input_div.appendChild(confirm_password_input);
    input_div.appendChild(createElement('br', null));
    input_div.appendChild(email_input);
    input_div.appendChild(createElement('br', null));
    input_div.appendChild(name_input);
    const signup_button = createElement('button', 'submit', { type: 'submit', id: 'signup-submit-button' });
    const word_about_login = createElement('p', 'Already a user? ');
    const login_link = createElement('a', 'Login here', { id: 'login_link' });
    login_link.addEventListener('click', () => {window.location.hash = '#'})
    signup_form.appendChild(signup_form_title);
    signup_form.appendChild(createElement('hr', null));
    signup_form.appendChild(input_div);
    signup_form.appendChild(signup_button);
    signup_form.appendChild(createElement('br', null));
    word_about_login.appendChild(login_link);
    signup_form.appendChild(word_about_login);
    parent.appendChild(signup_form);
    signup_button.addEventListener('click', () => {
        register_check(username_input, password_input, confirm_password_input, email_input,
            name_input);
    });
    signup_form.addEventListener('keydown', (e) => {
        if (e.keyCode === 13) {
            register_check(username_input, password_input, confirm_password_input, email_input,
                name_input);
        }
    });
}


const login_submit = () => {
    const form = document.getElementById('login_form');
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const error_message = document.getElementById('login-error-message');
    if (error_message) form.removeChild(error_message);
    const login_url = 'auth/login';
    const data = {username:username, password:password};
    const results = api.postData(login_url, data);
    results.then(result => {
        // incorrect username or password
        if ('token' in result) {
            // set the token
            window.localStorage.setItem('AUTH_KEY', result.token);
            // rerender the posts page
            fill_login_info();
            change_hash_location();
        } else {
            // error message
            const div = form.firstChild.nextSibling;
            const error_message = createElement('h4', result.message, { style: 'color: red', id: 'login-error-message' });
            form.insertBefore(error_message, div);
        }
    });
}

const signup_submit = () => {
    const form = document.getElementById('register_form');
    const username = document.getElementById('username-input').value;
    const password = document.getElementById('password-input').value;
    const email = document.getElementById('email-input').value;
    const name = document.getElementById('display-name-input').value;
    const error_message = document.getElementById('signup-error-message');
    if (error_message) form.removeChild(error_message);
    const register_url = 'auth/signup';
    const data = { username: username, password: password, email:email, name: name };
    const results = api.postData(register_url, data);
    results.then(result => {
        // incorrect username or password
        if ('token' in result) {
            // set the token
            window.localStorage.setItem('AUTH_KEY', result.token);
            fill_login_info();
            // rerender the posts page
            window.location.hash = '#';
        } else {
            // error message
            const div = form.firstChild.nextSibling;
            const error_message = createElement('h4', result.message, { style: 'color: red', id: 'signup-error-message' });
            form.insertBefore(error_message, div);
        }
    });
}

const fill_login_info = () => {
    const results = api.getData('user', window.localStorage.getItem('AUTH_KEY'));
    results
        .then(res => {
            window.localStorage.setItem('username', res.username);
            window.localStorage.setItem('name', res.name);
            window.localStorage.setItem('id', res.id);
            window.localStorage.setItem('email', res.email);
            window.localStorage.setItem('posts', res.posts);
        })
}
