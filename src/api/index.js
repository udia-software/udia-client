const isDevelopment = process.env.NODE_ENV === 'development';
let API = '/api';
if (isDevelopment) {
  API = 'http://127.0.0.1:4000/api';
} else {
  API = 'https://udia-staging.herokuapp.com/api';
}

// If testing, use localStorage polyfill, else use browser localStorage
const localStorage = global.process && process.env.NODE_ENV === 'test' ?
  // eslint-disable-next-line import/no-extraneous-dependencies
  require('localStorage') : global.window.localStorage;

function headers() {
  const token = JSON.parse(localStorage.getItem('token'));

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer: ${token}`
  };
}

function parseResponse(response) {
  return response.json().then((json) => {
    if (!response.ok) {
      return Promise.reject(json);
    }
    return json;
  });
}

function queryString(params) {
  const query = Object.keys(params)
                      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
                      .join('&');
  return `${query.length ? '?' : ''}${query}`;
}

export function get(url, params = {}) {
  return fetch(`${API}${url}${queryString(params)}`, {
    method: 'GET',
    headers: headers()
  })
  .then(parseResponse);
}

export function post(url, data) {
  const body = JSON.stringify(data);

  return fetch(`${API}${url}`, {
    method: 'POST',
    headers: headers(),
    body
  })
  .then(parseResponse);
}

export function patch(url, data) {
  const body = JSON.stringify(data);

  return fetch(`${API}${url}`, {
    method: 'PATCH',
    headers: headers(),
    body
  })
  .then(parseResponse);
}

export function del(url) {
  return fetch(`${API}${url}`, {
    method: 'DELETE',
    headers: headers()
  })
  .then(parseResponse);
}