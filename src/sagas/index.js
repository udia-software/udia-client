import { effects } from 'redux-saga';
import { login, logout, register } from './authSagas';
import { createPostCall, getPostsCall, getPostByIdCall } from './postSagas';
import { getUsersCall } from './userSagas';
import {
  SET_AUTH,
  SET_USER,
  CLEAR_ERROR,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  CREATE_POST_REQUEST,
  GET_USERS_REQUEST,
  GET_POSTS_REQUEST,
  ADD_POST,
  GET_POST_BY_ID_REQUEST,
  SET_POST,
  EDIT_POST_TITLE,
  EDIT_POST_CONTENT,
  CLEAR_POST_LIST
} from '../actions/constants';

import { me } from '../auth';

/**
 * Saga for logging a user in. Listen for LOGIN_REQUEST action.
 */
export function* loginFlow() {
  while (true) {
    const request = yield effects.take(LOGIN_REQUEST);
    const { username, password } = request.data;
    const wasSuccessful = yield effects.call(login, { username, password });

    if (wasSuccessful) {
      yield effects.put({
        type: SET_AUTH,
        newAuthState: true
      });
      yield effects.put({
        type: SET_USER,
        newUserState: me()
      });
      yield effects.put({
        type: CLEAR_ERROR
      });
    }
  }
}

/**
 * Saga for logging out a user. Listen for LOGOUT_REQUEST action.
 */
export function* logoutFlow() {
  while (true) {
    yield effects.take(LOGOUT_REQUEST);
    yield effects.put({
      type: SET_AUTH,
      newAuthState: false
    });
    yield effects.put({
      type: SET_USER,
      newUserState: me()
    });
    yield effects.call(logout);
  }
}

/**
 * Saga for registering a new user. Listen for REGISTER_REQUEST action.
 */
export function* registerFlow() {
  while (true) {
    const request = yield effects.take(REGISTER_REQUEST);
    const { username, password } = request.data;
    const wasSuccessful = yield effects.call(register, {
      username,
      password
    });

    if (wasSuccessful) {
      yield effects.put({
        type: SET_AUTH,
        newAuthState: true
      });
      yield effects.put({
        type: SET_USER,
        newUserState: me()
      });
      yield effects.put({
        type: CLEAR_ERROR
      });
    }
  }
}

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
      const post = wasSuccessful.data;
      yield effects.put({
        type: ADD_POST,
        post
      });
      yield effects.put({
        type: CLEAR_ERROR
      });
      yield effects.put({
        type: EDIT_POST_TITLE,
        title: ''
      });
      yield effects.put({
        type: EDIT_POST_CONTENT,
        content: ''
      });
    }
  }
}

/**
 * Saga for getting all users. Liste for GET_USERS_REQUEST action.
 */
export function* getUsersFlow() {
  while(true) {
    yield effects.take(GET_USERS_REQUEST);
    const wasSuccessful = yield effects.call(getUsersCall, {});

    if (wasSuccessful) {
      yield effects.put({
        type: CLEAR_ERROR
      });
    }
  }
}

export function* getPostsFlow() {
  while (true) {
    // TO DO add pagination
    yield effects.take(GET_POSTS_REQUEST);
    const wasSuccessful = yield effects.call(getPostsCall);
    if (wasSuccessful) {
      yield effects.put({
        type: CLEAR_POST_LIST
      });
      const posts = wasSuccessful.data;
      for (let i = 0; i < posts.length; i++) {
        yield effects.put({
          type: ADD_POST,
          post: posts[i]
        });
      }
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

export default function* root() {
  yield effects.fork(loginFlow);
  yield effects.fork(logoutFlow);
  yield effects.fork(registerFlow);
  yield effects.fork(createPostFlow);
  yield effects.fork(getPostsFlow);
  yield effects.fork(getUsersFlow);
  yield effects.fork(getPostByIdFlow);
}
