import {
  IS_SENDING_COMMENT,
  SET_COMMENT_ERROR,
  CLEAR_COMMENT_ERROR,
  ADD_COMMENT,
  ADD_COMMENTS,
  CLEAR_COMMENTS_STATE,
  SET_COMMENT_CONTENT,
  TOGGLE_COMMENT_REPLY_BOX,
  TOGGLE_EDIT_COMMENT,
  SET_EDIT_COMMENT_CONTENT,
  CLEAR_EDIT_COMMENT,
  REPLACE_COMMENT
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
  let err = "" + exception;
  if (response.status) {
    err = `${response.status} ${response.statusText}`;
  }
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

/**
 * Reducer action for toggling the reply box of the comment
 * @param {number} comment_id - ID of the comment user is replying to
 */
export function toggleCommentReplyBox(comment_id) {
  return {
    type: TOGGLE_COMMENT_REPLY_BOX,
    data: comment_id
  };
}

/**
 * Reducer action for toggling the edit comment functionality
 * @param {number} comment_id - ID of the comment user is editing
 * @param {string} content - Content of the comment
 */
export function toggleEditComment(comment_id, content) {
  return {
    type: TOGGLE_EDIT_COMMENT,
    data: {
      comment_id,
      content
    }
  };
}

/**
 * Reducer action for changing the edit comment string
 * @param {number} comment_id - ID of the comment user is editing
 * @param {string} content - Content of the comment
 */
export function setEditCommentContent(comment_id, content) {
  return {
    type: SET_EDIT_COMMENT_CONTENT,
    data: {
      comment_id,
      content
    }
  };
}

/**
 * Reducer action for clearing the edit comment state
 * @param {number} comment_id - ID of the edit comment state to clear
 */
export function clearEditComment(comment_id) {
  return {
    type: CLEAR_EDIT_COMMENT,
    data: comment_id
  };
}

/**
 * Reducer action for replacing a comment object in the list of comments
 * @param {number} parent_id - Parent ID of the comment we are replacing
 * @param {number} comment_id - ID of the comment we are replacing
 * @param {Object} comment - Object structure we are replacing the comment with
 */
export function replaceComment(parent_id, comment_id, comment) {
  return {
    type: REPLACE_COMMENT,
    data: {
      parent_id,
      comment_id,
      comment
    }
  };
}
