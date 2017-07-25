import { GET_POSTS_REQUEST } from "./constants";

/**
 * Saga action for triggering an async Get Posts HTTP request
 * @param {Object} data - Saga get posts payload
 * @param {string} data.page - The page of posts to get
 */
export function getPostsRequest(data) {
  return {
    type: GET_POSTS_REQUEST,
    data
  }
}
