import { show_likes, submit_comment, show_comment, submit_like, delete_comfirm } from './feed.js'
const STATIC_URL = 'http://localhost:8080/data'
/* returns an empty array of size max */
export const range = (max) => Array(max).fill(null);

/* returns a randomInteger */
export const randomInteger = (max = 1) => Math.floor(Math.random()*max);

/* returns a randomHexString */
const randomHex = () => randomInteger(256).toString(16);

/* returns a randomColor */
export const randomColor = () => '#'+range(3).map(randomHex).join('');

/**
 * You don't have to use this but it may or may not simplify element creation
 * 
 * @param {string}  tag     The HTML element desired
 * @param {any}     data    Any textContent, data associated with the element
 * @param {object}  options Any further HTML attributes specified
 */
export function createElement(tag, data, options = {}) {
    const el = document.createElement(tag);
    el.textContent = data;
   
    // Sets the attributes in the options object to the element
    return Object.entries(options).reduce(
        (element, [field, value]) => {
            element.setAttribute(field, value);
            return element;
        }, el);
}

/**
 * Given a post, return a tile with the relevant data
 * @param   {object}        post 
 * @returns {HTMLElement}
 */
export function createFeed(post) {
    const section = createElement('section', null, { class: 'post' });
    const post_heading = createElement('div', null, { class: 'post-heading' });
    const author_name = createElement('h2', post.meta.author, { class: 'post-title' });
    post_heading.appendChild(author_name);
    // check if the author
    if (window.localStorage.getItem('posts').includes(post.id)) {
        const close = createElement('span', null, { class: 'delete' })
        close.innerHTML = '&times;'
        close.addEventListener('click', () => {
            delete_comfirm(post.id, section);
        })
        post_heading.appendChild(close);
    }
    section.appendChild(post_heading);
    const post_img = createElement('img', null, { src: `data:image/png;base64,${post.thumbnail}`,
        alt: post.meta.description_text, class: 'post-image' 
    })
    section.appendChild(post_img);
    post_img.addEventListener('click', () => {
        window.location.hash = `#post=${post.id}`;
    });
    section.appendChild(createElement('p', null, { class: 'post-description_text'}));
    const section_box = createElement('section', null, {class: 'post-box'});
    const comments_box = createElement('div', null, { class: 'post-comments-box' });
    comments_box.appendChild(createElement('img', null, {alt:'comments icon', class:'comments-icon', src: `${STATIC_URL}/blogging.svg`}))
    const like_box = createElement('div', null, { class: 'post-likes-box' });
    const like_icon = createElement('img', null, { alt: 'likes icon', class: 'likes-icon', src: `${STATIC_URL}/like.png` });
    like_box.appendChild(like_icon);
    if (post.meta.likes.includes(parseInt(window.localStorage.getItem('id')))) {
        like_icon.src = `${STATIC_URL}/liked.png`;
    }
    section_box.appendChild(comments_box);
    section_box.appendChild(like_box);
    section.appendChild(section_box);
    const likes_count_div = createElement('p', `${post.meta.likes.length} likes`, { class: 'post-likes-num' });
    section.appendChild(likes_count_div);
        like_box.addEventListener('click', () => {
            submit_like(post.meta.likes, post.id, likes_count_div, like_icon);
        })
    const comments_num = createElement('p', `${post.comments.length} comments`, { class: 'post-comments-num' });
    section.appendChild(comments_num);
    const description = createElement('div', null, { class:'description-box' });
    const author_b = createElement('b', post.meta.author);
    const text = createElement('div', post.meta.description_text);
    description.appendChild(author_b);
    description.appendChild(text);
    section.appendChild(description);
    comments_num.addEventListener('click', () => {
        show_comment(post.comments);
    })
    likes_count_div.addEventListener('click', () => {
        show_likes(post.meta.likes);
    })
    const comment_div = createElement('div', null, {class: 'comment-area'});
    const comment_input = createElement('input', null, { class: 'comment-input', placeholder:'Input your comment' });
    const comment_submit_button = createElement('button', 'comment', {class: 'comment-button'});
    comment_div.appendChild(comment_input);
    comment_div.appendChild(comment_submit_button);
    section.appendChild(comment_div);
    comments_box.addEventListener('click', () => {
        comment_div.style.display = 'inline-block';
    });
    comment_submit_button.addEventListener('click', () => {
        submit_comment(comment_input.value, window.localStorage.getItem('name'), post.id, comments_num, comment_input, post.comments);
    })
    if (window.localStorage.getItem('posts').includes(post.id)) {
        const modify = createElement('div', 'Modify this post', { class: 'modify-region' });
        section.appendChild(createElement('hr', null));
        section.appendChild(modify);
    }
    section.appendChild(createElement('i', getDate(post.meta.published), { class: 'post-pushlished-time' }));
    return section;
}



/* 
    Reminder about localStorage
    window.localStorage.setItem('AUTH_KEY', someKey);
    window.localStorage.getItem('AUTH_KEY');
    localStorage.clear()
*/
export function checkStore(key) {
    if (window.localStorage)
        return window.localStorage.getItem(key)
    else
        return null

}
/**
 *  input a int
 *  if the int is smaller than 10 padding the zero
 *  @param  {string} i
 *  @return {string}
 */
const addZero = (i) => {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}

/**
 * input a timestamp string, output formatted date time
 * @param   {string}        string 
 * @returns {string}
 */
const getDate = (string) => {
    let date = new Date(string * 1000);
    let dd = addZero(date.getDate());
    let mm = addZero(date.getMonth() + 1); //January is 0!
    let yyyy = date.getFullYear();
    let h = addZero(date.getHours());
    let m = addZero(date.getMinutes());
    let s = addZero(date.getSeconds());

    const new_date = h + ':' + m + ':' + s + ' ' + mm + '/' + dd + '/' + yyyy;
    return new_date
}
