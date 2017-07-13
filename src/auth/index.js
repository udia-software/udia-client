import { get, del, post } from '../api';

// If testing, use localStorage polyfill, else use browser localStorage
const localStorage = global.process && process.env.NODE_ENV === 'test' ?
  // eslint-disable-next-line import/no-extraneous-dependencies
  require('localStorage') : global.window.localStorage;

export function me() {
  const strCurrentUser = localStorage.getItem('currentUser');
  if (strCurrentUser) {
    return JSON.parse(strCurrentUser);
  }
  return null;
}

/**
 * Checks if a user is logged in
 */
export function signedIn() {
  return !!localStorage.getItem('token');
}

/**
 * Get the locally stored user token
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Logs a user in, returning a promise with `true` when done
 * @param  {string} username The username of the user
 * @param  {string} password The password of the user
 */
export function signin(username, password) {
  if (signedIn()) return Promise.resolve(true);

  return post('/sessions', {
    username,
    password
  }).then((response) => {
    // Save token to local storage
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    return Promise.resolve(true);
  });
}

/**
 * Logs the current user out
 */
export function signout() {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  return del('/sessions').then(() => Promise.resolve(true));
}

/**
 * Registers a user and then logs them in
 * @param  {string} username The username of the user
 * @param  {string} password The password of the user
 */
export function signup(username, password) {
  return post('/users', {
    username,
    password
  }).then((response) => {
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    return Promise.resolve(true);
  });
}

/**
 * Get the specified user
 * @param {string} username The value of the user's username
 */
export function getUser(username) {
  return get(`/users/${username}`);
}

/**
 * Get all of the users
 */
export function getUsers() {
  return get('/users');
}
