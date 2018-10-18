// importing named exports we use brackets
import { createFeed, createElement } from './helpers.js';
import { BACKEND_URL, STATIC_URL } from './global_var.js';
import API from './api.js';
// when importing 'default' exports, use below syntax



const api_backend = new API(BACKEND_URL);
// we can use this single api request multiple times
// const feed = api.getFeed();

let post_num = 0;
let first_post_id = null;
export function fetch_feed(p=0, n=10) {
    const feed = api_backend.getData(`user/feed?p=${p}&n=${n}`, window.localStorage.getItem('AUTH_KEY'));
    feed
        .then(posts => {
            if ('posts' in posts) {
                if (posts.posts.length > 0) {
                    posts.posts.reduce((parent, post) => {
                        if (post_num++ === 0){
                            first_post_id = post.id;
                        }
                        parent.appendChild(createFeed(post));
                        return parent;
                    }, document.getElementById('large-feed'))
                }
            } else if ('message' in posts) {
                if (posts.message === 'Invalid Authorization Token') {
                    window.location.hash = '#expired';
                }
            }
        });
}
let upload_file_data = {};
export function add_element_show_post(parent, post_id = null, img_html_object = null, text_html_object = null) {
    const section = createElement('section', null, { class: 'post-post' });
    let h3 = null;
    if (post_id) {
        h3 = createElement('h3', 'Change your post');
    } else {
        h3 = createElement('h3', 'Upload your post');
    }
    const form = createElement('form', null, { class: 'post-form' });
    const text_area = createElement('textarea', null, { id: 'post-textarea', placeholder: 'Something you want to say...' });
    const upload_file = createElement('input', 'Upload your image', { id: 'upload-file-field', type: 'file', name: 'myfile' });
    const upload_file_field = createElement('div', null, { id: 'upload-field' });
    const upload_field_button = createElement('button', 'Choose your image');
    const upload_file_name = createElement('div', 'No image has been chosen', { id: 'upload-img-name' });
    upload_file_field.appendChild(upload_field_button);
    upload_file_field.appendChild(upload_file_name);
    const submit_post_button = createElement('button', null, { class: 'post-submit-button' });
    const upload_icon = createElement('img', null, {
        class: 'upload-icon', src: `${STATIC_URL}/upload-button.svg`,
        alt: 'upload-button.svg'
    });
    submit_post_button.appendChild(upload_icon);
    const post_success = createElement('h3', 'Image upload succeed', { style: 'color:red; display:none', id: 'post-success-word' });
    form.appendChild(text_area);
    form.appendChild(upload_file);
    form.appendChild(upload_file_field);
    form.appendChild(submit_post_button);
    form.appendChild(post_success);
    section.appendChild(h3);
    section.appendChild(form);
    parent.appendChild(section);
    upload_field_button.addEventListener('click', (e) => { e.preventDefault(); upload_file.click(); });
    upload_file.addEventListener('change', getImageContent);
    submit_post_button.addEventListener('click', (e) => {
        e.preventDefault();
        if (text_area.value && 'src' in upload_file_data) {
            upload_file_data['description_text'] = text_area.value;
            if (post_id !== null) {
                put_image(upload_file_data, post_id, img_html_object, text_html_object);
            } else {
                upload_image(upload_file_data);
            }
            document.getElementById('upload-img-name').innerText = 'No image has been chosen';
            upload_file.value = '';
            upload_file_data = {};
            text_area.value = '';
            text_area.placeholder = 'Something you want to say...';
        } else if (!text_area.value) {
            text_area.placeholder = 'Please input something!';
        }
    });
}
export function show_post_box() {
    const parent = document.getElementById('large-feed');
    add_element_show_post(parent);
}
const getImageContent = (event) => {
    const [file] = event.target.files;

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    const valid = validFileTypes.find(type => type === file.type);
    const form = document.getElementsByClassName('post-form')[0];
    // bad data, let's walk away
    if (!valid)
        return false;
    // if we get here we have a valid image
    const reader = new FileReader();
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result.split(',')[1];
        const preview_img = document.getElementById('preview-image');
        if (preview_img === null)
           form.appendChild(createElement('img', null, { src: e.target.result, alt:'preview image', id:'preview-image' }))
        else
            preview_img.src = e.target.result;
        upload_file_data = { src: dataURL };
    };
        
    document.getElementById('upload-img-name').innerText = document.getElementById('upload-file-field').value.replace(/^.*[\\\/]/, '');
    // this returns a base64 image
    reader.readAsDataURL(file);
}

const upload_image = (data) => {
    const post_url = 'post/';
    const results = api_backend.postData(post_url, data, window.localStorage.getItem('AUTH_KEY'));
    results.then(result => {
        if ('post_id' in result) {
            const preview_img = document.getElementById('preview-image');
            preview_img.parentNode.removeChild(preview_img);
            const post_success = document.getElementById('post-success-word');
            post_success.style.display = 'block';
            document.getElementById('preview-image');
            localStorage['posts'] += `,${result.post_id}`;
            setTimeout(() => {
                post_success.style.display = 'none';
            }, 2000);
        }
    });
}

const put_image = (data, post_id, img_html_object, text_html_object) => {
    const post_url = `post?id=${post_id}`;
    const results = api_backend.putData(post_url, data, window.localStorage.getItem('AUTH_KEY'));
    results.then(res => {
        if ('message' in res && res.message === 'success') {
            img_html_object.src = `data:image/png;base64,${data.src}`;
            text_html_object.innerText = data.description_text;
            document.getElementById('modifyModal').style.display = 'none';
        }
    });
}
const fetch_likes_user = (likes, parent) => {
    for (const like of likes) {
        const results = api_backend.getData(`user?id=${like}`, window.localStorage.getItem('AUTH_KEY'));
        results
            .then(res => {
                if ('id' in res) {
                    const author = createElement('div', res.name, { style: 'width: 100%; font-weight: 600', class:'like-author' })
                    author.addEventListener('click', () => {
                        window.location.hash = `userid=${res.id}`;
                    })
                    parent.appendChild(author);
                }
            })
    }
}

export function show_likes(likes) {
    const parent = document.getElementById('modal-content');
    document.getElementById('myModal').style.display = 'block';
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.appendChild(createElement('h3', 'Likes:'));
    fetch_likes_user(likes, parent);
}
export function submit_like(likes, post_id, likes_count_div, like_box) {
    const my_post_id = parseInt(window.localStorage.getItem('id'));
    if (likes.includes(my_post_id)) {
        // do the unlike
        const results = api_backend.putData(`post/unlike?id=${post_id}`, {}, window.localStorage.getItem('AUTH_KEY'));
        results
            .then(res => {
                if ('message' in res && res.message === 'success') {
                    const index = likes.indexOf(my_post_id);
                    if (index > -1) likes.splice(index, 1);
                    likes_count_div.innerText = `${likes.length} likes`;
                    like_box.src = `${STATIC_URL}/like.png`;
                }
            })
        } else {
            // do the like
            const results = api_backend.putData(`post/like?id=${post_id}`, {}, window.localStorage.getItem('AUTH_KEY'));
            results
            .then(res => {
                if ('message' in res && res.message === 'success') {
                    likes.push(my_post_id);
                    likes_count_div.innerText = `${likes.length} likes`;
                    like_box.src = `${STATIC_URL}/liked.png`;
                }
            })
    }
}

export function submit_comment(comment, author, post_id, comments_num, comment_input, coment_list) {
    const timestamp = new Date().getTime() / 1000;
    const data = { author: author, comment: comment, published: timestamp };
    const results = api_backend.putData(`post/comment?id=${post_id}`, data, window.localStorage.getItem('AUTH_KEY'));
    results
        .then(res => {
            if ('message' in res) {
                if (res.message === 'success') {
                    coment_list.push(data);
                    comments_num.innerText = `${coment_list.length} comments`;
                    comment_input.value = '';
                }
            }
        })
}


export function show_comment(comments) {
    const parent = document.getElementById('modal-content');
    document.getElementById('myModal').style.display = 'block';
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    const sorted_comments = comments.sort((a, b) =>
        (parseFloat(b.published) - parseFloat(a.published)));
    parent.appendChild(createElement('h3', 'Comments:'));
    sorted_comments.reduce((div, comment) => {
        const comment_box = createElement('div', null, { class: 'comment-box' })
        const author = createElement('b', `${comment.author}: `, { class: 'comment-author' });
        const message = createElement('div', `  ${comment.comment}`);
        comment_box.appendChild(author);
        comment_box.appendChild(message);
        div.appendChild(comment_box);
        return div;
    }, parent);
}

export function delete_comfirm(post_id, section) {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
    const confirm = document.getElementById('delete-confirm-button');
    confirm.addEventListener('click', () => {
        const results = api_backend.deleteData(`post?id=${post_id}`, window.localStorage.getItem('AUTH_KEY'));
        results
            .then(res => {
                if ('message' in res && res.message === 'success') {
                    section.parentNode.removeChild(section);
                    modal.style.display = 'none';
                    window.history.back();
                }
            })
    })
}

export function modify_post(post_id, post_src, post_text) {
    const parent = document.getElementById('modify-modal-content');
    document.getElementById('modifyModal').style.display = 'block';
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    add_element_show_post(parent, post_id, post_src, post_text);
}
export function reset_post_id() {
    post_num = 0;
}
export function fetch_more() {
    fetch_feed(post_num);
}

export function newfeedmessage() {
    const parent = document.getElementById('large-feed');
    const feed = api_backend.getData('user/feed?p=0&n=1', window.localStorage.getItem('AUTH_KEY'));
    feed
        .then(posts => {
            if ('posts' in posts) {
                if (posts.posts.length > 0) {
                    if (posts.posts[0].id !== first_post_id) {
                        // new feed comes
                        if (!document.getElementById('notification')) {
                            const notification = createElement('div', 'You have new messages', {id: 'notification'});
                            notification.addEventListener('click', () => {
                                post_num = 0;
                                while (parent.childNodes[1]) {
                                    parent.removeChild(parent.childNodes[1]);
                                }
                                fetch_feed();
                            });
                            parent.insertBefore(notification, parent.childNodes[1])
                        }
                    } 
                }
            } else if ('message' in posts) {
                if (posts.message === 'Invalid Authorization Token') {
                    window.location.hash = '#expired';
                }
            }
        });
}