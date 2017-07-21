import { effects } from 'redux-saga';
import { createPost, getPosts, getPostById } from '../api/post';
import { API_DOWN_MESSAGE } from '../sagas';
import {
  SENDING_REQUEST,
  REQUEST_ERROR
} from '../actions/constants';

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
  } catch (exception) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: exception.errors || exception.error || API_DOWN_MESSAGE
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}

export function* getPostByIdCall(id) {
  yield effects.put({
    type: SENDING_REQUEST,
    sending: true
  });

  try {
    return yield effects.call(getPostById, id);
  } catch (exception) {
    yield effects.put({
      type: REQUEST_ERROR,
      error: exception.errors || exception.error || API_DOWN_MESSAGE
    });
    return false;
  } finally {
    yield effects.put({
      type: SENDING_REQUEST,
      sending: false
    });
  }
}
