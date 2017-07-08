/*
 * Actions describe changes of state in your application
 */

// We import constants to name our actions' type
import {
  SET_AUTH,
  SET_USER,
  SENDING_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT,
  REQUEST_ERROR,
  CLEAR_ERROR,
  EDIT_POST_TITLE,
  EDIT_POST_CONTENT,
  CREATE_POST_REQUEST
} from './constants';

/**
 * Sets the authentication state of the application
 * @param  {boolean} newAuthState True means a user is logged in, false means no user is logged in
 */
export function setAuthState(newAuthState) {
  return {
    type: SET_AUTH,
    newAuthState
  };
}

export function setUser(newUserState) {
  return {
    type: SET_USER,
    newUserState
  };
}

/**
 * Sets the `currentlySending` state, which displays a loading indicator during requests
 * @param  {boolean} sending True means we're sending a request, false means we're not
 */
export function sendingRequest(sending) {
  return {
    type: SENDING_REQUEST,
    sending
  };
}

/**
 * Tells the app we want to log in a user
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.username The username of the user to log in
 * @param  {string} data.password The password of the user to log in
 */
export function loginRequest(data) {
  return {
    type: LOGIN_REQUEST,
    data
  };
}

/**
 * Tells the app we want to log out a user
 */
export function logout() {
  return {
    type: LOGOUT
  };
}

/**
 * Tells the app we want to register a user
 * @param  {object} data          The data we're sending for registration
 * @param  {string} data.username The username of the user to register
 * @param  {string} data.password The password of the user to register
 */
export function registerRequest(data) {
  return {
    type: REGISTER_REQUEST,
    data
  };
}

/**
 * Sets the `error` state to the error received
 * @param  {object} error The error we got when trying to make the request
 */
export function requestError(error) {
  return {
    type: REQUEST_ERROR,
    error
  };
}

/**
 * Sets the `error` state as empty
 */
export function clearError() {
  return {
    type: CLEAR_ERROR
  };
}

export function editPostTitle(title) {
  return {
    type: EDIT_POST_TITLE,
    title
  };
}

export function editPostContent(content) {
  return {
    type: EDIT_POST_CONTENT,
    content
  };
}

/**
 * Tells the app we want to log in a user
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.title    The title of the post
 * @param  {string} data.content  The content of the post
 */
export function createPostRequest(data) {
  return {
    type: CREATE_POST_REQUEST,
    data
  }
}