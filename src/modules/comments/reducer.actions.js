import {
  IS_SENDING_COMMENT,
  SET_COMMENT_ERROR,
  CLEAR_COMMENT_ERROR,
  ADD_COMMENT,
  ADD_COMMENTS,
  CLEAR_COMMENTS_STATE,
  SET_COMMENT_CONTENT
} from "./constants";

/**
 * Reducer action for setting when a user is submiting a comment
 * @param {string|null} parent_id - Parent comment id (null if root)
 * @param {boolean} sendingRequest - loading state boolean
 */
export function isSendingComment(parent_id, sendingRequest) {
  return {
    type: IS_SENDING_COMMENT,
    data: {
      parent_id,
      isSending: sendingRequest
    }
  };
}

/**
 * Reducer action for setting an error message in the comments functionality
 * @param {string|null} parent_id - Parent comment id (null if root)
 * @param {Object|String} exception - Exception
 */
export function setCommentError(parent_id, exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = `${response.status} ${response.statusText}`;
  return {
    type: SET_COMMENT_ERROR,
    data: {
      parent_id,
      err: data.errors || data.error || err
    }
  };
}

/**
 * Reducer action for clearing an error message in the comments functionality
 * @param {string|null} parent_id - Parent comment id (null if root)
 */
export function clearCommentError(parent_id) {
  return {
    type: CLEAR_COMMENT_ERROR,
    data: { parent_id }
  };
}

/**
 * Reducer action for adding a comment to the comments
 * @param {string|null} parent_id - Parent comment id (null if root)
 * @param {Object} comment - Comment object
 */
export function addComment(parent_id, comment) {
  return {
    type: ADD_COMMENT,
    data: { parent_id, comment }
  };
}

/**
 * Reducer action for adding a list of comments to the comments functionality
 * @param {string|null} parent_id - Parent comment id (null if root)
 * @param {array} comments - array of comments to add
 * @param {Object} pagination - Pagination object for given parent_id ref
 */
export function addComments(parent_id, comments, pagination) {
  return {
    type: ADD_COMMENTS,
    data: { parent_id, comments, pagination }
  };
}

/**
 * Reducer action for clearing the comments functionality state
 */
export function clearCommentsState() {
  return {
    type: CLEAR_COMMENTS_STATE
  };
}

/**
 * Reducer action for setting the text of the current comment ref
 * @param {string|null} parent_id - Parent comment id (null if root)
 * @param {string} content - Content of the comment
 */
export function setCommentContent(parent_id, content) {
  return {
    type: SET_COMMENT_CONTENT,
    data: { parent_id, content }
  };
}
