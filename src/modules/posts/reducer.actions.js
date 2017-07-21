import {
  IS_GETTING_POSTS,
  SET_POSTS_ERROR,
  CLEAR_POSTS_ERROR,
  ADD_POSTS,
  CLEAR_POSTS,
  SET_POSTS_PAGINATION
} from "./constants";

/**
 * Reducer action for setting loading in the posts functionality
 * @param {boolean} sendingRequest - Boolean for loading state
 */
export function isGettingPosts(sendingRequest) {
  return {
    type: IS_GETTING_POSTS,
    data: sendingRequest
  }
}
/**
 * Reducer action for setting an error message in the posts functionality
 * @param {Object|String} exception - Exception object or string
 */
export function setPostsError(exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = `${response.status} ${response.statusText}`;
  return {
    type: SET_POSTS_ERROR,
    data: data.errors || data.error || err
  };
}

/**
 * Reducer action for clearing an error message in the posts functionality
 */
export function clearPostsError() {
  return {
    type: CLEAR_POSTS_ERROR
  };
}

/**
 * Reducer action for adding posts to the posts functionality
 * @param {array} posts - Array of posts objects
 */
export function addPosts(posts) {
  return {
    type: ADD_POSTS,
    data: posts
  }
}

/**
 * Reducer action for clearing all posts from the posts functionality
 */
export function clearPosts() {
  return {
    type: CLEAR_POSTS
  }
}

/**
 * Reducer action for setting the posts pagination data
 * @param {Object} pagination - Posts pagination data
 */
export function setPostsPagination(pagination) {
  return {
    type: SET_POSTS_PAGINATION,
    data: pagination
  }
}