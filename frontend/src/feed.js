// importing named exports we use brackets
import { createFeed, createElement } from './helpers.js';
// when importing 'default' exports, use below syntax
import API from './api.js';


const api_backend = new API("http://127.0.0.1:5000");
const STATIC_URL = 'http://localhost:8080/data'
// we can use this single api request multiple times
// const feed = api.getFeed();


export function fetch_feed(p=0, n=10) {

    const feed = api_backend.getData(`user/feed?p=${p}&n=${n}`, window.localStorage.getItem("AUTH_KEY"));
    feed
        .then(posts => {
            if (posts in posts) {
                if (posts.length > 0) {
                    posts.reduce((parent, post) => {
                        parent.appendChild(createFeed(post));
                        // parent.appendChild()
                        return parent;
        
                    }, document.getElementById('large-feed'))
                }
            } else if ("message" in posts) {
                if (posts.message === "Invalid Authorization Token") {
                    window.location.hash = "#expired";
                }
            }
        });
}
let upload_file_data = null;
export function show_post_box() {
    const parent = document.getElementById("large-feed");
    const section = createElement("section", null, { class:"post-post"});
    const h3 = createElement("h3", "Post your image");
    const form = createElement("form", null, {class: "post-form"});
    const text_area = createElement("textarea", null, {id: "post-textarea", placeholder: "Something you want to say..."});
    const upload_file = createElement("input", "Upload your image", { id: "upload-file-field", type: "file", name:"myfile"});
    const upload_file_field = createElement("div", null, {id: "upload-field"});
    const upload_field_button = createElement("button", "Choose your image");
    const upload_file_name = createElement("div", "No image has been chosen", {id: "upload-img-name"});
    upload_file_field.appendChild(upload_field_button);
    upload_file_field.appendChild(upload_file_name);
    const submit_post_button = createElement("button", null, { class: "post-submit-button"});
    const upload_icon = createElement("img", null, {
        class: "upload-icon", src: `${STATIC_URL}/upload-button.svg`,
        alt: "upload-button.svg"});
    submit_post_button.appendChild(upload_icon);
    const post_success = createElement("h3", "Image upload succeed", { style: "color:red; display:none", id: "post-success-word" });
    form.appendChild(text_area);
    form.appendChild(upload_file);
    form.appendChild(upload_file_field);
    form.appendChild(submit_post_button);
    form.appendChild(post_success);
    section.appendChild(h3);
    section.appendChild(form);
    parent.appendChild(section);
    upload_field_button.addEventListener("click", (e)=>{e.preventDefault();upload_file.click();});
    upload_file.addEventListener("change", getImageContent);
    submit_post_button.addEventListener("click", (e) => {
        e.preventDefault();
        if (text_area.value) {
            upload_file_data['description_text'] = text_area.value;
            upload_image(upload_file_data);
            document.getElementById("upload-img-name").innerText = "No image has been chosen";
            upload_file.value = '';
            upload_file_data = null;
            text_area.value = '';
            text_area.placeholder = "Something you want to say...";
        } else {
            text_area.placeholder = "Please input something!";
        }
    });
}
const getImageContent = (event) => {
    const [file] = event.target.files;

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    // if we get here we have a valid image
    const reader = new FileReader();
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result.split(',')[1];
        upload_file_data = { src: dataURL };
    };
        
    document.getElementById("upload-img-name").innerText = document.getElementById("upload-file-field").value.replace(/^.*[\\\/]/, '');
    // this returns a base64 image
    reader.readAsDataURL(file);
}

const upload_image = (data) => {
    const post_url = 'post/';
    const results = api_backend.postData(post_url, data, window.localStorage.getItem("AUTH_KEY"));
    results.then(result => {
        if ("post_id" in result) {
            const post_success = document.getElementById("post-success-word");
            post_success.style.display = "block";
            setTimeout(() => {
                post_success.style.display = "none";
            }, 2000);
        }
        // result.post_id
    });
}
