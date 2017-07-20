import axios from "axios";
const isDevelopment = process.env.NODE_ENV === "development";

export let API_ENDPOINT = "/api";
if (isDevelopment) {
  API_ENDPOINT = "http://127.0.0.1:4000/api";
} else {
  API_ENDPOINT = "https://a.udia.ca/api";
}

// If testing, use localStorage polyfill, else use browser localStorage
const localStorage = global.process && process.env.NODE_ENV === "test"
  ? // eslint-disable-next-line import/no-extraneous-dependencies
    require("localStorage")
  : global.window.localStorage;

function headers() {
  const token = localStorage.getItem("token") || "";

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer: ${token}`
  };
}

const apiInstance = axios.create({
  baseURL: API_ENDPOINT,
  timeout: 3000,
});

export function get(url, params = {}) {
  return apiInstance
    .get(url, {params, headers: headers()})
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}

export function post(url, data) {
  return apiInstance
    .post(url, data, {headers: headers()})
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}

export function patch(url, data) {
  return apiInstance
    .patch(url, data, {headers: headers()})
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}

export function del(url) {
  return apiInstance
    .delete(url, {headers: headers()})
    .then(response => response.data)
    .catch(error => Promise.reject(error));
}
