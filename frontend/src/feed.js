// importing named exports we use brackets
import { createPostTile, createElement } from './helpers.js';
// when importing 'default' exports, use below syntax
import API from './api.js';


const api_backend = new API("http://127.0.0.1:5000");
const STATIC_URL = 'http://localhost:8080/data'
// we can use this single api request multiple times
// const feed = api.getFeed();


export function fetch_feed(p=0, n=10) {

    const feed = api_backend.getFeed(`user/feed?p=${p}&n=${n}`, {p: 0, n:10}, window.localStorage.getItem("AUTH_KEY"));
    feed
        .then(posts => {
            if (posts.length > 0) {
                posts.reduce((parent, post) => {
                    parent.appendChild(createPostTile(post));
                    // parent.appendChild()
                    return parent;
    
                }, document.getElementById('large-feed'))
            }
        });
}
let upload_file_data = null;
export function show_post_box() {
    const parent = document.getElementById("large-feed");
    const section = createElement("section", null, { class:"post-post"});
    const h2 = createElement("h3", "Post your image");
    const form = createElement("form", null, {class: "post-form"});
    const text_area = createElement("textarea", null, {id: "post-textarea", placeholder: "Some thing you want to say..."});
    const upload_file = createElement("input", "Upload your image", { class: "upload-file-field", type: "file", name:"myfile"});
    const submit_post_button = createElement("button", null, { class: "post-submit-button"});
    const upload_icon = createElement("img", null, {
        class: "upload-icon", src: `${STATIC_URL}/upload-button.svg`,
        alt: "upload-button.svg"});
    submit_post_button.appendChild(upload_icon);
    form.appendChild(text_area);
    form.appendChild(upload_file);
    form.appendChild(submit_post_button);
    section.appendChild(h2);
    section.appendChild(form);
    parent.appendChild(section);
    upload_file.addEventListener("change", getImageContent);
    submit_post_button.addEventListener("click", (e) => {
        e.preventDefault();
        upload_file_data['description_text'] = text_area.value;
        upload_image(upload_file_data);
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
        // upload_image(upload_file_data);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
}

const upload_image = (data) => {
    const post_url = 'post/';
    const results = api_backend.postData(post_url, data, window.localStorage.getItem("AUTH_KEY"));
    results.then(result => {
        // result.post_id
    });
}
