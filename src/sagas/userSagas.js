import { effects } from 'redux-saga';
import { getUsers } from '../auth';
import {
  SENDING_REQUEST,
  REQUEST_ERROR
} from '../actions/constants';

export function* getUsersCall() {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(getUsers)
  } catch (exception) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: exception.error || 'API Server is down.'
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}
