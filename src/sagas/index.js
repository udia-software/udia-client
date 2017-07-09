import { effects } from 'redux-saga';
import { login, logout, register } from './authSagas';
import { createPostCall } from './postSagas';
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
      yield effects.put({
        type: CLEAR_ERROR
      });
      // TODO redirect to post page
      console.log('create post successful', wasSuccessful);
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
    console.log(wasSuccessful);

    if (wasSuccessful) {
      yield effects.put({
        type: CLEAR_ERROR
      });
    }
  }
}

export default function* root() {
  yield effects.fork(loginFlow);
  yield effects.fork(logoutFlow);
  yield effects.fork(registerFlow);
  yield effects.fork(createPostFlow);
  yield effects.fork(getUsersFlow);
}
