import { effects } from "redux-saga";
import { createComment, editComment, getComments } from "./api";
import {
  CREATE_COMMENT_REQUEST,
  EDIT_COMMENT_REQUEST,
  GET_USER_COMMENTS_REQUEST
} from "./constants";
import {
  isSendingComment,
  setCommentError,
  clearCommentError,
  setCommentContent,
  addComment,
  addComments,
  toggleCommentReplyBox,
  clearEditComment,
  replaceComment,
  isGettingUserComments,
  setUserCommentsError,
  clearUserCommentsError,
  clearUserComments,
  setUserCommentsPagination,
  addUserComments
} from "./reducer.actions";

/**
 * Generator function for creating a comment.
 * @param {Object} data - Saga send comment payload
 * @param {string} data.content - Content of the comment
 * @param {string} data.post_id - ID of the post comment is replying under
 * @param {string|null} data.parent_id - ID of the parent comment, or null if root
 */
function* createCommentCall(data) {
  const { content, post_id, parent_id } = data;
  yield effects.put(isSendingComment(parent_id, true));
  try {
    return yield effects.call(createComment, content, post_id, parent_id);
  } catch (exception) {
    yield effects.put(setCommentError(parent_id, exception));
    return false;
  } finally {
    yield effects.put(isSendingComment(parent_id, false));
  }
}

/**
 * Generator function for editing a comment.
 * @param {Object} data - Saga edit comment payload
 * @param {string} data.comment_id - ID of the comment to be edited
 * @param {string} data.content - New content of the comment
 */
function* editCommentCall(data) {
  const { comment_id, content } = data;
  yield effects.put(isSendingComment(comment_id, true));
  try {
    return yield effects.call(editComment, comment_id, content);
  } catch (exception) {
    yield effects.put(setCommentError(comment_id, exception));
    return false;
  } finally {
    yield effects.put(isSendingComment(comment_id, false));
  }
}

/**
 * Generator function for getting a list of comments.
 * @param {Object} data - Saga get comments payload
 * @param {string} data.page - Pagination Page of the comments to get
 * @param {string} data.post_id - ID of the post comment is replying under
 * @param {string|null} data.parent_id - ID of the parent comment, or null if root
 */
function* getCommentsCall(data) {
  const { parent_id } = data;
  yield effects.put(isSendingComment(parent_id, true));
  try {
    return yield effects.call(getComments, data);
  } catch (exception) {
    yield effects.put(setCommentError(parent_id, exception));
    return false;
  } finally {
    yield effects.put(isSendingComment(parent_id, false));
  }
}

function* getUserCommentsCall(data) {
  yield effects.put(isGettingUserComments(true));
  try {
    return yield effects.call(getComments, data);
  } catch (exception) {
    yield effects.put(setUserCommentsError(exception));
    return false;
  } finally {
    yield effects.put(isGettingUserComments(false));
  }
}

/**
 * Saga for creating a new comment. Listen for CREATE_COMMENT_REQUEST action.
 */
export function* createCommentFlow() {
  while (true) {
    const request = yield effects.take(CREATE_COMMENT_REQUEST);
    const { parent_id } = request.data;
    const wasSuccessful = yield effects.call(createCommentCall, request.data);
    if (wasSuccessful) {
      yield effects.put(setCommentContent(parent_id, ""));
      yield effects.put(addComment(parent_id, wasSuccessful.data));
      yield effects.put(clearCommentError(parent_id));
      yield effects.put(toggleCommentReplyBox(parent_id));
    }
  }
}

export function* editCommentFlow() {
  while (true) {
    const request = yield effects.take(EDIT_COMMENT_REQUEST);
    const wasSuccessful = yield effects.call(editCommentCall, request.data);
    if (wasSuccessful) {
      yield effects.put(clearEditComment(wasSuccessful.data.id));
      yield effects.put(
        replaceComment(
          wasSuccessful.data.parent_id,
          wasSuccessful.data.id,
          wasSuccessful.data
        )
      );
    }
  }
}

/**
 * Saga for getting a list of comments. Listen for GET_COMMENTS_REQUEST action.
 */
export function* getCommentsFlow(action) {
  const { parent_id } = action.data;
  const wasSuccessful = yield effects.call(getCommentsCall, action.data);
  if (wasSuccessful) {
    yield effects.put(
      addComments(parent_id, wasSuccessful.data, wasSuccessful.pagination)
    );
    yield effects.put(clearCommentError(parent_id));
  }
}

/**
 * Saga for getting a list of comments (user profile). Listen for GET_USER_COMMENTS_REQUEST action.
 */
export function* getUserCommentsFlow(action) {
  while (true) {
    const request = yield effects.take(GET_USER_COMMENTS_REQUEST);
    const wasSuccessful = yield effects.call(getUserCommentsCall, request.data);
    if (wasSuccessful) {
      const { page_number } = wasSuccessful.pagination;
      if (page_number <= 1) yield effects.put(clearUserComments());
      yield effects.put(setUserCommentsPagination(wasSuccessful.pagination));
      yield effects.put(addUserComments(wasSuccessful.data));
      yield effects.put(clearUserCommentsError());
    }
  }
}
