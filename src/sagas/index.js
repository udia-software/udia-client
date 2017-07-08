import { effects } from 'redux-saga';

import {
  SENDING_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  SET_AUTH,
  SET_USER,
  LOGOUT,
  REQUEST_ERROR,
  CREATE_POST_REQUEST
} from '../actions/constants';

import { me, signup, signin, signout } from '../auth';
import { createPost } from '../post';

export function* register({
  username,
  password
}) {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(signup, username, password);
  } catch (exception) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: exception.errors
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}

export function* login({
  username,
  password
}) {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(signin, username, password);
  } catch (exception) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: exception.error
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}

/**
 * Effect to handle logging out
 */
export function* logout() {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    const response = yield effects.call(signout);
    return response;
  } catch (error) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: error.message
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}

export function* createPostCall({
  title,
  content
}) {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(createPost, title, content);
  } catch (error) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: error.message
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}

/**
 * Log in saga
 */
export function* loginFlow() {
  while (true) {
    const request = yield effects.take(LOGIN_REQUEST);
    const {
      username,
      password
    } = request.data;

    const winner = yield effects.race({
      auth: effects.call(login, {
        username,
        password
      }),
      logout: effects.take(LOGOUT)
    });

    if (winner.auth) {
      yield effects.put({
        type: SET_AUTH,
        newAuthState: true
      });
      yield effects.put({
        type: SET_USER,
        newUserState: me()
      });
    }
  }
}

/**
 * Log out saga
 */
export function* logoutFlow() {
  while (true) {
    yield effects.take(LOGOUT);
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
 * Register saga
 */
export function* registerFlow() {
  while (true) {
    const request = yield effects.take(REGISTER_REQUEST);
    const {
      username,
      password
    } = request.data;

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
    }
  }
}

/*
{
      id,
      title,
      content,
      type,
      author,
      inserted_at,
      updated_at
    }

    */

export function* createPostFlow() {
  while (true) {
    const request = yield effects.take(CREATE_POST_REQUEST);
    const {
      title,
      content
    } = request.data;

    const wasSuccessful = yield effects.call(createPostCall, {
      title,
      content
    });

    if (wasSuccessful) {
      console.log('create post successful', wasSuccessful);
    }
  }
}

export default function* root() {
  yield effects.fork(loginFlow);
  yield effects.fork(logoutFlow);
  yield effects.fork(registerFlow);
  yield effects.fork(createPostFlow);
}
