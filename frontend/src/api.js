// change this when you integrate with the real API, or when u start using the dev server
const API_URL = 'http://localhost:8080/data'


/**
 * This is a sample class API which you may base your code on.
 * You don't have to do this as a class.
 */
export default class API {

    /**
     * Defaults to teh API URL
     * @param {string} url 
     */
    constructor(url = API_URL) {
        this.url = url;
    } 

    /**
     * sending request to the destination
     * @param {string} path
     * @returns feed array in json format
     */
    getData(path, token = null) {
        return fetch(`${this.url}/${path}`, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                // 'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Credentials':true,
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Token ${token}`
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
        })
            .then(response => response.json()) // parses response to JSON
    }

    /**
    * putting request to the destination
     * @param {string} path
     * @param {oject} data
     * @returns feed array in json format
     */
    putData(path, data = {}, token = null) {
        // Default options are marked with *
        return fetch(`${this.url}/${path}`, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: 'omit',
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                // 'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Token ${token}`
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match 'Content-Type' header
        })
            .then(response => response.json()) // parses response to JSON
    }


    /**
    * posting request to the destination
     * @param {string} path
     * @param {oject} data
     * @returns feed array in json format
     */
    postData(path, data = {}, token = null) {
        // Default options are marked with *
        return fetch(`${this.url}/${path}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin',
            // credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                // 'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Token ${token}`
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data), // body data type must match 'Content-Type' header
        })
            .then(response => response.json()) // parses response to JSON
    }
    deleteData(path, token = null) {
        // Default options are marked with *
        return fetch(`${this.url}/${path}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin',
            // credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                // 'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Token ${token}`
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            // body: JSON.stringify(data), // body data type must match 'Content-Type' header
        })
            .then(response => response.json()) // parses response to JSON
    }
}

