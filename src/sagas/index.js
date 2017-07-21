import { effects } from "redux-saga";
import { createPostCall, getPostsCall, getPostByIdCall } from "./postSagas";
import { createCommentCall, getCommentsCall } from "./commentSagas";
import {
  CLEAR_ERROR,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  CREATE_POST_REQUEST,
  GET_POSTS_REQUEST,
  ADD_POSTS,
  SET_POSTS_PAGE_NUMBER,
  SET_POSTS_PAGE_SIZE,
  SET_POSTS_TOTAL_ENTRIES,
  SET_POSTS_TOTAL_PAGES,
  GET_POST_BY_ID_REQUEST,
  GET_USER_BY_USERNAME_REQUEST,
  SET_POST,
  EDIT_POST_TITLE,
  EDIT_POST_CONTENT,
  CLEAR_POST_LIST,
  CREATE_COMMENT_REQUEST,
  EDIT_COMMENT_CONTENT,
  ADD_COMMENT,
  GET_COMMENTS_REQUEST,
  ADD_COMMENTS
} from "../actions/constants";

import { setSelfUser } from "../actions/auth";
import { setUser } from "../actions/user";

export const API_DOWN_MESSAGE = "API Server is down.";

export function* createCommentFlow() {
  while (true) {
    const request = yield effects.take(CREATE_COMMENT_REQUEST);
    const { content, parent_id, post_id } = request.data;
    const wasSuccessful = yield effects.call(createCommentCall, {
      content,
      parent_id,
      post_id
    });
    if (wasSuccessful) {
      const { parent_id } = wasSuccessful.data;
      yield effects.put({
        type: EDIT_COMMENT_CONTENT,
        parent_id,
        content: ""
      });
      yield effects.put({
        type: ADD_COMMENT,
        parent_id,
        comment: wasSuccessful.data
      });
    }
  }
}

export function* getCommentsFlow() {
  while (true) {
    const request = yield effects.take(GET_COMMENTS_REQUEST);
    const { page, post_id, parent_id } = request.data;
    const wasSuccessful = yield effects.call(getCommentsCall, {
      page,
      parent_id,
      post_id
    });
    if (wasSuccessful) {
      yield effects.put({
        type: ADD_COMMENTS,
        parent_id: parent_id || null,
        comments: wasSuccessful.data,
        pagination: wasSuccessful.pagination
      });
    }
  }
}

export default function* root() {
  yield effects.fork(createPostFlow);
  yield effects.fork(getPostsFlow);
  yield effects.fork(getUserFlow);
  yield effects.fork(getPostByIdFlow);
  yield effects.fork(createCommentFlow);
  yield effects.fork(getCommentsFlow);
}
