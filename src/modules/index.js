/*
 * Actions describe changes of state in your application
 */

// We import constants to name our actions' type
import {
  SENDING_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR,
  EDIT_POST_TITLE,
  EDIT_POST_CONTENT,
  CREATE_POST_REQUEST,
  ADD_POSTS,
  SET_POST,
  GET_POSTS_REQUEST,
  GET_POST_BY_ID_REQUEST,
  GET_USER_BY_USERNAME_REQUEST,
  CREATE_COMMENT_REQUEST,
  EDIT_COMMENT_CONTENT,
  GET_COMMENTS_REQUEST,
  CLEAR_COMMENTS_STATE
} from './constants';

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
 * Tells the app we want to log out our currently signed in user
 */
export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST
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

/**
 * Sets the title of the post currently being edited/created
 * @param {string} title Title of the post currently being edited/created
 */
export function editPostTitle(title) {
  return {
    type: EDIT_POST_TITLE,
    title
  };
}

/**
 * Sets the content for the post currently being edited/created
 * @param {string} content Content of the post currently being edited/created
 */
export function editPostContent(content) {
  return {
    type: EDIT_POST_CONTENT,
    content
  };
}

/**
 * Tells the app we want to create a post
 * @param  {object} data          The data we're sending for log in
 * @param  {string} data.title    The title of the post
 * @param  {string} data.content  The content of the post
 */
export function createPostRequest(data) {
  return {
    type: CREATE_POST_REQUEST,
    data
  };
}

export function addPosts(posts) {
  return {
    type: ADD_POSTS,
    posts
  };
}

export function getPosts(page) {
  return {
    type: GET_POSTS_REQUEST,
    page
  };
}

export function getPostById(id) {
  return {
    type: GET_POST_BY_ID_REQUEST,
    id
  };
}

export function setPost(post) {
  return {
    type: SET_POST,
    post
  };
}

/**
 * Create a comment for a given post
 * @param {object} data The data we're sending for comment creation
 * @param {string} data.content Body of the comment to create
 * @param {string|null} data.parent_id ID of the comment we are replying to (null for root)
 * @param {string} data.post_id ID of the post we are commenting in
 */
export function createCommentRequest(data) {
  return {
    type: CREATE_COMMENT_REQUEST,
    data
  }
}

/**
 * Edit the value for a comment currently being written
 * @param {string|null} parent_id 
 * @param {string} content 
 */
export function editCommentContent(parent_id, content) {
  return {
    type: EDIT_COMMENT_CONTENT,
    parent_id,
    content
  }
}

/**
 * Get the comments for a given post
 * @param {*} data  object
 * @param {string} data.page
 * @param {string} data.post_id
 * @param {string|null} data.parent_id
 */
export function getCommentsRequest(data) {
  return {
    type: GET_COMMENTS_REQUEST,
    data
  }
}

export function clearCommentsState() {
  return {
    type: CLEAR_COMMENTS_STATE
  }
}