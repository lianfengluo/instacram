const URL = 'http://localhost:8080/data'
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
export function createPostTile(post) {
    const section = createElement('section', null, { class: 'post' });

    section.appendChild(createElement('h2', post.meta.author, { class: 'post-title' }));
    section.appendChild(createElement('img', null, 
    { src: '/images/'+post.src, alt: post.meta.description_text, class: 'post-image' }));
    section.appendChild(createElement("p", null, { class: "post-description_text"}));
    const section_box = createElement("section", null, {class: "post-box"});
    const comments_box = createElement("div", null, { class: "post-comments-box" });
    comments_box.appendChild(createElement("img", null, {alt:"comments icon", class:"comments-icon", src: `${URL}/blogging.svg`}))
    
    const like_box = createElement("div", null, { class: "post-likes-box" });
    like_box.appendChild(createElement("img", null, {alt:"likes icon", class:"likes-icon", src: `${URL}/like.svg`}))
    section_box.appendChild(comments_box);
    section_box.appendChild(like_box);
    section.appendChild(section_box);
    section.appendChild(createElement("p", `${post.meta.likes.length} likes`, { class: "post-likes-num" }));
    section.appendChild(createElement("p", `${post.meta.comments.length} comments`, { class: "post-comments-num" }));
    section.appendChild(createElement("i", getDateString(post.meta.published), { class: "post-pushlished-time"}));
    return section;
}

// Given an input element of type=file, grab the data uploaded for use
export function uploadImage(event) {
    const [ file ] = event.target.files;

    const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
    const valid = validFileTypes.find(type => type === file.type);

    // bad data, let's walk away
    if (!valid)
        return false;
    
    // if we get here we have a valid image
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // do something with the data result
        const dataURL = e.target.result;
        const image = createElement('img', null, { src: dataURL });
        document.body.appendChild(image);
    };

    // this returns a base64 image
    reader.readAsDataURL(file);
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

const addZero = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

const getDateString = (string) => {
    const date = new Date(string);
    let dd = addZero(date.getDate());
    let mm = addZero(date.getMonth() + 1); //January is 0!
    let yyyy = date.getFullYear();
    let h = addZero(date.getHours());
    let m = addZero(date.getMinutes());
    let s = addZero(date.getSeconds());

    const new_date = h + ":" + m + ":" + s + ' ' + mm + '/' + dd + '/' + yyyy;
    return new_date
}