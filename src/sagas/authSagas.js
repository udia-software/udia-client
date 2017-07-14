import { effects } from 'redux-saga';
import { signup, signin, signout } from '../auth';
import { API_DOWN_MESSAGE } from '../sagas';
import {
  SENDING_REQUEST,
  REQUEST_ERROR
} from '../actions/constants';


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
      error: exception.errors || API_DOWN_MESSAGE
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
      error: exception.error || API_DOWN_MESSAGE
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
      error: error.message || API_DOWN_MESSAGE
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}
