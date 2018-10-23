// importing named exports we use brackets
import { createFeed, createElement } from './helpers.js';
import { BACKEND_URL, first_post_id_time, set_notification_time } from './global_var.js';
import API from './api.js';
// when importing 'default' exports, use below syntax



const api_backend = new API(BACKEND_URL);
// we can use this single api request multiple times
// const feed = api.getFeed();

// this variable is used to keep track on the infinite post
let post_num = 0;

/**
 * fetch feed function is about sending the request to backend and fetch the posts
 * @param {number} p the starting position of fetching data 
 * @param {number} n how posts we want to fetch
 */
export function fetch_feed(p=0, n=10) {
    const feed = api_backend.getData(`user/feed?p=${p}&n=${n}`, window.localStorage.getItem('AUTH_KEY'));
    feed
        .then(posts => {
            if ('posts' in posts) {
                if (posts.posts.length > 0) {
                    posts.posts.reduce((parent, post) => {
                        if (post_num++ === 0){
                            set_notification_time(post.meta.published)
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
/**
 * This function is build the dom tree of posting
 * we will have to cases in this dom 
 * 1.user posting the post
 * 2.user change the post
 * @param {htmlNode} parent Parent that the new node we are going to append on
 * @param {number} post_id the when use change the posts we have to provide the post id
 * @param {htmlNode} img_html_object this is the img html node
 * @param {htmlNode} text_html_object this is the updating text
 */
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
        class: 'upload-icon', src: '../data/upload-button.svg',
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
    upload_file.addEventListener('change', (e) => {
        if (getImageContent(e) === false) {
            upload_file_name.innerText = 'Invalid image format';
        }
    });
    submit_post_button.addEventListener('click', (e) => {
        e.preventDefault();
        if (text_area.value)
            upload_file_data['description_text'] = text_area.value;
        if (post_id !== null) {
            if (!('src' in upload_file_data)) {
                upload_file_data['src'] = img_html_object.src.split(',')[1];
            }
            if (!('description_text' in upload_file_data)) {
                upload_file_data['description_text'] = text_html_object.innerText;
            }
            put_image(upload_file_data, post_id, img_html_object, text_html_object);
            upload_file_name.innerText = 'No image has been chosen';
            upload_file.value = '';
            upload_file_data = {};
            text_area.value = '';
            text_area.placeholder = 'Something you want to say...';
        } else {
            if (text_area.value && 'src' in upload_file_data) {
                upload_image(upload_file_data);
                upload_file_name.innerText = 'No image has been chosen';
                upload_file.value = '';
                upload_file_data = {};
                text_area.value = '';
                text_area.placeholder = 'Something you want to say...';
            }else {
                if (!text_area.value)
                    text_area.placeholder = 'Please input something!';
                if (!('src' in upload_file_data))
                    upload_file_name.innerText = 'Please upload your image';
            }
        } 
    });
}
/**
 * show post box is the html node that will let user
 * to post their image
 */
export function show_post_box() {
    const parent = document.getElementById('large-feed');
    add_element_show_post(parent);
}
/**
 * get image content is a function that will load the
 * uploaded image to the variable which is about to submit to the backend
 * @param {event}  event which is a event that when use change the uploading file
 * @return {boolean} return false if it not a image 
 */
const getImageContent = (event) => {
    event.preventDefault();
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
        
    document.getElementById('upload-img-name').innerText = document.getElementById('upload-file-field').value.replace(/^.*[\\/]/, '');
    // this returns a base64 image
    reader.readAsDataURL(file);
}
/**
 * function for posting the posts to the backend
 * @param {object} data the data we want to upload 
 */
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
            if (window.localStorage['posts'].length === 0) {
                window.localStorage['posts'] += `${result.post_id}`;
            } else {
                window.localStorage['posts'] += `,${result.post_id}`;
            }
            setTimeout(() => {
                post_success.style.display = 'none';
            }, 2000);
        }
    });
}
/**
 * function for updating the posts to the backend
 * @param {object} data  the data we want to update
 * @param {number} post_id the post id we want to update
 * @param {htmlNode} img_html_object change the image object when update is success
 * @param {htmlNode} text_html_object  change the text description object when update is success
 */
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
/**
 * fecth the info of the user that like this post
 * @param {list} likes a list of user id
 * @param {htmlNode} parent the new post in the likes area
 */
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
/**
 * show all the likes in the page
 * @param {list} likes a list user id that likes this posts
 */
export function show_likes(likes, title = 'Likes') {
    const parent = document.getElementById('modal-content');
    document.getElementById('myModal').style.display = 'block';
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.appendChild(createElement('h3', `${title}:`));
    fetch_likes_user(likes, parent);
}
/**
 * function that will handle event that when user likes this post
 * @param {list} likes a list user id that likes this posts
 * @param {number} post_id the post id we want to update
 * @param {htmlNode} likes_count_div update the like count without refresh
 * @param {htmlNode} like_box update the like icon without refresh
 */
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
                    like_box.src = '../data/like.png';
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
                    like_box.src = '../data/liked.png';
                }
            })
    }
}
/**
 * function that will handle event that when user submit comment on this post
 * update the comment count without refresh
 * @param {string} comment 
 * @param {string} author 
 * @param {number} post_id 
 * @param {htmlNode} comments_num 
 * @param {htmlNode} comment_input 
 * @param {htmlNode} coment_list 
 */
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

/**
 * show the command of the posts
 * @param {htmlNode} comments 
 */
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

/**
 * comfirm removing the page
 * @param {number} post_id post we want to delete
 * @param {htmlNode} section remove the page section
 */
export function delete_comfirm(post_id) {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'block';
    const confirm = document.getElementById('delete-confirm-button');
    confirm.addEventListener('click', () => {
        const results = api_backend.deleteData(`post?id=${post_id}`, window.localStorage.getItem('AUTH_KEY'));
        results
            .then(res => {
                if ('message' in res && res.message === 'success') {
                    let posts_list = window.localStorage.getItem('posts').split(',');
                    const index = posts_list.indexOf(post_id.toString());
                    posts_list.splice(index, 1);
                    window.localStorage.setItem('posts', posts_list.toString());
                    modal.style.display = 'none';
                    window.history.back();
                }
            })
    })
}
/**
 * the update posts event function
 * @param {number} post_id 
 * @param {strint} post_src 
 * @param {string} post_text 
 */
export function modify_post(post_id, post_src, post_text) {
    const parent = document.getElementById('modify-modal-content');
    document.getElementById('modifyModal').style.display = 'block';
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    add_element_show_post(parent, post_id, post_src, post_text);
}
/**
 * reset_post_id
 */
export function reset_post_id() {
    post_num = 0;
}
/**
 * infinite fetch feed
 */
export function fetch_more() {
    fetch_feed(post_num);
}




/**
 * function the push notification
 */
export function newfeedmessage() {
    const feed = api_backend.getData('user/feed?p=0&n=10', window.localStorage.getItem('AUTH_KEY'));
    feed
        .then(posts => {
            if ('posts' in posts) {
                if (posts.posts.length > 0) {
                    let num_of_new = 0;
                    let newest_time = null;
                    // new feed comes
                    for (const post_index in posts.posts) {
                        if (post_index == 0)
                            newest_time = posts.posts[post_index].meta.published
                        if (first_post_id_time && posts.posts[post_index].meta.published > first_post_id_time) {
                            ++num_of_new
                        } else {
                            break
                        }
                    }
                    set_notification_time(newest_time);
                    let notification = null;
                    if (num_of_new > 0) {
                        if (num_of_new === 10)
                            notification = new Notification('You have 10+ new notification')
                        else if(num_of_new > 0) 
                            notification = new Notification(`You have ${num_of_new} new notification`)
                        setTimeout(notification.close.bind(notification), 4000)
                    }
                }
            }
        })
}