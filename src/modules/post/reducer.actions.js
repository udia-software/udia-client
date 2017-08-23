import {
  IS_SENDING_POST,
  SET_POST_ERROR,
  CLEAR_POST_ERROR,
  SET_POST,
  SET_POST_TITLE,
  SET_POST_CONTENT,
  SET_EDIT_POST_SUCCESS
} from "./constants";

/**
 * Reducer action for setting loading in the post functionality
 * @param {boolean} sendingRequest - Boolean for if the request's sending
 */
export function isSendingPost(sendingRequest) {
  return {
    type: IS_SENDING_POST,
    data: sendingRequest
  };
}

/**
 * Reducer action for setting an error message in the post functionality
 * @param {Object|string} exception - Exception object or string
 */
export function setPostError(exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = "" + exception;
  if (response.status) {
    err = `${response.status} ${response.statusText}`;
  }
  return {
    type: SET_POST_ERROR,
    data: data.errors || data.error || err
  };
}

/**
 * Reducer action for clearing an error message in the post functionality
 */
export function clearPostError() {
  return {
    type: CLEAR_POST_ERROR
  };
}

/**
 * Reducer action for setting the post object on viewing.
 * @param {Object|null} post - The post object
 */
export function setPost(post) {
  return {
    type: SET_POST,
    data: post
  };
}

/**
 * Reducer action for setting the post title on create/update.
 * @param {string} title - The title of the post
 */
export function setPostTitle(title) {
  return {
    type: SET_POST_TITLE,
    data: title
  };
}

/**
 * Reducer action for setting the post content on create/update.
 * @param {string} content - The content of the post
 */
export function setPostContent(content) {
  return {
    type: SET_POST_CONTENT,
    data: content
  };
}

/**
 * Reducer action for setting the post editing success value
 * @param {boolean} successful - Whether or not the edit post request was successful
 */
export function setEditPostSuccess(successful) {
  return {
    type: SET_EDIT_POST_SUCCESS,
    data: successful
  };
}
