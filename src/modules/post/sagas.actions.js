import { CREATE_POST_REQUEST, GET_POST_REQUEST, EDIT_POST_REQUEST } from "./constants";

/**
 * Saga action for triggering an async Create Post HTTP request
 * @param {Object} data - Saga create post payload
 * @param {string} data.title - Title of post
 * @param {string} data.content - Content of post
 */
export function createPostRequest(data) {
  return {
    type: CREATE_POST_REQUEST,
    data
  };
}

/**
 * Saga action for triggering an async Get Post HTTP request
 * @param {Object} data - Saga get post payload
 * @param {string} data.id - ID of post to get
 */
export function getPostRequest(data) {
  return {
    type: GET_POST_REQUEST,
    data
  };
}

/**
 * Saga action for triggering an async Edit Post HTTP request
 * @param {Object} data - Saga edit post payload
 */
export function editPostRequest(data) {
  return {
    type: EDIT_POST_REQUEST,
    data
  }
}
