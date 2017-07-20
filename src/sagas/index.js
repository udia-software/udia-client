import { effects } from "redux-saga";
import { createPostCall, getPostsCall, getPostByIdCall } from "./postSagas";
import { getUserCall } from "./userSagas";
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

/**
 * Saga for creating a new post. Listen for CREATE_POST_REQUEST action.
 */
export function* createPostFlow() {
  while (true) {
    const request = yield effects.take(CREATE_POST_REQUEST);
    const { title, content } = request.data;
    const wasSuccessful = yield effects.call(createPostCall, {
      title,
      content
    });

    if (wasSuccessful) {
      yield effects.put({
        type: CLEAR_ERROR
      });
      yield effects.put({
        type: EDIT_POST_TITLE,
        title: ""
      });
      yield effects.put({
        type: EDIT_POST_CONTENT,
        content: ""
      });
      yield effects.put({
        type: SET_POST,
        post: wasSuccessful.data
      });
      // TODO: Redirect to Post Page
    }
  }
}

export function* getPostsFlow() {
  while (true) {
    const request = yield effects.take(GET_POSTS_REQUEST);
    const page = request.page;
    const wasSuccessful = yield effects.call(getPostsCall, page);
    if (wasSuccessful) {
      const {
        page_number,
        page_size,
        total_entries,
        total_pages
      } = wasSuccessful.pagination;

      if (page_number <= 1) {
        yield effects.put({
          type: CLEAR_POST_LIST
        });
      }
      yield effects.put({
        type: SET_POSTS_PAGE_NUMBER,
        page_number
      });
      yield effects.put({
        type: SET_POSTS_PAGE_SIZE,
        page_size
      });
      yield effects.put({
        type: SET_POSTS_TOTAL_ENTRIES,
        total_entries
      });
      yield effects.put({
        type: SET_POSTS_TOTAL_PAGES,
        total_pages
      });
      yield effects.put({
        type: ADD_POSTS,
        posts: wasSuccessful.data
      });
    }
  }
}

export function* getUserFlow() {
  while (true) {
    const request = yield effects.take(GET_USER_BY_USERNAME_REQUEST);
    const { username } = request;
    const wasSuccessful = yield effects.call(getUserCall, username);
    if (wasSuccessful) {
      yield effects.put(setUser(wasSuccessful.data));
    }
  }
}

export function* getPostByIdFlow() {
  while (true) {
    const request = yield effects.take(GET_POST_BY_ID_REQUEST);
    const { id } = request;
    const wasSuccessful = yield effects.call(getPostByIdCall, id);
    if (wasSuccessful) {
      yield effects.put({
        type: SET_POST,
        post: wasSuccessful.data
      });
    }
  }
}

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
