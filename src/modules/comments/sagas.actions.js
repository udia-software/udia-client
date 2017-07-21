import { CREATE_COMMENT_REQUEST, GET_COMMENTS_REQUEST } from "./constants";

/**
 * Saga action for triggering an async Create Comment HTTP request.
 * @param {Object} data - Saga send comment payload
 * @param {string} data.content - Content of the comment
 * @param {string} data.post_id - ID of the post comment is replying under
 * @param {string|null} data.parent_id - ID of the parent comment, or null if root
 */
export function createCommentRequest(data) {
  return {
    type: CREATE_COMMENT_REQUEST,
    data
  };
}

/**
 * Saga action for triggering an async Get Comments HTTP request.
 * @param {Object} data - Saga get comments payload
 * @param {string} data.page - Pagination Page of the comments to get
 * @param {string} data.post_id - ID of the post comment is replying under
 * @param {string|null} data.parent_id - ID of the parent comment, or null if root
 */
export function getCommentsRequest(data) {
  return {
    type: GET_COMMENTS_REQUEST,
    data
  };
}
