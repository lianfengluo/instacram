export const BACKEND_URL = 'http://localhost:5000';
export const STATIC_URL = 'http://localhost:8080/data';
// this variable is used to keep track on whether have new message comming
export let first_post_id_time = null;

export function set_notification_time(time) {
    first_post_id_time = time;
} 