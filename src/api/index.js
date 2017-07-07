const isDevelopment = process.env.NODE_ENV === 'development';

export let API_ENDPOINT = '/api';
if (isDevelopment) {
  API_ENDPOINT = 'http://127.0.0.1:4000/api';
} else {
  API_ENDPOINT = 'https://a.udia.ca/api';
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
  return fetch(`${API_ENDPOINT}${url}${queryString(params)}`, {
    method: 'GET',
    headers: headers()
  })
  .then(parseResponse);
}

export function post(url, data) {
  const body = JSON.stringify(data);

  return fetch(`${API_ENDPOINT}${url}`, {
    method: 'POST',
    headers: headers(),
    body
  })
  .then(parseResponse);
}

export function patch(url, data) {
  const body = JSON.stringify(data);

  return fetch(`${API_ENDPOINT}${url}`, {
    method: 'PATCH',
    headers: headers(),
    body
  })
  .then(parseResponse);
}

export function del(url) {
  return fetch(`${API_ENDPOINT}${url}`, {
    method: 'DELETE',
    headers: headers()
  })
  .then(parseResponse);
}